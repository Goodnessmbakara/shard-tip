/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  // Reduce bundle size
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Fix for server-side rendering issues with WalletConnect
      config.externals.push({
        'pino-pretty': 'commonjs pino-pretty',
      })
    }
    
    // Fix for indexedDB not defined error
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    
    return config
  },
  serverExternalPackages: ['@walletconnect/ethereum-provider'],
}

export default nextConfig