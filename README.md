# ShardTip - Decentralized Micro-Tipping Platform

A sophisticated micro-tipping platform built on Shardeum blockchain with Apple-inspired minimalist design.

## 🌐 Live Demo & Resources

- **🚀 Live Application**: [https://shard-tip.vercel.app/](https://shard-tip.vercel.app/)
- **📂 Open Source Code**: [https://github.com/Goodnessmbakara/shard-tip](https://github.com/Goodnessmbakara/shard-tip)
- **🎥 Demo Video**: [https://youtu.be/bHx0a72eYLE](https://youtu.be/bHx0a72eYLE)
- **📚 API Documentation**: [API Documentation](./docs/API.md)

## Features

- 🔗 **Shardeum Integration**: Built on Shardeum Unstablenet testnet (Chain ID 8080)
- 💰 **Micro-Tipping**: Send small SHM tips to creators' wallet addresses
- 🎨 **Apple-Inspired Design**: Clean, minimalist interface with custom animations
- ⚡ **Atomic Claims**: Creators can claim batched tips atomically
- 📱 **Responsive**: Mobile-first design with desktop enhancements
- 🔍 **Wallet Verification**: Verify wallet activity and tipping history
- 📊 **Real-time Analytics**: Track tips sent, received, and pending amounts

## Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, TypeScript
- **Blockchain**: Shardeum testnet, wagmi/viem for wallet integration
- **Animations**: Framer Motion, Canvas Confetti
- **State**: React hooks/context with TanStack Query
- **UI Components**: Radix UI, Lucide React icons

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet
- Shardeum testnet SHM tokens

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Goodnessmbakara/shard-tip.git
cd shard-tip
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env.local file
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SHARDTIP_CONTRACT_ADDRESS=0xA61BBB8C3FE06D39E52c2CbC22190Ddb344d86D9
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Wallet Setup

1. Add Shardeum Unstablenet to MetaMask:
   - Network Name: Shardeum Unstablenet
   - RPC URL: https://api-unstable.shardeum.org
   - Chain ID: 8080
   - Currency Symbol: SHM
   - Block Explorer: https://explorer-unstable.shardeum.org

2. Get testnet SHM tokens from the Shardeum faucet

## Smart Contract

The ShardTip smart contract is deployed to Shardeum Unstablenet at `0xA61BBB8C3FE06D39E52c2CbC22190Ddb344d86D9`. Contract features:
- `tip(address creator)` - Send tips to creators
- `claimTips()` - Claim accumulated tips
- `getPendingTips(address)` - View pending tips
- `getCreatorStats(address)` - Get creator statistics

## API Endpoints

### Wallet Verification API
- **Endpoint**: `/api/verify`
- **Method**: GET
- **Description**: Verify wallet activity and tipping history
- **Documentation**: [API Documentation](./docs/API.md)

## Project Structure

```
shardtip/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # UI components
│   ├── tip-form.tsx      # Tip sending form
│   ├── claim-card.tsx    # Tip claiming interface
│   └── verification-card.tsx # Wallet verification
├── contracts/            # Smart contracts
│   └── contracts/        # Solidity contracts
├── lib/                  # Utilities and configurations
└── docs/                 # Documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## About

ShardTip is built to empower creators in the Web3 ecosystem by providing instant, low-cost micro-tipping capabilities on the Shardeum network. The platform takes only a 2.5% fee, ensuring creators keep 97.5% of their earnings.
