"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, Shield, Activity, TrendingUp } from "lucide-react"

interface VerificationResult {
  verified: boolean
  wallet: string
  metrics: {
    totalTipsSent: string
    totalTipsReceived: string
    pendingTips: string
    tipTransactions: number
    claimTransactions: number
    totalTransactions: number
    recentActivity: boolean
    hasMinimumActivity: boolean
    hasRecentActivity: boolean
  }
  criteria: {
    minimumTipAmount: string
    minimumTotalSent: string
    minimumTransactions: number
    timeWindow: string
  }
  reason: string
  verificationDate: string
}

export function VerificationCard() {
  const { address } = useAccount()
  const [walletAddress, setWalletAddress] = useState(address || "")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)
  const [error, setError] = useState("")

  const handleVerify = async () => {
    if (!walletAddress.trim()) {
      setError("Please enter a wallet address")
      return
    }

    setIsVerifying(true)
    setError("")
    setVerificationResult(null)

    try {
      const response = await fetch(`/api/verify?wallet=${walletAddress}`)
      const data = await response.json()

      if (data.status === "success") {
        setVerificationResult(data.data)
      } else {
        setError(data.error || "Verification failed")
      }
    } catch (err) {
      setError("Failed to verify wallet. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleUseCurrentWallet = () => {
    if (address) {
      setWalletAddress(address)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-primary" />
          <span>Wallet Verification</span>
        </CardTitle>
        <CardDescription>
          Verify if a wallet has completed required tipping activities on ShardTip
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wallet">Wallet Address</Label>
            <div className="flex space-x-2">
              <Input
                id="wallet"
                type="text"
                placeholder="0x..."
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="font-mono text-sm"
              />
              {address && (
                <Button
                  variant="outline"
                  onClick={handleUseCurrentWallet}
                  className="whitespace-nowrap"
                >
                  Use Current
                </Button>
              )}
            </div>
          </div>

          <Button
            onClick={handleVerify}
            disabled={isVerifying || !walletAddress.trim()}
            className="w-full"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Verify Wallet
              </>
            )}
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Verification Result */}
        {verificationResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Status Card */}
            <div className={`p-4 rounded-lg border-2 ${
              verificationResult.verified 
                ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950' 
                : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
            }`}>
              <div className="flex items-center space-x-3">
                {verificationResult.verified ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
                <div>
                  <div className="font-semibold">
                    {verificationResult.verified ? 'Wallet Verified' : 'Wallet Not Verified'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {verificationResult.reason}
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground">Tips Sent</div>
                <div className="text-lg font-semibold">{verificationResult.metrics.totalTipsSent} SHM</div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground">Tips Received</div>
                <div className="text-lg font-semibold">{verificationResult.metrics.totalTipsReceived} SHM</div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground">Total Transactions</div>
                <div className="text-lg font-semibold">{verificationResult.metrics.totalTransactions}</div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground">Pending Tips</div>
                <div className="text-lg font-semibold">{verificationResult.metrics.pendingTips} SHM</div>
              </div>
            </div>

            {/* Activity Indicators */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Activity Status</div>
              <div className="flex flex-wrap gap-2">
                <Badge variant={verificationResult.metrics.hasMinimumActivity ? "default" : "secondary"}>
                  <Activity className="w-3 h-3 mr-1" />
                  Minimum Activity
                </Badge>
                <Badge variant={verificationResult.metrics.hasRecentActivity ? "default" : "secondary"}>
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Recent Activity
                </Badge>
                <Badge variant={verificationResult.metrics.recentActivity ? "default" : "secondary"}>
                  Active User
                </Badge>
              </div>
            </div>

            {/* Verification Criteria */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Verification Criteria</div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>• Minimum tip amount: {verificationResult.criteria.minimumTipAmount} SHM</div>
                <div>• Minimum total sent: {verificationResult.criteria.minimumTotalSent} SHM</div>
                <div>• Minimum transactions: {verificationResult.criteria.minimumTransactions}</div>
                <div>• Time window: {verificationResult.criteria.timeWindow}</div>
              </div>
            </div>

            {/* Verification Date */}
            <div className="text-xs text-muted-foreground">
              Verified on: {new Date(verificationResult.verificationDate).toLocaleString()}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
