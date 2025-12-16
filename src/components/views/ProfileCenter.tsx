import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, Moon, Sun, Bell, Shield, Download,
  Upload, Trash2, ChevronRight, Cloud, Smartphone,
  HelpCircle, Heart
} from 'lucide-react'
import { useAppStore } from '../../stores/useAppStore'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { cn } from '../../lib/utils'

// ========================================
// 设置项组件
// ========================================
interface SettingItemProps {
  icon: React.ElementType
  label: string
  description?: string
  value?: React.ReactNode
  onClick?: () => void
  danger?: boolean
}

function SettingItem({ icon: Icon, label, description, value, onClick, danger }: SettingItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 p-4 rounded-xl transition-colors text-left",
        onClick ? "hover:bg-slate-50 active:bg-slate-100" : "",
        danger && "hover:bg-rose-50"
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
        danger ? "bg-rose-100 text-rose-500" : "bg-slate-100 text-slate-500"
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className={cn("font-medium", danger ? "text-rose-600" : "text-slate-800")}>
          {label}
        </div>
        {description && (
          <div className="text-sm text-slate-500 truncate">{description}</div>
        )}
      </div>
      {value !== undefined ? (
        <div className="text-sm text-slate-500">{value}</div>
      ) : onClick && (
        <ChevronRight className="w-5 h-5 text-slate-300" />
      )}
    </button>
  )
}

// ========================================
// 开关组件
// ========================================
interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

function Toggle({ checked, onChange, disabled }: ToggleProps) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={cn(
        "relative w-12 h-7 rounded-full transition-colors",
        checked ? "bg-sky-500" : "bg-slate-200",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <motion.div
        animate={{ x: checked ? 22 : 2 }}
        className="absolute top-1 w-5 h-5 bg-white rounded-full shadow"
      />
    </button>
  )
}

// ========================================
// 主题选择器
// ========================================
function ThemeSelector() {
  const preferences = useAppStore((s) => s.preferences)
  const setPreferences = useAppStore((s) => s.setPreferences)
  
  const themes = [
    { id: 'light', icon: Sun, label: '浅色' },
    { id: 'dark', icon: Moon, label: '深色' },
    { id: 'system', icon: Smartphone, label: '跟随系统' },
  ] as const

  return (
    <div className="grid grid-cols-3 gap-2 p-4">
      {themes.map(theme => (
        <button
          key={theme.id}
          onClick={() => setPreferences({ theme: theme.id })}
          className={cn(
            "flex flex-col items-center gap-2 p-3 rounded-xl transition-all",
            preferences.theme === theme.id
              ? "bg-sky-100 text-sky-600 ring-2 ring-sky-400"
              : "bg-slate-50 text-slate-500 hover:bg-slate-100"
          )}
        >
          <theme.icon className="w-6 h-6" />
          <span className="text-xs font-medium">{theme.label}</span>
        </button>
      ))}
    </div>
  )
}

