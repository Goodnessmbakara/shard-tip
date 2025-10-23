export function ShardLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Modern gradient - more professional and DeFi-focused */}
        <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="50%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#DB2777" />
        </linearGradient>
        
        {/* Accent gradient for highlights */}
        <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#EF4444" />
        </linearGradient>
        
        {/* Subtle glow effect */}
        <filter id="subtleGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Shadow for depth */}
        <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.1"/>
        </filter>
      </defs>
      
      {/* Background circle - subtle and professional */}
      <circle cx="20" cy="20" r="18" fill="url(#primaryGradient)" opacity="0.05" />
      
      {/* Main shard shape - simplified and more geometric */}
      <path 
        d="M20 6L28 14L20 22L12 14L20 6Z" 
        fill="url(#primaryGradient)" 
        stroke="url(#primaryGradient)" 
        strokeWidth="0.5"
        filter="url(#subtleGlow)"
      />
      
      {/* Inner core representing the tip/reward */}
      <path 
        d="M20 10L24 14L20 18L16 14L20 10Z" 
        fill="url(#accentGradient)" 
        opacity="0.9"
      />
      
      {/* Central highlight - represents the "tip" concept */}
      <circle cx="20" cy="14" r="2" fill="white" opacity="0.8" />
      
      {/* Simplified directional elements - representing flow/movement */}
      <path 
        d="M20 20L18 24L20 22L22 24L20 20Z" 
        fill="url(#accentGradient)" 
        opacity="0.7"
        filter="url(#dropShadow)"
      />
      
      {/* Subtle corner accents - representing the "shard" concept */}
      <circle cx="14" cy="10" r="1" fill="white" opacity="0.4" />
      <circle cx="26" cy="10" r="1" fill="white" opacity="0.4" />
      <circle cx="14" cy="18" r="1" fill="white" opacity="0.4" />
      <circle cx="26" cy="18" r="1" fill="white" opacity="0.4" />
    </svg>
  )
}
