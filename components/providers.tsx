"use client"

import type React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { RainbowKitProvider, getDefaultConfig, darkTheme } from "@rainbow-me/rainbowkit"
import { sepolia } from "wagmi/chains"
import "@rainbow-me/rainbowkit/styles.css"

// Create config with Sepolia for now
const config = getDefaultConfig({
  appName: "ShardTip Creator Rewards",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "14521493ef2c71800bd0d0f93524de9d",
  chains: [sepolia],
  ssr: false, // Disable SSR to prevent hydration issues
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme()}
          modalSize="compact"
          initialChain={sepolia}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
