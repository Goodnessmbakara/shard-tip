"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Activity, Zap, DollarSign } from "lucide-react"
import { getNetworkStats } from "@/lib/network-api"

interface FooterStatsData {
  activeNodes: number
  tps: number
  avgFee: string
  loading: boolean
}

export function NetworkStatsFooter() {
  const [stats, setStats] = useState<FooterStatsData>({
    activeNodes: 0,
    tps: 0,
    avgFee: "0.000000",
    loading: true,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const networkStats = await getNetworkStats()
        setStats({
          activeNodes: networkStats.activeNodes,
          tps: networkStats.tps,
          avgFee: networkStats.avgFee,
          loading: false,
        })
      } catch (error) {
        console.error("Failed to fetch footer stats:", error)
        setStats((prev) => ({ ...prev, loading: false }))
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 300000) // Update every 5 minutes for footer
    return () => clearInterval(interval)
  }, [])

  const footerStats = [
    {
      icon: <Activity className="w-4 h-4 text-primary" />,
      label: "Nodes",
      value: stats.loading ? "..." : stats.activeNodes.toLocaleString(),
    },
    {
      icon: <Zap className="w-4 h-4 text-secondary" />,
      label: "TPS",
      value: stats.loading ? "..." : stats.tps.toLocaleString(),
    },
    {
      icon: <DollarSign className="w-4 h-4 text-accent" />,
      label: "Fee",
      value: stats.loading ? "..." : `${stats.avgFee} TIP`,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-muted/20 border border-border/30 rounded-lg p-4"
    >
      <div className="flex items-center justify-center space-x-8">
        {footerStats.map((stat, index) => (
          <div key={stat.label} className="flex items-center space-x-2 text-sm">
            {stat.icon}
            <span className="text-muted-foreground">{stat.label}:</span>
            <span className="font-semibold text-foreground">{stat.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
