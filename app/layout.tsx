import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ProvidersWrapper } from "@/components/providers-wrapper"
import { Header } from "@/components/header"
import "./globals.css"
import { Suspense } from "react"
import "@/lib/polyfills"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "ShardTip Creator Rewards Hook - Uniswap v4 Capstone",
  description: "Uniswap v4 hook that automatically rewards pool creators with micro-tips from swap volume. Bringing the creator economy to DeFi.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${inter.variable} antialiased`} suppressHydrationWarning>
        <Suspense fallback={null}>
          <ProvidersWrapper>
            <Header />
            {children}
            <Analytics />
          </ProvidersWrapper>
        </Suspense>
      </body>
    </html>
  )
}
