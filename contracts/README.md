# ShardTip Smart Contracts

Smart contracts for the ShardTip decentralized micro-tipping platform on Shardeum.

## Contract Features

- **Secure Tipping**: Send SHM tips to creator addresses with reentrancy protection
- **Atomic Claims**: Creators can claim all pending tips in a single transaction
- **Platform Fees**: Configurable platform fee (default 2.5%, max 5%)
- **Statistics**: Track tipping volume, transactions, and user stats
- **Owner Controls**: Platform fee management and emergency functions

## Setup

1. Install dependencies:
\`\`\`bash
cd contracts
npm install
\`\`\`

2. Create environment file:
\`\`\`bash
cp .env.example .env
# Add your private key to .env
\`\`\`

3. Compile contracts:
\`\`\`bash
npm run compile
\`\`\`

4. Run tests:
\`\`\`bash
npm run test
\`\`\`

## Deployment

### To Shardeum Unstablenet

1. Ensure you have SHM testnet tokens for gas
2. Set your private key in `.env`
3. Deploy:

\`\`\`bash
npm run deploy
\`\`\`

The deployment script will output the contract address. Add this to your frontend `.env.local`:

\`\`\`
NEXT_PUBLIC_SHARDTIP_CONTRACT_ADDRESS=<deployed_contract_address>
\`\`\`

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

\`\`\`bash
npm run test
\`\`\`

Tests cover:
- Basic tipping functionality
- Claim mechanisms
- Access controls
- Edge cases and error conditions
- Gas usage optimization

## Verification

After deployment, verify the contract on Shardeum explorer (if supported):

\`\`\`bash
npm run verify <CONTRACT_ADDRESS>
\`\`\`
