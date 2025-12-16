import React, { useEffect } from 'react'
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

import { useAssessmentFlow } from './app/assessment/useAssessmentFlow'
import { PHQ9_ITEMS, GAD7_ITEMS } from './domain/assessment/scales'
import type { Phq9Severity, Gad7Severity } from './domain/assessment/scoring'

export default function App() {
  const {
    step,
    direction,
    paginate,

    phq9: phq9Answers,
    setPhq9: setPhq9Answers,
    gad7: gad7Answers,
    setGad7: setGad7Answers,

    allowLocalSave,
    setAllowLocalSave,

    phqTotal,
    gadTotal,
    phqLevel,
    gadLevel,
    triageRes,
    tips,
    phqInfo,
    gadInfo,
    crisisSupportTips,

    saveSnapshot,
    restart,

    allAnswered,
    answeredCount,
  } = useAssessmentFlow()

  // 使用全局状态管理
  const addAssessment = useAppStore((s) => s.addAssessment)
  const activeTab = useAppStore((s) => s.activeTab)

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

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
  const badgeClass = (s: Phq9Severity | Gad7Severity) => {
    switch (s) {
      case 'minimal': return 'badge badge-success bg-emerald-100 text-emerald-800'
      case 'mild': return 'badge bg-blue-100 text-blue-800'
      case 'moderate': return 'badge badge-warning bg-amber-100 text-amber-800'
      case 'moderately_severe':
      case 'severe': return 'badge badge-danger bg-red-100 text-red-800'
    }
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
              setAllowLocalSave={setAllowLocalSave}
              onRestart={restart}
              onBack={() => paginate('gad7', -1)}
              badgeClass={badgeClass}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  )
}
