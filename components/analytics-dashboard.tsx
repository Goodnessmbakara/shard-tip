"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity, 
  BarChart3, 
  PieChart, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Heart,
  Zap
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface AnalyticsData {
  overview: {
    totalTips: number
    totalCreators: number
    totalVolume: number
    activeUsers: number
    growthRate: number
  }
  topCreators: Array<{
    address: string
    name: string
    tipsReceived: number
    growthRate: number
    category: string
  }>
  volumeData: Array<{
    date: string
    volume: number
    tips: number
    users: number
  }>
  categoryStats: Array<{
    category: string
    percentage: number
    volume: number
    creators: number
  }>
  recentActivity: Array<{
    id: string
    type: 'tip' | 'registration' | 'claim'
    from: string
    to: string
    amount: number
    timestamp: string
  }>
}

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data - replace with actual API calls
        const mockData: AnalyticsData = {
          overview: {
            totalTips: 15420,
            totalCreators: 342,
            totalVolume: 125000,
            activeUsers: 1280,
            growthRate: 23.5
          },
          topCreators: [
            {
              address: '0x1234...5678',
              name: 'Carlos Rodriguez',
              tipsReceived: 2450,
              growthRate: 15.2,
              category: 'Infrastructure'
            },
            {
              address: '0x2345...6789',
              name: 'Emma Thompson',
              tipsReceived: 1890,
              growthRate: 8.7,
              category: 'Education'
            },
            {
              address: '0x3456...7890',
              name: 'Sarah Martinez',
              tipsReceived: 3200,
              growthRate: 22.1,
              category: 'NFT'
            }
          ],
          volumeData: [
            { date: '2024-01-01', volume: 12000, tips: 45, users: 120 },
            { date: '2024-01-02', volume: 15000, tips: 52, users: 135 },
            { date: '2024-01-03', volume: 18000, tips: 61, users: 148 },
            { date: '2024-01-04', volume: 22000, tips: 73, users: 162 },
            { date: '2024-01-05', volume: 19000, tips: 68, users: 155 },
            { date: '2024-01-06', volume: 25000, tips: 84, users: 178 },
            { date: '2024-01-07', volume: 28000, tips: 92, users: 195 }
          ],
          categoryStats: [
            { category: 'DeFi', percentage: 35, volume: 43750, creators: 120 },
            { category: 'Infrastructure', percentage: 25, volume: 31250, creators: 85 },
            { category: 'Education', percentage: 20, volume: 25000, creators: 68 },
            { category: 'NFT', percentage: 15, volume: 18750, creators: 51 },
            { category: 'Gaming', percentage: 5, volume: 6250, creators: 18 }
          ],
          recentActivity: [
            {
              id: '1',
              type: 'tip',
              from: '0xabcd...1234',
              to: 'Carlos Rodriguez',
              amount: 50,
              timestamp: '2 minutes ago'
            },
            {
              id: '2',
              type: 'registration',
              from: '0xefgh...5678',
              to: 'New Creator',
              amount: 0,
              timestamp: '15 minutes ago'
            },
            {
              id: '3',
              type: 'claim',
              from: 'Emma Thompson',
              to: 'Emma Thompson',
              amount: 150,
              timestamp: '1 hour ago'
            }
          ]
        }
        
        setAnalytics(mockData)
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [timeRange])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-slate-900 dark:text-white mt-4">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-900 dark:text-white text-xl">Failed to load analytics</p>
        </div>
      </div>
    )
  }

  const overviewCards = [
    {
      title: "Total Tips",
      value: analytics.overview.totalTips.toLocaleString(),
      icon: <DollarSign className="w-6 h-6" />,
      change: `+${analytics.overview.growthRate}%`,
      trend: "up"
    },
    {
      title: "Active Creators",
      value: analytics.overview.totalCreators.toLocaleString(),
      icon: <Users className="w-6 h-6" />,
      change: "+12.3%",
      trend: "up"
    },
    {
      title: "Total Volume",
      value: `$${analytics.overview.totalVolume.toLocaleString()}`,
      icon: <TrendingUp className="w-6 h-6" />,
      change: "+18.7%",
      trend: "up"
    },
    {
      title: "Active Users",
      value: analytics.overview.activeUsers.toLocaleString(),
      icon: <Activity className="w-6 h-6" />,
      change: "+8.2%",
      trend: "up"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Analytics Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-300">Comprehensive insights into the creator economy</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {overviewCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">{card.title}</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{card.value}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {card.trend === 'up' ? (
                        <ArrowUpRight className="w-4 h-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-sm font-medium ${
                        card.trend === 'up' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {card.change}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center mt-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      {card.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="creators">Top Creators</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Volume Chart */}
              <Card className="bg-white/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>Volume Trends</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 dark:text-slate-300">Volume chart would be implemented with a charting library</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Category Distribution */}
              <Card className="bg-white/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChart className="w-5 h-5" />
                    <span>Category Distribution</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.categoryStats.map((category, index) => (
                      <div key={category.category} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                          <span className="text-slate-700 dark:text-slate-300 font-medium">{category.category}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-900 dark:text-white font-semibold">{category.percentage}%</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{category.creators} creators</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="creators" className="space-y-6">
            <Card className="bg-white/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-lg">
              <CardHeader>
                <CardTitle>Top Performing Creators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topCreators.map((creator, index) => (
                    <div key={creator.address} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{creator.name}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-300">{creator.address}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900 dark:text-white">{creator.tipsReceived.toLocaleString()} TIP</p>
                        <div className="flex items-center space-x-1">
                          <ArrowUpRight className="w-3 h-3 text-green-500" />
                          <span className="text-sm text-green-500">+{creator.growthRate}%</span>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {creator.category}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analytics.categoryStats.map((category, index) => (
                <Card key={category.category} className="bg-white/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{category.category}</h3>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {category.percentage}%
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-300">Volume</span>
                        <span className="font-semibold text-slate-900 dark:text-white">${category.volume.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-300">Creators</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{category.creators}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-white/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-lg">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        {activity.type === 'tip' && <Heart className="w-4 h-4 text-blue-500" />}
                        {activity.type === 'registration' && <Users className="w-4 h-4 text-green-500" />}
                        {activity.type === 'claim' && <Zap className="w-4 h-4 text-yellow-500" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-900 dark:text-white font-medium">
                          {activity.type === 'tip' && `${activity.from} tipped ${activity.to}`}
                          {activity.type === 'registration' && `${activity.from} registered as creator`}
                          {activity.type === 'claim' && `${activity.from} claimed rewards`}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{activity.timestamp}</p>
                      </div>
                      {activity.amount > 0 && (
                        <div className="text-right">
                          <p className="font-semibold text-slate-900 dark:text-white">{activity.amount} TIP</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

