// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {CreatorRewardsHook} from "../contracts/CreatorRewardsHook.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {console2} from "forge-std/console2.sol";

contract DeployCreatorRewardsHook is Script {
    // Uniswap v4 PoolManager addresses
    address constant SEPOLIA_POOL_MANAGER = 0xE03A1074c86CFeDd5C142C4F04F1a1536e203543;
    address constant MAINNET_POOL_MANAGER = 0x000000000004444c5dc75cB358380D2e3dE08A90;
    address constant POLYGON_QUOTER = 0xb3d5c3Dfc3a7aEbFF71895A7191796BFFc2c81b9;
    
    // Note: For Polygon, we'll need to find the PoolManager address
    // The Quoter address is available, but PoolManager might need to be deployed or found
    
    function run() external returns (CreatorRewardsHook) {
        // Try to get private key with 0x prefix, fallback to without
        uint256 deployerPrivateKey;
        try vm.envUint("PRIVATE_KEY") returns (uint256 key) {
            deployerPrivateKey = key;
        } catch {
            string memory pkString = vm.envString("PRIVATE_KEY");
            deployerPrivateKey = vm.parseUint(string.concat("0x", pkString));
        }
        
        // Get PoolManager address - use Sepolia by default, or from env
        address poolManagerAddress = vm.envOr("POOL_MANAGER_ADDRESS", SEPOLIA_POOL_MANAGER);
        
        console2.log("Deploying CreatorRewardsHook...");
        console2.log("Using PoolManager at:", poolManagerAddress);
        
        vm.startBroadcast(deployerPrivateKey);
        
        IPoolManager poolManager = IPoolManager(poolManagerAddress);
        CreatorRewardsHook hook = new CreatorRewardsHook(poolManager);
        
        console2.log("CreatorRewardsHook deployed at:", address(hook));
        console2.log("Using PoolManager at:", poolManagerAddress);
        
        vm.stopBroadcast();
        
        return hook;
    }
}

