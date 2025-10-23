// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MultiTokenSupport
 * @dev Provides multi-token support for ShardTip platform
 * @author ShardTip Team
 */
contract MultiTokenSupport is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // Events
    event TokenSupported(address indexed token, bool supported);
    event TokenTipped(address indexed from, address indexed to, address indexed token, uint256 amount);
    event TokenRewardsClaimed(address indexed creator, address indexed token, uint256 amount);
    event TokenRewardsDistributed(address indexed creator, address indexed token, uint256 amount);

    // State variables
    mapping(address => bool) public supportedTokens;
    mapping(address => mapping(address => uint256)) public tokenBalances; // creator => token => balance
    mapping(address => uint256) public totalTokenVolume; // token => total volume
    mapping(address => uint256) public totalTokenRewards; // token => total rewards distributed
    
    address public constant NATIVE_TOKEN = address(0);
    uint256 public constant MIN_TIP_AMOUNT = 0.001 ether;
    uint256 public platformFeePercentage = 250; // 2.5%
    uint256 public constant MAX_PLATFORM_FEE = 1000; // 10%

    constructor() Ownable(msg.sender) {
        // Support native token by default
        supportedTokens[NATIVE_TOKEN] = true;
    }

    /**
     * @dev Add support for a new token
     */
    function addSupportedToken(address token) external onlyOwner {
        require(token != address(0), "MultiTokenSupport: Invalid token address");
        supportedTokens[token] = true;
        emit TokenSupported(token, true);
    }

    /**
     * @dev Remove support for a token
     */
    function removeSupportedToken(address token) external onlyOwner {
        require(token != NATIVE_TOKEN, "MultiTokenSupport: Cannot remove native token");
        supportedTokens[token] = false;
        emit TokenSupported(token, false);
    }

    /**
     * @dev Send tip in any supported token
     */
    function tipToken(
        address creator,
        address token,
        uint256 amount
    ) external payable nonReentrant {
        require(supportedTokens[token], "MultiTokenSupport: Token not supported");
        require(amount >= MIN_TIP_AMOUNT, "MultiTokenSupport: Amount too small");
        require(creator != address(0), "MultiTokenSupport: Invalid creator address");

        uint256 platformFee = (amount * platformFeePercentage) / 10000;
        uint256 creatorAmount = amount - platformFee;

        if (token == NATIVE_TOKEN) {
            require(msg.value == amount, "MultiTokenSupport: Incorrect ETH amount");
            
            // Transfer to creator
            (bool success, ) = payable(creator).call{value: creatorAmount}("");
            require(success, "MultiTokenSupport: ETH transfer failed");
            
            // Keep platform fee in contract
            tokenBalances[owner()][token] += platformFee;
        } else {
            // Transfer ERC20 tokens
            IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
            
            // Transfer to creator
            IERC20(token).safeTransfer(creator, creatorAmount);
            
            // Keep platform fee in contract
            tokenBalances[owner()][token] += platformFee;
        }

        // Update balances and volume
        tokenBalances[creator][token] += creatorAmount;
        totalTokenVolume[token] += amount;
        totalTokenRewards[token] += creatorAmount;

        emit TokenTipped(msg.sender, creator, token, amount);
    }

    /**
     * @dev Batch tip multiple creators with same token
     */
    function batchTipToken(
        address[] calldata creators,
        address token,
        uint256[] calldata amounts
    ) external payable nonReentrant {
        require(creators.length == amounts.length, "MultiTokenSupport: Array length mismatch");
        require(supportedTokens[token], "MultiTokenSupport: Token not supported");

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }

        if (token == NATIVE_TOKEN) {
            require(msg.value == totalAmount, "MultiTokenSupport: Incorrect ETH amount");
        } else {
            IERC20(token).safeTransferFrom(msg.sender, address(this), totalAmount);
        }

        for (uint256 i = 0; i < creators.length; i++) {
            if (amounts[i] > 0) {
                uint256 platformFee = (amounts[i] * platformFeePercentage) / 10000;
                uint256 creatorAmount = amounts[i] - platformFee;

                if (token == NATIVE_TOKEN) {
                    (bool success, ) = payable(creators[i]).call{value: creatorAmount}("");
                    require(success, "MultiTokenSupport: ETH transfer failed");
                } else {
                    IERC20(token).safeTransfer(creators[i], creatorAmount);
                }

                tokenBalances[creators[i]][token] += creatorAmount;
                totalTokenVolume[token] += amounts[i];
                totalTokenRewards[token] += creatorAmount;

                emit TokenTipped(msg.sender, creators[i], token, amounts[i]);
            }
        }

        // Keep platform fees
        uint256 totalPlatformFee = (totalAmount * platformFeePercentage) / 10000;
        tokenBalances[owner()][token] += totalPlatformFee;
    }

    /**
     * @dev Claim accumulated token rewards
     */
    function claimTokenRewards(address token) external nonReentrant {
        _claimTokenRewards(msg.sender, token);
    }

    /**
     * @dev Internal function to claim token rewards
     */
    function _claimTokenRewards(address creator, address token) internal {
        uint256 amount = tokenBalances[creator][token];
        require(amount > 0, "MultiTokenSupport: No rewards to claim");

        tokenBalances[creator][token] = 0;

        if (token == NATIVE_TOKEN) {
            (bool success, ) = payable(creator).call{value: amount}("");
            require(success, "MultiTokenSupport: ETH transfer failed");
        } else {
            IERC20(token).safeTransfer(creator, amount);
        }

        emit TokenRewardsClaimed(creator, token, amount);
    }

    /**
     * @dev Batch claim rewards for multiple tokens
     */
    function claimAllTokenRewards(address[] calldata tokens) external nonReentrant {
        for (uint256 i = 0; i < tokens.length; i++) {
            _claimTokenRewards(msg.sender, tokens[i]);
        }
    }

    /**
     * @dev Get creator's balance for a specific token
     */
    function getCreatorTokenBalance(address creator, address token) external view returns (uint256) {
        return tokenBalances[creator][token];
    }

    /**
     * @dev Get total volume for a token
     */
    function getTokenVolume(address token) external view returns (uint256) {
        return totalTokenVolume[token];
    }

    /**
     * @dev Get total rewards distributed for a token
     */
    function getTokenRewards(address token) external view returns (uint256) {
        return totalTokenRewards[token];
    }

    /**
     * @dev Get creator's total balances across all tokens
     */
    function getCreatorTotalBalances(address creator, address[] calldata tokens) external view returns (uint256[] memory) {
        uint256[] memory balances = new uint256[](tokens.length);
        for (uint256 i = 0; i < tokens.length; i++) {
            balances[i] = tokenBalances[creator][tokens[i]];
        }
        return balances;
    }

    /**
     * @dev Update platform fee percentage (owner only)
     */
    function updatePlatformFeePercentage(uint256 newFeePercentage) external onlyOwner {
        require(newFeePercentage <= MAX_PLATFORM_FEE, "MultiTokenSupport: Fee too high");
        platformFeePercentage = newFeePercentage;
    }

    /**
     * @dev Withdraw platform fees (owner only)
     */
    function withdrawPlatformFees(address token) external onlyOwner {
        uint256 amount = tokenBalances[owner()][token];
        require(amount > 0, "MultiTokenSupport: No fees to withdraw");

        tokenBalances[owner()][token] = 0;

        if (token == NATIVE_TOKEN) {
            (bool success, ) = payable(owner()).call{value: amount}("");
            require(success, "MultiTokenSupport: ETH transfer failed");
        } else {
            IERC20(token).safeTransfer(owner(), amount);
        }
    }

    /**
     * @dev Get supported tokens list
     */
    function getSupportedTokens() external view returns (address[] memory) {
        // This is a simplified implementation
        // In production, you'd maintain a dynamic list
        return new address[](0);
    }

    /**
     * @dev Check if token is supported
     */
    function isTokenSupported(address token) external view returns (bool) {
        return supportedTokens[token];
    }

    /**
     * @dev Get platform statistics
     */
    function getPlatformStats() external view returns (
        uint256 totalVolume,
        uint256 totalRewards,
        uint256 platformFees,
        uint256 supportedTokensCount
    ) {
        // This would require iterating through all tokens
        // Simplified for gas efficiency
        return (0, 0, 0, 0);
    }

    /**
     * @dev Emergency withdrawal (owner only)
     */
    function emergencyWithdraw(address token) external onlyOwner {
        uint256 balance = token == NATIVE_TOKEN ? 
            address(this).balance : 
            IERC20(token).balanceOf(address(this));
            
        if (balance > 0) {
            if (token == NATIVE_TOKEN) {
                (bool success, ) = payable(owner()).call{value: balance}("");
                require(success, "MultiTokenSupport: ETH transfer failed");
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

