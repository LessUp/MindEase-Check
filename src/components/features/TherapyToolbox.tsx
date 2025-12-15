import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Heart, Leaf, Wind, Sparkles } from 'lucide-react'
import { Card } from '../ui/Card'
import type { TherapyTool } from '../../data/therapies'
import { cn } from '../../lib/utils'

interface TherapyToolboxProps {
  recommended: TherapyTool[]
}

const categoryIcons: Record<string, React.ReactNode> = {
  cbt: <Brain className="w-5 h-5" />,
  act: <Heart className="w-5 h-5" />,
  dbt: <Sparkles className="w-5 h-5" />,
  relax: <Wind className="w-5 h-5" />,
  meditation: <Leaf className="w-5 h-5" />,
}

const categoryColors: Record<string, string> = {
  cbt: 'bg-sky-100 text-sky-600 border-sky-200',
  act: 'bg-rose-100 text-rose-600 border-rose-200',
  dbt: 'bg-amber-100 text-amber-600 border-amber-200',
  relax: 'bg-emerald-100 text-emerald-600 border-emerald-200',
  meditation: 'bg-indigo-100 text-indigo-600 border-indigo-200',
}

const categoryLabels: Record<string, string> = {
  cbt: 'CBT',
  act: 'ACT',
  dbt: 'DBT',
  relax: '放松',
  meditation: '冥想',
}

export function TherapyToolbox({ recommended }: TherapyToolboxProps) {
  if (recommended.length === 0) return null

  return (
    <Card className="bg-white border-slate-200 shadow-lg shadow-slate-200/30 overflow-hidden">
      <div className="bg-slate-50/50 border-b border-slate-100 px-6 py-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500" />
          推荐治疗工具
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          根据您的评估结果，以下工具可能对您有帮助
        </p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommended.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white rounded-xl p-4 border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    'p-2 rounded-lg border',
                    categoryColors[tool.category]
                  )}
                >
                  {categoryIcons[tool.category]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-slate-800 truncate">
                      {tool.name}
                    </h4>
                    <span
                      className={cn(
                        'text-xs px-1.5 py-0.5 rounded font-medium',
                        categoryColors[tool.category]
                      )}
                    >
                      {categoryLabels[tool.category]}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2">
                    {tool.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  )
}
