import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, Moon, Heart, Eye, Wind,
  Play, Pause, RotateCcw,
  ChevronRight
} from 'lucide-react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { cn } from '../../lib/utils'

// ========================================
// 引导式冥想 - Guided Meditation
// ========================================
interface MeditationScript {
  id: string
  name: string
  duration: number // seconds
  icon: React.ElementType
  color: string
  phases: {
    time: number // seconds from start
    text: string
  }[]
}

const MEDITATION_SCRIPTS: MeditationScript[] = [
  {
    id: 'body-scan',
    name: '身体扫描',
    duration: 300, // 5 minutes
    icon: Eye,
    color: 'indigo',
    phases: [
      { time: 0, text: '找一个舒适的姿势，可以躺下或坐着。轻轻闭上眼睛。' },
      { time: 15, text: '做几次深呼吸。吸气...呼气...让身体开始放松。' },
      { time: 40, text: '将注意力带到脚趾。感受它们的温度、触感，不需要改变什么。' },
      { time: 70, text: '注意力慢慢向上移动到双脚、脚踝。如果有紧张，想象呼气时它在融化。' },
      { time: 100, text: '继续向上扫描小腿、膝盖、大腿。感受这些部位此刻的状态。' },
      { time: 140, text: '注意力来到腹部和下背部。呼吸时感受腹部的起伏。' },
      { time: 180, text: '扫描胸部、上背部和肩膀。这里常常积累紧张，让它们自然下沉。' },
      { time: 220, text: '注意力流向双臂、手腕和手指。感受手掌的温度。' },
      { time: 250, text: '最后来到颈部、面部和头顶。放松眉头、下巴、舌头。' },
      { time: 280, text: '现在感受整个身体作为一个整体。与身体同在。' },
      { time: 295, text: '准备好后，慢慢睁开眼睛，带着这份觉察回到当下。' },
    ],
  },
  {
    id: 'loving-kindness',
    name: '慈悲冥想',
    duration: 300,
    icon: Heart,
    color: 'rose',
    phases: [
      { time: 0, text: '舒适地坐着，闭上眼睛。将一只手放在心口，感受那里的温暖。' },
      { time: 20, text: '首先对自己说：愿我平安。愿我健康。愿我快乐。愿我生活安稳。' },
      { time: 50, text: '再次默念：愿我平安...愿我健康...愿我快乐...愿我生活安稳...' },
      { time: 90, text: '现在想象一个你爱的人站在面前。对他/她说同样的话：' },
      { time: 110, text: '愿你平安。愿你健康。愿你快乐。愿你生活安稳。' },
      { time: 150, text: '想象这份善意像温暖的光芒，从你心中流向对方。' },
      { time: 180, text: '现在扩展到一个中性的人——也许是邻居或同事。愿他们平安...' },
      { time: 220, text: '如果你愿意，可以扩展到一个困难的人。这不容易，但尝试祝愿他们幸福。' },
      { time: 260, text: '最后，将这份善意扩展到所有生命：愿所有众生平安、健康、快乐。' },
      { time: 290, text: '深呼吸，感受心中的温暖。准备好后，慢慢睁开眼睛。' },
    ],
  },
  {
    id: 'breath-focus',
    name: '呼吸觉察',
    duration: 180, // 3 minutes
    icon: Wind,
    color: 'sky',
    phases: [
      { time: 0, text: '舒适地坐着，脊椎自然挺直。轻轻闭上眼睛。' },
      { time: 15, text: '开始注意你的呼吸。不需要改变它，只是观察。' },
      { time: 35, text: '注意空气从鼻腔进入的感觉。凉凉的、流动的。' },
      { time: 55, text: '感受胸部和腹部随呼吸起伏。吸气时扩张，呼气时收缩。' },
      { time: 80, text: '如果思绪漫游了，这是正常的。温柔地将注意力带回呼吸。' },
      { time: 100, text: '每一次呼气，让身体更放松一点。' },
      { time: 120, text: '继续与呼吸同在。吸气...呼气...' },
      { time: 150, text: '感谢自己花这几分钟照顾自己。' },
      { time: 170, text: '准备好后，慢慢睁开眼睛，带着平静回到活动中。' },
    ],
  },
]

