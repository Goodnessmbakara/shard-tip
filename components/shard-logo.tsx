export function ShardLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0070F3" />
          <stop offset="100%" stopColor="#00BFFF" />
        </linearGradient>
      </defs>
      <path d="M16 2L26 8v6c0 8-6 14-10 16-4-2-10-8-10-16V8l10-6z" fill="url(#shardGradient)" stroke="none" />
      <circle cx="16" cy="12" r="3" fill="white" opacity="0.9" />
      <path d="M13 12h6v8c0 1.5-1.5 3-3 3s-3-1.5-3-3v-8z" fill="white" opacity="0.7" />
    </svg>
  )
}
