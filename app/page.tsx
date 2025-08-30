"use client"

import { motion } from "framer-motion"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { ShardLogo } from "@/components/shard-logo"
import { NetworkStats } from "@/components/network-stats"
import { NetworkStatsFooter } from "@/components/network-stats-footer"
import { ErrorBoundary } from "@/components/error-boundary"
import { ArrowRight, Sparkles, Coins, Heart, Zap, Shield, Users, Star, TrendingUp, Globe } from "lucide-react"

export default function HomePage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Header */}
        <header className="border-b border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="relative">
                <ShardLogo className="w-8 h-8" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 border-blue-500/20 rounded-full"
                  />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ShardTip
                </span>
              </div>
              <ConnectButton />
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="mb-12"
              >
                {/* Custom animated logo */}
                <div className="relative inline-block mb-8">
                  <div className="relative">
                    <ShardLogo className="w-24 h-24 mx-auto" />
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl"
                    />
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                  </motion.div>
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white mb-8 leading-tight">
                  <span className="block">Support Creators</span>
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Instantly
                  </span>
                </h1>
                
                <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto mb-12 leading-relaxed">
                  The first micro-tipping platform built on{" "}
                  <span className="font-semibold text-blue-600 dark:text-blue-400">Shardeum</span>.
                  <br />
                  Send tips in seconds, not minutes. Pay pennies, not dollars.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              >
                <ConnectButton.Custom>
                  {({ account, chain, openConnectModal, mounted }) => {
                    const ready = mounted
                    const connected = ready && account && chain

                    return (
                      <button
                        onClick={openConnectModal}
                        disabled={!ready}
                        className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center space-x-3 overflow-hidden"
                      >
                        <motion.div
                          animate={{ x: [0, 100, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        />
                        <span className="relative z-10">Start Tipping Now</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                      </button>
                    )
                  }}
                </ConnectButton.Custom>

                <button className="group text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 px-6 py-3 font-semibold flex items-center space-x-2">
                  <span>See How It Works</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </button>
              </motion.div>
            </div>
          </div>

          {/* Custom background elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                x: [0, 10, 0]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-2xl"
            />
            <motion.div
              animate={{ 
                y: [0, 20, 0],
                x: [0, -15, 0]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-40 right-20 w-40 h-40 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-xl"
            />
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">$0.01</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Avg. Tip Fee</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">&lt;1s</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Transaction Time</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-2">∞</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Scalability</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">100%</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Creator Revenue</div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                Why Creators Love ShardTip
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                Built for the creator economy, powered by the most scalable blockchain ever created
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-slate-200 dark:border-slate-700">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Lightning Fast</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Tips are processed in under a second. No more waiting for confirmations or dealing with slow networks.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-slate-200 dark:border-slate-700">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Coins className="w-8 h-8 text-white" />
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Dirt Cheap</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Transaction fees are less than a penny. More money goes to creators, not to middlemen.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-slate-200 dark:border-slate-700">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                    <motion.div
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Creator First</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Built specifically for creators with batched claims, instant payouts, and zero platform fees.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                How It Works
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                Three simple steps to start supporting your favorite creators
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-white mb-4">
                    1
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 border-blue-300 rounded-full"
                  />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Connect Wallet</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Connect your Web3 wallet and add some SHM tokens from the Shardeum faucet
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-white mb-4">
                    2
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 border-2 border-purple-300 rounded-full"
                  />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Find Creators</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Browse creators or enter their wallet address to send them a tip
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-white mb-4">
                    3
                  </div>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 border-2 border-pink-300 rounded-full"
                  />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Send Tip</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Choose an amount and send your tip. It arrives instantly with minimal fees
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Network Stats Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-8">
                  Powered by Shardeum
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-300 mb-12 leading-relaxed">
                  The world's first EVM-based L1 blockchain that scales linearly with every node. 
                  Perfect for micro-transactions and creator payments.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Linear Scalability</h3>
                      <p className="text-slate-600 dark:text-slate-300">Gets faster with every node added</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Stable Low Fees</h3>
                      <p className="text-slate-600 dark:text-slate-300">Consistent pricing regardless of network load</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">EVM Compatible</h3>
                      <p className="text-slate-600 dark:text-slate-300">Works with all your favorite wallets and tools</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
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
        <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
          />
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              x: [0, 10, 0]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-lg"
          />
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8">
                Ready to Support Creators?
              </h2>
              <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
                Join thousands of creators and supporters using ShardTip to build a better creator economy
              </p>
              <ConnectButton.Custom>
                {({ account, chain, openConnectModal, mounted }) => {
                  const ready = mounted
                  const connected = ready && account && chain

                  return (
                    <button
                      onClick={openConnectModal}
                      disabled={!ready}
                      className="group bg-white hover:bg-gray-100 text-blue-600 px-12 py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center space-x-3 mx-auto"
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
        <footer className="border-t border-slate-200 dark:border-slate-700 py-12 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center space-y-6">
              <NetworkStatsFooter />
              <div className="flex flex-col md:flex-row justify-between items-center w-full">
                <div className="flex items-center space-x-3 mb-4 md:mb-0">
                  <ShardLogo className="w-6 h-6" />
                  <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ShardTip
                  </span>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  Built on Shardeum • Powered by the creator economy
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  )
}
