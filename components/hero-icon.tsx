import { motion } from "framer-motion"
import { Heart, Coins, Sparkles, Users, Zap, Star } from "lucide-react"

interface HeroIconProps {
  variant?: 'heart' | 'coins' | 'sparkles' | 'users' | 'zap' | 'star' | 'none'
  className?: string
}

export function HeroIcon({ variant = 'heart', className = "w-24 h-24" }: HeroIconProps) {
  const iconProps = {
    className: className,
    strokeWidth: 1.5
  }

  const variants = {
    heart: (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        <Heart 
          {...iconProps} 
          className={`${iconProps.className} text-pink-500`}
        />
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-pink-500/20 rounded-full blur-xl"
        />
      </motion.div>
    ),
    
    coins: (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        <Coins 
          {...iconProps} 
          className={`${iconProps.className} text-yellow-500`}
        />
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl"
        />
      </motion.div>
    ),
    
    sparkles: (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        <Sparkles 
          {...iconProps} 
          className={`${iconProps.className} text-purple-500`}
        />
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl"
        />
      </motion.div>
    ),
    
    users: (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        <Users 
          {...iconProps} 
          className={`${iconProps.className} text-blue-500`}
        />
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl"
        />
      </motion.div>
    ),
    
    zap: (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        <Zap 
          {...iconProps} 
          className={`${iconProps.className} text-green-500`}
        />
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"
        />
      </motion.div>
    ),
    
    star: (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        <Star 
          {...iconProps} 
          className={`${iconProps.className} text-orange-500`}
        />
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl"
        />
      </motion.div>
    ),
    
    none: null
  }

  return variants[variant]
}

