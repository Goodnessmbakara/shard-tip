"use client"

import { useEffect, useState, memo } from "react"
import { motion } from "framer-motion"
import { Activity, Zap, DollarSign, Globe, Clock, TrendingUp } from "lucide-react"
import { getNetworkStats } from "@/lib/network-api"

interface NetworkStatsData {
  activeNodes: number
  tps: number
  avgFee: string
  gasPrice: string
  blockNumber: number
  loading: boolean
  lastUpdated: Date | null
}

export const NetworkStats = memo(function NetworkStats() {
  const [stats, setStats] = useState<NetworkStatsData>({
    activeNodes: 0,
    tps: 0,
    avgFee: "0.000000",
    gasPrice: "0.000000",
    blockNumber: 0,
    loading: true,
    lastUpdated: null,
  })

  const fetchStats = async () => {
    try {
      const networkStats = await getNetworkStats()
      setStats({
        activeNodes: networkStats.activeNodes,
        tps: networkStats.tps,
        avgFee: networkStats.avgFee,
        gasPrice: networkStats.gasPrice,
        blockNumber: networkStats.blockNumber,
        loading: false,
        lastUpdated: new Date(),
      })
    } catch (error) {
      console.error("Failed to fetch network stats:", error)
      setStats((prev) => ({ ...prev, loading: false }))
    }
  }

  useEffect(() => {
    fetchStats()

    // Refresh stats every 5 minutes (reduced from 30 seconds)
    const interval = setInterval(fetchStats, 300000)
    return () => clearInterval(interval)
  }, [])

  const statItems = [
    {
      icon: <Activity className="w-6 h-6 text-primary" />,
      label: "Active Nodes",
      value: stats.loading ? "..." : stats.activeNodes.toLocaleString(),
      suffix: "",
      description: "Validator nodes securing the network",
    },
    {
      icon: <Zap className="w-6 h-6 text-secondary" />,
      label: "Network TPS",
      value: stats.loading ? "..." : stats.tps.toLocaleString(),
      suffix: "",
      description: "Transactions processed per second",
    },
    {
      icon: <DollarSign className="w-6 h-6 text-accent" />,
      label: "Avg Fee",
      value: stats.loading ? "..." : stats.avgFee,
      suffix: " TIP",
      description: "Average transaction fee",
    },
    {
      icon: <Globe className="w-6 h-6 text-primary" />,
      label: "Gas Price",
      value: stats.loading ? "..." : stats.gasPrice,
      suffix: " TIP",
      description: "Current gas price per unit",
    },
  ]

  return (
    <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-card-foreground">Live Network Stats</h3>
        {stats.lastUpdated && (
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>Updated {stats.lastUpdated.toLocaleTimeString()}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group p-4 bg-muted/30 hover:bg-muted/50 rounded-xl transition-all duration-300 hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                <span className="text-muted-foreground font-medium text-sm">{item.label}</span>
              </div>
            </div>
            <div className="text-right mb-1">
              <span className="text-2xl font-bold text-card-foreground">{item.value}</span>
              <span className="text-sm text-muted-foreground">{item.suffix}</span>
            </div>
            <div className="text-xs text-muted-foreground">{item.description}</div>
          </motion.div>
        ))}
      </div>

      {/* Additional Network Info */}
      <div className="border-t border-border/50 pt-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            <span className="text-muted-foreground">Creator Network</span>
          </div>
          <div className="flex items-center space-x-4 text-muted-foreground">
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>Block #{stats.blockNumber.toLocaleString()}</span>
            </div>
            <div className="text-xs">Chain ID: 8080</div>
          </div>
        </div>
      </div>
    </div>
  )
})
