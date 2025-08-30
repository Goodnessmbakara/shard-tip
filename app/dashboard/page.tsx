"use client"

import { useAccount } from "wagmi"
import { redirect } from "next/navigation"
import { useState } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { TipForm } from "@/components/tip-form"
import { ClaimCard } from "@/components/claim-card"
import { ErrorBoundary } from "@/components/error-boundary"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Wallet } from "lucide-react"

export default function DashboardPage() {
  const { address, isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState("send")

  if (!isConnected) {
    redirect("/")
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Send tips to creators or claim your pending tips on Shardeum</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="send" className="flex items-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>Send Tip</span>
                </TabsTrigger>
                <TabsTrigger value="claim" className="flex items-center space-x-2">
                  <Wallet className="w-4 h-4" />
                  <span>Claim Tips</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="send">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <TipForm />
                </motion.div>
              </TabsContent>

              <TabsContent value="claim">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <ClaimCard />
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </main>
      </div>
    </ErrorBoundary>
  )
}
