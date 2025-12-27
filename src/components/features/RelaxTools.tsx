import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Wind, Music, Waves, TreePine, Coffee, CloudRain,
  Bird, Volume2, VolumeX, Play, Pause, Timer,
  Palette, Sparkles, RotateCcw
} from 'lucide-react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { cn } from '../../lib/utils'

// ========================================
// 呼吸练习 - 增强版
// ========================================
type BreathingPattern = {
  name: string
  inhale: number
  hold1: number
  exhale: number
  hold2: number
  description: string
  color: string
}

const BREATHING_PATTERNS: BreathingPattern[] = [
  { name: '4-7-8放松', inhale: 4, hold1: 7, exhale: 8, hold2: 0, description: '助眠放松', color: 'indigo' },
  { name: '方块呼吸', inhale: 4, hold1: 4, exhale: 4, hold2: 4, description: '平静专注', color: 'sky' },
  { name: '腹式呼吸', inhale: 4, hold1: 2, exhale: 6, hold2: 2, description: '日常减压', color: 'emerald' },
  { name: '能量呼吸', inhale: 2, hold1: 0, exhale: 2, hold2: 0, description: '提神醒脑', color: 'amber' },
]

export function BreathingExercise() {
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(BREATHING_PATTERNS[0])
  const [isRunning, setIsRunning] = useState(false)
  const [phase, setPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale')
  const [countdown, setCountdown] = useState(0)
  const [phaseDuration, setPhaseDuration] = useState(0) // 当前阶段的总时长
  const [cycles, setCycles] = useState(0)
  const [targetCycles, setTargetCycles] = useState(5)

  const phaseLabels = {
    inhale: '吸气',
    hold1: '屏息',
    exhale: '呼气',
    hold2: '屏息',
  }

  useEffect(() => {
    if (!isRunning) return

    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          // 切换到下一阶段
          setPhase(p => {
            const phases: Array<'inhale' | 'hold1' | 'exhale' | 'hold2'> = ['inhale', 'hold1', 'exhale', 'hold2']
            const currentIdx = phases.indexOf(p)
            let nextIdx = (currentIdx + 1) % 4

            // 跳过时长为0的阶段
            while (selectedPattern[phases[nextIdx]] === 0) {
              nextIdx = (nextIdx + 1) % 4
            }

            // 设置下一阶段的时长
            const nextPhase = phases[nextIdx]
            setPhaseDuration(selectedPattern[nextPhase])

            // 完成一个周期
            if (nextIdx === 0) {
              setCycles(cy => {
                if (cy + 1 >= targetCycles) {
                  setIsRunning(false)
                  return 0
                }
                return cy + 1
              })
            }

            return nextPhase
          })
          return selectedPattern[phase === 'hold2' ? 'inhale' :
                 phase === 'inhale' ? 'hold1' :
                 phase === 'hold1' ? 'exhale' : 'hold2'] || 1
        }
        return c - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isRunning, phase, selectedPattern, targetCycles])

  const start = () => {
    setPhase('inhale')
    setCountdown(selectedPattern.inhale)
    setPhaseDuration(selectedPattern.inhale)
    setCycles(0)
    setIsRunning(true)
  }

  const stop = () => {
    setIsRunning(false)
    setCycles(0)
  }

  const circleScale = phase === 'inhale' ? 1.3 : phase === 'exhale' ? 0.8 : 1

  return (
    <div className="space-y-6">
      {/* 模式选择 */}
      <div className="grid grid-cols-2 gap-2">
        {BREATHING_PATTERNS.map(pattern => (
          <button
            key={pattern.name}
            onClick={() => { setSelectedPattern(pattern); stop() }}
            disabled={isRunning}
            className={cn(
              "p-3 rounded-xl text-left transition-all border-2",
              selectedPattern.name === pattern.name
                ? `border-${pattern.color}-400 bg-${pattern.color}-50`
                : "border-transparent bg-slate-50 hover:bg-slate-100",
              isRunning && "opacity-50"
            )}
          >
            <div className="font-bold text-sm text-slate-800">{pattern.name}</div>
            <div className="text-xs text-slate-500">{pattern.description}</div>
          </button>
        ))}
      </div>

      {/* 呼吸动画 */}
      <div className="flex flex-col items-center py-8">
        <motion.div
          key={phase} // 当 phase 改变时重新开始动画
          animate={{ scale: isRunning ? circleScale : 1 }}
          transition={{ duration: phaseDuration, ease: "easeInOut" }}
          className={cn(
            "w-40 h-40 rounded-full flex items-center justify-center",
            `bg-gradient-to-br from-${selectedPattern.color}-200 to-${selectedPattern.color}-400`
          )}
        >
          <div className="text-center text-white">
            {isRunning ? (
              <>
                <div className="text-4xl font-bold">{countdown}</div>
                <div className="text-sm opacity-90">{phaseLabels[phase]}</div>
              </>
            ) : (
              <Wind className="w-12 h-12 opacity-80" />
            )}
          </div>
        </motion.div>

        {isRunning && (
          <div className="mt-4 text-sm text-slate-500">
            周期 {cycles + 1} / {targetCycles}
          </div>
        )}
      </div>

      {/* 控制按钮 */}
      <div className="flex justify-center gap-4">
        {!isRunning ? (
          <>
            <select
              value={targetCycles}
              onChange={(e) => setTargetCycles(Number(e.target.value))}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value={3}>3 周期</option>
              <option value={5}>5 周期</option>
              <option value={10}>10 周期</option>
            </select>
            <Button onClick={start}>
              <Play className="w-4 h-4 mr-2" />
              开始练习
            </Button>
          </>
        ) : (
          <Button variant="outline" onClick={stop}>
            <Pause className="w-4 h-4 mr-2" />
            停止
          </Button>
        )}
      </div>
    </div>
  )
}

