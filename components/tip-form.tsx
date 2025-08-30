"use client"

import type React from "react"

import { useState } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useBalance } from "wagmi"
import { parseEther, isAddress } from "viem"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Send, Sparkles, AlertCircle, Brain, TrendingUp, ExternalLink } from "lucide-react"
import { getEnhancedTipSuggestion } from "@/lib/ai-sentiment"

// Mock contract address - replace with actual deployed contract
const SHARDTIP_CONTRACT_ADDRESS = "0x2e678D2Aa70A28B78b3f62316d565c7718798a6B"

const SHARDTIP_ABI = [
  {
    inputs: [{ name: "creator", type: "address" }],
    name: "tip",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const

export function TipForm() {
  const { address } = useAccount()
  const [creatorAddress, setCreatorAddress] = useState("")
  const [content, setContent] = useState("")
  const [tipAmount, setTipAmount] = useState([0.001])
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState<{
    amount: number
    confidence: number
    reasoning: string
  } | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [transactionHash, setTransactionHash] = useState<string | null>(null)

  const { data: balance } = useBalance({
    address,
  })

  const { writeContract, data: hash, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const handleGetSuggestion = async () => {
    if (!content.trim()) {
      setError("Please enter some content to analyze")
      return
    }

    setIsLoadingSuggestion(true)
    setError("")
    setAiSuggestion(null)

    try {
      const suggestion = await getEnhancedTipSuggestion(content)
      setAiSuggestion(suggestion)
      setTipAmount([suggestion.amount])
    } catch (err) {
      setError("Failed to get AI suggestion. Please try again.")
    } finally {
      setIsLoadingSuggestion(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setTransactionHash(null)

    // Validation
    if (!creatorAddress) {
      setError("Please enter a creator address")
      return
    }

    if (!isAddress(creatorAddress)) {
      setError("Please enter a valid Ethereum address")
      return
    }

    if (creatorAddress.toLowerCase() === address?.toLowerCase()) {
      setError("You cannot tip yourself")
      return
    }

    if (tipAmount[0] <= 0) {
      setError("Tip amount must be greater than 0")
      return
    }

    const tipValue = parseEther(tipAmount[0].toString())

    // Check balance
    if (balance && balance.value < tipValue) {
      setError("Insufficient balance for this tip")
      return
    }

    try {
      writeContract({
        address: SHARDTIP_CONTRACT_ADDRESS,
        abi: SHARDTIP_ABI,
        functionName: "tip",
        args: [creatorAddress as `0x${string}`],
        value: tipValue,
      })
    } catch (err) {
      setError("Failed to send tip. Please try again.")
    }
  }

  // Handle successful transaction
  if (isConfirmed && !success) {
    setSuccess(`Successfully sent ${tipAmount[0]} SHM to ${creatorAddress}!`)
    setTransactionHash(hash || null)

    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#0070F3", "#00BFFF", "#10b981", "#8B5CF6", "#F59E0B"],
      shapes: ["circle", "square"],
      scalar: 1.2,
    })

    // Reset form
    setCreatorAddress("")
    setContent("")
    setTipAmount([0.001])
    setAiSuggestion(null)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Send className="w-5 h-5 text-primary" />
          <span>Send a Tip</span>
        </CardTitle>
        <CardDescription>Support creators with instant micro-tips on Shardeum</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Creator Address */}
          <div className="space-y-2">
            <Label htmlFor="creator">Creator Address</Label>
            <Input
              id="creator"
              type="text"
              placeholder="0x..."
              value={creatorAddress}
              onChange={(e) => setCreatorAddress(e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          {/* Content for AI Analysis */}
          <div className="space-y-2">
            <Label htmlFor="content">Content (Optional)</Label>
            <Textarea
              id="content"
              placeholder="Paste content here for AI-powered tip suggestions..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
            />
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGetSuggestion}
                disabled={!content.trim() || isLoadingSuggestion}
                className="flex items-center space-x-2 bg-transparent"
              >
                {isLoadingSuggestion ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                <span>Get AI Suggestion</span>
              </Button>
              {content.trim() && (
                <Badge variant="secondary" className="text-xs">
                  {content.trim().split(/\s+/).length} words
                </Badge>
              )}
            </div>
          </div>

          {aiSuggestion && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-lg p-4"
            >
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-semibold text-foreground">AI Suggestion:</span>
                    <Badge variant="outline" className="text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {Math.round(aiSuggestion.confidence * 100)}% confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{aiSuggestion.reasoning}</p>
                  <div className="text-lg font-bold text-primary">{aiSuggestion.amount} SHM</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tip Amount */}
          <div className="space-y-4">
            <Label>Tip Amount: {tipAmount[0]} SHM</Label>
            <Slider
              value={tipAmount}
              onValueChange={setTipAmount}
              max={1}
              min={0.001}
              step={0.001}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>0.001 SHM</span>
              <span>1 SHM</span>
            </div>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setTipAmount([0.001])}
                className="text-xs"
              >
                Min
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setTipAmount([0.005])}
                className="text-xs"
              >
                0.005
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setTipAmount([0.01])}
                className="text-xs"
              >
                0.01
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setTipAmount([0.05])}
                className="text-xs"
              >
                0.05
              </Button>
            </div>
          </div>

          {/* Balance Display */}
          {balance && (
            <div className="text-sm text-muted-foreground">
              Your balance: {Number.parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
            </div>
          )}

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
              className="space-y-3"
            >
              <Alert className="border-secondary text-secondary-foreground">
                <Sparkles className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
              
              {/* Transaction Hash */}
              {transactionHash && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="text-center"
                >
                  <div className="text-xs text-muted-foreground mb-1">Transaction Hash:</div>
                  <a
                    href={`https://explorer.shardeum.org/tx/${transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 font-mono text-xs text-primary hover:text-primary/80 transition-colors cursor-pointer bg-primary/5 hover:bg-primary/10 px-2 py-1 rounded border border-primary/20 hover:border-primary/30"
                  >
                    <span>{transactionHash.slice(0, 8)}...{transactionHash.slice(-6)}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <div className="text-xs text-muted-foreground mt-1">Click to view on Shardeum Explorer</div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isPending || isConfirming || !creatorAddress || tipAmount[0] <= 0}
          >
            {isPending || isConfirming ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isPending ? "Confirming..." : "Processing..."}
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Tip
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