const GuidedMeditation = () => {
  const [selectedScript, setSelectedScript] = useState<MeditationScript | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [time, setTime] = useState(0)

  const currentPhase = useMemo(() => {
    if (!selectedScript) return 0
    const phase = selectedScript.phases.findIndex((p, i) => {
      const next = selectedScript.phases[i + 1]
      return time >= p.time && (!next || time < next.time)
    })
    return phase >= 0 ? phase : 0
  }, [selectedScript, time])

  useEffect(() => {
    if (!isPlaying || !selectedScript) return
    if (time >= selectedScript.duration) return

    const timeout = setTimeout(() => setTime((t) => t + 1), 1000)

    return () => clearTimeout(timeout)
  }, [isPlaying, time, selectedScript])

  const reset = () => {
    setTime(0)
    setIsPlaying(false)
  }

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60)
    const secs = s % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!selectedScript) {
    return (
      <div className="space-y-4">
        <p className="text-center text-slate-600 mb-4">选择一个冥想练习：</p>
        {MEDITATION_SCRIPTS.map((script) => (
          <button
            key={script.id}
            onClick={() => setSelectedScript(script)}
            className={cn(
              "w-full p-4 rounded-xl border transition-all flex items-center gap-4",
              "hover:shadow-md hover:border-slate-300 bg-white"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              `bg-${script.color}-100`
            )}>
              <script.icon className={cn("w-6 h-6", `text-${script.color}-500`)} />
            </div>
            <div className="text-left flex-1">
              <h4 className="font-bold text-slate-800">{script.name}</h4>
              <p className="text-sm text-slate-500">{Math.floor(script.duration / 60)} 分钟</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
        ))}
      </div>
    )
  }

  const progress = (time / selectedScript.duration) * 100
  const isActivePlaying = isPlaying && time < selectedScript.duration

  const togglePlay = () => {
    if (isActivePlaying) {
      setIsPlaying(false)
      return
    }

    if (time >= selectedScript.duration) {
      setTime(0)
    }

    setIsPlaying(true)
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => { setSelectedScript(null); reset() }}
        className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
      >
        ← 返回选择
      </button>

      <div className="text-center">
        <h4 className="text-xl font-bold text-slate-800 mb-2">{selectedScript.name}</h4>
        <div className="text-3xl font-mono text-slate-600 mb-4">
          {formatTime(time)} / {formatTime(selectedScript.duration)}
        </div>
        
        {/* Progress bar */}
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-6">
          <motion.div
            className={cn("h-full rounded-full", `bg-${selectedScript.color}-500`)}
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Current instruction */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={cn(
            "p-6 rounded-xl text-center min-h-[120px] flex items-center justify-center",
            `bg-${selectedScript.color}-50`
          )}
        >
          <p className={cn("text-lg leading-relaxed", `text-${selectedScript.color}-800`)}>
            {selectedScript.phases[currentPhase]?.text}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-center gap-4">
        <Button
          onClick={togglePlay}
          size="lg"
          className={cn(
            "rounded-full w-16 h-16",
            isActivePlaying ? "bg-amber-500 hover:bg-amber-600" : `bg-${selectedScript.color}-500`
          )}
        >
          {isActivePlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={reset}
          className="rounded-full w-16 h-16"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}

