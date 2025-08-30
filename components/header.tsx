"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { ShardLogo } from "@/components/shard-logo"
import Link from "next/link"

export function Header() {
  return (
    <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <ShardLogo className="w-8 h-8" />
            <span className="text-xl font-semibold text-foreground">ShardTip</span>
          </Link>
          <ConnectButton />
        </div>
      </div>
    </header>
  )
}
