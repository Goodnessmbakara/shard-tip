// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ShardTip
 * @dev Decentralized micro-tipping platform for creators on Shardeum
 * @author ShardTip Team
 */
contract ShardTip is ReentrancyGuard, Ownable {
    // Events
    event TipSent(address indexed tipper, address indexed creator, uint256 amount, uint256 timestamp);
    event TipsClaimed(address indexed creator, uint256 amount, uint256 timestamp);
    event PlatformFeeUpdated(uint256 newFee);

    // State variables
    mapping(address => uint256) public pendingTips;
    mapping(address => uint256) public totalTipsReceived;
    mapping(address => uint256) public totalTipsSent;
    
    uint256 public platformFeePercentage = 250; // 2.5% platform fee (250 basis points)
    uint256 public constant MAX_PLATFORM_FEE = 500; // Maximum 5% platform fee
    uint256 public totalPlatformFees;
    
    uint256 public totalTipsVolume;
    uint256 public totalTransactions;

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Send a tip to a creator
     * @param creator The address of the creator to tip
     */
    function tip(address creator) external payable nonReentrant {
        require(creator != address(0), "ShardTip: Invalid creator address");
        require(msg.value > 0, "ShardTip: Tip amount must be greater than 0");
        require(creator != msg.sender, "ShardTip: Cannot tip yourself");

        uint256 tipAmount = msg.value;
        uint256 platformFee = (tipAmount * platformFeePercentage) / 10000;
        uint256 creatorAmount = tipAmount - platformFee;

        // Update state
        pendingTips[creator] += creatorAmount;
        totalTipsReceived[creator] += creatorAmount;
        totalTipsSent[msg.sender] += tipAmount;
        totalPlatformFees += platformFee;
        totalTipsVolume += tipAmount;
        totalTransactions++;

        emit TipSent(msg.sender, creator, tipAmount, block.timestamp);
    }

    /**
     * @dev Claim all pending tips for the caller
     */
    function claimTips() external nonReentrant {
        uint256 amount = pendingTips[msg.sender];
        require(amount > 0, "ShardTip: No tips to claim");

        // Reset pending tips before transfer (CEI pattern)
        pendingTips[msg.sender] = 0;

        // Transfer tips to creator
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "ShardTip: Transfer failed");

        emit TipsClaimed(msg.sender, amount, block.timestamp);
    }

    /**
     * @dev Get pending tips for a specific address
     * @param creator The creator's address
     * @return The amount of pending tips
     */
    function getPendingTips(address creator) external view returns (uint256) {
        return pendingTips[creator];
    }

    /**
     * @dev Get creator statistics
     * @param creator The creator's address
     * @return pendingAmount The pending tips amount
     * @return totalReceived The total tips received all time
     */
    function getCreatorStats(address creator) external view returns (uint256 pendingAmount, uint256 totalReceived) {
        return (pendingTips[creator], totalTipsReceived[creator]);
    }

    /**
     * @dev Get tipper statistics
     * @param tipper The tipper's address
     * @return totalSent The total tips sent all time
     */
    function getTipperStats(address tipper) external view returns (uint256 totalSent) {
        return totalTipsSent[tipper];
    }

    /**
     * @dev Get platform statistics
     * @return volume Total tips volume
     * @return transactions Total number of transactions
     * @return fees Total platform fees collected
     */
    function getPlatformStats() external view returns (uint256 volume, uint256 transactions, uint256 fees) {
        return (totalTipsVolume, totalTransactions, totalPlatformFees);
    }

    /**
     * @dev Update platform fee (only owner)
     * @param newFeePercentage New fee percentage in basis points (e.g., 250 = 2.5%)
     */
    function updatePlatformFee(uint256 newFeePercentage) external onlyOwner {
        require(newFeePercentage <= MAX_PLATFORM_FEE, "ShardTip: Fee too high");
        platformFeePercentage = newFeePercentage;
        emit PlatformFeeUpdated(newFeePercentage);
    }

    /**
     * @dev Withdraw platform fees (only owner)
     */
    function withdrawPlatformFees() external onlyOwner nonReentrant {
        uint256 amount = totalPlatformFees;
        require(amount > 0, "ShardTip: No fees to withdraw");

        totalPlatformFees = 0;

        (bool success, ) = payable(owner()).call{value: amount}("");
        require(success, "ShardTip: Withdrawal failed");
    }

    /**
     * @dev Emergency pause function (only owner)
     * This would require implementing Pausable from OpenZeppelin in a production version
     */
    function emergencyWithdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "ShardTip: No balance to withdraw");

        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "ShardTip: Emergency withdrawal failed");
    }

    /**
     * @dev Get contract balance
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Fallback function to reject direct ETH transfers
     */
    receive() external payable {
        revert("ShardTip: Direct transfers not allowed. Use tip() function.");
    }
}
