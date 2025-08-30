#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get contract address from command line argument
const contractAddress = process.argv[2];

if (!contractAddress) {
  console.error('Usage: node scripts/update-contract-address.js <contract_address>');
  console.error('Example: node scripts/update-contract-address.js 0x1234567890123456789012345678901234567890');
  process.exit(1);
}

// Validate contract address format
if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
  console.error('Invalid contract address format. Must be a valid Ethereum address.');
  process.exit(1);
}

console.log(`Updating contract address to: ${contractAddress}`);

// Files to update
const filesToUpdate = [
  'components/tip-form.tsx',
  'components/claim-card.tsx'
];

// Mock address to replace
const mockAddress = '0x1234567890123456789012345678901234567890';

filesToUpdate.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace mock address with real address
    const updatedContent = content.replace(new RegExp(mockAddress, 'g'), contractAddress);
    
    if (content !== updatedContent) {
      fs.writeFileSync(fullPath, updatedContent);
      console.log(`✅ Updated ${filePath}`);
    } else {
      console.log(`⚠️  No changes needed in ${filePath}`);
    }
  } else {
    console.log(`❌ File not found: ${filePath}`);
  }
});

// Update environment file
const envPath = path.join(process.cwd(), '.env.local');
const envContent = `# WalletConnect Project ID - Get from https://cloud.walletconnect.com/
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Contract address
NEXT_PUBLIC_SHARDTIP_CONTRACT_ADDRESS=${contractAddress}
`;

fs.writeFileSync(envPath, envContent);
console.log(`✅ Updated .env.local with contract address`);

console.log('\n🎉 Contract address update complete!');
console.log('\nNext steps:');
console.log('1. Update NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in .env.local');
console.log('2. Restart the development server: pnpm dev');
console.log('3. Test the application functionality');
