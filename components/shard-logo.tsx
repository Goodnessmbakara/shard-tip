export function ShardLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        <linearGradient id="tipGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#EF4444" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Background circle with gradient */}
      <circle cx="16" cy="16" r="15" fill="url(#shardGradient)" opacity="0.1" />
      
      {/* Main diamond shape representing a shard */}
      <path 
        d="M16 4L24 12L16 20L8 12L16 4Z" 
        fill="url(#shardGradient)" 
        stroke="url(#shardGradient)" 
        strokeWidth="0.5"
        filter="url(#glow)"
      />
      
      {/* Inner diamond representing the tip */}
      <path 
        d="M16 8L20 12L16 16L12 12L16 8Z" 
        fill="url(#tipGradient)" 
        opacity="0.8"
      />
      
      {/* Sparkle effect */}
      <circle cx="16" cy="12" r="1.5" fill="white" opacity="0.9" />
      
      {/* Decorative elements */}
      <circle cx="12" cy="8" r="0.8" fill="white" opacity="0.6" />
      <circle cx="20" cy="8" r="0.8" fill="white" opacity="0.6" />
      <circle cx="12" cy="16" r="0.8" fill="white" opacity="0.6" />
      <circle cx="20" cy="16" r="0.8" fill="white" opacity="0.6" />
      
      {/* Tip arrow pointing up */}
      <path 
        d="M16 18L14 22L16 20L18 22L16 18Z" 
        fill="url(#tipGradient)" 
        opacity="0.7"
      />
    </svg>
  )
}
