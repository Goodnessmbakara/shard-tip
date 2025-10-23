import { useState, useEffect, useCallback, useRef } from 'react';
import { useAccount } from 'wagmi';
import { 
  getAllCreators, 
  getTotalTipsSent, 
  getTotalCreators, 
  getCreatorStats,
  sendTipToCreator,
  registerCreator,
  getCreatorPools,
  getCreatorPoolStats,
  claimPoolRewards,
  claimAllPoolRewards,
  PoolData,
  CreatorPoolStats
} from '../smart-contract-api';

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

export interface PlatformStats {
  totalCreators: number;
  totalTipsSent: number;
  totalActivePools: number;
}

export function useSmartContract() {
  const { address, isConnected } = useAccount();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [platformStats, setPlatformStats] = useState<PlatformStats>({
    totalCreators: 0,
    totalTipsSent: 0,
    totalActivePools: 0,
  });
  const [creatorPools, setCreatorPools] = useState<PoolData[]>([]);
  const [creatorPoolStats, setCreatorPoolStats] = useState<CreatorPoolStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Debounce refs to prevent excessive API calls
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch all creators from smart contract
  const fetchCreators = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const smartContractCreators = await getAllCreators();
      setCreators(smartContractCreators);
      
      console.log(`Fetched ${smartContractCreators.length} creators from smart contract`);
    } catch (err) {
      console.error('Failed to fetch creators:', err);
      setError('Failed to fetch creators from smart contract');
    } finally {
      setLoading(false);
    }
  };

  // Fetch platform statistics with debouncing
  const fetchPlatformStats = useCallback(async () => {
    // Clear existing timeout
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }
    
    // Set new timeout to debounce calls
    fetchTimeoutRef.current = setTimeout(async () => {
      try {
        const [totalCreators, totalTipsSent] = await Promise.all([
          getTotalCreators(),
          getTotalTipsSent(),
        ]);

        setPlatformStats({
          totalCreators,
          totalTipsSent,
          totalActivePools: 0, // TODO: Implement pool counting
        });
      } catch (err) {
        console.error('Failed to fetch platform stats:', err);
      }
    }, 1000); // 1 second debounce
  }, []);

  // Send tip to creator
  const sendTip = async (creatorAddress: string, amount: number, privateKey: string) => {
    try {
      setLoading(true);
      const txHash = await sendTipToCreator(creatorAddress, amount, privateKey);
      
      // Refresh data after successful tip
      await Promise.all([fetchCreators(), fetchPlatformStats()]);
      
      return txHash;
    } catch (err) {
      console.error('Failed to send tip:', err);
      setError('Failed to send tip');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register new creator
  const registerNewCreator = async (
    name: string,
    description: string,
    avatarUrl: string,
    category: string,
    socialLinks: string[],
    privateKey: string
  ) => {
    try {
      setLoading(true);
      const txHash = await registerCreator(name, description, avatarUrl, category, socialLinks, privateKey);
      
      // Refresh data after successful registration
      await Promise.all([fetchCreators(), fetchPlatformStats()]);
      
      return txHash;
    } catch (err) {
      console.error('Failed to register creator:', err);
      setError('Failed to register creator');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get creator stats
  const getCreatorStatsData = async (creatorAddress: string) => {
    try {
      return await getCreatorStats(creatorAddress);
    } catch (err) {
      console.error('Failed to fetch creator stats:', err);
      throw err;
    }
  };

  // Fetch creator pools
  const fetchCreatorPools = async (creatorAddress: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const pools = await getCreatorPools(creatorAddress);
      setCreatorPools(pools);
      
      console.log(`Fetched ${pools.length} pools for creator ${creatorAddress}`);
    } catch (err) {
      console.error('Failed to fetch creator pools:', err);
      setError('Failed to fetch creator pools from smart contract');
    } finally {
      setLoading(false);
    }
  };

  // Fetch creator pool stats
  const fetchCreatorPoolStats = async (creatorAddress: string) => {
    try {
      setError(null);
      
      const stats = await getCreatorPoolStats(creatorAddress);
      setCreatorPoolStats(stats);
      
      console.log(`Fetched pool stats for creator ${creatorAddress}:`, stats);
    } catch (err) {
      console.error('Failed to fetch creator pool stats:', err);
      setError('Failed to fetch creator pool stats from smart contract');
    }
  };

  // Claim pool rewards
  const claimPoolRewardsForCreator = async (currency: string, privateKey: string) => {
    try {
      setLoading(true);
      const txHash = await claimPoolRewards(currency, privateKey);
      
      // Refresh pool data after successful claim
      if (address) {
        await Promise.all([
          fetchCreatorPools(address),
          fetchCreatorPoolStats(address)
        ]);
      }
      
      return txHash;
    } catch (err) {
      console.error('Failed to claim pool rewards:', err);
      setError('Failed to claim pool rewards');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Claim all pool rewards
  const claimAllPoolRewardsForCreator = async (currencies: string[], privateKey: string) => {
    try {
      setLoading(true);
      const txHash = await claimAllPoolRewards(currencies, privateKey);
      
      // Refresh pool data after successful claim
      if (address) {
        await Promise.all([
          fetchCreatorPools(address),
          fetchCreatorPoolStats(address)
        ]);
      }
      
      return txHash;
    } catch (err) {
      console.error('Failed to claim all pool rewards:', err);
      setError('Failed to claim all pool rewards');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchCreators(), fetchPlatformStats()]);
    };

    fetchData();

    // Set up periodic refresh (every 5 minutes)
    const interval = setInterval(() => {
      fetchPlatformStats();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  return {
    creators,
    platformStats,
    creatorPools,
    creatorPoolStats,
    loading,
    error,
    fetchCreators,
    fetchPlatformStats,
    fetchCreatorPools,
    fetchCreatorPoolStats,
    sendTip,
    registerNewCreator,
    getCreatorStatsData,
    claimPoolRewardsForCreator,
    claimAllPoolRewardsForCreator,
    isConnected,
    address,
  };
}
