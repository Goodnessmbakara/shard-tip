// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test, console} from "forge-std/Test.sol";
import {CreatorRewardsHook} from "../contracts/CreatorRewardsHook.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {IHooks} from "v4-core/interfaces/IHooks.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";
import {PoolId, PoolIdLibrary} from "v4-core/types/PoolId.sol";
import {Currency} from "v4-core/types/Currency.sol";
import {CurrencyLibrary} from "v4-core/types/Currency.sol";
import {Hooks} from "v4-core/libraries/Hooks.sol";
import {TickMath} from "v4-core/libraries/TickMath.sol";
import {BalanceDelta, toBalanceDelta} from "v4-core/types/BalanceDelta.sol";

/**
 * @title CreatorRewardsHookTest
 * @dev Comprehensive test suite for CreatorRewardsHook
 * @author ShardTip Team
 */
contract CreatorRewardsHookTest is Test {
    using PoolIdLibrary for PoolKey;
    using CurrencyLibrary for Currency;

    CreatorRewardsHook public hook;
    IPoolManager public poolManager;
    
    address public creator = makeAddr("creator");
    address public swapper = makeAddr("swapper");
    
    PoolKey public poolKey;
    PoolId public poolId;
    
    Currency public currency0;
    Currency public currency1;

    function setUp() public {
        // Mock PoolManager for testing
        poolManager = IPoolManager(makeAddr("poolManager"));
        
        // Deploy hook
        hook = new CreatorRewardsHook(poolManager);
        
        // Setup test currencies
        currency0 = Currency.wrap(makeAddr("token0"));
        currency1 = Currency.wrap(makeAddr("token1"));
        
        // Setup test pool
        poolKey = PoolKey({
            currency0: currency0,
            currency1: currency1,
            fee: 3000,
            tickSpacing: 60,
            hooks: IHooks(hook)
        });
        poolId = poolKey.toId();
    }

    function testInitialization() public {
        assertEq(address(hook.poolManager()), address(poolManager));
        assertEq(hook.owner(), address(this));
        assertEq(hook.rewardPercentage(), 10); // 0.1%
        assertFalse(hook.creatorWhitelistEnabled());
    }

    function testHookPermissions() public {
        Hooks.Permissions memory permissions = hook.getHookPermissions();
        
        assertFalse(permissions.beforeInitialize);
        assertTrue(permissions.afterInitialize);
        assertFalse(permissions.beforeAddLiquidity);
        assertFalse(permissions.afterAddLiquidity);
        assertFalse(permissions.beforeRemoveLiquidity);
        assertFalse(permissions.afterRemoveLiquidity);
        assertFalse(permissions.beforeSwap);
        assertTrue(permissions.afterSwap);
        assertFalse(permissions.beforeDonate);
        assertFalse(permissions.afterDonate);
    }

    function testPoolCreatorRegistration() public {
        // Simulate pool initialization
        vm.prank(creator);
        hook.afterInitialize(
            creator,
            poolKey,
            0, // sqrtPriceX96
            0  // tick
        );
        
        assertEq(hook.poolCreators(poolId), creator);
    }

    function testRewardDistribution() public {
        // Register creator
        vm.prank(creator);
        hook.afterInitialize(creator, poolKey, 0, 0);
        
        // Authorize creator if whitelist is enabled
        hook.authorizeCreator(creator);
        
        // Simulate swap with 1000 token volume
        uint256 swapAmount = 1000e18;
        // For zeroForOne: true, amount0 should be negative (token0 out), amount1 should be positive (token1 in)
        BalanceDelta delta = toBalanceDelta(int128(-int256(swapAmount)), int128(int256(swapAmount)));
        
        vm.prank(swapper);
        (bytes4 selector, int128 returnDelta) = hook.afterSwap(
            swapper,
            poolKey,
            IPoolManager.SwapParams({
                zeroForOne: true,
                amountSpecified: int256(swapAmount),
                sqrtPriceLimitX96: 0
            }),
            delta,
            ""
        );
        
        // Check that hook returns correct selector
        assertEq(selector, hook.afterSwap.selector);
        assertEq(returnDelta, 0);
        
        // Check reward calculation (0.1% of 1000 = 1)
        uint256 expectedReward = (swapAmount * 10) / 10000; // 0.1%
        assertEq(hook.pendingRewards(creator, currency0), expectedReward);
        assertEq(hook.totalRewardsDistributed(poolId), expectedReward);
    }

    function testRewardClaiming() public {
        // Setup: register creator and accumulate rewards
        vm.prank(creator);
        hook.afterInitialize(creator, poolKey, 0, 0);
        
        // Simulate reward accumulation
        uint256 rewardAmount = 1e18;
        hook._setPendingRewards(creator, CurrencyLibrary.ADDRESS_ZERO, rewardAmount);
        
        // Fund the hook contract
        vm.deal(address(hook), rewardAmount);
        
        uint256 creatorBalanceBefore = creator.balance;
        
        // Claim rewards
        vm.prank(creator);
        hook.claimRewards(CurrencyLibrary.ADDRESS_ZERO);
        
        // Check balances
        assertEq(creator.balance, creatorBalanceBefore + rewardAmount);
        assertEq(hook.pendingRewards(creator, CurrencyLibrary.ADDRESS_ZERO), 0);
    }

    function testBatchRewardClaiming() public {
        // Setup: register creator
        vm.prank(creator);
        hook.afterInitialize(creator, poolKey, 0, 0);
        
        // Setup multiple currencies
        Currency[] memory currencies = new Currency[](2);
        currencies[0] = CurrencyLibrary.ADDRESS_ZERO;
        currencies[1] = currency0;
        
        // Fund rewards
        uint256 rewardAmount = 1e18;
        hook._setPendingRewards(creator, currencies[0], rewardAmount);
        hook._setPendingRewards(creator, currencies[1], rewardAmount);
        
        vm.deal(address(hook), rewardAmount);
        
        uint256 creatorBalanceBefore = creator.balance;
        
        // Batch claim
        vm.prank(creator);
        hook.claimAllRewards(currencies);
        
        // Check ETH reward was claimed
        assertEq(creator.balance, creatorBalanceBefore + rewardAmount);
        assertEq(hook.pendingRewards(creator, currencies[0]), 0);
        // Note: ERC20 claiming would fail in this implementation
    }

    function testRewardPercentageUpdate() public {
        uint256 newPercentage = 50; // 0.5%
        
        hook.updateRewardPercentage(newPercentage);
        assertEq(hook.rewardPercentage(), newPercentage);
    }

    function testRewardPercentageUpdateFailsWhenTooHigh() public {
        uint256 tooHighPercentage = 200; // 2% > 1% max
        
        vm.expectRevert("CreatorRewardsHook: Percentage too high");
        hook.updateRewardPercentage(tooHighPercentage);
    }

    function testCreatorWhitelist() public {
        // Enable whitelist
        hook.setCreatorWhitelistEnabled(true);
        assertTrue(hook.creatorWhitelistEnabled());
        
        // Authorize creator
        hook.authorizeCreator(creator);
        assertTrue(hook.authorizedCreators(creator));
        
        // Deauthorize creator
        hook.deauthorizeCreator(creator);
        assertFalse(hook.authorizedCreators(creator));
    }

    function testGetCreatorStats() public {
        // Setup creator with rewards
        hook._setPendingRewards(creator, CurrencyLibrary.ADDRESS_ZERO, 1e18);
        hook.authorizeCreator(creator);
        
        (uint256 totalPendingETH, uint256 totalPendingTokens, bool isAuthorized) = 
            hook.getCreatorStats(creator);
        
        assertEq(totalPendingETH, 1e18);
        assertEq(totalPendingTokens, 0); // Simplified implementation
        assertTrue(isAuthorized);
    }

    function testGetPoolStats() public {
        // Register creator
        vm.prank(creator);
        hook.afterInitialize(creator, poolKey, 0, 0);
        
        // Add some rewards
        hook._setTotalRewardsDistributed(poolId, 5e18);
        
        (address poolCreator, uint256 totalRewards, bool hasCreator) = 
            hook.getPoolStats(poolId);
        
        assertEq(poolCreator, creator);
        assertEq(totalRewards, 5e18);
        assertTrue(hasCreator);
    }

    function testEmergencyWithdraw() public {
        // Fund the hook
        uint256 emergencyAmount = 1e18;
        vm.deal(address(hook), emergencyAmount);
        
        uint256 ownerBalanceBefore = address(this).balance;
        
        // Emergency withdraw
        hook.emergencyWithdraw(CurrencyLibrary.ADDRESS_ZERO);
        
        assertEq(address(this).balance, ownerBalanceBefore + emergencyAmount);
    }

    // Fallback function to receive ETH
    receive() external payable {}

    function testRejectDirectTransfers() public {
        (bool success,) = address(hook).call{value: 1 ether}("");
        // The call should fail due to the revert in receive()
        assertFalse(success);
    }

    function testOnlyOwnerFunctions() public {
        address nonOwner = makeAddr("nonOwner");
        
        vm.startPrank(nonOwner);
        
        vm.expectRevert();
        hook.updateRewardPercentage(20);
        
        vm.expectRevert();
        hook.setCreatorWhitelistEnabled(true);
        
        vm.expectRevert();
        hook.authorizeCreator(creator);
        
        vm.expectRevert();
        hook.emergencyWithdraw(CurrencyLibrary.ADDRESS_ZERO);
        
        vm.stopPrank();
    }

    function testNoRewardsForUnauthorizedCreator() public {
        // Enable whitelist but don't authorize creator
        hook.setCreatorWhitelistEnabled(true);
        
        // Register creator
        vm.prank(creator);
        hook.afterInitialize(creator, poolKey, 0, 0);
        
        // Simulate swap
        uint256 swapAmount = 1000e18;
        BalanceDelta delta = BalanceDelta.wrap(int128(int256(swapAmount)));
        
        vm.prank(swapper);
        hook.afterSwap(
            swapper,
            poolKey,
            IPoolManager.SwapParams({
                zeroForOne: true,
                amountSpecified: int256(swapAmount),
                sqrtPriceLimitX96: 0
            }),
            delta,
            ""
        );
        
        // Should not accumulate rewards for unauthorized creator
        assertEq(hook.pendingRewards(creator, currency0), 0);
    }
}