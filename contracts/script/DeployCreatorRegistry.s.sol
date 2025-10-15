// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {CreatorRegistry} from "../contracts/CreatorRegistry.sol";
import {console2} from "forge-std/console2.sol";

contract DeployCreatorRegistry is Script {
    function run() external returns (CreatorRegistry) {
        // Try to get private key with 0x prefix, fallback to without
        uint256 deployerPrivateKey;
        try vm.envUint("PRIVATE_KEY") returns (uint256 key) {
            deployerPrivateKey = key;
        } catch {
            // If that fails, try reading as string and adding 0x prefix
            string memory pkString = vm.envString("PRIVATE_KEY");
            deployerPrivateKey = vm.parseUint(string.concat("0x", pkString));
        }
        
        vm.startBroadcast(deployerPrivateKey);
        
        CreatorRegistry registry = new CreatorRegistry();
        
        console2.log("CreatorRegistry deployed at:", address(registry));
        
        vm.stopBroadcast();
        
        return registry;
    }
}

