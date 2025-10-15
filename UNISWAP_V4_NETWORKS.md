# Uniswap v4 Deployment Networks

## Testnets with Uniswap v4

### ✅ Sepolia (Recommended for Development)
- **Chain ID**: 11155111
- **RPC URL**: `https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY` or `https://sepolia.infura.io/v3/YOUR_KEY`
- **PoolManager**: `0xE03A1074c86CFeDd5C142C4F04F1a1536e203543`
- **Explorer**: https://sepolia.etherscan.io/

**Why Sepolia?**
- Full Uniswap v4 deployment
- EIP-1559 support
- Free testnet ETH from faucets
- Well-documented and stable

## Mainnets with Uniswap v4

### Ethereum Mainnet
- **Chain ID**: 1
- **PoolManager**: `0x000000000004444c5dc75cB358380D2e3dE08A90`

### Arbitrum One
- **Chain ID**: 42161
- **Quoter**: `0x3972c00f7ed4885e145823eb7c655375d275a1c5`

### Polygon
- **Chain ID**: 137
- **Quoter**: `0xb3d5c3dfc3a7aebff71895a7191796bffc2c81b9`

### Base (Worldchain)
- **Chain ID**: 480
- **PoolManager**: `0xb1860d529182ac3bc1f51fa2abd56662b7d13f33`

### Blast
- **Chain ID**: 81457
- **Quoter**: `0x6f71cdcb0d119ff72c6eb501abceb576fbf62bcf`

### Zora
- **Chain ID**: 7777777
- **PoolManager**: `0x0575338e4c17006ae181b47900a84404247ca30f`

### Ink
- **Chain ID**: 57073
- **PoolManager**: `0x360e68faccca8ca495c1b759fd9eee466db9fb32`

## Deployment Strategy for ShardTip

### Phase 1: Deploy to Sepolia (Testnet)
Deploy both contracts to Sepolia for full Uniswap v4 integration testing:
1. CreatorRegistry
2. CreatorRewardsHook (using Sepolia PoolManager)

### Phase 2: Deploy to Shardeum (Production)
Deploy CreatorRegistry to Shardeum for your existing ShardTip app:
1. CreatorRegistry only (for creator profiles)
2. Keep existing ShardTip contract

### Phase 3: Multi-chain Strategy (Optional)
Deploy to multiple chains for broader reach:
1. Base/Worldchain (low fees, growing ecosystem)
2. Arbitrum (established L2)
3. Polygon (wide adoption)

## Getting Testnet Funds

### Sepolia ETH Faucets
- https://sepoliafaucet.com/
- https://www.alchemy.com/faucets/ethereum-sepolia
- https://faucet.quicknode.com/ethereum/sepolia

### Network Configuration

**Sepolia**:
```bash
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
SEPOLIA_POOL_MANAGER=0xE03A1074c86CFeDd5C142C4F04F1a1536e203543
```

**Shardeum**:
```bash
SHARDEUM_RPC_URL=https://api-unstable.shardeum.org
# Note: Use --legacy flag for deployments
```


