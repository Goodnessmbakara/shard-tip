import { createPublicClient, createWalletClient, http, parseEther, formatEther } from 'viem';
import { sepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import ShardTipABI from './contracts/ShardTip.json';
import CreatorRegistryABI from './contracts/CreatorRegistry.json';

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

/**
 * Get all registered creators from the CreatorRegistry contract
 */
export async function getAllCreators(): Promise<Creator[]> {
  try {
    console.log('Fetching all creators from smart contract...');
    
    // Get all creator addresses
    const creatorAddresses = await publicClient.readContract({
      address: CREATOR_REGISTRY_ADDRESS as `0x${string}`,
      abi: CreatorRegistryABI,
      functionName: 'getAllCreators',
    }) as string[];

    console.log(`Found ${creatorAddresses.length} creators`);

    // Get creator details for each address
    const creators: Creator[] = [];
    
    for (const address of creatorAddresses) {
      try {
        const creatorData = await publicClient.readContract({
          address: CREATOR_REGISTRY_ADDRESS as `0x${string}`,
          abi: CreatorRegistryABI,
          functionName: 'getCreator',
          args: [address as `0x${string}`],
        }) as any;

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
          registrationTime: Number(creatorData.registrationTime),
          totalTipsReceived: tipsReceived.toString(),
          totalPoolsCreated: 0, // TODO: Implement pool counting
        });
      } catch (error) {
        console.error(`Error fetching creator ${address}:`, error);
      }
    }

    console.log(`Successfully fetched ${creators.length} creators`);
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
    
    const totalTips = await publicClient.readContract({
      address: SHARD_TIP_ADDRESS as `0x${string}`,
      abi: ShardTipABI,
      functionName: 'getTotalTipsDistributed',
    }) as bigint;

    const totalTipsFormatted = Number(formatEther(totalTips));
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
