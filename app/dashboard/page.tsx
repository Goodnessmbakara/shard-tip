'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { ClientOnly } from '@/components/client-only';
import { useSmartContract } from '@/lib/hooks/useSmartContract';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Wallet, 
  Users, 
  Activity,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { PoolRewardsSuccessModal } from '@/components/pool-rewards-success-modal';

interface PoolReward {
  poolId: string;
  poolName: string;
  currency: string;
  pendingAmount: string;
  totalEarned: string;
  lastActivity: string;
  isActive: boolean;
}

interface TipHistory {
  id: string;
  from: string;
  amount: string;
  timestamp: string;
  type: 'direct' | 'pool_reward';
  poolId?: string;
}

interface CreatorStats {
  totalTipsReceived: string;
  totalPoolRewards: string;
  totalPoolsCreated: number;
  activePools: number;
  monthlyEarnings: string;
  weeklyGrowth: number;
  topPerformingPool: string;
  recentActivity: TipHistory[];
}

const CHART_COLORS = ['#fbbf24', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6'];
const TOKEN_SYMBOL = 'TIP';

function CreatorDashboardContent() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [creatorStats, setCreatorStats] = useState<CreatorStats | null>(null);
  const [poolRewards, setPoolRewards] = useState<PoolReward[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [claimTransactionHash, setClaimTransactionHash] = useState('');
  const [claimTotalAmount, setClaimTotalAmount] = useState('');
  const [claimPools, setClaimPools] = useState<string[]>([]);
  
  // Use smart contract hook for live data
  const {
    platformStats,
    creatorPools,
    creatorPoolStats,
    loading: smartContractLoading,
    error: smartContractError,
    fetchPlatformStats,
    fetchCreatorPools,
    fetchCreatorPoolStats,
    claimPoolRewardsForCreator,
    claimAllPoolRewardsForCreator,
  } = useSmartContract();

  // Fetch live data from smart contracts
  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        setLoading(true);
        
        if (address) {
          // Fetch creator-specific data
          await Promise.all([
            fetchCreatorPools(address),
            fetchCreatorPoolStats(address)
          ]);
        }
        
        // Use live data from smart contracts
        const liveStats: CreatorStats = {
          totalTipsReceived: platformStats.totalTipsSent.toString(),
          totalPoolRewards: creatorPoolStats?.totalPendingETH || '0',
          totalPoolsCreated: platformStats.totalActivePools,
          activePools: platformStats.totalActivePools,
          monthlyEarnings: '0', // TODO: Calculate from transaction history
          weeklyGrowth: 0, // TODO: Calculate growth percentage
          topPerformingPool: 'N/A', // TODO: Implement pool performance tracking
          recentActivity: [] // TODO: Fetch from transaction events
        };

        // Convert live pool data to PoolReward format
        const livePoolRewards: PoolReward[] = creatorPools.map(pool => ({
          poolId: pool.poolId,
          poolName: pool.poolName,
          currency: pool.currency,
          pendingAmount: pool.pendingAmount,
          totalEarned: pool.totalEarned,
          lastActivity: pool.lastActivity,
          isActive: pool.isActive
        }));

        setCreatorStats(liveStats);
        setPoolRewards(livePoolRewards);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch live data:', error);
        setLoading(false);
      }
    };

    fetchLiveData();
    
    // Set up periodic refresh (every 30 seconds)
    const interval = setInterval(fetchLiveData, 30000);
    
    return () => clearInterval(interval);
  }, [platformStats, creatorPools, creatorPoolStats, address]);

  const chartData = [
    { name: 'Week 1', tips: 400, rewards: 240 },
    { name: 'Week 2', tips: 300, rewards: 139 },
    { name: 'Week 3', tips: 200, rewards: 980 },
    { name: 'Week 4', tips: 278, rewards: 390 },
    { name: 'Week 5', tips: 189, rewards: 480 },
    { name: 'Week 6', tips: 239, rewards: 380 },
    { name: 'Week 7', tips: 349, rewards: 430 },
  ];

  const poolPerformanceData = [
    { name: 'ETH/SHM', value: 2100, color: '#fbbf24' },
    { name: 'USDC/SHM', value: 890, color: '#10b981' },
    { name: 'WBTC/SHM', value: 320, color: '#3b82f6' },
    { name: 'DAI/SHM', value: 150, color: '#ef4444' },
  ];

  const handleClaimRewards = async (poolId: string) => {
    try {
      console.log('Claiming rewards for pool:', poolId);
      
      // Check if user has pending rewards
      const pool = poolRewards.find(p => p.poolId === poolId);
      if (!pool || pool.pendingAmount === '0') {
        alert('No pending rewards to claim for this pool.');
        return;
      }

      // For now, show a success modal with mock data
      // In a real implementation, this would integrate with wallet signing
      setClaimTransactionHash('0x' + Math.random().toString(16).substr(2, 64));
      setClaimTotalAmount(pool.pendingAmount);
      setClaimPools([pool.poolName]);
      setShowSuccessModal(true);
      
      // In a real implementation, you would:
      // 1. Get the user's wallet signature
      // 2. Call claimPoolRewardsForCreator() with the private key
      // 3. Wait for transaction confirmation
      // 4. Show success modal with real transaction hash
      
    } catch (error) {
      console.error('Failed to claim rewards:', error);
      alert('Failed to claim rewards. Please try again.');
    }
  };

  const handleClaimAllRewards = async () => {
    try {
      console.log('Claiming all rewards');
      
      // Check if user has any pending rewards
      const poolsWithRewards = poolRewards.filter(p => p.pendingAmount !== '0');
      if (poolsWithRewards.length === 0) {
        alert('No pending rewards to claim.');
        return;
      }

      // Calculate total amount
      const totalAmount = poolsWithRewards.reduce((sum, pool) => {
        return sum + parseFloat(pool.pendingAmount);
      }, 0);

      // For now, show a success modal with mock data
      // In a real implementation, this would integrate with wallet signing
      setClaimTransactionHash('0x' + Math.random().toString(16).substr(2, 64));
      setClaimTotalAmount(totalAmount.toString());
      setClaimPools(poolsWithRewards.map(p => p.poolName));
      setShowSuccessModal(true);
      
      // In a real implementation, you would:
      // 1. Get the user's wallet signature
      // 2. Call claimAllPoolRewardsForCreator() with the private key
      // 3. Wait for transaction confirmation
      // 4. Show success modal with real transaction hash
      
    } catch (error) {
      console.error('Failed to claim all rewards:', error);
      alert('Failed to claim rewards. Please try again.');
    }
  };

  if (loading || smartContractLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-slate-900 dark:text-white mt-4">Loading live data from blockchain...</p>
          {smartContractError && (
            <p className="text-red-500 text-sm mt-2">Error: {smartContractError}</p>
          )}
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Connect Your Wallet</h1>
          <p className="text-slate-600 dark:text-slate-300">Please connect your wallet to view your creator dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Creator Dashboard</h1>
              <p className="text-slate-600 dark:text-slate-300 mt-2">
                Monitor your earnings and pool performance
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                Active Creator
              </Badge>
              <Button 
                onClick={() => router.push('/creators')}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Public Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">Total Tips</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{creatorStats?.totalTipsReceived}</p>
                    <p className="text-green-500 text-sm flex items-center mt-1">
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      +12.5% this week
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-3 rounded-full">
                    <DollarSign className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">Pool Rewards</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{creatorStats?.totalPoolRewards}</p>
                    <p className="text-green-500 text-sm flex items-center mt-1">
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      +8.3% this week
                    </p>
                  </div>
                  <div className="bg-green-500/20 p-3 rounded-full">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">Active Pools</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{creatorStats?.activePools}</p>
                    <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                      {creatorStats?.totalPoolsCreated} total created
                    </p>
                  </div>
                  <div className="bg-yellow-500/20 p-3 rounded-full">
                    <Users className="w-6 h-6 text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">Monthly Earnings</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{creatorStats?.monthlyEarnings}</p>
                    <p className="text-green-500 text-sm flex items-center mt-1">
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      +15.2% vs last month
                    </p>
                  </div>
                  <div className="bg-orange-500/20 p-3 rounded-full">
                    <Wallet className="w-6 h-6 text-orange-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-green-600 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="pools" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-green-600 data-[state=active]:text-white">
              Pool Rewards
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-green-600 data-[state=active]:text-white">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-green-600 data-[state=active]:text-white">
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Earnings Chart */}
              <Card className="bg-white/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Earnings Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="tips" 
                        stroke="#fbbf24" 
                        strokeWidth={2}
                        name="Direct Tips"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="rewards" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        name="Pool Rewards"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Pool Performance */}
              <Card className="bg-white/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white flex items-center">
                    <PieChartIcon className="w-5 h-5 mr-2" />
                    Pool Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={poolPerformanceData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {poolPerformanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-white/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {creatorStats?.recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-slate-100/50 dark:bg-slate-700/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          activity.type === 'direct' 
                            ? 'bg-blue-500/20' 
                            : 'bg-green-500/20'
                        }`}>
                          {activity.type === 'direct' ? (
                            <DollarSign className="w-4 h-4 text-blue-500" />
                          ) : (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-slate-900 dark:text-white font-medium">
                            {activity.from}
                          </p>
                          <p className="text-slate-600 dark:text-slate-300 text-sm">
                            {activity.type === 'pool_reward' && activity.poolId && (
                              <span className="text-yellow-500">Pool: {activity.poolId}</span>
                            )}
                            {activity.type === 'direct' && 'Direct tip'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-green-500 font-semibold">+{activity.amount} {TOKEN_SYMBOL}</p>
                        <p className="text-slate-600 dark:text-slate-300 text-sm">{activity.timestamp}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pools" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Pool Rewards</h2>
              <Button 
                onClick={handleClaimAllRewards}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                Claim All Rewards
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {poolRewards.map((pool, index) => (
                <motion.div
                  key={pool.poolId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-lg">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-slate-900 dark:text-white">{pool.poolName}</CardTitle>
                        <Badge className={
                          pool.isActive 
                            ? 'bg-green-500/20 text-green-500 border-green-500/30'
                            : 'bg-slate-500/20 text-slate-500 border-slate-500/30'
                        }>
                          {pool.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-300">Pending Rewards:</span>
                          <span className="text-yellow-500 font-semibold">
                            {pool.pendingAmount} {pool.currency}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-300">Total Earned:</span>
                          <span className="text-green-500 font-semibold">
                            {pool.totalEarned} {pool.currency}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-300">Last Activity:</span>
                          <span className="text-slate-700 dark:text-slate-200">{pool.lastActivity}</span>
                        </div>
                      </div>

                      {pool.pendingAmount !== '0' && (
                        <Button
                          onClick={() => handleClaimRewards(pool.poolId)}
                          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold"
                        >
                          Claim {pool.pendingAmount} {pool.currency}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white">Weekly Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }} 
                      />
                      <Bar dataKey="tips" fill="#fbbf24" name="Direct Tips" />
                      <Bar dataKey="rewards" fill="#10b981" name="Pool Rewards" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white">Growth Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-600 dark:text-slate-300">Weekly Growth</span>
                      <span className="text-green-500 font-semibold">+12.5%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-600 dark:text-slate-300">Pool Utilization</span>
                      <span className="text-blue-500 font-semibold">68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-600 dark:text-slate-300">Community Engagement</span>
                      <span className="text-orange-500 font-semibold">84%</span>
                    </div>
                    <Progress value={84} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-white/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">All Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {creatorStats?.recentActivity.map((activity, index) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-slate-100/50 dark:bg-slate-700/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          activity.type === 'direct' 
                            ? 'bg-blue-500/20' 
                            : 'bg-green-500/20'
                        }`}>
                          {activity.type === 'direct' ? (
                            <DollarSign className="w-4 h-4 text-blue-500" />
                          ) : (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-slate-900 dark:text-white font-medium">{activity.from}</p>
                          <p className="text-slate-600 dark:text-slate-300 text-sm">
                            {activity.type === 'pool_reward' && activity.poolId && (
                              <span className="text-yellow-500">Pool: {activity.poolId}</span>
                            )}
                            {activity.type === 'direct' && 'Direct tip'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-green-500 font-semibold">+{activity.amount} {TOKEN_SYMBOL}</p>
                        <p className="text-slate-600 dark:text-slate-300 text-sm">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Pool Rewards Success Modal */}
      <PoolRewardsSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        transactionHash={claimTransactionHash}
        totalAmount={claimTotalAmount}
        currency={TOKEN_SYMBOL}
        poolsClaimed={claimPools}
        explorerUrl={`https://sepolia.etherscan.io/tx/${claimTransactionHash}`}
      />
    </div>
  );
}

export default function CreatorDashboard() {
  return (
    <ClientOnly fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-slate-900 dark:text-white mt-4">Loading dashboard...</p>
        </div>
      </div>
    }>
      <CreatorDashboardContent />
    </ClientOnly>
  );
}