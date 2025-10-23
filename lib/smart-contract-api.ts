import { createPublicClient, createWalletClient, http, parseEther, formatEther } from 'viem';
import { sepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import ShardTipABI from './contracts/ShardTip.json' assert { type: 'json' };
import CreatorRegistryABI from './contracts/CreatorRegistry.json' assert { type: 'json' };
import CreatorRewardsHookABI from './contracts/CreatorRewardsHook.json' assert { type: 'json' };

// Contract addresses from deployment
const SHARD_TIP_ADDRESS = '0xF7936D54CE16CdBC7725091945b36655Cfa74167';
const CREATOR_REGISTRY_ADDRESS = '0x41548Ec594CfF2276E2cC805Ab6c1d9A8d7ba764';
const CREATOR_REWARDS_HOOK_ADDRESS = '0x24CADED3B6F0f35180Dc6BdDc6ffB5B3f03EEdf1';

// RPC URL
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://eth-sepolia.g.alchemy.com/v2/Is8yBI6q-15CZYr4ySEfU0xnh6b-X2sz';

// Create public client for read operations
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(RPC_URL),
});

// Create wallet client for write operations (when needed)
const createWalletClientForAccount = (privateKey: string) => {
  const account = privateKeyToAccount(privateKey as `0x${string}`);
  return createWalletClient({
    account,
    chain: sepolia,
    transport: http(RPC_URL),
  });
};

// Interface for Creator data
export interface Creator {
  address: string;
  name: string;
  description: string;
  avatarUrl: string;
  category: string;
  socialLinks: string[];
  isActive: boolean;
  registrationTime: number;
  totalTipsReceived: string;
  totalPoolsCreated: number;
}

// Interface for tip data
export interface TipData {
  from: string;
  to: string;
  amount: string;
  timestamp: number;
  transactionHash: string;
}

// Interface for pool data
export interface PoolData {
  poolId: string;
  poolName: string;
  currency: string;
  pendingAmount: string;
  totalEarned: string;
  lastActivity: string;
  isActive: boolean;
  creator: string;
  totalRewards: string;
}

// Interface for creator pool stats
export interface CreatorPoolStats {
  totalPendingETH: string;
  totalPendingTokens: string;
  isAuthorized: boolean;
}

/**
 * Get all registered creators from the CreatorRegistry contract
 */
export async function getAllCreators(): Promise<Creator[]> {
  try {
    console.log('Fetching all creators from smart contract...');
    
    // First get the total number of creators
    const totalCreators = await publicClient.readContract({
      address: CREATOR_REGISTRY_ADDRESS as `0x${string}`,
      abi: CreatorRegistryABI,
      functionName: 'getTotalCreators',
    }) as bigint;

    const totalCount = Number(totalCreators);
    console.log(`Found ${totalCount} total creators`);

    if (totalCount === 0) {
      return [];
    }

    // Get all creators using pagination (fetch all at once since we know the total)
    const result = await publicClient.readContract({
      address: CREATOR_REGISTRY_ADDRESS as `0x${string}`,
      abi: CreatorRegistryABI,
      functionName: 'getCreators',
      args: [0, totalCount], // offset: 0, limit: totalCount
    }) as [string[], any[]];

    const [creatorAddresses, creatorProfiles] = result;
    console.log(`Retrieved ${creatorAddresses.length} creators with profiles`);

    // Process creator data
    const creators: Creator[] = [];
    
    for (let i = 0; i < creatorAddresses.length; i++) {
      try {
        const address = creatorAddresses[i];
        const creatorData = creatorProfiles[i];

        // Get tips received for this creator
        const tipsReceived = await getCreatorTipsReceived(address);
        
        creators.push({
          address,
          name: creatorData.name,
          description: creatorData.description,
          avatarUrl: creatorData.avatarUrl,
          category: creatorData.category,
          socialLinks: creatorData.socialLinks,
          isActive: creatorData.isActive,
          registrationTime: Number(creatorData.registrationTimestamp),
          totalTipsReceived: tipsReceived.toString(),
          totalPoolsCreated: Number(creatorData.totalPoolsCreated),
        });
      } catch (error) {
        console.error(`Error processing creator ${creatorAddresses[i]}:`, error);
      }
    }

    console.log(`Successfully processed ${creators.length} creators`);
    return creators;
  } catch (error) {
    console.error('Failed to fetch creators from smart contract:', error);
    throw error;
  }
}

/**
 * Get total tips sent across all creators
 */
export async function getTotalTipsSent(): Promise<number> {
  try {
    console.log('Fetching total tips sent from smart contract...');
    
    const platformStats = await publicClient.readContract({
      address: SHARD_TIP_ADDRESS as `0x${string}`,
      abi: ShardTipABI,
      functionName: 'getPlatformStats',
    }) as [bigint, bigint, bigint];

    const [totalTipsVolume, totalTransactions, totalPlatformFees] = platformStats;
    const totalTipsFormatted = Number(formatEther(totalTipsVolume));
    console.log(`Total tips sent: ${totalTipsFormatted}`);
    return totalTipsFormatted;
  } catch (error) {
    console.error('Failed to fetch total tips sent:', error);
    return 0;
  }
}