// ========================================
// 数据管理
// ========================================
function DataManagement() {
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const assessments = useAppStore((s) => s.assessments)

  const exportData = () => {
    const data = {
      assessments: useAppStore.getState().assessments,
      moods: useAppStore.getState().moods,
      preferences: useAppStore.getState().preferences,
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mindease-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearData = () => {
    useAppStore.setState({ assessments: [], moods: [] })
    setShowClearConfirm(false)
  }

  return (
    <div className="space-y-2">
      <SettingItem
        icon={Download}
        label="导出数据"
        description={`${assessments.length} 条评估记录`}
        onClick={exportData}
      />
      <SettingItem
        icon={Upload}
        label="导入数据"
        description="从备份文件恢复"
        onClick={() => {/* TODO */}}
      />
      
      {!showClearConfirm ? (
        <SettingItem
          icon={Trash2}
          label="清除所有数据"
          description="此操作不可撤销"
          onClick={() => setShowClearConfirm(true)}
          danger
        />
      ) : (
        <div className="p-4 bg-rose-50 rounded-xl">
          <p className="text-sm text-rose-700 mb-3">确定要清除所有数据吗？此操作不可撤销。</p>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => setShowClearConfirm(false)}>
              取消
            </Button>
            <Button size="sm" className="bg-rose-500 hover:bg-rose-600" onClick={clearData}>
              确认清除
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// ========================================
// 主组件
// ========================================
export function ProfileCenter() {
  const preferences = useAppStore((s) => s.preferences)
  const setPreferences = useAppStore((s) => s.setPreferences)
  const assessments = useAppStore((s) => s.assessments)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const stats = {
    totalAssessments: assessments.length,
    streakDays: 0, // TODO: 计算连续使用天数
  }

  return (
    <div className="space-y-6 pb-20">
      {/* 用户卡片 */}
      <Card className="bg-gradient-to-br from-sky-500 to-indigo-600 text-white overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">心灵驿客</h2>
            <p className="text-white/80 text-sm">关爱自己，从心开始</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/20">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.totalAssessments}</div>
            <div className="text-xs text-white/70">评估次数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.streakDays}</div>
            <div className="text-xs text-white/70">连续天数</div>
          </div>
        </div>
      </Card>

      {/* 同步状态 */}
      <Card className="bg-amber-50 border-amber-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
            <Cloud className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-amber-800">数据仅保存在本地</div>
            <div className="text-xs text-amber-600">登录账号可同步到云端</div>
          </div>
          <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">
            登录
          </Button>
        </div>
      </Card>

      {/* 设置列表 */}
      <Card>
        <h3 className="font-bold text-slate-800 mb-2 px-4 pt-2">偏好设置</h3>
        
        {/* 主题 */}
        <div className="border-b border-slate-100">
          <button
            onClick={() => setActiveSection(activeSection === 'theme' ? null : 'theme')}
            className="w-full flex items-center gap-4 p-4"
          >
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              {preferences.theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-slate-800">主题</div>
              <div className="text-sm text-slate-500">
                {preferences.theme === 'light' ? '浅色' : preferences.theme === 'dark' ? '深色' : '跟随系统'}
              </div>
            </div>
            <ChevronRight className={cn(
              "w-5 h-5 text-slate-300 transition-transform",
              activeSection === 'theme' && "rotate-90"
            )} />
          </button>
          <AnimatePresence>
            {activeSection === 'theme' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <ThemeSelector />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 通知 */}
        <div className="flex items-center gap-4 p-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
            <Bell className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-slate-800">提醒通知</div>
            <div className="text-sm text-slate-500">每日提醒记录心情</div>
          </div>
          <Toggle
            checked={preferences.enableNotifications}
            onChange={(v) => setPreferences({ enableNotifications: v })}
          />
        </div>

        {/* 本地存储 */}
        <div className="flex items-center gap-4 p-4">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
            <Shield className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-slate-800">本地存储</div>
            <div className="text-sm text-slate-500">保存评估记录到设备</div>
          </div>
          <Toggle
            checked={preferences.enableLocalStorage}
            onChange={(v) => setPreferences({ enableLocalStorage: v })}
          />
        </div>
      </Card>

      {/* 数据管理 */}
      <Card>
        <h3 className="font-bold text-slate-800 mb-2 px-4 pt-2">数据管理</h3>
        <DataManagement />
      </Card>

      {/* 关于 */}
      <Card>
        <h3 className="font-bold text-slate-800 mb-2 px-4 pt-2">关于</h3>
        <SettingItem
          icon={HelpCircle}
          label="使用指南"
          onClick={() => {}}
        />
        <SettingItem
          icon={Shield}
          label="隐私政策"
          onClick={() => {}}
        />
        <SettingItem
          icon={Heart}
          label="关于我们"
          description="MindEase v1.0.0"
          onClick={() => {}}
        />
      </Card>

      {/* 免责声明 */}
      <p className="text-xs text-slate-400 text-center px-4">
        本应用仅供心理健康自评参考，不能替代专业诊断。
        如有严重心理困扰，请及时寻求专业帮助。
      </p>
    </div>
  )
}
