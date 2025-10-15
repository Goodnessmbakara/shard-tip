// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {IHooks} from "v4-core/interfaces/IHooks.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {Hooks} from "v4-core/libraries/Hooks.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";
import {BalanceDelta} from "v4-core/types/BalanceDelta.sol";
import {BeforeSwapDelta, toBeforeSwapDelta} from "v4-core/types/BeforeSwapDelta.sol";

/**
 * @title BaseHook
 * @notice Abstract contract providing a base implementation for Uniswap v4 hooks
 * @dev Derived contracts should override internal hook functions and getHookPermissions
 */
abstract contract BaseHook is IHooks {
    using Hooks for IHooks;

    IPoolManager public immutable poolManager;

    constructor(IPoolManager _poolManager) {
        poolManager = _poolManager;
        _validateHookAddress(this);
    }

    /**
     * @notice Returns the hook permissions configuration
     * @dev Must be overridden by derived contracts to specify which hooks are enabled
     */
    function getHookPermissions() public pure virtual returns (Hooks.Permissions memory);

    /**
     * @notice Validates that the hook address matches the permissions
     * @dev Called in constructor to ensure correct deployment
     */
    function _validateHookAddress(BaseHook hook) internal pure {
        Hooks.validateHookPermissions(hook, hook.getHookPermissions());
    }

    // ========== IHooks Implementation ==========

    function beforeInitialize(address sender, PoolKey calldata key, uint160 sqrtPriceX96)
        external
        virtual
        override
        returns (bytes4)
    {
        if (!getHookPermissions().beforeInitialize) revert();
        return _beforeInitialize(sender, key, sqrtPriceX96);
    }

    function afterInitialize(address sender, PoolKey calldata key, uint160 sqrtPriceX96, int24 tick)
        external
        virtual
        override
        returns (bytes4)
    {
        if (!getHookPermissions().afterInitialize) revert();
        return _afterInitialize(sender, key, sqrtPriceX96, tick);
    }

    function beforeAddLiquidity(
        address sender,
        PoolKey calldata key,
        IPoolManager.ModifyLiquidityParams calldata params,
        bytes calldata hookData
    ) external virtual override returns (bytes4) {
        if (!getHookPermissions().beforeAddLiquidity) revert();
        return _beforeAddLiquidity(sender, key, params, hookData);
    }

    function afterAddLiquidity(
        address sender,
        PoolKey calldata key,
        IPoolManager.ModifyLiquidityParams calldata params,
        BalanceDelta delta,
        BalanceDelta feesAccrued,
        bytes calldata hookData
    ) external virtual override returns (bytes4, BalanceDelta) {
        if (!getHookPermissions().afterAddLiquidity) revert();
        return _afterAddLiquidity(sender, key, params, delta, feesAccrued, hookData);
    }

    function beforeRemoveLiquidity(
        address sender,
        PoolKey calldata key,
        IPoolManager.ModifyLiquidityParams calldata params,
        bytes calldata hookData
    ) external virtual override returns (bytes4) {
        if (!getHookPermissions().beforeRemoveLiquidity) revert();
        return _beforeRemoveLiquidity(sender, key, params, hookData);
    }

    function afterRemoveLiquidity(
        address sender,
        PoolKey calldata key,
        IPoolManager.ModifyLiquidityParams calldata params,
        BalanceDelta delta,
        BalanceDelta feesAccrued,
        bytes calldata hookData
    ) external virtual override returns (bytes4, BalanceDelta) {
        if (!getHookPermissions().afterRemoveLiquidity) revert();
        return _afterRemoveLiquidity(sender, key, params, delta, feesAccrued, hookData);
    }

    function beforeSwap(
        address sender,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        bytes calldata hookData
    ) external virtual override returns (bytes4, BeforeSwapDelta, uint24) {
        if (!getHookPermissions().beforeSwap) revert();
        return _beforeSwap(sender, key, params, hookData);
    }

    function afterSwap(
        address sender,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        BalanceDelta delta,
        bytes calldata hookData
    ) external virtual override returns (bytes4, int128) {
        if (!getHookPermissions().afterSwap) revert();
        return _afterSwap(sender, key, params, delta, hookData);
    }

    function beforeDonate(
        address sender,
        PoolKey calldata key,
        uint256 amount0,
        uint256 amount1,
        bytes calldata hookData
    ) external virtual override returns (bytes4) {
        if (!getHookPermissions().beforeDonate) revert();
        return _beforeDonate(sender, key, amount0, amount1, hookData);
    }

    function afterDonate(
        address sender,
        PoolKey calldata key,
        uint256 amount0,
        uint256 amount1,
        bytes calldata hookData
    ) external virtual override returns (bytes4) {
        if (!getHookPermissions().afterDonate) revert();
        return _afterDonate(sender, key, amount0, amount1, hookData);
    }

    // ========== Internal Hook Functions (Override These) ==========

    function _beforeInitialize(address, PoolKey calldata, uint160)
        internal
        virtual
        returns (bytes4)
    {
        return this.beforeInitialize.selector;
    }

    function _afterInitialize(address, PoolKey calldata, uint160, int24)
        internal
        virtual
        returns (bytes4)
    {
        return this.afterInitialize.selector;
    }

    function _beforeAddLiquidity(address, PoolKey calldata, IPoolManager.ModifyLiquidityParams calldata, bytes calldata)
        internal
        virtual
        returns (bytes4)
    {
        return this.beforeAddLiquidity.selector;
    }

    function _afterAddLiquidity(
        address,
        PoolKey calldata,
        IPoolManager.ModifyLiquidityParams calldata,
        BalanceDelta,
        BalanceDelta,
        bytes calldata
    ) internal virtual returns (bytes4, BalanceDelta) {
        return (this.afterAddLiquidity.selector, BalanceDelta.wrap(0));
    }

    function _beforeRemoveLiquidity(
        address,
        PoolKey calldata,
        IPoolManager.ModifyLiquidityParams calldata,
        bytes calldata
    ) internal virtual returns (bytes4) {
        return this.beforeRemoveLiquidity.selector;
    }

    function _afterRemoveLiquidity(
        address,
        PoolKey calldata,
        IPoolManager.ModifyLiquidityParams calldata,
        BalanceDelta,
        BalanceDelta,
        bytes calldata
    ) internal virtual returns (bytes4, BalanceDelta) {
        return (this.afterRemoveLiquidity.selector, BalanceDelta.wrap(0));
    }

    function _beforeSwap(address, PoolKey calldata, IPoolManager.SwapParams calldata, bytes calldata)
        internal
        virtual
        returns (bytes4, BeforeSwapDelta, uint24)
    {
        return (this.beforeSwap.selector, toBeforeSwapDelta(0, 0), 0);
    }

    function _afterSwap(address, PoolKey calldata, IPoolManager.SwapParams calldata, BalanceDelta, bytes calldata)
        internal
        virtual
        returns (bytes4, int128)
    {
        return (this.afterSwap.selector, 0);
    }

    function _beforeDonate(address, PoolKey calldata, uint256, uint256, bytes calldata)
        internal
        virtual
        returns (bytes4)
    {
        return this.beforeDonate.selector;
    }

    function _afterDonate(address, PoolKey calldata, uint256, uint256, bytes calldata)
        internal
        virtual
        returns (bytes4)
    {
        return this.afterDonate.selector;
    }
}