/**
 * Get total number of registered creators
 */
export async function getTotalCreators(): Promise<number> {
  try {
    console.log('Fetching total creators from smart contract...');
    
    const totalCreators = await publicClient.readContract({
      address: CREATOR_REGISTRY_ADDRESS as `0x${string}`,
      abi: CreatorRegistryABI,
      functionName: 'getTotalCreators',
    }) as bigint;

    const totalCreatorsFormatted = Number(totalCreators);
    console.log(`Total creators: ${totalCreatorsFormatted}`);
    return totalCreatorsFormatted;
  } catch (error) {
    console.error('Failed to fetch total creators:', error);
    return 0;
  }
}

/**
 * Get tips received by a specific creator
 */
export async function getCreatorTipsReceived(creatorAddress: string): Promise<bigint> {
  try {
    const pendingTips = await publicClient.readContract({
      address: SHARD_TIP_ADDRESS as `0x${string}`,
      abi: ShardTipABI,
      functionName: 'getPendingTips',
      args: [creatorAddress as `0x${string}`],
    }) as bigint;

    return pendingTips;
  } catch (error) {
    console.error(`Failed to fetch tips for creator ${creatorAddress}:`, error);
    return BigInt(0);
  }
}

/**
 * Send a tip to a creator
 */
export async function sendTipToCreator(
  creatorAddress: string, 
  amount: number, 
  privateKey: string
): Promise<string> {
  try {
    console.log(`Sending ${amount} ETH tip to ${creatorAddress}`);
    
    const walletClient = createWalletClientForAccount(privateKey);
    
    const hash = await walletClient.writeContract({
      address: SHARD_TIP_ADDRESS as `0x${string}`,
      abi: ShardTipABI,
      functionName: 'tip',
      args: [creatorAddress as `0x${string}`, parseEther(amount.toString())],
      value: parseEther(amount.toString()),
    });

    console.log(`Tip sent successfully! Transaction hash: ${hash}`);
    return hash;
  } catch (error) {
    console.error('Failed to send tip:', error);
    throw error;
  }
}

/**
 * Register a new creator
 */
export async function registerCreator(
  name: string,
  description: string,
  avatarUrl: string,
  category: string,
  socialLinks: string[],
  privateKey: string
): Promise<string> {
  try {
    console.log(`Registering creator: ${name}`);
    
    const walletClient = createWalletClientForAccount(privateKey);
    
    const hash = await walletClient.writeContract({
      address: CREATOR_REGISTRY_ADDRESS as `0x${string}`,
      abi: CreatorRegistryABI,
      functionName: 'registerCreator',
      args: [name, description, avatarUrl, category, socialLinks],
      value: parseEther('0.01'), // Registration fee
    });

    console.log(`Creator registered successfully! Transaction hash: ${hash}`);
    return hash;
  } catch (error) {
    console.error('Failed to register creator:', error);
    throw error;
  }
}

/**
 * Get creator statistics
 */
export async function getCreatorStats(creatorAddress: string): Promise<{
  totalTipsReceived: string;
  totalPoolsCreated: number;
  recentActivity: Array<{
    id: string;
    from: string;
    amount: string;
    timestamp: string;
    type: 'direct' | 'pool_reward';
  }>;
}> {
  try {
    const tipsReceived = await getCreatorTipsReceived(creatorAddress);
    
    return {
      totalTipsReceived: formatEther(tipsReceived),
      totalPoolsCreated: 0, // TODO: Implement pool counting
      recentActivity: [], // TODO: Implement activity tracking
    };
  } catch (error) {
    console.error('Failed to fetch creator stats:', error);
    throw error;
  }
}

/**
 * Get platform statistics
 */
export async function getPlatformStats(): Promise<{
  totalCreators: number;
  totalTipsSent: number;
  totalActivePools: number;
}> {
  try {
    const [totalCreators, totalTipsSent] = await Promise.all([
      getTotalCreators(),
      getTotalTipsSent(),
    ]);

    return {
      totalCreators,
      totalTipsSent,
      totalActivePools: 0, // TODO: Implement pool counting
    };
  } catch (error) {
    console.error('Failed to fetch platform stats:', error);
    throw error;
  }
}

/**
 * Get creator pool statistics from CreatorRewardsHook
 */
export async function getCreatorPoolStats(creatorAddress: string): Promise<CreatorPoolStats> {
  try {
    console.log(`Fetching pool stats for creator: ${creatorAddress}`);
    
    const result = await publicClient.readContract({
      address: CREATOR_REWARDS_HOOK_ADDRESS as `0x${string}`,
      abi: CreatorRewardsHookABI as any,
      functionName: 'getCreatorStats',
      args: [creatorAddress as `0x${string}`],
    }) as [bigint, bigint, boolean];

    const [totalPendingETH, totalPendingTokens, isAuthorized] = result;

    return {
      totalPendingETH: formatEther(totalPendingETH),
      totalPendingTokens: formatEther(totalPendingTokens),
      isAuthorized,
    };
  } catch (error) {
    console.error(`Failed to fetch pool stats for creator ${creatorAddress}:`, error);
    return {
      totalPendingETH: '0',
      totalPendingTokens: '0',
      isAuthorized: false,
    };
  }
}

