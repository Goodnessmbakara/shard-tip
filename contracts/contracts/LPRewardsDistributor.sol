// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title LPRewardsDistributor
 * @dev Distributes rewards to liquidity providers based on their share of pool liquidity
 * @author ShardTip Team
 */
contract LPRewardsDistributor is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // Events
    event LPRewardDistributed(address indexed lp, address indexed token, uint256 amount, uint256 timestamp);
    event RewardPoolCreated(address indexed token, uint256 totalRewards, uint256 duration);
    event LPRewardClaimed(address indexed lp, address indexed token, uint256 amount);
    event RewardPoolUpdated(address indexed token, uint256 newTotalRewards);

    // State variables
    struct RewardPool {
        address token;
        uint256 totalRewards;
        uint256 distributedRewards;
        uint256 startTime;
        uint256 duration;
        bool active;
    }

    struct LPReward {
        address token;
        uint256 amount;
        uint256 timestamp;
        bool claimed;
    }

    mapping(address => RewardPool) public rewardPools;
    mapping(address => mapping(address => LPReward[])) public lpRewards; // lp => token => rewards
    mapping(address => uint256) public totalLPRewards; // token => total rewards for LPs
    mapping(address => bool) public authorizedTokens;
    
    uint256 public constant MAX_REWARD_PERCENTAGE = 5000; // 50% max for LPs
    uint256 public lpRewardPercentage = 2000; // 20% of total rewards go to LPs
    bool public lpRewardsEnabled = true;

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Create a new reward pool for LPs
     */
    function createRewardPool(
        address token,
        uint256 totalRewards,
        uint256 duration
    ) external payable onlyOwner {
        require(totalRewards > 0, "LPRewardsDistributor: Invalid total rewards");
        require(duration > 0, "LPRewardsDistributor: Invalid duration");
        require(!rewardPools[token].active, "LPRewardsDistributor: Pool already exists");

        rewardPools[token] = RewardPool({
            token: token,
            totalRewards: totalRewards,
            distributedRewards: 0,
            startTime: block.timestamp,
            duration: duration,
            active: true
        });

        // Transfer tokens to this contract
        if (token == address(0)) {
            require(msg.value == totalRewards, "LPRewardsDistributor: Incorrect ETH amount");
        } else {
            IERC20(token).safeTransferFrom(msg.sender, address(this), totalRewards);
        }

        emit RewardPoolCreated(token, totalRewards, duration);
    }

    /**
     * @dev Distribute rewards to LPs based on their liquidity share
     */
    function distributeLPRewards(
        address[] calldata lps,
        uint256[] calldata shares,
        address token
    ) external onlyOwner {
        require(rewardPools[token].active, "LPRewardsDistributor: Pool not active");
        require(lps.length == shares.length, "LPRewardsDistributor: Array length mismatch");
        require(lpRewardsEnabled, "LPRewardsDistributor: LP rewards disabled");

        RewardPool storage pool = rewardPools[token];
        require(block.timestamp >= pool.startTime, "LPRewardsDistributor: Distribution not started");
        require(block.timestamp <= pool.startTime + pool.duration, "LPRewardsDistributor: Distribution ended");

        uint256 totalShares = 0;
        for (uint256 i = 0; i < shares.length; i++) {
            totalShares += shares[i];
        }

        require(totalShares > 0, "LPRewardsDistributor: No shares to distribute");

        uint256 remainingRewards = pool.totalRewards - pool.distributedRewards;
        require(remainingRewards > 0, "LPRewardsDistributor: No rewards left");

        for (uint256 i = 0; i < lps.length; i++) {
            if (shares[i] > 0) {
                uint256 rewardAmount = (remainingRewards * shares[i]) / totalShares;
                
                if (rewardAmount > 0) {
                    // Record the reward
                    lpRewards[lps[i]][token].push(LPReward({
                        token: token,
                        amount: rewardAmount,
                        timestamp: block.timestamp,
                        claimed: false
                    }));

                    totalLPRewards[token] += rewardAmount;
                    pool.distributedRewards += rewardAmount;

                    emit LPRewardDistributed(lps[i], token, rewardAmount, block.timestamp);
                }
            }
        }
    }

    /**
     * @dev Claim LP rewards
     */
    function claimLPRewards(address token) external nonReentrant {
        _claimLPRewards(msg.sender, token);
    }

    /**
     * @dev Internal function to claim LP rewards
     */
    function _claimLPRewards(address lp, address token) internal {
        LPReward[] storage rewards = lpRewards[lp][token];
        uint256 totalClaimable = 0;

        // Calculate total claimable rewards
        for (uint256 i = 0; i < rewards.length; i++) {
            if (!rewards[i].claimed) {
                totalClaimable += rewards[i].amount;
                rewards[i].claimed = true;
            }
        }

        require(totalClaimable > 0, "LPRewardsDistributor: No rewards to claim");

        // Transfer rewards
        if (token == address(0)) {
            (bool success, ) = payable(lp).call{value: totalClaimable}("");
            require(success, "LPRewardsDistributor: ETH transfer failed");
        } else {
            IERC20(token).safeTransfer(lp, totalClaimable);
        }

        emit LPRewardClaimed(lp, token, totalClaimable);
    }

    /**
     * @dev Batch claim rewards for multiple tokens
     */
    function claimAllLPRewards(address[] calldata tokens) external nonReentrant {
        for (uint256 i = 0; i < tokens.length; i++) {
            _claimLPRewards(msg.sender, tokens[i]);
        }
    }

    /**
     * @dev Get LP's pending rewards for a token
     */
    function getLPPendingRewards(address lp, address token) external view returns (uint256) {
        LPReward[] memory rewards = lpRewards[lp][token];
        uint256 totalPending = 0;

        for (uint256 i = 0; i < rewards.length; i++) {
            if (!rewards[i].claimed) {
                totalPending += rewards[i].amount;
            }
        }

        return totalPending;
    }

    /**
     * @dev Get LP's reward history for a token
     */
    function getLPRewardHistory(address lp, address token) external view returns (LPReward[] memory) {
        return lpRewards[lp][token];
    }

    /**
     * @dev Update LP reward percentage (owner only)
     */
    function updateLPRewardPercentage(uint256 newPercentage) external onlyOwner {
        require(newPercentage <= MAX_REWARD_PERCENTAGE, "LPRewardsDistributor: Percentage too high");
        lpRewardPercentage = newPercentage;
    }

    /**
     * @dev Toggle LP rewards (owner only)
     */
    function setLPRewardsEnabled(bool enabled) external onlyOwner {
        lpRewardsEnabled = enabled;
    }

    /**
     * @dev Update reward pool (owner only)
     */
    function updateRewardPool(address token, uint256 newTotalRewards) external onlyOwner {
        require(rewardPools[token].active, "LPRewardsDistributor: Pool not active");
        require(newTotalRewards > rewardPools[token].distributedRewards, "LPRewardsDistributor: Invalid new total");

        rewardPools[token].totalRewards = newTotalRewards;
        emit RewardPoolUpdated(token, newTotalRewards);
    }

    /**
     * @dev Authorize a token for rewards (owner only)
     */
    function authorizeToken(address token) external onlyOwner {
        authorizedTokens[token] = true;
    }

    /**
     * @dev Deauthorize a token (owner only)
     */
    function deauthorizeToken(address token) external onlyOwner {
        authorizedTokens[token] = false;
    }

    /**
     * @dev Get reward pool info
     */
    function getRewardPoolInfo(address token) external view returns (RewardPool memory) {
        return rewardPools[token];
    }

    /**
     * @dev Emergency withdrawal (owner only)
     */
    function emergencyWithdraw(address token) external onlyOwner {
        uint256 balance = token == address(0) ? 
            address(this).balance : 
            IERC20(token).balanceOf(address(this));
            
        if (balance > 0) {
            if (token == address(0)) {
                (bool success, ) = payable(owner()).call{value: balance}("");
                require(success, "LPRewardsDistributor: ETH transfer failed");
            } else {
                IERC20(token).safeTransfer(owner(), balance);
            }
        }
    }

    /**
     * @dev Fallback function to accept ETH
     */
    receive() external payable {}
}

