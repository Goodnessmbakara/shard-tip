# ShardTip - Decentralized Micro-Tipping Platform

A sophisticated micro-tipping platform built on Shardeum blockchain with Apple-inspired minimalist design.

## Features

- 🔗 **Shardeum Integration**: Built on Shardeum Unstablenet testnet (Chain ID 8080)
- 💰 **Micro-Tipping**: Send small SHM tips to creators' wallet addresses
- 🤖 **AI Suggestions**: Smart tip amount suggestions based on content sentiment analysis
- 🎨 **Apple-Inspired Design**: Clean, minimalist interface with custom animations
- ⚡ **Atomic Claims**: Creators can claim batched tips atomically
- 📱 **Responsive**: Mobile-first design with desktop enhancements

## Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, TypeScript
- **Blockchain**: Shardeum testnet, wagmi/viem for wallet integration
- **AI**: Hugging Face API for sentiment analysis
- **Animations**: Framer Motion, Canvas Confetti
- **State**: React hooks/context with TanStack Query

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet
- Shardeum testnet SHM tokens

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd shardtip
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
# Create .env.local file
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
\`\`\`

4. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

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

The ShardTip smart contract will be deployed to Shardeum Unstablenet. Contract features:
- `tip(address creator)` - Send tips to creators
- `claimTips()` - Claim accumulated tips
- `getPendingTips(address)` - View pending tips

## Project Structure

\`\`\`
shardtip/
├── app/                    # Next.js app directory
├── components/             # React components
├── contracts/              # Smart contracts
├── lib/                    # Utilities and configurations
├── hooks/                  # Custom React hooks
└── public/                 # Static assets
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
