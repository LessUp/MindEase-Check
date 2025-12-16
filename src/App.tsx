import React, { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import Questionnaire from './components/Questionnaire'
import { AppShell } from './components/layout/AppShell'
import { HomePage } from './components/views/HomePage'
import { Result } from './components/views/Result'
import { ProgressBar } from './components/ui/ProgressBar'
import { Button } from './components/ui/Button'
import { useAppStore } from './stores/useAppStore'
import type { AssessmentRecord } from './core/types'

import { PHQ9_ITEMS, GAD7_ITEMS } from './domain/assessment/scales'
import {
  phq9Total,
  gad7Total,
  phq9Severity,
  gad7Severity,
  triage,
  PHQ9_SEVERITY_INFO,
  GAD7_SEVERITY_INFO,
  type Phq9Severity,
  type Gad7Severity,
} from './domain/assessment/scoring'
import { generateCbtTips } from './domain/assessment/cbt'
import { writeLatestSnapshot, type AssessmentSnapshot } from './domain/assessment/storage'

type Step = 'intro' | 'phq9' | 'gad7' | 'result'

const readAllowLocalSavePreference = () => {
  try {
    return localStorage.getItem('cbt-diagnostic-allow-save') === 'true'
  } catch {
    return false
  }
}

export default function App() {
  const [step, setStep] = useState<Step>('intro')
  const [direction, setDirection] = useState(0)
  const [phq9Answers, setPhq9Answers] = useState<number[]>(Array(PHQ9_ITEMS.length).fill(-1))
  const [gad7Answers, setGad7Answers] = useState<number[]>(Array(GAD7_ITEMS.length).fill(-1))

  const [allowLocalSave, setAllowLocalSave] = useState<boolean>(readAllowLocalSavePreference)

  // 使用全局状态管理
  const addAssessment = useAppStore((s) => s.addAssessment)
  const activeTab = useAppStore((s) => s.activeTab)

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  const paginate = (newStep: Step, newDirection: number) => {
    setDirection(newDirection)
    setStep(newStep)
  }

  // Derived
  const phqTotal = useMemo(() => phq9Total(phq9Answers.map(v => (v < 0 ? 0 : v))), [phq9Answers])
  const gadTotal = useMemo(() => gad7Total(gad7Answers.map(v => (v < 0 ? 0 : v))), [gad7Answers])
  const phqLevel: Phq9Severity = useMemo(() => phq9Severity(phqTotal), [phqTotal])
  const gadLevel: Gad7Severity = useMemo(() => gad7Severity(gadTotal), [gadTotal])
  const triageRes = useMemo(() => triage(phq9Answers, gad7Answers), [phq9Answers, gad7Answers])
  const tips = useMemo(() => generateCbtTips(phqLevel, gadLevel), [phqLevel, gadLevel])
  const phqInfo = useMemo(() => PHQ9_SEVERITY_INFO[phqLevel], [phqLevel])
  const gadInfo = useMemo(() => GAD7_SEVERITY_INFO[gadLevel], [gadLevel])

  // 保存评估记录到全局 Store（用于历史记录/首页展示）
  const saveToStore = () => {
    const now = Date.now()

    const phq9Record: AssessmentRecord = {
      id: `phq9_${now}`,
      scaleId: 'PHQ9',
      answers: phq9Answers,
      totalScore: phqTotal,
      severity: phqInfo.label,
      completedAt: now,
      synced: false,
    }

    const gad7Record: AssessmentRecord = {
      id: `gad7_${now}`,
      scaleId: 'GAD7',
      answers: gad7Answers,
      totalScore: gadTotal,
      severity: gadInfo.label,
      completedAt: now,
      synced: false,
    }

    addAssessment(phq9Record)
    addAssessment(gad7Record)
  }

  const saveSnapshot = () => {
    const payload: AssessmentSnapshot = {
      ts: Date.now(),
      phq9: [...phq9Answers],
      gad7: [...gad7Answers],
      phqTotal,
      gadTotal,
      phqLevel,
      gadLevel,
    }

    writeLatestSnapshot(payload)
  }

  const setAllowLocalSaveWithSnapshot: React.Dispatch<React.SetStateAction<boolean>> = value => {
    const next = typeof value === 'function' ? value(allowLocalSave) : value
    setAllowLocalSave(next)
    if (next && step === 'result') {
      saveToStore()
      saveSnapshot()
    }
  }

  const crisisSupportTips = useMemo(() => {
    if (triageRes.level === 'crisis') {
      return [
        '请立即联系当地紧急服务或就近医院急诊，确保自身安全。',
        '若身边有可信任的人，请寻求他们的陪伴，避免独自一人。',
        '在等待专业人员时，可拨打危机干预热线或使用线上紧急支持渠道。',
      ]
    }
    if (triageRes.level === 'high') {
      return [
        '建议尽快预约心理咨询或精神科医生，讨论评估与治疗选项。',
        '将当前状况告知信任的亲友，建立安全支持计划。',
        '若症状加重或出现危机信号，请及时联系当地紧急服务。',
      ]
    }
    return []
  }, [triageRes])

  useEffect(() => {
    try {
      localStorage.setItem('cbt-diagnostic-allow-save', allowLocalSave ? 'true' : 'false')
    } catch {}
  }, [allowLocalSave])
  const allAnswered = (arr: number[]) => arr.every(v => v >= 0)
  const answeredCount = (arr: number[]) => arr.filter(v => v >= 0).length

  const badgeClass = (s: Phq9Severity | Gad7Severity) => {
    switch (s) {
      case 'minimal': return 'badge badge-success bg-emerald-100 text-emerald-800'
      case 'mild': return 'badge bg-blue-100 text-blue-800'
      case 'moderate': return 'badge badge-warning bg-amber-100 text-amber-800'
      case 'moderately_severe':
      case 'severe': return 'badge badge-danger bg-red-100 text-red-800'
    }
  }

  const handleRestart = () => {
    setPhq9Answers(Array(PHQ9_ITEMS.length).fill(-1))
    setGad7Answers(Array(GAD7_ITEMS.length).fill(-1))
    paginate('intro', -1)
  }

  // Animation variants for page transitions
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  }

  // 根据当前tab决定是否显示导航
  const showNav = activeTab !== 'home' || step === 'intro'

  return (
    <AppShell showNav={showNav}>
      <AnimatePresence mode="wait" custom={direction}>
        {step === 'intro' && (
          <motion.div
            key="intro"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
          >
            <HomePage onStartAssessment={() => paginate('phq9', 1)} />
          </motion.div>
        )}

        {step === 'phq9' && (
          <motion.div
            key="phq9"
            className="space-y-6"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
          >
            <ProgressBar current={answeredCount(phq9Answers)} total={PHQ9_ITEMS.length} />
            <Questionnaire
              title="第一部分：PHQ-9"
              subtitle="请根据过去两周内的实际感受，回答以下问题。"
              items={PHQ9_ITEMS}
              responses={phq9Answers}
              onChange={(index, value) =>
                setPhq9Answers(prev => prev.map((v, i) => (i === index ? value : v)))
              }
            />
            <div className="flex items-center justify-between pt-4">
              <Button variant="ghost" onClick={() => paginate('intro', -1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回
              </Button>
              <Button 
                onClick={() => paginate('gad7', 1)} 
                disabled={!allAnswered(phq9Answers)}
                className="w-32"
              >
                下一步
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'gad7' && (
          <motion.div
            key="gad7"
            className="space-y-6"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
          >
            <ProgressBar current={answeredCount(gad7Answers)} total={GAD7_ITEMS.length} />
            <Questionnaire
              title="第二部分：GAD-7"
              subtitle="请根据过去两周内的实际感受，回答以下问题。"
              items={GAD7_ITEMS}
              responses={gad7Answers}
              onChange={(index, value) =>
                setGad7Answers(prev => prev.map((v, i) => (i === index ? value : v)))
              }
            />
            <div className="flex items-center justify-between pt-4">
              <Button variant="ghost" onClick={() => paginate('phq9', -1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                上一步
              </Button>
              <Button 
                onClick={() => {
                  saveToStore()
                  if (allowLocalSave) saveSnapshot()
                  paginate('result', 1)
                }} 
                disabled={!allAnswered(gad7Answers)}
                className="w-32"
              >
                查看结果
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'result' && (
          <motion.div
            key="result"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
          >
            <Result
              phqTotal={phqTotal}
              gadTotal={gadTotal}
              phqLevel={phqLevel}
              gadLevel={gadLevel}
              triageRes={triageRes}
              phqInfo={phqInfo}
              gadInfo={gadInfo}
              crisisSupportTips={crisisSupportTips}
              tips={tips}
              allowLocalSave={allowLocalSave}
              setAllowLocalSave={setAllowLocalSaveWithSnapshot}
              onRestart={handleRestart}
              onBack={() => paginate('gad7', -1)}
              badgeClass={badgeClass}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  )
}
