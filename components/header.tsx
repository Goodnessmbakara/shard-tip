"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { ShardLogo } from "@/components/shard-logo"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  Home, 
  TrendingUp, 
  UserPlus,
  Wallet
} from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <ShardLogo className="w-8 h-8" />
            <span className="text-xl font-semibold text-foreground">ShardTip</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-foreground hover:text-yellow-500">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link href="/creators">
              <Button variant="ghost" size="sm" className="text-foreground hover:text-yellow-500">
                <Users className="w-4 h-4 mr-2" />
                Creators
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-foreground hover:text-yellow-500">
                <TrendingUp className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link href="/creator-registration">
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                <UserPlus className="w-4 h-4 mr-2" />
                Become Creator
              </Button>
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  )
}
