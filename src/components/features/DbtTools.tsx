import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Snowflake, Activity, Wind, Heart,
  Scale, ChevronRight, Check, Timer, RefreshCw,
  Brain, Zap
} from 'lucide-react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { cn } from '../../lib/utils'

// ========================================
// TIPP 技巧 - 紧急情绪调节
// ========================================
const TippExercise = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [timer, setTimer] = useState(0)
  const [isActive, setIsActive] = useState(false)

  const steps = [
    {
      letter: 'T',
      title: '温度 Temperature',
      description: '用冷水洗脸或握住冰块30秒，激活潜水反射',
      icon: Snowflake,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50',
      duration: 30,
    },
    {
      letter: 'I',
      title: '强烈运动 Intense Exercise',
      description: '快速运动5-10分钟：跑步、跳跃、俯卧撑',
      icon: Activity,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      duration: 300,
    },
    {
      letter: 'P',
      title: '配速呼吸 Paced Breathing',
      description: '缓慢呼气比吸气长：吸4秒，呼6-8秒',
      icon: Wind,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
      duration: 60,
    },
    {
      letter: 'P',
      title: '成对肌肉放松 Paired Muscle Relaxation',
      description: '依次紧绷后放松各肌肉群',
      icon: Zap,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      duration: 120,
    },
  ]

  useEffect(() => {
    if (!isActive) return
    if (timer <= 0) return

    const timeout = setTimeout(() => setTimer((t) => t - 1), 1000)

    return () => clearTimeout(timeout)
  }, [isActive, timer])

  const startStep = () => {
    setTimer(steps[currentStep].duration)
    setIsActive(true)
  }

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60)
    const secs = s % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const CurrentIcon = steps[currentStep].icon
  const isRunning = isActive && timer > 0

  return (
    <div className="space-y-6">
      {/* Step Indicators */}
      <div className="flex justify-center gap-2">
        {steps.map((step, idx) => (
          <button
            key={idx}
            onClick={() => { setCurrentStep(idx); setIsActive(false); setTimer(0) }}
            className={cn(
              "w-10 h-10 rounded-full font-bold transition-all",
              idx === currentStep 
                ? `${step.bgColor} ${step.color} ring-2 ring-offset-2 ring-current` 
                : "bg-slate-100 text-slate-400 hover:bg-slate-200"
            )}
          >
            {step.letter}
          </button>
        ))}
      </div>

      {/* Current Step Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={cn("p-6 rounded-xl text-center", steps[currentStep].bgColor)}
        >
          <CurrentIcon className={cn("w-12 h-12 mx-auto mb-4", steps[currentStep].color)} />
          <h4 className="text-lg font-bold text-slate-800 mb-2">
            {steps[currentStep].title}
          </h4>
          <p className="text-slate-600 mb-4">{steps[currentStep].description}</p>
          
          {isRunning ? (
            <div className="space-y-4">
              <div className="text-4xl font-mono font-bold text-slate-700">
                {formatTime(timer)}
              </div>
              <Button variant="outline" onClick={() => setIsActive(false)}>
                暂停
              </Button>
            </div>
          ) : (
            <div className="flex justify-center gap-3">
              <Button onClick={startStep}>
                <Timer className="w-4 h-4 mr-2" />
                开始练习
              </Button>
              {currentStep < steps.length - 1 && (
                <Button 
                  variant="ghost" 
                  onClick={() => setCurrentStep(c => c + 1)}
                >
                  跳过
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ========================================
// 智慧心 - Wise Mind
// ========================================
const WiseMindExercise = () => {
  const [phase, setPhase] = useState<'intro' | 'emotion' | 'reason' | 'wise' | 'complete'>('intro')
  const [emotionThought, setEmotionThought] = useState('')
  const [reasonThought, setReasonThought] = useState('')

  const reset = () => {
    setPhase('intro')
    setEmotionThought('')
    setReasonThought('')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-4 mb-6">
        <div className={cn(
          "w-24 h-24 rounded-full flex items-center justify-center transition-all",
          phase === 'emotion' ? "bg-rose-100 scale-110" : "bg-rose-50"
        )}>
          <Heart className={cn("w-10 h-10", phase === 'emotion' ? "text-rose-500" : "text-rose-300")} />
        </div>
        <div className={cn(
          "w-24 h-24 rounded-full flex items-center justify-center transition-all",
          phase === 'wise' || phase === 'complete' ? "bg-purple-100 scale-110" : "bg-purple-50"
        )}>
          <Scale className={cn("w-10 h-10", phase === 'wise' || phase === 'complete' ? "text-purple-500" : "text-purple-300")} />
        </div>
        <div className={cn(
          "w-24 h-24 rounded-full flex items-center justify-center transition-all",
          phase === 'reason' ? "bg-blue-100 scale-110" : "bg-blue-50"
        )}>
          <Brain className={cn("w-10 h-10", phase === 'reason' ? "text-blue-500" : "text-blue-300")} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center space-y-4"
          >
            <h4 className="text-lg font-bold text-slate-800">智慧心练习</h4>
            <p className="text-slate-600">
              智慧心是情绪心与理性心的融合。当我们只用情绪心时，可能冲动行事；
              只用理性心时，可能忽略重要感受。智慧心帮助我们做出平衡的决定。
            </p>
            <Button onClick={() => setPhase('emotion')}>开始练习</Button>
          </motion.div>
        )}

        {phase === 'emotion' && (
          <motion.div
            key="emotion"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="p-4 bg-rose-50 rounded-xl">
              <h4 className="font-bold text-rose-700 mb-2">情绪心在说什么？</h4>
              <p className="text-sm text-rose-600 mb-3">此刻你的情绪想让你做什么？</p>
              <textarea
                value={emotionThought}
                onChange={(e) => setEmotionThought(e.target.value)}
                placeholder="例如：我太生气了，我想立刻反击..."
                className="w-full p-3 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-300 focus:outline-none"
                rows={3}
              />
            </div>
            <Button onClick={() => setPhase('reason')} disabled={!emotionThought.trim()}>
              下一步 <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>
        )}

        {phase === 'reason' && (
          <motion.div
            key="reason"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="p-4 bg-blue-50 rounded-xl">
              <h4 className="font-bold text-blue-700 mb-2">理性心在说什么？</h4>
              <p className="text-sm text-blue-600 mb-3">纯粹从逻辑角度，什么是"正确"的做法？</p>
              <textarea
                value={reasonThought}
                onChange={(e) => setReasonThought(e.target.value)}
                placeholder="例如：冷静下来，分析情况，找出最佳解决方案..."
                className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
                rows={3}
              />
            </div>
            <Button onClick={() => setPhase('wise')} disabled={!reasonThought.trim()}>
              寻找智慧心 <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>
        )}

        {phase === 'wise' && (
          <motion.div
            key="wise"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="p-6 bg-purple-50 rounded-xl text-center">
              <Scale className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h4 className="font-bold text-purple-700 mb-4">智慧心的声音</h4>
              <p className="text-slate-600 mb-4">
                深呼吸，闭上眼睛。问自己：<br />
                "如果我既尊重自己的感受，又考虑长远后果，<br />
                <strong>什么行动对我最好？"</strong>
              </p>
              <div className="grid grid-cols-2 gap-4 text-left text-sm">
                <div className="p-3 bg-white rounded-lg">
                  <span className="text-rose-500 font-bold">情绪心：</span>
                  <p className="text-slate-600 mt-1">{emotionThought}</p>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <span className="text-blue-500 font-bold">理性心：</span>
                  <p className="text-slate-600 mt-1">{reasonThought}</p>
                </div>
              </div>
            </div>
            <Button onClick={() => setPhase('complete')}>
              <Check className="w-4 h-4 mr-2" />
              我找到了智慧心的答案
            </Button>
          </motion.div>
        )}

        {phase === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-4 p-6 bg-emerald-50 rounded-xl"
          >
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-emerald-500" />
            </div>
            <h4 className="font-bold text-emerald-700">练习完成</h4>
            <p className="text-slate-600">
              记住，智慧心不是关于对错，而是找到对你最好的平衡。
              经常练习，你会更容易找到它的声音。
            </p>
            <Button variant="outline" onClick={reset}>
              <RefreshCw className="w-4 h-4 mr-2" />
              重新练习
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ========================================
// 全然接纳 - Radical Acceptance
// ========================================
const RadicalAcceptanceExercise = () => {
  const [step, setStep] = useState(0)
  
  const prompts = [
    {
      title: '识别现实',
      question: '此刻，什么是你无法改变的现实？',
      hint: '例如：过去已发生的事、他人的选择、无法控制的情况',
    },
    {
      title: '承认抗拒',
      question: '你对这个现实有什么抗拒或不接受的感觉？',
      hint: '愤怒、悲伤、不公平感都是正常的',
    },
    {
      title: '理解因果',
      question: '这个现实是如何发生的？有哪些因素导致了它？',
      hint: '不是为了找借口，而是理解事物有其原因',
    },
    {
      title: '选择接纳',
      question: '如果你选择接纳这个现实（不是赞同），你的身体和心理会有什么变化？',
      hint: '接纳不等于认可，而是停止与现实对抗',
    },
    {
      title: '向前一步',
      question: '接纳之后，你可以采取什么有意义的行动？',
      hint: '将能量用在你可以改变的事情上',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-2 mb-4">
        {prompts.map((_, idx) => (
          <div
            key={idx}
            className={cn(
              "w-3 h-3 rounded-full transition-all",
              idx === step ? "bg-indigo-500 w-6" : idx < step ? "bg-indigo-300" : "bg-slate-200"
            )}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-6 bg-indigo-50 rounded-xl"
        >
          <div className="text-sm text-indigo-500 font-medium mb-2">
            步骤 {step + 1} / {prompts.length}
          </div>
          <h4 className="text-lg font-bold text-slate-800 mb-3">
            {prompts[step].title}
          </h4>
          <p className="text-slate-700 mb-2">{prompts[step].question}</p>
          <p className="text-sm text-slate-500 italic">{prompts[step].hint}</p>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          上一步
        </Button>
        <Button
          onClick={() => setStep(s => Math.min(prompts.length - 1, s + 1))}
          disabled={step === prompts.length - 1}
        >
          {step === prompts.length - 1 ? '完成' : '下一步'}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <p className="text-center text-sm text-slate-500">
        "这就是现实。它不是我想要的，但它就是这样。我可以选择如何回应。"
      </p>
    </div>
  )
}

// ========================================
// 主组件 - DBT Tools
// ========================================
type DbtTab = 'tipp' | 'wise-mind' | 'acceptance'

export function DbtTools() {
  const [activeTab, setActiveTab] = useState<DbtTab>('tipp')

  const tabs = [
    { id: 'tipp' as const, name: 'TIPP技巧', icon: Snowflake },
    { id: 'wise-mind' as const, name: '智慧心', icon: Scale },
    { id: 'acceptance' as const, name: '全然接纳', icon: Heart },
  ]

  return (
    <Card className="bg-white border-slate-200 shadow-lg overflow-hidden">
      <div className="bg-purple-50/50 border-b border-purple-100 px-6 py-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Scale className="w-5 h-5 text-purple-500" />
          DBT 辩证行为技能
        </h3>
        <p className="text-sm text-slate-500 mt-1">接纳与改变的平衡</p>
      </div>

      <div className="flex border-b border-slate-100 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 py-3 px-4 text-sm font-medium transition-colors relative whitespace-nowrap",
              activeTab === tab.id 
                ? "text-purple-600 bg-purple-50/50" 
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <span className="flex items-center justify-center gap-2">
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500" />
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
            {activeTab === 'tipp' && <TippExercise />}
            {activeTab === 'wise-mind' && <WiseMindExercise />}
            {activeTab === 'acceptance' && <RadicalAcceptanceExercise />}
          </motion.div>
        </AnimatePresence>
      </div>
    </Card>
  )
}
