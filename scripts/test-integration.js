#!/usr/bin/env node

const { ethers } = require('ethers');
const axios = require('axios');

// Configuration
const SHARDEUM_RPC = 'https://api-unstable.shardeum.org';
const CHAIN_ID = 8080;

// Test configuration
const TEST_CONFIG = {
  contractAddress: process.env.NEXT_PUBLIC_SHARDTIP_CONTRACT_ADDRESS,
  privateKey: process.env.PRIVATE_KEY,
  testAmount: '0.001', // 0.001 SHM
  timeout: 30000, // 30 seconds
};

console.log('🧪 ShardTip Integration Testing Suite');
console.log('=====================================\n');

// Test utilities
class IntegrationTester {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(SHARDEUM_RPC);
    this.results = [];
  }

  async log(message, status = 'INFO') {
    const timestamp = new Date().toISOString();
    const statusIcon = {
      'INFO': 'ℹ️',
      'SUCCESS': '✅',
      'ERROR': '❌',
      'WARNING': '⚠️'
    }[status] || 'ℹ️';
    
    console.log(`${statusIcon} [${timestamp}] ${message}`);
  }

  async testNetworkConnectivity() {
    await this.log('Testing Shardeum network connectivity...');
    
    try {
      const blockNumber = await this.provider.getBlockNumber();
      const gasPrice = await this.provider.getFeeData();
      
      await this.log(`Network connected! Block: ${blockNumber}, Gas Price: ${ethers.formatUnits(gasPrice.gasPrice, 'gwei')} gwei`, 'SUCCESS');
      
      return {
        success: true,
        blockNumber,
        gasPrice: gasPrice.gasPrice
      };
    } catch (error) {
      await this.log(`Network connectivity failed: ${error.message}`, 'ERROR');
      return { success: false, error: error.message };
    }
  }

  async testContractDeployment() {
    await this.log('Testing contract deployment status...');
    
    if (!TEST_CONFIG.contractAddress) {
      await this.log('No contract address provided in environment variables', 'ERROR');
      return { success: false, error: 'No contract address' };
    }

    try {
      const code = await this.provider.getCode(TEST_CONFIG.contractAddress);
      
      if (code === '0x') {
        await this.log('Contract not deployed at specified address', 'ERROR');
        return { success: false, error: 'Contract not deployed' };
      }

      await this.log(`Contract deployed successfully at ${TEST_CONFIG.contractAddress}`, 'SUCCESS');
      
      return {
        success: true,
        contractAddress: TEST_CONFIG.contractAddress,
        codeLength: code.length
      };
    } catch (error) {
      await this.log(`Contract test failed: ${error.message}`, 'ERROR');
      return { success: false, error: error.message };
    }
  }

  async testWalletConnection() {
    await this.log('Testing wallet connection...');
    
    if (!TEST_CONFIG.privateKey) {
      await this.log('No private key provided for wallet testing', 'WARNING');
      return { success: false, error: 'No private key' };
    }

    try {
      const wallet = new ethers.Wallet(TEST_CONFIG.privateKey, this.provider);
      const balance = await wallet.getBalance();
      const address = wallet.address;
      
      await this.log(`Wallet connected! Address: ${address}`, 'SUCCESS');
      await this.log(`Balance: ${ethers.formatEther(balance)} SHM`, 'INFO');
      
      return {
        success: true,
        address,
        balance: ethers.formatEther(balance)
      };
    } catch (error) {
      await this.log(`Wallet connection failed: ${error.message}`, 'ERROR');
      return { success: false, error: error.message };
    }
  }

  async testContractFunctions() {
    await this.log('Testing contract function calls...');
    
    if (!TEST_CONFIG.contractAddress) {
      await this.log('Skipping contract function tests - no contract address', 'WARNING');
      return { success: false, error: 'No contract address' };
    }

    try {
      // Basic contract interface for testing
      const contractInterface = new ethers.Interface([
        'function platformFeePercentage() view returns (uint256)',
        'function getPlatformStats() view returns (uint256 volume, uint256 transactions, uint256 fees)',
        'function getContractBalance() view returns (uint256)'
      ]);

      const contract = new ethers.Contract(TEST_CONFIG.contractAddress, contractInterface, this.provider);
      
      // Test view functions
      const platformFee = await contract.platformFeePercentage();
      const stats = await contract.getPlatformStats();
      const balance = await contract.getContractBalance();
      
      await this.log(`Platform fee: ${platformFee} basis points`, 'SUCCESS');
      await this.log(`Platform stats - Volume: ${ethers.formatEther(stats[0])} SHM, Transactions: ${stats[1]}, Fees: ${ethers.formatEther(stats[2])} SHM`, 'SUCCESS');
      await this.log(`Contract balance: ${ethers.formatEther(balance)} SHM`, 'SUCCESS');
      
      return {
        success: true,
        platformFee: platformFee.toString(),
        stats: {
          volume: ethers.formatEther(stats[0]),
          transactions: stats[1].toString(),
          fees: ethers.formatEther(stats[2])
        },
        balance: ethers.formatEther(balance)
      };
    } catch (error) {
      await this.log(`Contract function test failed: ${error.message}`, 'ERROR');
      return { success: false, error: error.message };
    }
  }

  async testAIIntegration() {
    await this.log('Testing AI sentiment analysis...');
    
    try {
      const testContent = "This is an amazing piece of content that I absolutely love! The creativity and effort put into this is incredible.";
      
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english',
        { inputs: testContent },
        { 
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        }
      );

      if (response.data && response.data.length > 0) {
        const positiveScore = response.data.find(r => r.label === 'POSITIVE')?.score || 0;
        await this.log(`AI sentiment analysis working! Positive score: ${(positiveScore * 100).toFixed(1)}%`, 'SUCCESS');
        
        return {
          success: true,
          positiveScore,
          responseTime: response.headers['x-response-time'] || 'unknown'
        };
      } else {
        throw new Error('No sentiment analysis results');
      }
    } catch (error) {
      await this.log(`AI integration test failed: ${error.message}`, 'ERROR');
      return { success: false, error: error.message };
    }
  }

  async testNetworkStats() {
    await this.log('Testing Shardeum network stats API...');
    
    try {
      const response = await axios.post(SHARDEUM_RPC, {
        jsonrpc: '2.0',
        method: 'shardeum_getNodeList',
        params: [],
        id: 1
      }, { timeout: 10000 });

      if (response.data && response.data.result) {
        const activeNodes = response.data.result.filter(node => node.status === 'active').length;
        await this.log(`Network stats working! Active nodes: ${activeNodes}`, 'SUCCESS');
        
        return {
          success: true,
          activeNodes,
          totalNodes: response.data.result.length
        };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      await this.log(`Network stats test failed: ${error.message}`, 'ERROR');
      return { success: false, error: error.message };
    }
  }

  async runAllTests() {
    await this.log('Starting comprehensive integration tests...\n');
    
    const tests = [
      { name: 'Network Connectivity', fn: () => this.testNetworkConnectivity() },
      { name: 'Contract Deployment', fn: () => this.testContractDeployment() },
      { name: 'Wallet Connection', fn: () => this.testWalletConnection() },
      { name: 'Contract Functions', fn: () => this.testContractFunctions() },
      { name: 'AI Integration', fn: () => this.testAIIntegration() },
      { name: 'Network Stats', fn: () => this.testNetworkStats() }
    ];

    for (const test of tests) {
      await this.log(`\n--- ${test.name} ---`);
      const result = await test.fn();
      this.results.push({ name: test.name, ...result });
      
      if (!result.success) {
        await this.log(`${test.name} test failed`, 'ERROR');
      }
    }

    await this.log('\n=== Test Summary ===');
    const passed = this.results.filter(r => r.success).length;
    const total = this.results.length;
    
    await this.log(`Tests passed: ${passed}/${total}`, passed === total ? 'SUCCESS' : 'WARNING');
    
    if (passed === total) {
      await this.log('🎉 All integration tests passed! ShardTip is ready for use.', 'SUCCESS');
    } else {
      await this.log('⚠️  Some tests failed. Please check the errors above.', 'WARNING');
    }

    return this.results;
  }
}

// Run tests
async function main() {
  const tester = new IntegrationTester();
  await tester.runAllTests();
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled promise rejection:', error);
  process.exit(1);
});

// Run the tests
main().catch(console.error);
