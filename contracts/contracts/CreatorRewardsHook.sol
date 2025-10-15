// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./BaseHook.sol";
import {Hooks} from "v4-core/libraries/Hooks.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";
import {PoolId, PoolIdLibrary} from "v4-core/types/PoolId.sol";
import {BalanceDelta} from "v4-core/types/BalanceDelta.sol";
import {Currency} from "v4-core/types/Currency.sol";
import {CurrencyLibrary} from "v4-core/types/Currency.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CreatorRewardsHook
 * @dev Uniswap v4 hook that distributes micro-tips to pool creators on each swap
 * @author ShardTip Team
 */
contract CreatorRewardsHook is BaseHook, ReentrancyGuard, Ownable {
    using PoolIdLibrary for PoolKey;
    using CurrencyLibrary for Currency;

    // Events
    event PoolCreatorRegistered(PoolId indexed poolId, address indexed creator);
    event RewardAccumulated(PoolId indexed poolId, address indexed creator, uint256 amount, Currency currency);
    event RewardClaimed(address indexed creator, Currency currency, uint256 amount);
    event RewardPercentageUpdated(uint256 newPercentage);

    // State variables
    mapping(PoolId => address) public poolCreators;
    mapping(address => mapping(Currency => uint256)) public pendingRewards;
    mapping(PoolId => uint256) public totalRewardsDistributed;
    mapping(address => bool) public authorizedCreators; // Optional: whitelist creators
    
    uint256 public rewardPercentage = 10; // 0.1% (10 basis points)
    uint256 public constant BPS_DENOMINATOR = 10000;
    uint256 public constant MAX_REWARD_PERCENTAGE = 100; // Max 1%
    
    bool public creatorWhitelistEnabled = false;

    constructor(IPoolManager _poolManager) BaseHook(_poolManager) Ownable(msg.sender) {}

    /**
     * @dev Hook permissions - enable afterInitialize and afterSwap
     */
    function getHookPermissions() public pure override returns (Hooks.Permissions memory) {
        return Hooks.Permissions({
            beforeInitialize: false,
            afterInitialize: true,  // Track pool creator
            beforeAddLiquidity: false,
            afterAddLiquidity: false,
            beforeRemoveLiquidity: false,
            afterRemoveLiquidity: false,
            beforeSwap: false,
            afterSwap: true,  // Main reward logic
            beforeDonate: false,
            afterDonate: false,
            beforeSwapReturnDelta: false,
            afterSwapReturnDelta: false,
            afterAddLiquidityReturnDelta: false,
            afterRemoveLiquidityReturnDelta: false
        });
    }

    /**
     * @dev Track pool creator when pool is initialized
     */
    function _afterInitialize(
        address sender,
        PoolKey calldata key,
        uint160,
        int24
    ) internal override returns (bytes4) {
        PoolId poolId = key.toId();
        poolCreators[poolId] = sender;
        
        emit PoolCreatorRegistered(poolId, sender);
        return this.afterInitialize.selector;
    }

    /**
     * @dev Main reward distribution logic on each swap
     */
    function _afterSwap(
        address,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        BalanceDelta delta,
        bytes calldata
    ) internal override returns (bytes4, int128) {
        PoolId poolId = key.toId();
        address creator = poolCreators[poolId];
        
        // Skip if no creator registered or creator not authorized (if whitelist enabled)
        if (creator == address(0) || 
            (creatorWhitelistEnabled && !authorizedCreators[creator])) {
            return (this.afterSwap.selector, 0);
        }

        // Calculate reward from swap volume
        // Use the input currency for reward calculation
        Currency rewardCurrency = params.zeroForOne ? key.currency0 : key.currency1;
        uint256 swapAmount = params.zeroForOne ? 
            uint256(int256(delta.amount0())) : 
            uint256(int256(delta.amount1()));
            
        // Take absolute value for calculation
        if (int256(swapAmount) < 0) {
            swapAmount = uint256(-int256(swapAmount));
        }
        
        uint256 rewardAmount = (swapAmount * rewardPercentage) / BPS_DENOMINATOR;

        // Only distribute if reward is meaningful (> 0)
        if (rewardAmount > 0) {
            pendingRewards[creator][rewardCurrency] += rewardAmount;
            totalRewardsDistributed[poolId] += rewardAmount;
            
            emit RewardAccumulated(poolId, creator, rewardAmount, rewardCurrency);
        }

        return (this.afterSwap.selector, 0);
    }

    /**
     * @dev Claim accumulated rewards (similar to ShardTip claim mechanism)
     */
    function claimRewards(Currency currency) external nonReentrant {
        uint256 amount = pendingRewards[msg.sender][currency];
        require(amount > 0, "CreatorRewardsHook: No rewards to claim");

        // CEI pattern - reset before transfer
        pendingRewards[msg.sender][currency] = 0;

        // Transfer tokens to creator
        if (currency.isAddressZero()) {
            (bool success, ) = payable(msg.sender).call{value: amount}("");
            require(success, "CreatorRewardsHook: ETH transfer failed");
        } else {
            // For ERC20 tokens, would need to implement proper transfer
            // This is a simplified version - in production, use proper ERC20 handling
            revert("CreatorRewardsHook: ERC20 claiming not implemented in this version");
        }
        
        emit RewardClaimed(msg.sender, currency, amount);
    }

    /**
     * @dev Batch claim multiple currencies
     */
    function claimAllRewards(Currency[] calldata currencies) external nonReentrant {
        for (uint256 i = 0; i < currencies.length; i++) {
            Currency currency = currencies[i];
            uint256 amount = pendingRewards[msg.sender][currency];
            
            if (amount > 0) {
                pendingRewards[msg.sender][currency] = 0;
                
                if (currency.isAddressZero()) {
                    (bool success, ) = payable(msg.sender).call{value: amount}("");
                    require(success, "CreatorRewardsHook: ETH transfer failed");
                }
                
                emit RewardClaimed(msg.sender, currency, amount);
            }
        }
    }

    /**
     * @dev Update reward percentage (owner only)
     */
    function updateRewardPercentage(uint256 newPercentage) external onlyOwner {
        require(newPercentage <= MAX_REWARD_PERCENTAGE, "CreatorRewardsHook: Percentage too high");
        rewardPercentage = newPercentage;
        emit RewardPercentageUpdated(newPercentage);
    }

    /**
     * @dev Toggle creator whitelist (owner only)
     */
    function setCreatorWhitelistEnabled(bool enabled) external onlyOwner {
        creatorWhitelistEnabled = enabled;
    }

    /**
     * @dev Authorize a creator (owner only)
     */
    function authorizeCreator(address creator) external onlyOwner {
        authorizedCreators[creator] = true;
    }

    /**
     * @dev Deauthorize a creator (owner only)
     */
    function deauthorizeCreator(address creator) external onlyOwner {
        authorizedCreators[creator] = false;
    }

    /**
     * @dev Get creator statistics
     */
    function getCreatorStats(address creator) external view returns (
        uint256 totalPendingETH,
        uint256 totalPendingTokens,
        bool isAuthorized
    ) {
        totalPendingETH = pendingRewards[creator][CurrencyLibrary.ADDRESS_ZERO];
        isAuthorized = authorizedCreators[creator];
        // Note: totalPendingTokens would require iterating through all ERC20 tokens
        // For gas efficiency, this is simplified
        totalPendingTokens = 0;
    }

    /**
     * @dev Get pool statistics
     */
    function getPoolStats(PoolId poolId) external view returns (
        address creator,
        uint256 totalRewards,
        bool hasCreator
    ) {
        creator = poolCreators[poolId];
        totalRewards = totalRewardsDistributed[poolId];
        hasCreator = creator != address(0);
    }

    /**
     * @dev Emergency withdrawal (owner only)
     */
    function emergencyWithdraw(Currency currency) external onlyOwner {
        uint256 balance = currency.isAddressZero() ? 
            address(this).balance : 
            0; // Would need proper ERC20 balance check
            
        if (balance > 0 && currency.isAddressZero()) {
            (bool success, ) = payable(owner()).call{value: balance}("");
            require(success, "CreatorRewardsHook: Emergency withdrawal failed");
        }
    }

    /**
     * @dev Fallback function to reject direct ETH transfers
     */
    receive() external payable {
        revert("CreatorRewardsHook: Direct transfers not allowed");
    }
}