// ========================================
// 5-4-3-2-1 感官练习
// ========================================
const SensoryExercise = () => {
  const [step, setStep] = useState(0)
  const [items, setItems] = useState<string[][]>([[], [], [], [], []])

  const senses = [
    { count: 5, sense: '看到', icon: '👁️', prompt: '注意周围5样你能看到的东西', color: 'bg-blue-50 border-blue-200' },
    { count: 4, sense: '触摸', icon: '✋', prompt: '感受4样你能触摸到的东西', color: 'bg-green-50 border-green-200' },
    { count: 3, sense: '听到', icon: '👂', prompt: '倾听3种你能听到的声音', color: 'bg-purple-50 border-purple-200' },
    { count: 2, sense: '闻到', icon: '👃', prompt: '注意2种你能闻到的气味', color: 'bg-orange-50 border-orange-200' },
    { count: 1, sense: '尝到', icon: '👅', prompt: '品味1样你能尝到的味道', color: 'bg-pink-50 border-pink-200' },
  ]

  const addItem = (text: string) => {
    if (!text.trim()) return
    setItems(prev => {
      const newItems = [...prev]
      if (newItems[step].length < senses[step].count) {
        newItems[step] = [...newItems[step], text]
      }
      return newItems
    })
  }

  const currentFilled = items[step].length
  const currentNeeded = senses[step].count
  const canProceed = currentFilled >= currentNeeded

  if (step >= senses.length) {
    return (
      <div className="text-center space-y-4 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
        <div className="text-4xl">🎉</div>
        <h4 className="font-bold text-indigo-700 text-xl">你回到了当下</h4>
        <p className="text-slate-600">
          通过感官觉察，你成功地将注意力从忧虑带回此刻。
          感受此刻的平静。
        </p>
        <Button variant="outline" onClick={() => { setStep(0); setItems([[], [], [], [], []]) }}>
          <RotateCcw className="w-4 h-4 mr-2" />
          重新练习
        </Button>
      </div>
    )
  }

  const current = senses[step]

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-2">
        {senses.map((s, i) => (
          <div
            key={i}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
              i === step ? "bg-indigo-500 text-white scale-110" :
              i < step ? "bg-indigo-200 text-indigo-700" : "bg-slate-100 text-slate-400"
            )}
          >
            {s.count}
          </div>
        ))}
      </div>

      <div className={cn("p-6 rounded-xl border", current.color)}>
        <div className="text-4xl text-center mb-3">{current.icon}</div>
        <h4 className="text-lg font-bold text-center text-slate-800 mb-2">
          {current.prompt}
        </h4>
        <p className="text-sm text-slate-500 text-center mb-4">
          已记录 {currentFilled} / {current.count}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {items[step].map((item, i) => (
            <span key={i} className="px-3 py-1 bg-white rounded-full text-sm border">
              {item}
            </span>
          ))}
        </div>

        {!canProceed && (
          <input
            type="text"
            placeholder={`我${current.sense}...`}
            className="w-full p-3 border rounded-lg"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addItem((e.target as HTMLInputElement).value)
                ;(e.target as HTMLInputElement).value = ''
              }
            }}
          />
        )}
      </div>

      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          上一步
        </Button>
        <Button
          onClick={() => setStep(s => s + 1)}
          disabled={!canProceed}
        >
          {step === senses.length - 1 ? '完成' : '下一步'}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}

// ========================================
// 主组件
// ========================================
type MeditationTab = 'guided' | 'sensory'

export function MeditationTools() {
  const [activeTab, setActiveTab] = useState<MeditationTab>('guided')

  const tabs = [
    { id: 'guided' as const, name: '引导冥想', icon: Sparkles },
    { id: 'sensory' as const, name: '5-4-3-2-1', icon: Eye },
  ]

  return (
    <Card className="bg-white border-slate-200 shadow-lg overflow-hidden">
      <div className="bg-indigo-50/50 border-b border-indigo-100 px-6 py-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Moon className="w-5 h-5 text-indigo-500" />
          正念冥想
        </h3>
        <p className="text-sm text-slate-500 mt-1">活在当下，觉察此刻</p>
      </div>

      <div className="flex border-b border-slate-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 py-3 px-4 text-sm font-medium transition-colors relative",
              activeTab === tab.id 
                ? "text-indigo-600 bg-indigo-50/50" 
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <span className="flex items-center justify-center gap-2">
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500" />
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
          >
            {activeTab === 'guided' && <GuidedMeditation />}
            {activeTab === 'sensory' && <SensoryExercise />}
          </motion.div>
        </AnimatePresence>
      </div>
    </Card>
  )
}
