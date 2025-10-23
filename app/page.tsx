"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useRouter } from "next/navigation"
import { ShardLogo } from "@/components/shard-logo"
import { HeroIcon } from "@/components/hero-icon"
import { IconPicker } from "@/components/icon-picker"
import { NetworkStats } from "@/components/network-stats"
import { NetworkStatsFooter } from "@/components/network-stats-footer"
import { ErrorBoundary } from "@/components/error-boundary"
import { ArrowRight, Sparkles, Coins, Heart, Zap, Shield, Users, Star, TrendingUp, Globe } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const [selectedIcon, setSelectedIcon] = useState("heart")
  
  return (
    <ErrorBoundary>
      <IconPicker onIconChange={setSelectedIcon} />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">

        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          {/* Background Image/Pattern */}
          <div className="absolute inset-0 -z-20">
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
            
            {/* Geometric pattern overlay */}
            <div className="absolute inset-0 opacity-30 dark:opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.05) 0%, transparent 50%),
                  linear-gradient(45deg, transparent 30%, rgba(59, 130, 246, 0.03) 50%, transparent 70%),
                  linear-gradient(-45deg, transparent 30%, rgba(16, 185, 129, 0.03) 50%, transparent 70%)
                `,
                backgroundSize: '400px 400px, 300px 300px, 500px 500px, 200px 200px, 200px 200px',
                backgroundPosition: '0 0, 100px 100px, 200px 200px, 0 0, 100px 100px'
              }} />
            </div>
            
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-20 dark:opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px'
              }} />
            </div>
            
            {/* Floating geometric shapes */}
            <div className="absolute inset-0">
              <div className="absolute top-20 left-20 w-32 h-32 border border-blue-300/20 dark:border-blue-400/10 rounded-full" />
              <div className="absolute top-40 right-32 w-24 h-24 border border-green-300/20 dark:border-green-400/10 rotate-45" />
              <div className="absolute bottom-32 left-1/3 w-16 h-16 border border-purple-300/20 dark:border-purple-400/10 rounded-full" />
              <div className="absolute bottom-20 right-20 w-20 h-20 border border-yellow-300/20 dark:border-yellow-400/10 rotate-12" />
            </div>
            
            {/* Subtle noise texture */}
            <div className="absolute inset-0 opacity-5 dark:opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                backgroundSize: '200px 200px'
              }} />
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="mb-12"
              >
                {/* Hero Icon */}
                <div className="relative inline-block mb-8">
                  <HeroIcon variant={selectedIcon as any} className="w-24 h-24 mx-auto" />
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white mb-8 leading-tight">
                  <span className="block">Support Creators</span>
                  <span className="block bg-gradient-to-r from-blue-600 via-green-600 to-yellow-600 bg-clip-text text-transparent">
                    Instantly
                  </span>
                </h1>
                
                <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto mb-12 leading-relaxed">
                  The first micro-tipping platform for creators.
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

                    if (connected) {
                      return (
                        <div className="flex flex-col sm:flex-row gap-4">
                          <button
                            onClick={() => router.push('/creators')}
                            className="group relative bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center space-x-3 overflow-hidden"
                          >
                            <motion.div
                              animate={{ x: [0, 100, 0] }}
                              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            />
                            <span className="relative z-10">Browse Creators</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                          </button>
                          
                          <button
                            onClick={() => router.push('/dashboard')}
                            className="group relative bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center space-x-3 overflow-hidden"
                          >
                            <motion.div
                              animate={{ x: [0, 100, 0] }}
                              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            />
                            <span className="relative z-10">Creator Dashboard</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                          </button>
                        </div>
                      )
                    }

                    return (
                      <button
                        onClick={openConnectModal}
                        disabled={!ready}
                        className="group relative bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center space-x-3 overflow-hidden"
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

                <button 
                  onClick={() => {
                    const featuresSection = document.getElementById('features')
                    featuresSection?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="group text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 px-6 py-3 font-semibold flex items-center space-x-2"
                >
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
              className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/15 to-green-400/15 rounded-full blur-2xl"
            />
              <motion.div
                animate={{ 
                  y: [0, 20, 0],
                  x: [0, -15, 0]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-40 right-20 w-40 h-40 bg-gradient-to-r from-green-400/15 to-blue-400/15 rounded-full blur-3xl"
              />
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-r from-yellow-400/15 to-orange-400/15 rounded-full blur-xl"
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
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">&lt;1s</div>
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
        <section id="features" className="py-24">
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
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
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
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
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
        <section className="py-24 bg-gradient-to-r from-blue-50 to-green-50 dark:from-slate-800 dark:to-slate-700">
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
                  Connect your Web3 wallet and add some tokens from the network faucet
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
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-white mb-4">
                    2
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 border-2 border-green-300 rounded-full"
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
                  <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-white mb-4">
                    3
                  </div>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 border-2 border-yellow-300 rounded-full"
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
                  Built for Creators
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-300 mb-12 leading-relaxed">
                  A platform designed specifically for the creator economy. 
                  Fast, affordable, and built with creators in mind.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-full" />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Lightning Fast</h3>
                      <p className="text-slate-600 dark:text-slate-300">Instant transactions and real-time updates</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Low Fees</h3>
                      <p className="text-slate-600 dark:text-slate-300">Minimal transaction costs for maximum creator revenue</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full" />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Creator Focused</h3>
                      <p className="text-slate-600 dark:text-slate-300">Built specifically for creator economy needs</p>
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
        <section className="py-24 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm relative overflow-hidden">
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
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-8">
                Ready to Support Creators?
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-2xl mx-auto">
                Join thousands of creators and supporters using ShardTip to build a better creator economy
              </p>
              <ConnectButton.Custom>
                {({ account, chain, openConnectModal, mounted }) => {
                  const ready = mounted
                  const connected = ready && account && chain

                  if (connected) {
                    return (
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={() => router.push('/creators')}
                          className="group bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center space-x-3"
                        >
                          <span>Browse Creators</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        
                        <button
                          onClick={() => router.push('/dashboard')}
                          className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center space-x-3"
                        >
                          <span>Creator Dashboard</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    )
                  }

                  return (
                    <button
                      onClick={openConnectModal}
                      disabled={!ready}
                      className="group bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-12 py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center space-x-3 mx-auto"
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
                  <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    ShardTip
                  </span>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  Powered by the creator economy
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  )
}
