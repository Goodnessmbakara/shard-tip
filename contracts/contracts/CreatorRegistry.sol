// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CreatorRegistry
 * @dev Manages creator profiles and metadata for the ShardTip platform
 * @author ShardTip Team
 */
contract CreatorRegistry is ReentrancyGuard, Ownable {
    
    constructor() Ownable(msg.sender) {}
    
    struct CreatorProfile {
        string name;
        string description;
        string avatarUrl; // IPFS or HTTP URL
        string category; // e.g., "DeFi", "NFT", "Education", etc.
        bool isActive;
        uint256 registrationTimestamp;
        uint256 totalTipsReceived;
        uint256 totalPoolsCreated;
        string[] socialLinks; // Twitter, GitHub, etc.
    }

    // Events
    event CreatorRegistered(address indexed creator, string name);
    event CreatorProfileUpdated(address indexed creator, string name);
    event CreatorDeactivated(address indexed creator);
    event CreatorReactivated(address indexed creator);
    event TipReceived(address indexed creator, uint256 amount, uint256 timestamp);

    // State variables
    mapping(address => CreatorProfile) public creators;
    mapping(string => address) public nameToCreator; // Prevent duplicate names
    mapping(string => address) public categoryToCreator; // For discovery
    
    address[] public registeredCreators;
    uint256 public totalCreators;
    uint256 public registrationFee = 0; // Can be set to require fee for registration
    
    // Modifiers
    modifier onlyRegisteredCreator() {
        require(creators[msg.sender].isActive, "CreatorRegistry: Not a registered creator");
        _;
    }

    modifier onlyValidName(string memory name) {
        require(bytes(name).length > 0 && bytes(name).length <= 50, "CreatorRegistry: Invalid name length");
        require(nameToCreator[name] == address(0) || nameToCreator[name] == msg.sender, "CreatorRegistry: Name already taken");
        _;
    }

    /**
     * @dev Register as a creator
     */
    function registerCreator(
        string memory name,
        string memory description,
        string memory avatarUrl,
        string memory category,
        string[] memory socialLinks
    ) external payable nonReentrant {
        require(!creators[msg.sender].isActive, "CreatorRegistry: Already registered");
        require(msg.value >= registrationFee, "CreatorRegistry: Insufficient registration fee");
        require(bytes(name).length > 0 && bytes(name).length <= 50, "CreatorRegistry: Invalid name");
        require(nameToCreator[name] == address(0), "CreatorRegistry: Name already taken");

        // Create creator profile
        creators[msg.sender] = CreatorProfile({
            name: name,
            description: description,
            avatarUrl: avatarUrl,
            category: category,
            isActive: true,
            registrationTimestamp: block.timestamp,
            totalTipsReceived: 0,
            totalPoolsCreated: 0,
            socialLinks: socialLinks
        });

        nameToCreator[name] = msg.sender;
        registeredCreators.push(msg.sender);
        totalCreators++;

        emit CreatorRegistered(msg.sender, name);
    }

    /**
     * @dev Update creator profile
     */
    function updateProfile(
        string memory name,
        string memory description,
        string memory avatarUrl,
        string memory category,
        string[] memory socialLinks
    ) external onlyRegisteredCreator onlyValidName(name) {
        CreatorProfile storage profile = creators[msg.sender];
        
        // Update name mapping if name changed
        if (keccak256(bytes(profile.name)) != keccak256(bytes(name))) {
            delete nameToCreator[profile.name];
            nameToCreator[name] = msg.sender;
        }
        
        profile.name = name;
        profile.description = description;
        profile.avatarUrl = avatarUrl;
        profile.category = category;
        profile.socialLinks = socialLinks;

        emit CreatorProfileUpdated(msg.sender, name);
    }

    /**
     * @dev Deactivate creator profile
     */
    function deactivateProfile() external onlyRegisteredCreator {
        creators[msg.sender].isActive = false;
        emit CreatorDeactivated(msg.sender);
    }

    /**
     * @dev Reactivate creator profile (admin only)
     */
    function reactivateCreator(address creator) external onlyOwner {
        require(!creators[creator].isActive, "CreatorRegistry: Already active");
        creators[creator].isActive = true;
        emit CreatorReactivated(creator);
    }

    /**
     * @dev Record a tip received (called by ShardTip contract)
     */
    function recordTipReceived(address creator, uint256 amount) external {
        // In production, add access control to ensure only ShardTip contract can call this
        require(creators[creator].isActive, "CreatorRegistry: Creator not active");
        
        creators[creator].totalTipsReceived += amount;
        emit TipReceived(creator, amount, block.timestamp);
    }

    /**
     * @dev Record pool creation (called by CreatorRewardsHook)
     */
    function recordPoolCreated(address creator) external {
        // In production, add access control to ensure only hook contract can call this
        require(creators[creator].isActive, "CreatorRegistry: Creator not active");
        creators[creator].totalPoolsCreated++;
    }

    /**
     * @dev Get creator profile
     */
    function getCreatorProfile(address creator) external view returns (CreatorProfile memory) {
        return creators[creator];
    }

    /**
     * @dev Get all registered creators (for frontend pagination)
     */
    function getCreators(uint256 offset, uint256 limit) external view returns (
        address[] memory creatorAddresses,
        CreatorProfile[] memory profiles
    ) {
        require(offset < totalCreators, "CreatorRegistry: Offset out of bounds");
        
        uint256 end = offset + limit;
        if (end > totalCreators) {
            end = totalCreators;
        }
        
        uint256 length = end - offset;
        creatorAddresses = new address[](length);
        profiles = new CreatorProfile[](length);
        
        for (uint256 i = 0; i < length; i++) {
            address creator = registeredCreators[offset + i];
            creatorAddresses[i] = creator;
            profiles[i] = creators[creator];
        }
    }

    /**
     * @dev Search creators by category
     */
    function getCreatorsByCategory(string memory category) external view returns (
        address[] memory creatorAddresses,
        CreatorProfile[] memory profiles
    ) {
        // Note: This is inefficient for large numbers of creators
        // In production, consider using events and indexing
        uint256 count = 0;
        
        // Count matching creators
        for (uint256 i = 0; i < totalCreators; i++) {
            if (keccak256(bytes(creators[registeredCreators[i]].category)) == keccak256(bytes(category))) {
                count++;
            }
        }
        
        // Populate arrays
        creatorAddresses = new address[](count);
        profiles = new CreatorProfile[](count);
        
        uint256 index = 0;
        for (uint256 i = 0; i < totalCreators; i++) {
            address creator = registeredCreators[i];
            if (keccak256(bytes(creators[creator].category)) == keccak256(bytes(category))) {
                creatorAddresses[index] = creator;
                profiles[index] = creators[creator];
                index++;
            }
        }
    }

    /**
     * @dev Get creator by name
     */
    function getCreatorByName(string memory name) external view returns (address creator) {
        return nameToCreator[name];
    }

    /**
     * @dev Update registration fee (owner only)
     */
    function setRegistrationFee(uint256 newFee) external onlyOwner {
        registrationFee = newFee;
    }

    /**
     * @dev Withdraw collected registration fees (owner only)
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "CreatorRegistry: No fees to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "CreatorRegistry: Withdrawal failed");
    }

    /**
     * @dev Get total number of registered creators
     */
    function getTotalCreators() external view returns (uint256) {
        return totalCreators;
    }

    /**
     * @dev Check if address is a registered creator
     */
    function isCreator(address addr) external view returns (bool) {
        return creators[addr].isActive;
    }
}
