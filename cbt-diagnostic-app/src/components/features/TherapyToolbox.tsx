import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, Scale, Compass, Users, Eye, Moon, 
  ChevronRight, BookOpen, Sparkles, Info, X
} from 'lucide-react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { cn } from '../../lib/utils'
import { CbtTools } from './CbtTools'
import { DbtTools } from './DbtTools'
import { ActTools } from './ActTools'
import { MeditationTools } from './MeditationTools'
import { ALL_THERAPIES, type TherapyType } from '../../data/therapies'

interface TherapyToolboxProps {
  recommended?: TherapyType[]
}

export function TherapyToolbox({ recommended = [] }: TherapyToolboxProps) {
  const [selectedTherapy, setSelectedTherapy] = useState<TherapyType | null>(null)
  const [showInfo, setShowInfo] = useState<TherapyType | null>(null)

  const therapyOptions = [
    { 
      id: 'CBT' as TherapyType, 
      name: 'CBT 认知行为', 
      icon: Brain, 
      color: 'blue',
      description: '改变思维模式',
      component: CbtTools 
    },
    { 
      id: 'DBT' as TherapyType, 
      name: 'DBT 辩证行为', 
      icon: Scale, 
      color: 'purple',
      description: '接纳与改变',
      component: DbtTools 
    },
    { 
      id: 'ACT' as TherapyType, 
      name: 'ACT 接纳承诺', 
      icon: Compass, 
      color: 'green',
      description: '心理灵活性',
      component: ActTools 
    },
    { 
      id: 'Mindfulness' as TherapyType, 
      name: '正念冥想', 
      icon: Moon, 
      color: 'indigo',
      description: '活在当下',
      component: MeditationTools 
    },
  ]

  const getColorClasses = (color: string, isActive: boolean) => {
    const colors: Record<string, { bg: string; text: string; border: string; activeBg: string }> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', activeBg: 'bg-blue-100' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', activeBg: 'bg-purple-100' },
      green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200', activeBg: 'bg-green-100' },
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200', activeBg: 'bg-indigo-100' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', activeBg: 'bg-orange-100' },
      teal: { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-200', activeBg: 'bg-teal-100' },
    }
    const c = colors[color] || colors.blue
    return isActive ? `${c.activeBg} ${c.border} ${c.text} ring-2 ring-${color}-400` : `${c.bg} ${c.border} hover:${c.activeBg}`
  }

  // 获取疗法详细信息
  const therapyInfo = showInfo ? ALL_THERAPIES.find(t => t.id === showInfo) : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-amber-500" />
          心理疗法工具箱
        </h2>
        <p className="text-slate-600">
          基于循证心理学研究，选择适合你的练习
        </p>
        {recommended.length > 0 && (
          <p className="text-sm text-emerald-600 mt-2">
            ✨ 根据你的评估结果，我们推荐：{recommended.join('、')}
          </p>
        )}
      </div>

      {/* Therapy Selection Grid */}
      {!selectedTherapy && (
        <div className="grid grid-cols-2 gap-4">
          {therapyOptions.map((therapy) => {
            const isRecommended = recommended.includes(therapy.id)
            return (
              <motion.button
                key={therapy.id}
                onClick={() => setSelectedTherapy(therapy.id)}
                className={cn(
                  "p-4 rounded-xl border-2 text-left transition-all relative",
                  "hover:shadow-lg hover:-translate-y-1",
                  getColorClasses(therapy.color, false)
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isRecommended && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-white text-xs px-2 py-0.5 rounded-full">
                    推荐
                  </span>
                )}
                <therapy.icon className={cn("w-8 h-8 mb-2", `text-${therapy.color}-500`)} />
                <h3 className="font-bold text-slate-800 mb-1">{therapy.name}</h3>
                <p className="text-sm text-slate-500">{therapy.description}</p>
                
                {/* Info button */}
                <button
                  onClick={(e) => { e.stopPropagation(); setShowInfo(therapy.id) }}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/50"
                >
                  <Info className="w-4 h-4 text-slate-400" />
                </button>
              </motion.button>
            )
          })}
        </div>
      )}

      {/* Selected Therapy Component */}
      <AnimatePresence mode="wait">
        {selectedTherapy && (
          <motion.div
            key={selectedTherapy}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Button 
              variant="ghost" 
              onClick={() => setSelectedTherapy(null)}
              className="mb-4"
            >
              ← 返回工具箱
            </Button>
            {therapyOptions.find(t => t.id === selectedTherapy)?.component && (
              React.createElement(therapyOptions.find(t => t.id === selectedTherapy)!.component)
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Therapy Info Modal */}
      <AnimatePresence>
        {showInfo && therapyInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowInfo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                <h3 className="font-bold text-lg">{therapyInfo.fullName}</h3>
                <button onClick={() => setShowInfo(null)} className="p-2 hover:bg-slate-100 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <p className="text-slate-600">{therapyInfo.description}</p>
                
                <div>
                  <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    核心原则
                  </h4>
                  <ul className="space-y-1">
                    {therapyInfo.keyPrinciples.map((p, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-emerald-500 mt-1">•</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">适用于</h4>
                  <div className="flex flex-wrap gap-2">
                    {therapyInfo.bestFor.map((b, i) => (
                      <span key={i} className="px-2 py-1 bg-slate-100 rounded-full text-xs text-slate-600">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">包含技术</h4>
                  <div className="space-y-2">
                    {therapyInfo.techniques.slice(0, 3).map((t) => (
                      <div key={t.id} className="p-3 bg-slate-50 rounded-lg">
                        <div className="font-medium text-slate-800">{t.name}</div>
                        <div className="text-sm text-slate-500">{t.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => { setShowInfo(null); setSelectedTherapy(therapyInfo.id) }}
                  className="w-full"
                >
                  开始练习
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
