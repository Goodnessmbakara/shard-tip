'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
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
  PieChart,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';

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

export default function CreatorDashboard() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState('overview');
  const [creatorStats, setCreatorStats] = useState<CreatorStats | null>(null);
  const [poolRewards, setPoolRewards] = useState<PoolReward[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockStats: CreatorStats = {
      totalTipsReceived: '12500',
      totalPoolRewards: '3400',
      totalPoolsCreated: 6,
      activePools: 4,
      monthlyEarnings: '2800',
      weeklyGrowth: 12.5,
      topPerformingPool: 'ETH/SHM Pool',
      recentActivity: [
        {
          id: '1',
          from: '0x1234...5678',
          amount: '50',
          timestamp: '2 hours ago',
          type: 'direct',
        },
        {
          id: '2',
          from: 'Pool Swap',
          amount: '12.5',
          timestamp: '4 hours ago',
          type: 'pool_reward',
          poolId: 'ETH/SHM'
        },
        {
          id: '3',
          from: '0x2345...6789',
          amount: '25',
          timestamp: '1 day ago',
          type: 'direct',
        },
        {
          id: '4',
          from: 'Pool Swap',
          amount: '8.3',
          timestamp: '2 days ago',
          type: 'pool_reward',
          poolId: 'USDC/SHM'
        }
      ]
    };

    const mockPoolRewards: PoolReward[] = [
      {
        poolId: 'ETH/SHM',
        poolName: 'ETH/SHM Pool',
        currency: 'SHM',
        pendingAmount: '125.50',
        totalEarned: '2100.75',
        lastActivity: '2 hours ago',
        isActive: true
      },
      {
        poolId: 'USDC/SHM',
        poolName: 'USDC/SHM Pool',
        currency: 'SHM',
        pendingAmount: '45.25',
        totalEarned: '890.30',
        lastActivity: '1 day ago',
        isActive: true
      },
      {
        poolId: 'WBTC/SHM',
        poolName: 'WBTC/SHM Pool',
        currency: 'SHM',
        pendingAmount: '0',
        totalEarned: '320.45',
        lastActivity: '3 days ago',
        isActive: false
      }
    ];

    setCreatorStats(mockStats);
    setPoolRewards(mockPoolRewards);
    setLoading(false);
  }, []);

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
      // TODO: Implement claim logic
      console.log('Claiming rewards for pool:', poolId);
      alert('Rewards claimed successfully!');
    } catch (error) {
      console.error('Failed to claim rewards:', error);
      alert('Failed to claim rewards. Please try again.');
    }
  };

  const handleClaimAllRewards = async () => {
    try {
      // TODO: Implement batch claim logic
      console.log('Claiming all rewards');
      alert('All rewards claimed successfully!');
    } catch (error) {
      console.error('Failed to claim all rewards:', error);
      alert('Failed to claim rewards. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h1>
          <p className="text-gray-400">Please connect your wallet to view your creator dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Creator Dashboard</h1>
              <p className="text-gray-300 mt-2">
                Monitor your earnings and pool performance
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                Active Creator
              </Badge>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
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
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Total Tips</p>
                    <p className="text-2xl font-bold text-white">{creatorStats?.totalTipsReceived}</p>
                    <p className="text-green-400 text-sm flex items-center mt-1">
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
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Pool Rewards</p>
                    <p className="text-2xl font-bold text-white">{creatorStats?.totalPoolRewards}</p>
                    <p className="text-green-400 text-sm flex items-center mt-1">
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
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Active Pools</p>
                    <p className="text-2xl font-bold text-white">{creatorStats?.activePools}</p>
                    <p className="text-gray-400 text-sm mt-1">
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
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Monthly Earnings</p>
                    <p className="text-2xl font-bold text-white">{creatorStats?.monthlyEarnings}</p>
                    <p className="text-green-400 text-sm flex items-center mt-1">
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      +15.2% vs last month
                    </p>
                  </div>
                  <div className="bg-purple-500/20 p-3 rounded-full">
                    <Wallet className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
              Overview
            </TabsTrigger>
            <TabsTrigger value="pools" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
              Pool Rewards
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Earnings Chart */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
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
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <PieChart className="w-5 h-5 mr-2" />
                    Pool Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <RechartsPie
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
                      </RechartsPie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }} 
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
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
                      className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
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
                          <p className="text-white font-medium">
                            {activity.from}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {activity.type === 'pool_reward' && activity.poolId && (
                              <span className="text-yellow-500">Pool: {activity.poolId}</span>
                            )}
                            {activity.type === 'direct' && 'Direct tip'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-semibold">+{activity.amount} SHM</p>
                        <p className="text-gray-400 text-sm">{activity.timestamp}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pools" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Pool Rewards</h2>
              <Button 
                onClick={handleClaimAllRewards}
                className="bg-green-500 hover:bg-green-600 text-white"
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
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white">{pool.poolName}</CardTitle>
                        <Badge className={
                          pool.isActive 
                            ? 'bg-green-500/20 text-green-500 border-green-500/30'
                            : 'bg-gray-500/20 text-gray-500 border-gray-500/30'
                        }>
                          {pool.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Pending Rewards:</span>
                          <span className="text-yellow-400 font-semibold">
                            {pool.pendingAmount} {pool.currency}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Earned:</span>
                          <span className="text-green-400 font-semibold">
                            {pool.totalEarned} {pool.currency}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Last Activity:</span>
                          <span className="text-gray-300">{pool.lastActivity}</span>
                        </div>
                      </div>

                      {pool.pendingAmount !== '0' && (
                        <Button
                          onClick={() => handleClaimRewards(pool.poolId)}
                          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
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
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Weekly Performance</CardTitle>
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

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Growth Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Weekly Growth</span>
                      <span className="text-green-400 font-semibold">+12.5%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Pool Utilization</span>
                      <span className="text-blue-400 font-semibold">68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Community Engagement</span>
                      <span className="text-purple-400 font-semibold">84%</span>
                    </div>
                    <Progress value={84} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">All Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {creatorStats?.recentActivity.map((activity, index) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
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
                          <p className="text-white font-medium">{activity.from}</p>
                          <p className="text-gray-400 text-sm">
                            {activity.type === 'pool_reward' && activity.poolId && (
                              <span className="text-yellow-500">Pool: {activity.poolId}</span>
                            )}
                            {activity.type === 'direct' && 'Direct tip'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-semibold">+{activity.amount} SHM</p>
                        <p className="text-gray-400 text-sm">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}