// ========================================
// 白噪音播放器 - 增强版
// ========================================
interface SoundOption {
  id: string
  name: string
  icon: React.ElementType
  color: string
  frequency?: number // 用于生成音频
}

const SOUND_OPTIONS: SoundOption[] = [
  { id: 'rain', name: '雨声', icon: CloudRain, color: 'sky' },
  { id: 'ocean', name: '海浪', icon: Waves, color: 'blue' },
  { id: 'forest', name: '森林', icon: TreePine, color: 'emerald' },
  { id: 'birds', name: '鸟鸣', icon: Bird, color: 'amber' },
  { id: 'cafe', name: '咖啡馆', icon: Coffee, color: 'orange' },
  { id: 'wind', name: '微风', icon: Wind, color: 'slate' },
]

export function WhiteNoisePlayer() {
  const [activeSounds, setActiveSounds] = useState<Set<string>>(new Set())
  const [volumes, setVolumes] = useState<Record<string, number>>({})
  const [isMuted, setIsMuted] = useState(false)
  const [timer, setTimer] = useState(0)
  const [timerActive, setTimerActive] = useState(false)

  const toggleSound = (id: string) => {
    setActiveSounds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
        if (!volumes[id]) {
          setVolumes(v => ({ ...v, [id]: 50 }))
        }
      }
      return next
    })
  }

  const setVolume = (id: string, volume: number) => {
    setVolumes(v => ({ ...v, [id]: volume }))
  }

  // 定时器
  useEffect(() => {
    if (!timerActive || timer <= 0) return
    const interval = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          setTimerActive(false)
          setActiveSounds(new Set())
          return 0
        }
        return t - 1
      })
    }, 60000) // 每分钟减1
    return () => clearInterval(interval)
  }, [timerActive, timer])

  const formatTimer = (mins: number) => {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return h > 0 ? `${h}h ${m}m` : `${m}m`
  }

  return (
    <div className="space-y-6">
      {/* 声音网格 */}
      <div className="grid grid-cols-3 gap-3">
        {SOUND_OPTIONS.map(sound => {
          const isActive = activeSounds.has(sound.id)
          const Icon = sound.icon
          return (
            <div key={sound.id} className="space-y-2">
              <button
                onClick={() => toggleSound(sound.id)}
                className={cn(
                  "w-full aspect-square rounded-xl flex flex-col items-center justify-center transition-all",
                  isActive
                    ? `bg-${sound.color}-100 text-${sound.color}-600 ring-2 ring-${sound.color}-400`
                    : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                )}
              >
                <Icon className="w-8 h-8 mb-1" />
                <span className="text-xs font-medium">{sound.name}</span>
              </button>
              {isActive && (
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volumes[sound.id] || 50}
                  onChange={(e) => setVolume(sound.id, Number(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              )}
            </div>
          )
        })}
      </div>

      {/* 控制栏 */}
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={cn(
              "p-2 rounded-lg transition-colors",
              isMuted ? "bg-rose-100 text-rose-500" : "bg-slate-200 text-slate-600"
            )}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <div className="text-sm text-slate-600">
            {activeSounds.size > 0 ? `${activeSounds.size} 个声音` : '选择声音'}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-slate-400" />
          <select
            value={timer}
            onChange={(e) => {
              const v = Number(e.target.value)
              setTimer(v)
              setTimerActive(v > 0)
            }}
            className="px-2 py-1 text-sm border rounded-lg"
          >
            <option value={0}>不限时</option>
            <option value={15}>15分钟</option>
            <option value={30}>30分钟</option>
            <option value={60}>1小时</option>
          </select>
        </div>
      </div>

      {timerActive && timer > 0 && (
        <div className="text-center text-sm text-slate-500">
          剩余 {formatTimer(timer)}
        </div>
      )}

      <p className="text-xs text-slate-400 text-center">
        提示：可以混合多种声音创建你的专属环境音
      </p>
    </div>
  )
}

// ========================================
// 渐进式肌肉放松
// ========================================
const MUSCLE_GROUPS = [
  { id: 'hands', name: '双手', instruction: '用力握紧拳头5秒，然后完全放松' },
  { id: 'arms', name: '手臂', instruction: '弯曲手臂绷紧二头肌5秒，然后放松' },
  { id: 'shoulders', name: '肩膀', instruction: '耸肩至耳朵5秒，然后让肩膀自然下沉' },
  { id: 'face', name: '面部', instruction: '紧闭双眼皱眉5秒，然后放松面部所有肌肉' },
  { id: 'chest', name: '胸部', instruction: '深吸气后屏息5秒，感受胸部紧张，然后呼气放松' },
  { id: 'abdomen', name: '腹部', instruction: '收紧腹部肌肉5秒，然后完全放松' },
  { id: 'legs', name: '双腿', instruction: '伸直双腿绷紧大腿5秒，然后放松' },
  { id: 'feet', name: '双脚', instruction: '脚趾用力抓地5秒，然后放松' },
]

export function MuscleRelaxation() {
  const [currentGroup, setCurrentGroup] = useState(0)
  const [phase, setPhase] = useState<'tense' | 'relax' | 'rest'>('tense')
  const [isRunning, setIsRunning] = useState(false)
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (!isRunning) return

    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          if (phase === 'tense') {
            setPhase('relax')
            return 10 // 放松10秒
          } else if (phase === 'relax') {
            setPhase('rest')
            return 3 // 休息3秒
          } else {
            // 下一个肌肉群
            if (currentGroup < MUSCLE_GROUPS.length - 1) {
              setCurrentGroup(g => g + 1)
              setPhase('tense')
              return 5
            } else {
              setIsRunning(false)
              setCurrentGroup(0)
              setPhase('tense')
              return 5
            }
          }
        }
        return c - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isRunning, phase, currentGroup])

  const start = () => {
    setCurrentGroup(0)
    setPhase('tense')
    setCountdown(5)
    setIsRunning(true)
  }

  const reset = () => {
    setIsRunning(false)
    setCurrentGroup(0)
    setPhase('tense')
    setCountdown(5)
  }

  const current = MUSCLE_GROUPS[currentGroup]
  const phaseInfo = {
    tense: { label: '紧绷', color: 'rose', bg: 'bg-rose-100' },
    relax: { label: '放松', color: 'emerald', bg: 'bg-emerald-100' },
    rest: { label: '休息', color: 'slate', bg: 'bg-slate-100' },
  }

  return (
    <div className="space-y-6">
      {/* 进度指示 */}
      <div className="flex gap-1">
        {MUSCLE_GROUPS.map((_, idx) => (
          <div
            key={idx}
            className={cn(
              "flex-1 h-2 rounded-full transition-colors",
              idx < currentGroup ? "bg-emerald-400" :
              idx === currentGroup ? "bg-sky-400" : "bg-slate-200"
            )}
          />
        ))}
      </div>

      {/* 当前肌肉群 */}
      <motion.div
        key={`${currentGroup}-${phase}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("p-6 rounded-xl text-center", phaseInfo[phase].bg)}
      >
        <div className={cn("text-sm font-medium mb-2", `text-${phaseInfo[phase].color}-600`)}>
          {currentGroup + 1}/{MUSCLE_GROUPS.length} - {current.name}
        </div>
        <div className="text-4xl font-bold text-slate-800 mb-2">
          {isRunning ? countdown : '准备'}
        </div>
        <div className={cn("text-lg font-bold mb-3", `text-${phaseInfo[phase].color}-700`)}>
          {phaseInfo[phase].label}
        </div>
        <p className="text-slate-600 text-sm">{current.instruction}</p>
      </motion.div>

      {/* 控制按钮 */}
      <div className="flex justify-center gap-4">
        {!isRunning ? (
          <Button onClick={start}>
            <Play className="w-4 h-4 mr-2" />
            开始练习
          </Button>
        ) : (
          <>
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              重置
            </Button>
            <Button variant="ghost" onClick={() => setIsRunning(false)}>
              暂停
            </Button>
          </>
        )}
      </div>

      <p className="text-xs text-slate-400 text-center">
        渐进式肌肉放松可以帮助释放身体紧张，改善睡眠质量
      </p>
    </div>
  )
}

// ========================================
// 主组件 - 放松工具箱
// ========================================
type RelaxTab = 'breathing' | 'sounds' | 'muscle'

export function RelaxTools() {
  const [activeTab, setActiveTab] = useState<RelaxTab>('breathing')

  const tabs = [
    { id: 'breathing' as const, name: '呼吸练习', icon: Wind },
    { id: 'sounds' as const, name: '白噪音', icon: Music },
    { id: 'muscle' as const, name: '肌肉放松', icon: Sparkles },
  ]

  return (
    <Card className="bg-white border-slate-200 shadow-lg overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-100 px-6 py-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Palette className="w-5 h-5 text-violet-500" />
          放松工具
        </h3>
        <p className="text-sm text-slate-500 mt-1">多种方式帮助你放松身心</p>
      </div>

      <div className="flex border-b border-slate-100 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 py-3 px-4 text-sm font-medium transition-colors relative whitespace-nowrap",
              activeTab === tab.id 
                ? "text-violet-600 bg-violet-50/50" 
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <span className="flex items-center justify-center gap-2">
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-violet-500" />
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
            {activeTab === 'breathing' && <BreathingExercise />}
            {activeTab === 'sounds' && <WhiteNoisePlayer />}
            {activeTab === 'muscle' && <MuscleRelaxation />}
          </motion.div>
        </AnimatePresence>
      </div>
    </Card>
  )
}
