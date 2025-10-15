// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {ShardTip} from "../contracts/ShardTip.sol";
import {console2} from "forge-std/console2.sol";

contract DeployShardTip is Script {
    function run() external returns (ShardTip) {
        // Try to get private key with 0x prefix, fallback to without
        uint256 deployerPrivateKey;
        try vm.envUint("PRIVATE_KEY") returns (uint256 key) {
            deployerPrivateKey = key;
        } catch {
            string memory pkString = vm.envString("PRIVATE_KEY");
            deployerPrivateKey = vm.parseUint(string.concat("0x", pkString));
        }
        
        console2.log("Deploying ShardTip...");
        console2.log("Deployer:", vm.addr(deployerPrivateKey));
        
        vm.startBroadcast(deployerPrivateKey);
        
        ShardTip shardTip = new ShardTip();
        
        console2.log("ShardTip deployed at:", address(shardTip));
        console2.log("Platform fee:", shardTip.platformFeePercentage(), "basis points");
        
        vm.stopBroadcast();
        
        return shardTip;
    }
}


