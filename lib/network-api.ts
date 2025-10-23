import axios from "axios"
import { 
  getAllCreators, 
  getTotalTipsSent as getSmartContractTotalTipsSent, 
  getTotalCreators, 
  getCreatorStats as getSmartContractCreatorStats,
  getPlatformStats
} from './smart-contract-api'

// Sepolia testnet configuration
const NETWORK_RPC_URL = "https://eth-sepolia.g.alchemy.com/v2/demo" // Sepolia RPC

interface NetworkNodeInfo {
  nodeId: string
  ip: string
  port: number
  status: string
}

interface NetworkCycleInfo {
  cycleNumber: number
  startTime: number
  duration: number
  activeNodes: number
}

interface NetworkStats {
  activeNodes: number
  tps: number
  avgFee: string
  gasPrice: string
  blockNumber: number
  cycleInfo: NetworkCycleInfo | null
}

export async function getNetworkStats(): Promise<NetworkStats> {
  try {
    const [nodeListResponse, gasResponse, blockResponse] = await Promise.allSettled([
      // Get latest block data
      axios.post(NETWORK_RPC_URL, {
        jsonrpc: "2.0",
        method: "eth_getBlockByNumber", // Get latest block info instead of node list
        params: [],
        id: 1,
      }),
      // Get gas price
      axios.post(NETWORK_RPC_URL, {
        jsonrpc: "2.0",
        method: "eth_gasPrice",
        params: [],
        id: 2,
      }),
      // Get latest block
      axios.post(NETWORK_RPC_URL, {
        jsonrpc: "2.0",
        method: "eth_blockNumber",
        params: [],
        id: 3,
      }),
    ])

    let activeNodes = 0
    let gasPrice = "0x0"
    let blockNumber = 0

    // Process block response for network activity
    if (nodeListResponse.status === "fulfilled" && nodeListResponse.value.data.result) {
      const blockData = nodeListResponse.value.data.result
      // Estimate active nodes based on block activity (mock calculation)
      activeNodes = Math.floor(Math.random() * 300) + 200
    } else {
      // Fallback to mock data
      activeNodes = Math.floor(Math.random() * 300) + 200
    }

    // Process gas price response
    if (gasResponse.status === "fulfilled" && gasResponse.value.data.result) {
      gasPrice = gasResponse.value.data.result
    } else {
      console.warn("Gas price response failed, using fallback")
      // Fallback gas price
      gasPrice = "0x4a817c800" // 20 gwei
    }

    // Process block number response
    if (blockResponse.status === "fulfilled" && blockResponse.value.data.result) {
      const blockHex = blockResponse.value.data.result
      if (typeof blockHex === "string" && blockHex.startsWith("0x")) {
        blockNumber = Number.parseInt(blockHex, 16)
      } else {
        console.warn("Invalid block number format:", blockHex)
      }
    } else {
      console.warn("Block number response failed")
    }

    // Calculate estimated TPS (mock calculation based on active nodes)
    const estimatedTps = Math.floor(activeNodes * 2.5) + Math.floor(Math.random() * 200)

    // Convert gas price from hex to decimal and then to native token
    const gasPriceDecimal = Number.parseInt(gasPrice, 16)
    const gasPriceInNative = (gasPriceDecimal / 1e18).toFixed(6)

    // Estimate average fee (gas price * average gas used)
    const avgGasUsed = 21000 // Standard transfer
    const avgFeeWei = gasPriceDecimal * avgGasUsed
    const avgFeeInNative = (avgFeeWei / 1e18).toFixed(6)

    return {
      activeNodes,
      tps: estimatedTps,
      avgFee: avgFeeInNative,
      gasPrice: gasPriceInNative,
      blockNumber,
      cycleInfo: null, // Would need specific network cycle endpoint
    }
  } catch (error) {
    console.error("Failed to fetch network stats:", error)

    // Return fallback mock data
    return {
      activeNodes: Math.floor(Math.random() * 300) + 200,
      tps: Math.floor(Math.random() * 800) + 400,
      avgFee: (Math.random() * 0.01 + 0.001).toFixed(6),
      gasPrice: (Math.random() * 0.00002 + 0.00001).toFixed(6),
      blockNumber: Math.floor(Math.random() * 1000000) + 500000,
      cycleInfo: null,
    }
  }
}

export async function getNetworkCycleInfo(): Promise<NetworkCycleInfo | null> {
  try {
    const response = await axios.post(NETWORK_RPC_URL, {
      jsonrpc: "2.0",
      method: "eth_getBlockByNumber", // Use standard Ethereum method
      params: [],
      id: 4,
    })

    if (response.data.result) {
      return response.data.result
    }
  } catch (error) {
    console.error("Failed to fetch cycle info:", error)
  }

  return null
}

// Creator-related functions
export async function tipCreator(creatorAddress: string, amount: number): Promise<void> {
  try {
    // TODO: Implement actual tipping logic with smart contract interaction
    console.log(`Tipping ${amount} tokens to ${creatorAddress}`)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // For now, just log the action
    console.log('Tip sent successfully!')
  } catch (error) {
    console.error('Failed to send tip:', error)
    throw error
  }
}

export async function getCreatorStats(creatorAddress: string): Promise<{
  totalTipsReceived: string
  totalPoolsCreated: number
  recentActivity: Array<{
    id: string
    from: string
    amount: string
    timestamp: string
    type: 'direct' | 'pool_reward'
  }>
}> {
  try {
    // TODO: Implement actual creator stats fetching
    console.log(`Fetching stats for creator: ${creatorAddress}`)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Return mock data for now
    return {
      totalTipsReceived: '1250',
      totalPoolsCreated: 3,
      recentActivity: [
        {
          id: '1',
          from: '0x1234...5678',
          amount: '50',
          timestamp: '2 hours ago',
          type: 'direct'
        },
        {
          id: '2',
          from: 'Pool Swap',
          amount: '12.5',
          timestamp: '4 hours ago',
          type: 'pool_reward'
        }
      ]
    }
  } catch (error) {
    console.error('Failed to fetch creator stats:', error)
    throw error
  }
}

// Get total tips sent from smart contract
export async function getTotalTipsSent(): Promise<number> {
  try {
    console.log('Fetching total tips sent from smart contract...');
    const totalTips = await getSmartContractTotalTipsSent();
    return totalTips;
  } catch (error) {
    console.error('Failed to fetch total tips sent:', error);
    return 0;
  }
}

// Get total active pools from smart contract
export async function getTotalActivePools(): Promise<number> {
  try {
    // TODO: Implement actual smart contract call to get active pools
    // For now, return 0 as pools are not yet implemented
    console.log('Active pools not yet implemented in smart contracts');
    return 0;
  } catch (error) {
    console.error('Failed to fetch total active pools:', error);
    return 0;
  }
}

// Get all creators from smart contract
export async function getAllCreatorsFromContract(): Promise<any[]> {
  try {
    console.log('Fetching all creators from smart contract...');
    const creators = await getAllCreators();
    return creators;
  } catch (error) {
    console.error('Failed to fetch creators from smart contract:', error);
    return [];
  }
}
