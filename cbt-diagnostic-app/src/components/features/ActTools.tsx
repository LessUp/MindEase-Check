import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Compass, Cloud, Anchor, Target, Eye,
  ChevronRight, Check, RefreshCw, Sparkles
} from 'lucide-react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { cn } from '../../lib/utils'

// ========================================
// 认知解离 - Cognitive Defusion
// ========================================
const DefusionExercise = () => {
  const [thought, setThought] = useState('')
  const [step, setStep] = useState(0)
  const [completed, setCompleted] = useState(false)

  const techniques = [
    {
      name: '添加前缀',
      instruction: '在想法前加上"我注意到我在想..."',
      transform: (t: string) => `我注意到我在想：${t}`,
    },
    {
      name: '歌唱技术',
      instruction: '想象用生日歌的旋律唱出这个想法',
      transform: (t: string) => `🎵 ${t} 🎵`,
    },
    {
      name: '云朵意象',
      instruction: '想象这个想法写在一朵云上，正在飘走',
      transform: (t: string) => `☁️ "${t}" 正在远去...`,
    },
    {
      name: '感谢大脑',
      instruction: '对大脑说"谢谢你分享这个想法"，然后继续',
      transform: (t: string) => `谢谢你，大脑。我注意到了"${t}"。现在我选择继续做重要的事。`,
    },
  ]

  const reset = () => {
    setThought('')
    setStep(0)
    setCompleted(false)
  }

  if (completed) {
    return (
      <div className="text-center space-y-4 p-6 bg-green-50 rounded-xl">
        <Cloud className="w-12 h-12 text-green-500 mx-auto" />
        <h4 className="font-bold text-green-700">练习完成</h4>
        <p className="text-slate-600">
          记住：你不是你的想法。想法只是大脑产生的语言事件，
          你可以选择与它们保持距离。
        </p>
        <Button variant="outline" onClick={reset}>
          <RefreshCw className="w-4 h-4 mr-2" />
          再试一次
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {step === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div className="text-center">
            <Cloud className="w-10 h-10 text-sky-500 mx-auto mb-3" />
            <h4 className="font-bold text-slate-800 mb-2">认知解离练习</h4>
            <p className="text-sm text-slate-600">
              写下一个困扰你的想法，然后学习与它保持距离
            </p>
          </div>
          <textarea
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            placeholder="例如：我不够好、我会失败、没人喜欢我..."
            className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-300 focus:outline-none"
            rows={3}
          />
          <Button 
            onClick={() => setStep(1)} 
            disabled={!thought.trim()}
            className="w-full"
          >
            开始解离练习
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="flex justify-center gap-2 mb-4">
              {techniques.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "w-2 h-2 rounded-full",
                    idx + 1 === step ? "bg-sky-500" : idx + 1 < step ? "bg-sky-300" : "bg-slate-200"
                  )}
                />
              ))}
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500">原始想法：</p>
              <p className="text-slate-700 italic">"{thought}"</p>
            </div>

            <div className="p-5 bg-sky-50 rounded-xl">
              <h5 className="font-bold text-sky-700 mb-2">
                技术 {step}: {techniques[step - 1].name}
              </h5>
              <p className="text-slate-600 mb-4">{techniques[step - 1].instruction}</p>
              <div className="p-3 bg-white rounded-lg border border-sky-200">
                <p className="text-slate-800">{techniques[step - 1].transform(thought)}</p>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(s => s - 1)}>
                上一步
              </Button>
              {step < techniques.length ? (
                <Button onClick={() => setStep(s => s + 1)}>
                  下一个技术
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={() => setCompleted(true)}>
                  <Check className="w-4 h-4 mr-2" />
                  完成
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}

// ========================================
// 抛锚技术 - ACE Dropping Anchor
// ========================================
const AnchorExercise = () => {
  const [phase, setPhase] = useState<'A' | 'C' | 'E' | 'complete'>('A')

  const phases = {
    A: {
      letter: 'A',
      title: 'Acknowledge 承认',
      instruction: '注意此刻你内心正在发生什么。给你的想法和感受命名。',
      prompt: '"我注意到我正在感到_____，我的大脑正在告诉我_____"',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    C: {
      letter: 'C',
      title: 'Connect 连接',
      instruction: '将注意力带回身体。感受你的双脚踩在地面上，你的身体与椅子接触的感觉。',
      prompt: '轻轻按压双脚，感受地面的支撑。缓慢伸展身体。',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    E: {
      letter: 'E',
      title: 'Engage 投入',
      instruction: '环顾四周。注意5样你能看到的东西。用心观察当下的环境。',
      prompt: '然后，将注意力带回你正在做的事情，全心投入当下。',
      color: 'bg-sky-50 text-sky-700 border-sky-200',
    },
  }

  const getNextPhase = () => {
    if (phase === 'A') return 'C'
    if (phase === 'C') return 'E'
    return 'complete'
  }

  if (phase === 'complete') {
    return (
      <div className="text-center space-y-4 p-6 bg-indigo-50 rounded-xl">
        <Anchor className="w-12 h-12 text-indigo-500 mx-auto" />
        <h4 className="font-bold text-indigo-700">锚已抛下</h4>
        <p className="text-slate-600">
          你成功地稳定了自己。记住：抛锚不是要消除情绪风暴，
          而是让你在风暴中保持稳定，不被冲走。
        </p>
        <Button variant="outline" onClick={() => setPhase('A')}>
          <RefreshCw className="w-4 h-4 mr-2" />
          再次练习
        </Button>
      </div>
    )
  }

  const current = phases[phase]

  return (
    <div className="space-y-6">
      <div className="flex justify-center items-center gap-4 mb-6">
        {(['A', 'C', 'E'] as const).map((p) => (
          <div
            key={p}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all",
              phase === p ? `${phases[p].color} ring-2 ring-offset-2 ring-current scale-110` : "bg-slate-100 text-slate-400"
            )}
          >
            {p}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={cn("p-6 rounded-xl border", current.color)}
        >
          <h4 className="text-xl font-bold mb-3">{current.title}</h4>
          <p className="mb-4">{current.instruction}</p>
          <p className="text-sm italic opacity-80">{current.prompt}</p>
        </motion.div>
      </AnimatePresence>

      <Button onClick={() => setPhase(getNextPhase())} className="w-full">
        {phase === 'E' ? '完成抛锚' : '下一步'}
        <ChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  )
}

// ========================================
// 价值澄清 - Values Clarification
// ========================================
const ValuesExercise = () => {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const [values, setValues] = useState<Record<string, string>>({})

  const domains = [
    { id: 'family', name: '家庭', icon: '👨‍👩‍👧‍👦', prompt: '你希望成为什么样的家人？' },
    { id: 'work', name: '工作/学业', icon: '💼', prompt: '工作对你意味着什么？' },
    { id: 'health', name: '身心健康', icon: '❤️', prompt: '你如何照顾自己？' },
    { id: 'relationships', name: '人际关系', icon: '🤝', prompt: '你想成为什么样的朋友？' },
    { id: 'growth', name: '个人成长', icon: '🌱', prompt: '你想学习或发展什么？' },
    { id: 'leisure', name: '休闲娱乐', icon: '🎨', prompt: '什么让你感到快乐？' },
  ]

  const completedCount = Object.keys(values).length

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <Compass className="w-10 h-10 text-green-500 mx-auto mb-2" />
        <h4 className="font-bold text-slate-800">价值澄清</h4>
        <p className="text-sm text-slate-600">
          点击下方领域，探索对你真正重要的东西
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {domains.map((domain) => (
          <button
            key={domain.id}
            onClick={() => setSelectedDomain(domain.id)}
            className={cn(
              "p-3 rounded-xl text-center transition-all",
              selectedDomain === domain.id
                ? "bg-green-100 ring-2 ring-green-400"
                : values[domain.id]
                ? "bg-green-50 border border-green-200"
                : "bg-slate-50 hover:bg-slate-100"
            )}
          >
            <span className="text-2xl block mb-1">{domain.icon}</span>
            <span className="text-xs font-medium text-slate-700">{domain.name}</span>
            {values[domain.id] && (
              <Check className="w-4 h-4 text-green-500 mx-auto mt-1" />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selectedDomain && (
          <motion.div
            key={selectedDomain}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-green-50 rounded-xl"
          >
            <p className="text-green-700 font-medium mb-3">
              {domains.find(d => d.id === selectedDomain)?.prompt}
            </p>
            <textarea
              value={values[selectedDomain] || ''}
              onChange={(e) => setValues(v => ({ ...v, [selectedDomain]: e.target.value }))}
              placeholder="用一两句话描述你的核心价值..."
              className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-300 focus:outline-none"
              rows={2}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {completedCount > 0 && (
        <div className="p-4 bg-slate-50 rounded-xl">
          <p className="text-sm text-slate-600 mb-2">
            已探索 {completedCount} 个领域
          </p>
          <p className="text-xs text-slate-500">
            价值不是目标——目标可以完成，但价值是持续的方向。
            把价值当作指南针，而不是目的地。
          </p>
        </div>
      )}
    </div>
  )
}

// ========================================
// 主组件 - ACT Tools
// ========================================
type ActTab = 'defusion' | 'anchor' | 'values'

export function ActTools() {
  const [activeTab, setActiveTab] = useState<ActTab>('defusion')

  const tabs = [
    { id: 'defusion' as const, name: '认知解离', icon: Cloud },
    { id: 'anchor' as const, name: '抛锚技术', icon: Anchor },
    { id: 'values' as const, name: '价值澄清', icon: Compass },
  ]

  return (
    <Card className="bg-white border-slate-200 shadow-lg overflow-hidden">
      <div className="bg-green-50/50 border-b border-green-100 px-6 py-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-green-500" />
          ACT 接纳承诺疗法
        </h3>
        <p className="text-sm text-slate-500 mt-1">培养心理灵活性</p>
      </div>

      <div className="flex border-b border-slate-100 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 py-3 px-4 text-sm font-medium transition-colors relative whitespace-nowrap",
              activeTab === tab.id 
                ? "text-green-600 bg-green-50/50" 
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <span className="flex items-center justify-center gap-2">
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500" />
            )}
          </button>
        ))}
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'defusion' && <DefusionExercise />}
            {activeTab === 'anchor' && <AnchorExercise />}
            {activeTab === 'values' && <ValuesExercise />}
          </motion.div>
        </AnimatePresence>
      </div>
    </Card>
  )
}
