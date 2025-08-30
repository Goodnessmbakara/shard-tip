"use client"

import type React from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit"
import { shardeumTestnet } from "@/lib/wagmi"
import "@rainbow-me/rainbowkit/styles.css"

const config = getDefaultConfig({
  appName: "ShardTip",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "shardtip-demo",
  chains: [shardeumTestnet],
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
