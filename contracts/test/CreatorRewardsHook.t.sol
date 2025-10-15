// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";
import {CreatorRewardsHook} from "../contracts/CreatorRewardsHook.sol";
import {CreatorRegistry} from "../contracts/CreatorRegistry.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {IHooks} from "v4-core/interfaces/IHooks.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";
import {PoolId, PoolIdLibrary} from "v4-core/types/PoolId.sol";
import {Currency} from "v4-core/types/Currency.sol";
import {BalanceDelta, toBalanceDelta} from "v4-core/types/BalanceDelta.sol";
import {Hooks} from "v4-core/libraries/Hooks.sol";

contract CreatorRewardsHookTest is Test {
    using PoolIdLibrary for PoolKey;

    CreatorRewardsHook public hook;
    CreatorRegistry public registry;
    IPoolManager public poolManager;
    
    address public creator = address(0x1);
    address public swapper = address(0x2);
    address public owner = address(this);

    function setUp() public {
        // Deploy mock pool manager (in real tests, use actual v4-core)
        address mockPoolManager = address(0x1234567890123456789012345678901234567890);
        vm.etch(mockPoolManager, new bytes(1)); // Mock pool manager address
        poolManager = IPoolManager(mockPoolManager);
        
        hook = new CreatorRewardsHook(poolManager);
        registry = new CreatorRegistry();
    }

    function testHookPermissions() public {
        Hooks.Permissions memory permissions = hook.getHookPermissions();
        
        assertFalse(permissions.beforeInitialize);
        assertTrue(permissions.afterInitialize);
        assertFalse(permissions.beforeSwap);
        assertTrue(permissions.afterSwap);
    }

    function testPoolCreatorRegistration() public {
        PoolKey memory key = PoolKey({
            currency0: Currency.wrap(address(0x3)),
            currency1: Currency.wrap(address(0x4)),
            fee: 3000,
            tickSpacing: 60,
            hooks: IHooks(address(hook))
        });

        PoolId poolId = key.toId();
        
        // Mock afterInitialize call
        vm.prank(address(poolManager));
        hook.afterInitialize(creator, key, 1000000, 0);
        
        assertEq(hook.poolCreators(poolId), creator);
    }

    function testRewardCalculation() public {
        // Register creator first
        vm.prank(creator);
        registry.registerCreator(
            "Test Creator",
            "A test creator",
            "https://example.com/avatar.png",
            "DeFi",
            new string[](0)
        );

        // Authorize creator
        hook.authorizeCreator(creator);

        PoolKey memory key = PoolKey({
            currency0: Currency.wrap(address(0)),
            currency1: Currency.wrap(address(0x5)),
            fee: 3000,
            tickSpacing: 60,
            hooks: IHooks(address(hook))
        });

        PoolId poolId = key.toId();

        // Register pool creator
        vm.prank(address(poolManager));
        hook.afterInitialize(creator, key, 1000000, 0);

        // Mock a swap with 1000 ETH input
        IPoolManager.SwapParams memory params = IPoolManager.SwapParams({
            zeroForOne: true,
            amountSpecified: 1000 ether,
            sqrtPriceLimitX96: 0
        });

        BalanceDelta delta = toBalanceDelta(int128(-1000 ether), int128(900 ether));

        vm.prank(address(poolManager));
        (bytes4 selector, int128 returnedDelta) = hook.afterSwap(
            swapper,
            key,
            params,
            delta,
            ""
        );

        assertEq(selector, hook.afterSwap.selector);
        assertEq(returnedDelta, 0);

        // Check that creator has pending rewards (0.1% of 1000 ETH = 1 ETH)
        assertEq(hook.pendingRewards(creator, Currency.wrap(address(0))), 1 ether);
        assertEq(hook.totalRewardsDistributed(poolId), 1 ether);
    }

    function testClaimRewards() public {
        // Setup: creator has pending rewards
        vm.deal(address(hook), 1 ether);
        vm.store(address(hook), keccak256(abi.encode(creator, keccak256("pendingRewards"))), bytes32(uint256(1 ether)));

        uint256 initialBalance = creator.balance;

        vm.prank(creator);
        hook.claimRewards(Currency.wrap(address(0)));

        assertEq(creator.balance, initialBalance + 1 ether);
        assertEq(hook.pendingRewards(creator, Currency.wrap(address(0))), 0);
    }

    function testUnauthorizedCreatorNoRewards() public {
        // Don't authorize creator
        PoolKey memory key = PoolKey({
            currency0: Currency.wrap(address(0)),
            currency1: Currency.wrap(address(0x5)),
            fee: 3000,
            tickSpacing: 60,
            hooks: IHooks(address(hook))
        });

        PoolId poolId = key.toId();

        // Register pool creator
        vm.prank(address(poolManager));
        hook.afterInitialize(creator, key, 1000000, 0);

        // Enable whitelist
        hook.setCreatorWhitelistEnabled(true);

        // Mock a swap
        IPoolManager.SwapParams memory params = IPoolManager.SwapParams({
            zeroForOne: true,
            amountSpecified: 1000 ether,
            sqrtPriceLimitX96: 0
        });

        BalanceDelta delta = toBalanceDelta(int128(-1000 ether), int128(900 ether));

        vm.prank(address(poolManager));
        hook.afterSwap(swapper, key, params, delta, "");

        // Creator should have no rewards since not authorized
        assertEq(hook.pendingRewards(creator, Currency.wrap(address(0))), 0);
    }

    function testUpdateRewardPercentage() public {
        assertEq(hook.rewardPercentage(), 10); // 0.1%

        hook.updateRewardPercentage(50); // 0.5%
        assertEq(hook.rewardPercentage(), 50);

        // Should revert if too high
        vm.expectRevert("CreatorRewardsHook: Percentage too high");
        hook.updateRewardPercentage(200); // 2%
    }

    function testCreatorRegistry() public {
        string[] memory socialLinks = new string[](2);
        socialLinks[0] = "https://twitter.com/creator";
        socialLinks[1] = "https://github.com/creator";

        vm.prank(creator);
        registry.registerCreator(
            "Test Creator",
            "A test creator description",
            "https://example.com/avatar.png",
            "DeFi",
            socialLinks
        );

        assertTrue(registry.isCreator(creator));
        assertEq(registry.getTotalCreators(), 1);

        CreatorRegistry.CreatorProfile memory profile = registry.getCreatorProfile(creator);
        assertEq(profile.name, "Test Creator");
        assertEq(profile.description, "A test creator description");
        assertEq(profile.category, "DeFi");
        assertEq(profile.socialLinks.length, 2);
    }
}
