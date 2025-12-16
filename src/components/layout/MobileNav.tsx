import React from 'react'
import { motion } from 'framer-motion'
import { Home, Sparkles, History, User } from 'lucide-react'
import { useAppStore } from '../../stores/useAppStore'
import { cn } from '../../lib/utils'

type TabId = 'home' | 'tools' | 'history' | 'profile'

interface NavItem {
  id: TabId
  label: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { id: 'home', label: '首页', icon: Home },
  { id: 'tools', label: '工具箱', icon: Sparkles },
  { id: 'history', label: '记录', icon: History },
  { id: 'profile', label: '我的', icon: User },
]

export function MobileNav() {
  const activeTab = useAppStore((s) => s.activeTab)
  const setActiveTab = useAppStore((s) => s.setActiveTab)

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200 pb-safe md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id
          const Icon = item.icon
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "relative flex flex-col items-center justify-center flex-1 h-full py-1",
                "transition-colors touch-manipulation",
                isActive ? "text-sky-600" : "text-slate-400"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-sky-500 rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <Icon className={cn(
                "w-6 h-6 mb-1 transition-transform",
                isActive && "scale-110"
              )} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
