"use client"

import dynamic from 'next/dynamic'
import type React from "react"
import { useEffect, useState } from 'react'

// Dynamically import providers to prevent SSR issues
const Providers = dynamic(() => import('./providers').then(mod => ({ default: mod.Providers })), {
  ssr: false,
})

export function ProvidersWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Return null during SSR to prevent hydration mismatch
  // Browser extensions inject scripts that cause mismatches
  if (!mounted) {
    return null
  }

  return <Providers>{children}</Providers>
}
