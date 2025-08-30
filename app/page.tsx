"use client"

import { motion } from "framer-motion"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { ShardLogo } from "@/components/shard-logo"
import { NetworkStats } from "@/components/network-stats"
import { NetworkStatsFooter } from "@/components/network-stats-footer"
import { FeatureCard } from "@/components/feature-card"
import { ErrorBoundary } from "@/components/error-boundary"
import { ArrowRight, Zap, Shield, Users } from "lucide-react"

export default function HomePage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <ShardLogo className="w-8 h-8" />
                <span className="text-xl font-semibold text-foreground">ShardTip</span>
              </div>
              <ConnectButton />
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                <ShardLogo className="w-20 h-20 mx-auto mb-8" />
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
                  Micro-Tip Creators on{" "}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Shardeum's Scalable Network
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 text-pretty">
                  Support your favorite creators with instant, low-cost tips powered by Shardeum's revolutionary
                  blockchain technology. No more high fees, no more delays.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <ConnectButton.Custom>
                  {({ account, chain, openConnectModal, mounted }) => {
                    const ready = mounted
                    const connected = ready && account && chain

                    return (
                      <button
                        onClick={openConnectModal}
                        disabled={!ready}
                        className="group bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center space-x-2"
                      >
                        <span>Get Started</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )
                  }}
                </ConnectButton.Custom>

                <button className="text-muted-foreground hover:text-foreground transition-colors duration-200 px-4 py-2">
                  Learn More
                </button>
              </motion.div>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-2xl" />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Why Choose ShardTip?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Built on Shardeum's cutting-edge technology for the best creator economy experience
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Zap className="w-8 h-8 text-primary" />}
                title="Lightning Fast"
                description="Tips are processed instantly with Shardeum's high-throughput blockchain. No more waiting for confirmations."
              />
              <FeatureCard
                icon={<Shield className="w-8 h-8 text-primary" />}
                title="Ultra Low Fees"
                description="Pay minimal transaction fees thanks to Shardeum's efficient consensus mechanism. More money goes to creators."
              />
              <FeatureCard
                icon={<Users className="w-8 h-8 text-primary" />}
                title="Creator Focused"
                description="Designed specifically for the creator economy with batched claims and AI-powered tip suggestions."
              />
            </div>
          </div>
        </section>

        {/* Why Shardeum Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Why Shardeum?</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
                Shardeum is the world's first EVM-based L1 blockchain that increases TPS with every node added to the
                network. Perfect for micro-transactions and creator payments.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Linear Scalability</h3>
                      <p className="text-muted-foreground">
                        Unlike other blockchains that slow down with more users, Shardeum gets faster as more nodes join
                        the network.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Low & Stable Fees</h3>
                      <p className="text-muted-foreground">
                        Transaction fees remain consistently low regardless of network congestion, perfect for
                        micro-tips.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">EVM Compatible</h3>
                      <p className="text-muted-foreground">
                        Full Ethereum compatibility means familiar tools, wallets, and developer experience.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <NetworkStats />
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">Ready to Start Tipping?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join the future of creator support with instant, affordable micro-tips on Shardeum.
              </p>
              <ConnectButton.Custom>
                {({ account, chain, openConnectModal, mounted }) => {
                  const ready = mounted
                  const connected = ready && account && chain

                  return (
                    <button
                      onClick={openConnectModal}
                      disabled={!ready}
                      className="group bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center space-x-2 mx-auto"
                    >
                      <span>Connect Wallet & Start</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )
                }}
              </ConnectButton.Custom>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center space-y-6">
              <NetworkStatsFooter />
              <div className="flex flex-col md:flex-row justify-between items-center w-full">
                <div className="flex items-center space-x-3 mb-4 md:mb-0">
                  <ShardLogo className="w-6 h-6" />
                  <span className="text-lg font-semibold text-foreground">ShardTip</span>
                </div>
                <div className="text-sm text-muted-foreground">Built on Shardeum • Powered by the creator economy</div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  )
}
