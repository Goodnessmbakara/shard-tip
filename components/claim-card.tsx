"use client"

import { useState, useEffect } from "react"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { formatEther } from "viem"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2, Wallet, AlertCircle, CheckCircle, TrendingUp, Users, Clock } from "lucide-react"

// Mock contract address - replace with actual deployed contract
const SHARDTIP_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890"

const SHARDTIP_ABI = [
  {
    inputs: [{ name: "creator", type: "address" }],
    name: "getPendingTips",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "claimTips",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "creator", type: "address" }],
    name: "getCreatorStats",
    outputs: [
      { name: "pendingAmount", type: "uint256" },
      { name: "totalReceived", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const

export function ClaimCard() {
  const { address } = useAccount()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [lastClaimTime, setLastClaimTime] = useState<Date | null>(null)

  // Read pending tips
  const { data: pendingTips, refetch: refetchPending } = useReadContract({
    address: SHARDTIP_CONTRACT_ADDRESS,
    abi: SHARDTIP_ABI,
    functionName: "getPendingTips",
    args: address ? [address] : undefined,
  })

  // Read creator stats
  const { data: creatorStats, refetch: refetchStats } = useReadContract({
    address: SHARDTIP_CONTRACT_ADDRESS,
    abi: SHARDTIP_ABI,
    functionName: "getCreatorStats",
    args: address ? [address] : undefined,
  })

  const { writeContract, data: hash, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const handleClaim = async () => {
    setError("")
    setSuccess("")

    if (!pendingTips || pendingTips === 0n) {
      setError("No tips to claim")
      return
    }

    try {
      writeContract({
        address: SHARDTIP_CONTRACT_ADDRESS,
        abi: SHARDTIP_ABI,
        functionName: "claimTips",
      })
    } catch (err) {
      setError("Failed to claim tips. Please try again.")
    }
  }

  // Handle successful claim
  useEffect(() => {
    if (isConfirmed && !success) {
      const amount = pendingTips ? formatEther(pendingTips) : "0"
      setSuccess(`Successfully claimed ${amount} SHM!`)
      setLastClaimTime(new Date())

      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 },
        colors: ["#10b981", "#0070F3", "#F59E0B", "#8B5CF6"],
        shapes: ["circle", "square"],
        scalar: 1.5,
        gravity: 0.8,
      })

      // Refetch data
      refetchPending()
      refetchStats()
    }
  }, [isConfirmed, success, pendingTips, refetchPending, refetchStats])

  const pendingAmount = pendingTips ? formatEther(pendingTips) : "0"
  const totalReceived = creatorStats ? formatEther(creatorStats[1]) : "0"

  const nextMilestone = 0.1 // 0.1 SHM milestone
  const progress = Math.min((Number.parseFloat(totalReceived) / nextMilestone) * 100, 100)

  return (
    <div className="space-y-6">
      {/* Pending Tips Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wallet className="w-5 h-5 text-primary" />
              <span>Pending Tips</span>
            </div>
            {Number.parseFloat(pendingAmount) > 0 && (
              <Badge variant="secondary" className="animate-pulse">
                <Clock className="w-3 h-3 mr-1" />
                Ready to claim
              </Badge>
            )}
          </CardTitle>
          <CardDescription>Tips waiting to be claimed from your supporters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <motion.div
              key={pendingAmount}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-4xl font-bold text-foreground mb-2"
            >
              {Number.parseFloat(pendingAmount).toFixed(4)} SHM
            </motion.div>
            <div className="text-muted-foreground">Available to claim</div>
            {lastClaimTime && (
              <div className="text-xs text-muted-foreground mt-2">Last claimed: {lastClaimTime.toLocaleString()}</div>
            )}
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Alert className="border-secondary text-secondary-foreground">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          <Button
            onClick={handleClaim}
            className="w-full"
            disabled={isPending || isConfirming || !pendingTips || pendingTips === 0n}
          >
            {isPending || isConfirming ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isPending ? "Confirming..." : "Processing..."}
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4 mr-2" />
                Claim Tips
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Enhanced Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-secondary" />
            <span>Creator Statistics</span>
          </CardTitle>
          <CardDescription>Your all-time tipping statistics and milestones</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground">{Number.parseFloat(totalReceived).toFixed(4)}</div>
              <div className="text-sm text-muted-foreground">Total Received (SHM)</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground">{Number.parseFloat(pendingAmount).toFixed(4)}</div>
              <div className="text-sm text-muted-foreground">Pending (SHM)</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress to 0.1 SHM milestone</span>
              <span className="font-medium">{progress.toFixed(1)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="text-xs text-muted-foreground text-center">
              {progress >= 100
                ? "Milestone achieved! 🎉"
                : `${(nextMilestone - Number.parseFloat(totalReceived)).toFixed(4)} SHM to go`}
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">Creator Insights</span>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Share your address to receive more tips</p>
              <p>• Engage with supporters to build community</p>
              <p>• Claim tips regularly to maintain momentum</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
