import { createConfig, http } from "wagmi"
import { defineChain } from "viem"
import { sepolia } from "viem/chains"

export const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/Is8yBI6q-15CZYr4ySEfU0xnh6b-X2sz"),
  },
})
