# Project Structure & Organization

## Root Directory Layout

```
shard-tip/
├── app/                     # Next.js App Router pages
├── components/              # React components
├── contracts/               # Smart contracts (Foundry workspace)
├── lib/                     # Utilities and configurations
├── docs/                    # Documentation
├── styles/                  # Global styles
└── .kiro/                   # Kiro steering rules
```

## Frontend Structure (`/app` - Next.js App Router)

### Page Organization
```
app/
├── layout.tsx              # Root layout with providers
├── page.tsx                # Home page
├── globals.css             # Global styles and design system
├── api/                    # API routes
│   └── verify/             # Wallet verification endpoint
├── creators/               # Creator marketplace
│   └── page.tsx
├── creator-registration/   # Creator onboarding flow
│   └── page.tsx
└── dashboard/              # Rewards dashboard
    └── page.tsx
```

### Component Architecture (`/components`)

#### UI Components (`/components/ui`)
- Radix UI primitives with custom styling
- Reusable design system components
- Follow shadcn/ui patterns (New York style)

#### Feature Components (`/components`)
```
components/
├── ui/                     # Design system primitives
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── ...
├── providers.tsx           # Web3 and app providers
├── header.tsx              # Navigation header
├── creator-registration.tsx # Registration form
├── tip-form.tsx            # Tipping interface
├── analytics-dashboard.tsx # Rewards analytics
└── network-stats.tsx       # Network statistics
```

## Smart Contracts Structure (`/contracts`)

### Foundry Workspace Layout
```
contracts/
├── contracts/              # Solidity source files
│   ├── ShardTip.sol       # Core tipping contract
│   ├── CreatorRegistry.sol # Creator profiles
│   ├── CreatorRewardsHook.sol # Uniswap v4 hook
│   └── BaseHook.sol       # Hook base implementation
├── script/                 # Deployment scripts
│   ├── DeployShardTip.s.sol
│   └── DeployCreatorRegistry.s.sol
├── test/                   # Foundry tests
│   ├── ShardTip.test.js
│   ├── CreatorRegistry.t.sol
│   └── CreatorRewardsHook.t.sol
├── foundry.toml           # Foundry configuration
└── package.json           # Node.js dependencies (Hardhat)
```

### Contract Dependencies
- **Uniswap v4**: Located in `/lib/v4-core` and `/lib/uniswap-hooks`
- **OpenZeppelin**: Via git submodules in lib structure
- **Forge Standard Library**: For testing utilities

## Library Structure (`/lib`)

### Configuration Files
```
lib/
├── wagmi.ts               # Web3 configuration
├── utils.ts               # Utility functions
├── network-api.ts         # Network API interactions
├── polyfills.ts           # Browser polyfills
├── v4-core/               # Uniswap v4 core (git submodule)
└── uniswap-hooks/         # Uniswap hooks library (git submodule)
```

## File Naming Conventions

### React Components
- **PascalCase** for component files: `CreatorRegistration.tsx`
- **kebab-case** for page files: `creator-registration/page.tsx`
- **camelCase** for utility files: `networkApi.ts`

### Solidity Contracts
- **PascalCase** for contracts: `CreatorRewardsHook.sol`
- **PascalCase** for test files: `CreatorRegistry.t.sol`
- **PascalCase** for scripts: `DeployShardTip.s.sol`

## Import Path Conventions

### TypeScript Path Mapping
```json
{
  "paths": {
    "@/*": ["./*"]
  }
}
```

### Usage Patterns
```typescript
// Components
import { Button } from "@/components/ui/button"
import { CreatorRegistration } from "@/components/creator-registration"

// Utilities
import { cn } from "@/lib/utils"
import { wagmiConfig } from "@/lib/wagmi"

// Types (when needed)
import type { CreatorProfile } from "@/types/creator"
```

## Configuration Files Location

### Root Level Configs
- `package.json` - Frontend dependencies
- `tsconfig.json` - TypeScript configuration
- `next.config.mjs` - Next.js configuration
- `postcss.config.mjs` - PostCSS/Tailwind setup
- `components.json` - shadcn/ui configuration

### Contract Configs
- `contracts/foundry.toml` - Foundry configuration
- `contracts/package.json` - Hardhat dependencies
- `contracts/.env` - Contract environment variables

## Documentation Organization (`/docs`)

### Documentation Files
```
docs/
├── API.md                 # API documentation
└── (additional docs as needed)

# Root level documentation
├── README.md              # Main project documentation
├── FINAL_STATUS.md        # Deployment status
└── UNISWAP_V4_NETWORKS.md # Network information
```

## Environment Files

### Frontend Environment
- `.env.local` - Local development variables
- `.env.example` - Template for required variables

### Contract Environment
- `contracts/.env` - Contract deployment variables
- Never commit private keys or sensitive data

## Git Submodules

### Uniswap Dependencies
- `lib/v4-core/` - Uniswap v4 core contracts
- `lib/uniswap-hooks/` - Uniswap hooks library

### Submodule Management
```bash
# Initialize submodules
git submodule update --init --recursive

# Update submodules
git submodule update --remote
```

## Build Artifacts

### Generated Directories (Git Ignored)
```
.next/                     # Next.js build output
node_modules/              # Node.js dependencies
contracts/out/             # Foundry build artifacts
contracts/cache/           # Foundry cache
contracts/broadcast/       # Deployment artifacts
```

## Development Workflow

### Working with Contracts
1. Navigate to `contracts/` directory
2. Use Foundry commands for development
3. Deploy scripts in `script/` directory
4. Tests in `test/` directory

### Working with Frontend
1. Work from project root
2. Components in `components/` directory
3. Pages in `app/` directory
4. Utilities in `lib/` directory

### Cross-Component Integration
- Contract ABIs should be imported into frontend
- Environment variables bridge contract addresses
- Type definitions shared between frontend and contracts