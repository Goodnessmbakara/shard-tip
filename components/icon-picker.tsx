"use client"

import { useState } from "react"
import { Heart, Coins, Sparkles, Users, Zap, Star, X } from "lucide-react"

interface IconPickerProps {
  onIconChange?: (icon: string) => void
}

export function IconPicker({ onIconChange }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIcon, setSelectedIcon] = useState("heart")
  
  const icons = [
    { key: "heart", label: "Heart", icon: Heart, color: "text-pink-500" },
    { key: "coins", label: "Coins", icon: Coins, color: "text-yellow-500" },
    { key: "sparkles", label: "Sparkles", icon: Sparkles, color: "text-purple-500" },
    { key: "users", label: "Users", icon: Users, color: "text-blue-500" },
    { key: "zap", label: "Zap", icon: Zap, color: "text-green-500" },
    { key: "star", label: "Star", icon: Star, color: "text-orange-500" },
    { key: "none", label: "None", icon: null, color: "text-gray-500" }
  ]

  const handleIconSelect = (iconKey: string) => {
    setSelectedIcon(iconKey)
    onIconChange?.(iconKey)
    setIsOpen(false)
  }

  const selectedIconData = icons.find(icon => icon.key === selectedIcon)

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-colors"
        title="Change Icon"
      >
        {selectedIconData?.icon ? (
          <selectedIconData.icon className={`w-6 h-6 ${selectedIconData.color}`} />
        ) : (
          <X className="w-6 h-6 text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-lg p-4 shadow-xl border border-slate-200 dark:border-slate-700 min-w-[200px]">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Choose Icon</h3>
          <div className="grid grid-cols-2 gap-2">
            {icons.map((icon) => (
              <button
                key={icon.key}
                onClick={() => handleIconSelect(icon.key)}
                className={`p-3 rounded-md text-sm transition-all duration-200 flex flex-col items-center space-y-1 ${
                  selectedIcon === icon.key
                    ? "bg-blue-500 text-white"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
              >
                {icon.icon ? (
                  <icon.icon className={`w-5 h-5 ${selectedIcon === icon.key ? 'text-white' : icon.color}`} />
                ) : (
                  <X className={`w-5 h-5 ${selectedIcon === icon.key ? 'text-white' : 'text-gray-500'}`} />
                )}
                <span className="text-xs">{icon.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

