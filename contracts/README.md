# ShardTip Smart Contracts

Smart contracts for the ShardTip decentralized micro-tipping platform on Shardeum.

## 🌐 Project Links

- **🚀 Live Application**: [https://shard-tip.vercel.app/](https://shard-tip.vercel.app/)
- **📂 Open Source Code**: [https://github.com/Goodnessmbakara/shard-tip](https://github.com/Goodnessmbakara/shard-tip)
- **🎥 Demo Video**: [https://youtu.be/bHx0a72eYLE](https://youtu.be/bHx0a72eYLE)
- **📚 API Documentation**: [API Documentation](../docs/API.md)

## Deployed Contract

**Network**: Shardeum Unstablenet (Chain ID: 8080)  
**Contract Address**: `0xA61BBB8C3FE06D39E52c2CbC22190Ddb344d86D9`  
**Explorer**: [https://explorer.shardeum.org/address/0xA61BBB8C3FE06D39E52c2CbC22190Ddb344d86D9](https://explorer.shardeum.org/address/0xA61BBB8C3FE06D39E52c2CbC22190Ddb344d86D9)

## Contract Features

- **Secure Tipping**: Send SHM tips to creator addresses with reentrancy protection
- **Atomic Claims**: Creators can claim all pending tips in a single transaction
- **Platform Fees**: Configurable platform fee (default 2.5%, max 5%)
- **Statistics**: Track tipping volume, transactions, and user stats
- **Owner Controls**: Platform fee management and emergency functions

## Setup

1. Install dependencies:
```bash
cd contracts
npm install
```

2. Create environment file:
```bash
cp .env.example .env
# Add your private key to .env
```

3. Compile contracts:
```bash
npm run compile
```

4. Run tests:
```bash
npm run test
```

## Deployment

### To Shardeum Unstablenet

1. Ensure you have SHM testnet tokens for gas
2. Set your private key in `.env`
3. Deploy:

```bash
npm run deploy
```

The deployment script will output the contract address. Add this to your frontend `.env.local`:

```
NEXT_PUBLIC_SHARDTIP_CONTRACT_ADDRESS=<deployed_contract_address>
```

### Using Remix IDE

1. Copy `contracts/ShardTip.sol` to Remix
2. Install OpenZeppelin contracts in Remix
3. Compile with Solidity 0.8.20
4. Deploy to Shardeum network via MetaMask

## Contract Functions

### Public Functions

- `tip(address creator)` - Send a tip to a creator (payable)
- `claimTips()` - Claim all pending tips
- `getPendingTips(address creator)` - View pending tips for an address
- `getCreatorStats(address creator)` - Get creator statistics
- `getTipperStats(address tipper)` - Get tipper statistics
- `getPlatformStats()` - Get platform-wide statistics

### Owner Functions

- `updatePlatformFee(uint256 newFeePercentage)` - Update platform fee
- `withdrawPlatformFees()` - Withdraw collected platform fees
- `emergencyWithdraw()` - Emergency withdrawal function

## Security Features

- **ReentrancyGuard**: Prevents reentrancy attacks
- **Checks-Effects-Interactions**: Follows CEI pattern
- **Input Validation**: Validates all inputs and addresses
- **Access Control**: Owner-only functions for platform management
- **Fee Limits**: Maximum platform fee cap of 5%

## Gas Optimization

- Efficient storage layout
- Batch operations where possible
- Optimized for frequent small transactions
- Compiler optimization enabled

## Testing

Run the test suite:

```bash
npm run test
```

Tests cover:
- Basic tipping functionality
- Claim mechanisms
- Access controls
- Edge cases and error conditions
- Gas usage optimization

## Verification

After deployment, verify the contract on Shardeum explorer (if supported):

```bash
npm run verify <CONTRACT_ADDRESS>
```

## Contract ABI

The contract ABI is available in the compiled artifacts and can be used for frontend integration:

```json
[
  {
    "inputs": [{"name": "creator", "type": "address"}],
    "name": "tip",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimTips",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "creator", "type": "address"}],
    "name": "getPendingTips",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
]
```

## Events

The contract emits the following events:

- `TipSent(address indexed tipper, address indexed creator, uint256 amount, uint256 timestamp)`
- `TipsClaimed(address indexed creator, uint256 amount, uint256 timestamp)`
- `PlatformFeeUpdated(uint256 newFee)`
