import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { 
  getAllCreators, 
  getTotalTipsSent, 
  getTotalCreators, 
  getCreatorStats,
  sendTipToCreator,
  registerCreator
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Fetch platform statistics
  const fetchPlatformStats = async () => {
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
  };

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

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchCreators(), fetchPlatformStats()]);
    };

    fetchData();

    // Set up periodic refresh (every 30 seconds)
    const interval = setInterval(() => {
      fetchPlatformStats();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    creators,
    platformStats,
    loading,
    error,
    fetchCreators,
    fetchPlatformStats,
    sendTip,
    registerNewCreator,
    getCreatorStatsData,
    isConnected,
    address,
  };
}
