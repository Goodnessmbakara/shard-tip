# 🚀 ShardTip Deployment Guide

## Prerequisites

1. **Get Sepolia ETH**: You need Sepolia testnet ETH for gas fees
   - Use [Sepolia Faucet](https://sepoliafaucet.com/) or [Alchemy Faucet](https://sepoliafaucet.com/)
   - You'll need at least 0.1 ETH for deployment

2. **Get API Keys** (optional but recommended):
   - [Infura](https://infura.io/) - for RPC endpoint
   - [Etherscan](https://etherscan.io/apis) - for contract verification

## Environment Setup

Create a `.env` file in the `contracts/` directory:

```bash
# Private key for deployment (use a test wallet, never mainnet keys)
PRIVATE_KEY=your_private_key_here

# RPC endpoints (optional)
INFURA_API_KEY=your_infura_api_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

## Deployment Commands

### 1. Deploy ShardTip Contract
```bash
cd contracts
forge script script/DeployShardTip.s.sol --rpc-url sepolia --broadcast --verify
```

### 2. Deploy CreatorRegistry Contract
```bash
forge script script/DeployCreatorRegistry.s.sol --rpc-url sepolia --broadcast --verify
```

### 3. Deploy CreatorRewardsHook Contract
```bash
forge script script/DeployCreatorRewardsHook.s.sol --rpc-url sepolia --broadcast --verify
```

## Post-Deployment

After deployment, you'll need to:
1. Copy the deployed addresses to the frontend configuration
2. Update the network configuration in the frontend
3. Test the integration

## Contract Addresses

After deployment, save these addresses:
- **ShardTip**: `0x...`
- **CreatorRegistry**: `0x...`
- **CreatorRewardsHook**: `0x...`

## Verification

You can verify contracts on Etherscan:
```bash
forge verify-contract <CONTRACT_ADDRESS> <CONTRACT_NAME> --chain-id 11155111 --etherscan-api-key $ETHERSCAN_API_KEY
```
