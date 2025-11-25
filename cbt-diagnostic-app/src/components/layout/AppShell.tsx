import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../../stores/useAppStore'
import { MobileNav } from './MobileNav'
import { HistoryCenter } from '../views/HistoryCenter'
import { ProfileCenter } from '../views/ProfileCenter'
import { TherapyToolbox } from '../features/TherapyToolbox'
import { RelaxTools } from '../features/RelaxTools'
import { cn } from '../../lib/utils'

// ========================================
// 工具箱页面
// ========================================
function ToolsPage() {
  const [toolSection, setToolSection] = useState<'therapy' | 'relax'>('therapy')
  
  return (
    <div className="space-y-6 pb-20">
      {/* 切换标签 */}
      <div className="flex bg-slate-100 rounded-xl p-1">
        <button
          onClick={() => setToolSection('therapy')}
          className={cn(
            "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all",
            toolSection === 'therapy'
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500"
          )}
        >
          心理疗法
        </button>
        <button
          onClick={() => setToolSection('relax')}
          className={cn(
            "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all",
            toolSection === 'relax'
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500"
          )}
        >
          放松工具
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={toolSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {toolSection === 'therapy' ? <TherapyToolbox /> : <RelaxTools />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ========================================
// App Shell Props
// ========================================
interface AppShellProps {
  children: React.ReactNode // 主页内容（评估流程）
  showNav?: boolean
}

// ========================================
// 主组件
// ========================================
export function AppShell({ children, showNav = true }: AppShellProps) {
  const activeTab = useAppStore((s) => s.activeTab)

  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return children
      case 'tools':
        return <ToolsPage />
      case 'history':
        return <HistoryCenter />
      case 'profile':
        return <ProfileCenter />
      default:
        return children
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 主内容区域 */}
      <main className={cn(
        "px-4 py-6 max-w-lg mx-auto",
        showNav && "pb-24" // 为底部导航留空间
      )}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 移动端底部导航 */}
      {showNav && <MobileNav />}
    </div>
  )
}
