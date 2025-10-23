'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  X, 
  TrendingUp, 
  Wallet, 
  Clock, 
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart as PieChartIcon,
  ExternalLink,
  Download,
  RefreshCw,
  DollarSign,
  Users,
  Activity
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface PoolReward {
  poolId: string;
  poolName: string;
  currency: string;
  pendingAmount: string;
  totalEarned: string;
  lastActivity: string;
  isActive: boolean;
  growthRate: number;
  weeklyEarnings: number;
}

interface RewardHistory {
  id: string;
  type: 'direct_tip' | 'pool_reward' | 'batch_claim';
  amount: string;
  timestamp: string;
  source: string;
  poolId?: string;
  txHash: string;
}

interface PoolsRewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorAddress: string;
}

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
const TOKEN_SYMBOL = 'TIP';

export default function PoolsRewardsModal({ isOpen, onClose, creatorAddress }: PoolsRewardsModalProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [poolRewards, setPoolRewards] = useState<PoolReward[]>([]);
  const [rewardHistory, setRewardHistory] = useState<RewardHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState<string | null>(null);

  // Mock data - replace with actual API calls
  useEffect(() => {
    if (isOpen) {
      const mockPoolRewards: PoolReward[] = [
        {
          poolId: 'ETH/SHM',
          poolName: 'ETH/SHM Pool',
          currency: TOKEN_SYMBOL,
          pendingAmount: '125.50',
          totalEarned: '2100.75',
          lastActivity: '2 hours ago',
          isActive: true,
          growthRate: 12.5,
          weeklyEarnings: 340
        },
        {
          poolId: 'USDC/SHM',
          poolName: 'USDC/SHM Pool',
          currency: TOKEN_SYMBOL,
          pendingAmount: '45.25',
          totalEarned: '890.30',
          lastActivity: '1 day ago',
          isActive: true,
          growthRate: 8.3,
          weeklyEarnings: 120
        },
        {
          poolId: 'WBTC/SHM',
          poolName: 'WBTC/SHM Pool',
          currency: TOKEN_SYMBOL,
          pendingAmount: '0',
          totalEarned: '320.45',
          lastActivity: '3 days ago',
          isActive: false,
          growthRate: -2.1,
          weeklyEarnings: 45
        },
        {
          poolId: 'DAI/SHM',
          poolName: 'DAI/SHM Pool',
          currency: TOKEN_SYMBOL,
          pendingAmount: '78.90',
          totalEarned: '156.20',
          lastActivity: '5 hours ago',
          isActive: true,
          growthRate: 15.7,
          weeklyEarnings: 89
        }
      ];

      const mockRewardHistory: RewardHistory[] = [
        {
          id: '1',
          type: 'direct_tip',
          amount: '50',
          timestamp: '2 hours ago',
          source: '0x1234...5678',
          txHash: '0xabc123...def456'
        },
        {
          id: '2',
          type: 'pool_reward',
          amount: '12.5',
          timestamp: '4 hours ago',
          source: 'ETH/SHM Pool',
          poolId: 'ETH/SHM',
          txHash: '0xdef456...ghi789'
        },
        {
          id: '3',
          type: 'batch_claim',
          amount: '89.75',
          timestamp: '1 day ago',
          source: 'Multiple Pools',
          txHash: '0xghi789...jkl012'
        }
      ];

      setPoolRewards(mockPoolRewards);
      setRewardHistory(mockRewardHistory);
    }
  }, [isOpen]);

  const handleClaimRewards = async (poolId: string) => {
    setClaiming(poolId);
    try {
      // TODO: Implement actual claim logic
      console.log('Claiming rewards for pool:', poolId);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      alert('Rewards claimed successfully!');
    } catch (error) {
      console.error('Failed to claim rewards:', error);
      alert('Failed to claim rewards. Please try again.');
    } finally {
      setClaiming(null);
    }
  };

  const handleClaimAllRewards = async () => {
    setClaiming('all');
    try {
      // TODO: Implement batch claim logic
      console.log('Claiming all rewards');
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate API call
      alert('All rewards claimed successfully!');
    } catch (error) {
      console.error('Failed to claim all rewards:', error);
      alert('Failed to claim rewards. Please try again.');
    } finally {
      setClaiming(null);
    }
  };

  const totalPendingRewards = poolRewards.reduce((sum, pool) => sum + parseFloat(pool.pendingAmount), 0);
  const totalEarned = poolRewards.reduce((sum, pool) => sum + parseFloat(pool.totalEarned), 0);
  const activePools = poolRewards.filter(pool => pool.isActive).length;

  const earningsData = [
    { name: 'Week 1', earnings: 400, tips: 240 },
    { name: 'Week 2', earnings: 300, tips: 139 },
    { name: 'Week 3', earnings: 200, tips: 980 },
    { name: 'Week 4', earnings: 278, tips: 390 },
    { name: 'Week 5', earnings: 189, tips: 480 },
    { name: 'Week 6', earnings: 239, tips: 380 },
    { name: 'Week 7', earnings: 349, tips: 430 },
  ];

  const poolPerformanceData = poolRewards.map((pool, index) => ({
    name: pool.poolName,
    value: parseFloat(pool.totalEarned),
    color: CHART_COLORS[index % CHART_COLORS.length]
  }));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Pools & Rewards</h2>
            <p className="text-slate-600 dark:text-slate-300">Manage your earnings and pool performance</p>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Pending Rewards</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalPendingRewards.toFixed(2)} {TOKEN_SYMBOL}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 dark:text-green-400 text-sm font-medium">Total Earned</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">{totalEarned.toFixed(2)} {TOKEN_SYMBOL}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-600 dark:text-orange-400 text-sm font-medium">Active Pools</p>
                    <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{activePools}</p>
                  </div>
                  <Users className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">This Week</p>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                      {poolRewards.reduce((sum, pool) => sum + pool.weeklyEarnings, 0)} {TOKEN_SYMBOL}
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pools List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Your Pools</h3>
                <Button
                  onClick={handleClaimAllRewards}
                  disabled={claiming === 'all' || totalPendingRewards === 0}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  {claiming === 'all' ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Wallet className="w-4 h-4 mr-2" />
                  )}
                  Claim All ({totalPendingRewards.toFixed(2)} {TOKEN_SYMBOL})
                </Button>
              </div>

              <div className="space-y-3">
                {poolRewards.map((pool, index) => (
                  <Card key={pool.poolId} className="bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white">{pool.poolName}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-300">Last activity: {pool.lastActivity}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={pool.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'}>
                            {pool.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          <span className={`text-sm font-medium ${pool.growthRate >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {pool.growthRate >= 0 ? '+' : ''}{pool.growthRate}%
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-300">Pending</p>
                          <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{pool.pendingAmount} {pool.currency}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-300">Total Earned</p>
                          <p className="text-lg font-bold text-green-600 dark:text-green-400">{pool.totalEarned} {pool.currency}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-600 dark:text-slate-300">
                          Weekly: {pool.weeklyEarnings} {TOKEN_SYMBOL}
                        </div>
                        {parseFloat(pool.pendingAmount) > 0 && (
                          <Button
                            onClick={() => handleClaimRewards(pool.poolId)}
                            disabled={claiming === pool.poolId}
                            size="sm"
                            className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white"
                          >
                            {claiming === pool.poolId ? (
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Wallet className="w-4 h-4 mr-2" />
                            )}
                            Claim {pool.pendingAmount} {TOKEN_SYMBOL}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Analytics */}
            <div className="space-y-6">
              {/* Earnings Chart */}
              <Card className="bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Weekly Earnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={earningsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#f8fafc', 
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          color: '#1e293b'
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="earnings" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        name="Pool Rewards"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="tips" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        name="Direct Tips"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Pool Performance */}
              <Card className="bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white flex items-center">
                    <PieChartIcon className="w-5 h-5 mr-2" />
                    Pool Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={poolPerformanceData}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {poolPerformanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#f8fafc', 
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          color: '#1e293b'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-6">
            <Card className="bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {rewardHistory.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          activity.type === 'direct_tip' 
                            ? 'bg-blue-100 dark:bg-blue-900/20' 
                            : activity.type === 'pool_reward'
                            ? 'bg-green-100 dark:bg-green-900/20'
                            : 'bg-purple-100 dark:bg-purple-900/20'
                        }`}>
                          {activity.type === 'direct_tip' ? (
                            <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          ) : activity.type === 'pool_reward' ? (
                            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                          ) : (
                            <Wallet className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-slate-900 dark:text-white font-medium">{activity.source}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            {activity.type === 'pool_reward' && activity.poolId && (
                              <span className="text-green-600 dark:text-green-400">Pool: {activity.poolId}</span>
                            )}
                            {activity.type === 'direct_tip' && 'Direct tip'}
                            {activity.type === 'batch_claim' && 'Batch claim'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-green-600 dark:text-green-400 font-semibold">+{activity.amount} {TOKEN_SYMBOL}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
