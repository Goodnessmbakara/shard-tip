import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ProvidersWrapper } from "@/components/providers-wrapper"
import "./globals.css"
import { Suspense } from "react"
import "@/lib/polyfills"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "ShardTip - Micro-Tip Creators on Shardeum",
  description: "Decentralized micro-tipping platform for creators built on Shardeum blockchain",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} antialiased`}>
        <Suspense fallback={null}>
          <ProvidersWrapper>
            {children}
            <Analytics />
          </ProvidersWrapper>
        </Suspense>
      </body>
    </html>
  )
}
