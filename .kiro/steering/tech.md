# Technology Stack & Build System

## Smart Contracts

### Core Technologies
- **Solidity**: 0.8.26 (strict version requirement)
- **Framework**: Foundry (primary) + Hardhat (legacy support)
- **Testing**: Forge with 100% test coverage requirement
- **Dependencies**: 
  - Uniswap v4 Core & Hooks
  - OpenZeppelin Contracts (ReentrancyGuard, Ownable)

### Contract Architecture Patterns
- **Security First**: Always use ReentrancyGuard on external functions
- **CEI Pattern**: Checks-Effects-Interactions for all state changes
- **Gas Optimization**: Optimizer enabled with 200 runs
- **Access Control**: Ownable for admin functions, proper modifiers

### Foundry Configuration
```toml
solc = "0.8.26"
optimizer = true
optimizer_runs = 200
fuzz = { runs = 1000 }
```

## Frontend Stack

### Core Framework
- **Next.js**: 15.x with App Router (required)
- **TypeScript**: Strict mode enabled
- **React**: 18.x with modern patterns

### Web3 Integration
- **wagmi**: Latest version for Ethereum interactions
- **viem**: For low-level blockchain operations
- **RainbowKit**: Wallet connection with dark theme
- **TanStack Query**: For async state management

### UI & Styling
- **Tailwind CSS**: 4.x with custom design system
- **Radix UI**: Accessible component primitives
- **Framer Motion**: Animations and transitions
- **Lucide React**: Icon library
- **shadcn/ui**: Component system (New York style)

### Design System
- **Color Scheme**: Custom OKLCH color space with dark mode
- **Typography**: Inter font with Geist fallbacks
- **Radius**: 0.5rem standard border radius
- **Spacing**: Tailwind default scale

## Development Commands

### Smart Contracts (from `/contracts` directory)
```bash
# Install dependencies
forge install

# Compile contracts
forge build

# Run tests with verbose output
forge test -vvv

# Run specific test
forge test --match-test testCreatorRegistration -vvv

# Deploy to Sepolia
forge script script/DeployShardTip.s.sol:DeployShardTip \
  --rpc-url $SEPOLIA_RPC_URL \
  --broadcast \
  --verify

# Check gas usage
forge test --gas-report
```

### Frontend (from project root)
```bash
# Install dependencies
pnpm install

# Development server
pnpm run dev

# Production build
pnpm run build

# Start production server
pnpm run start

# Linting
pnpm run lint
```

## Environment Configuration

### Required Environment Variables
```bash
# Frontend (.env.local)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_id
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_NETWORK_NAME=Sepolia
NEXT_PUBLIC_SHARDTIP_CONTRACT_ADDRESS=0xD963A5d06641C5E3d6f45e4F40c39aD4F81a0A5E
NEXT_PUBLIC_CREATOR_REGISTRY_ADDRESS=0x453ac10b6758E1990FBAdF9116216E246Fce6845
NEXT_PUBLIC_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY

# Contracts (.env in contracts/)
PRIVATE_KEY=your_private_key
ALCHEMY_API_KEY=your_alchemy_key
ETHERSCAN_API_KEY=your_etherscan_key
```

## Network Configuration

### Primary Network: Sepolia Testnet
- **Chain ID**: 11155111
- **RPC**: Alchemy endpoint required
- **Explorer**: https://sepolia.etherscan.io/
- **Faucet**: https://sepoliafaucet.com/

### Uniswap v4 Integration
- **PoolManager**: `0xE03A1074c86CFeDd5C142C4F04F1a1536e203543`
- **Hook Deployment**: Requires CREATE2 with computed salt
- **Permission Bitmap**: Must match hook address requirements

## Code Quality Standards

### Solidity
- NatSpec documentation required for all public functions
- Gas optimization comments for complex operations
- Comprehensive test coverage (aim for 100%)
- Security audit patterns (ReentrancyGuard, input validation)

### TypeScript/React
- Strict TypeScript configuration
- Component composition over inheritance
- Custom hooks for Web3 interactions
- Error boundaries for robust UX
- Responsive design (mobile-first)

### Testing Requirements
- All smart contract functions must have tests
- Frontend components should have basic functionality tests
- Integration tests for Web3 interactions
- Gas usage reporting for contract optimizations