/**
 * Get pool statistics from CreatorRewardsHook
 */
export async function getPoolStats(poolId: string): Promise<{
  creator: string;
  totalRewards: string;
  hasCreator: boolean;
}> {
  try {
    console.log(`Fetching stats for pool: ${poolId}`);
    
    const result = await publicClient.readContract({
      address: CREATOR_REWARDS_HOOK_ADDRESS as `0x${string}`,
      abi: CreatorRewardsHookABI as any,
      functionName: 'getPoolStats',
      args: [poolId as `0x${string}`],
    }) as [string, bigint, boolean];

    const [creator, totalRewards, hasCreator] = result;

    return {
      creator,
      totalRewards: formatEther(totalRewards),
      hasCreator,
    };
  } catch (error) {
    console.error(`Failed to fetch stats for pool ${poolId}:`, error);
    return {
      creator: '0x0000000000000000000000000000000000000000',
      totalRewards: '0',
      hasCreator: false,
    };
  }
}

/**
 * Get all pool data for a creator
 */
export async function getCreatorPools(creatorAddress: string): Promise<PoolData[]> {
  try {
    console.log(`Fetching pools for creator: ${creatorAddress}`);
    
    // Get creator pool stats
    const poolStats = await getCreatorPoolStats(creatorAddress);
    
    // For now, we'll create mock pool data based on common pool types
    // In a real implementation, you'd query for actual pools created by this creator
    const mockPools: PoolData[] = [
      {
        poolId: 'ETH/SHM',
        poolName: 'ETH/SHM Pool',
        currency: 'TIP',
        pendingAmount: poolStats.totalPendingETH !== '0' ? poolStats.totalPendingETH : '0.025', // Mock some rewards for testing
        totalEarned: '0.15', // Mock historical earnings
        lastActivity: poolStats.totalPendingETH !== '0' ? 'Active' : '2 hours ago',
        isActive: poolStats.totalPendingETH !== '0' || poolStats.isAuthorized || true, // Show as active for testing
        creator: creatorAddress,
        totalRewards: poolStats.totalPendingETH !== '0' ? poolStats.totalPendingETH : '0.025',
      },
      {
        poolId: 'USDC/SHM',
        poolName: 'USDC/SHM Pool',
        currency: 'TIP',
        pendingAmount: '0.012', // Mock some rewards for testing
        totalEarned: '0.08',
        lastActivity: '1 hour ago',
        isActive: poolStats.isAuthorized || true, // Show as active for testing
        creator: creatorAddress,
        totalRewards: '0.012',
      },
      {
        poolId: 'WBTC/SHM',
        poolName: 'WBTC/SHM Pool',
        currency: 'TIP',
        pendingAmount: '0', // No pending rewards
        totalEarned: '0.05',
        lastActivity: 'No activity',
        isActive: poolStats.isAuthorized || false, // Show as inactive
        creator: creatorAddress,
        totalRewards: '0',
      }
    ];

    return mockPools;
  } catch (error) {
    console.error(`Failed to fetch pools for creator ${creatorAddress}:`, error);
    return [];
  }
}

/**
 * Claim rewards for a specific currency
 */
export async function claimPoolRewards(
  currency: string,
  privateKey: string
): Promise<string> {
  try {
    console.log(`Claiming rewards for currency: ${currency}`);
    
    const walletClient = createWalletClientForAccount(privateKey);
    
    // For ETH rewards, use the zero address
    const currencyAddress = currency === 'ETH' ? '0x0000000000000000000000000000000000000000' : currency;
    
    const hash = await walletClient.writeContract({
      address: CREATOR_REWARDS_HOOK_ADDRESS as `0x${string}`,
      abi: CreatorRewardsHookABI as any,
      functionName: 'claimRewards',
      args: [currencyAddress as `0x${string}`],
    });

    console.log(`Pool rewards claimed successfully! Transaction hash: ${hash}`);
    return hash;
  } catch (error) {
    console.error('Failed to claim pool rewards:', error);
    throw error;
  }
}

/**
 * Claim all rewards for multiple currencies
 */
export async function claimAllPoolRewards(
  currencies: string[],
  privateKey: string
): Promise<string> {
  try {
    console.log(`Claiming all rewards for currencies: ${currencies.join(', ')}`);
    
    const walletClient = createWalletClientForAccount(privateKey);
    
    // Convert currency strings to addresses
    const currencyAddresses = currencies.map(currency => 
      currency === 'ETH' ? '0x0000000000000000000000000000000000000000' : currency
    );
    
    const hash = await walletClient.writeContract({
      address: CREATOR_REWARDS_HOOK_ADDRESS as `0x${string}`,
      abi: CreatorRewardsHookABI as any,
      functionName: 'claimAllRewards',
      args: [currencyAddresses as `0x${string}`[]],
    });

    console.log(`All pool rewards claimed successfully! Transaction hash: ${hash}`);
    return hash;
  } catch (error) {
    console.error('Failed to claim all pool rewards:', error);
    throw error;
  }
}
