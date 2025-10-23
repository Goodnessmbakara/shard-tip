// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script, console} from "forge-std/Script.sol";
import {CreatorRewardsHook} from "../contracts/CreatorRewardsHook.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";

/**
 * @title DeployCreatorRewardsHook
 * @dev Deployment script for CreatorRewardsHook with CREATE2
 * @author ShardTip Team
 */
contract DeployCreatorRewardsHook is Script {
    // Sepolia PoolManager address
    address constant POOL_MANAGER = 0xE03A1074c86CFeDd5C142C4F04F1a1536e203543;
    
    // CREATE2 salt for deterministic deployment
    bytes32 constant SALT = keccak256("ShardTip-CreatorRewardsHook-v1");
    
    function run() external {
        // Try to get private key with 0x prefix, fallback to without
        uint256 deployerPrivateKey;
        try vm.envUint("PRIVATE_KEY") returns (uint256 key) {
            deployerPrivateKey = key;
        } catch {
            string memory pkString = vm.envString("PRIVATE_KEY");
            deployerPrivateKey = vm.parseUint(string.concat("0x", pkString));
        }
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying CreatorRewardsHook...");
        console.log("Deployer:", deployer);
        console.log("PoolManager:", POOL_MANAGER);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy with CREATE2 for deterministic address
        bytes memory bytecode = abi.encodePacked(
            type(CreatorRewardsHook).creationCode,
            abi.encode(IPoolManager(POOL_MANAGER))
        );
        
        address hookAddress;
        bytes32 salt = SALT;
        assembly {
            hookAddress := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
        }
        
        require(hookAddress != address(0), "CreatorRewardsHook: Deployment failed");
        
        vm.stopBroadcast();
        
        console.log("CreatorRewardsHook deployed at:", hookAddress);
        console.log("Salt used:", vm.toString(SALT));
        
        // Verify deployment
        CreatorRewardsHook hook = CreatorRewardsHook(payable(hookAddress));
        console.log("Hook owner:", hook.owner());
        console.log("Reward percentage:", hook.rewardPercentage());
        console.log("Creator whitelist enabled:", hook.creatorWhitelistEnabled());
        
        // Save deployment info
        string memory deploymentInfo = string(abi.encodePacked(
            "CreatorRewardsHook Deployment Info:\n",
            "Address: ", vm.toString(hookAddress), "\n",
            "PoolManager: ", vm.toString(POOL_MANAGER), "\n",
            "Salt: ", vm.toString(SALT), "\n",
            "Deployer: ", vm.toString(deployer), "\n",
            "Block: ", vm.toString(block.number), "\n",
            "Timestamp: ", vm.toString(block.timestamp)
        ));
        
        vm.writeFile("deployment-info.txt", deploymentInfo);
        console.log("Deployment info saved to deployment-info.txt");
    }
}