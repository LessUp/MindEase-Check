import React, { useEffect, useMemo, useState } from 'react'
import Questionnaire from './components/Questionnaire'
import { PHQ9_ITEMS, GAD7_ITEMS } from './data/scales'
import {
  phq9Total,
  gad7Total,
  phq9Severity,
  gad7Severity,
  type Phq9Severity,
  type Gad7Severity,
  triage,
  PHQ9_SEVERITY_INFO,
  GAD7_SEVERITY_INFO,
} from './utils/scoring'
import { generateCbtTips } from './utils/cbt'

type Step = 'intro' | 'phq9' | 'gad7' | 'result'

type AssessmentSnapshot = {
  ts: number
  phq9: number[]
  gad7: number[]
  phqTotal: number
  gadTotal: number
  phqLevel: Phq9Severity
  gadLevel: Gad7Severity
}

export default function App() {
  const [step, setStep] = useState<Step>('intro')
  const [phq9, setPhq9] = useState<number[]>(Array(PHQ9_ITEMS.length).fill(-1))
  const [gad7, setGad7] = useState<number[]>(Array(GAD7_ITEMS.length).fill(-1))

  const [allowLocalSave, setAllowLocalSave] = useState<boolean>(false)
  const [lastSaved, setLastSaved] = useState<AssessmentSnapshot | null>(null)

  // Derived
  const phqTotal = useMemo(() => phq9Total(phq9.map(v => (v < 0 ? 0 : v))), [phq9])
  const gadTotal = useMemo(() => gad7Total(gad7.map(v => (v < 0 ? 0 : v))), [gad7])
  const phqLevel: Phq9Severity = useMemo(() => phq9Severity(phqTotal), [phqTotal])
  const gadLevel: Gad7Severity = useMemo(() => gad7Severity(gadTotal), [gadTotal])
  const triageRes = useMemo(() => triage(phq9, gad7), [phq9, gad7])
  const tips = useMemo(() => generateCbtTips(phqLevel, gadLevel), [phqLevel, gadLevel])
  const phqInfo = useMemo(() => PHQ9_SEVERITY_INFO[phqLevel], [phqLevel])
  const gadInfo = useMemo(() => GAD7_SEVERITY_INFO[gadLevel], [gadLevel])
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

  const validateSnapshot = (raw: unknown): raw is AssessmentSnapshot => {
    if (typeof raw !== 'object' || raw === null) return false
    const snapshot = raw as Partial<AssessmentSnapshot>
    const isValidResponses = (arr: unknown, length: number) =>
      Array.isArray(arr) && arr.length === length && arr.every(v => typeof v === 'number')
    return (
      typeof snapshot.ts === 'number' &&
      isValidResponses(snapshot.phq9, PHQ9_ITEMS.length) &&
      isValidResponses(snapshot.gad7, GAD7_ITEMS.length) &&
      typeof snapshot.phqTotal === 'number' &&
      typeof snapshot.gadTotal === 'number' &&
      typeof snapshot.phqLevel === 'string' &&
      typeof snapshot.gadLevel === 'string'
    )
  }

  const loadLatestSnapshot = () => {
    try {
      const raw = localStorage.getItem('cbt-diagnostic-latest')
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (validateSnapshot(parsed)) {
        setLastSaved(parsed)
      }
    } catch {}
  }

  useEffect(() => {
    try {
      const pref = localStorage.getItem('cbt-diagnostic-allow-save')
      if (pref === 'true') {
        setAllowLocalSave(true)
      }
    } catch {}
    loadLatestSnapshot()
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('cbt-diagnostic-allow-save', allowLocalSave ? 'true' : 'false')
    } catch {}
  }, [allowLocalSave])

  useEffect(() => {
    if (!allowLocalSave) return
    try {
      const payload = {
        ts: Date.now(),
        phq9,
        gad7,
        phqTotal,
        gadTotal,
        phqLevel,
        gadLevel,
      }
      localStorage.setItem('cbt-diagnostic-latest', JSON.stringify(payload))
      setLastSaved(payload)
    } catch {}
  }, [allowLocalSave, phq9, gad7, phqTotal, gadTotal, phqLevel, gadLevel])

  const allAnswered = (arr: number[]) => arr.every(v => v >= 0)

  const severityText = (s: Phq9Severity | Gad7Severity) => {
    switch (s) {
      case 'minimal':
        return '最轻'
      case 'mild':
        return '轻度'
      case 'moderate':
        return '中度'
      case 'moderately_severe':
        return '中重度'
      case 'severe':
        return '重度'
    }
  }

  const badgeClass = (s: Phq9Severity | Gad7Severity) => {
    switch (s) {
      case 'minimal':
        return 'badge badge-success'
      case 'mild':
        return 'badge'
      case 'moderate':
        return 'badge badge-warning'
      case 'moderately_severe':
      case 'severe':
        return 'badge badge-danger'
    }
  }

  const formatTimestamp = (ts: number) =>
    new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(ts)

  const restoreFromLastSaved = () => {
    if (!lastSaved) return
    setPhq9([...lastSaved.phq9])
    setGad7([...lastSaved.gad7])
    setStep('result')
  }

  const clearLocalSnapshot = () => {
    try {
      localStorage.removeItem('cbt-diagnostic-latest')
    } catch {}
    setLastSaved(null)
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto container-narrow px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/favicon.svg" alt="Logo" className="h-6 w-6" />
            <div className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-emerald-600">
              CBT 评估与建议
            </div>
          </div>
          <div className="text-xs text-slate-500">v0.1 本地运行</div>
        </div>
      </header>

      <main className="mx-auto container-narrow px-4 py-6 space-y-6">
        {step === 'intro' && (
          <>
            <div className="card space-y-4">
              <h1 className="text-2xl font-bold">认知行为疗法（CBT）自助评估</h1>
              <p className="text-slate-700 text-sm leading-6">
                本工具整合 PHQ-9 与 GAD-7 量表，用于自我筛查抑郁与焦虑症状强度，并给出教育性建议，不能替代专业诊断与治疗。
              </p>
              <ul className="text-slate-700 text-sm list-disc pl-5 space-y-1">
                <li>预计耗时 3-5 分钟；数据默认只在本地处理，不会上传。</li>
                <li>若出现持续的自伤/自杀想法或计划，请立即联系当地紧急服务或就近医院急诊。</li>
              </ul>
              <div className="flex items-center gap-3">
                <button className="btn btn-primary" onClick={() => setStep('phq9')}>
                  开始评估
                </button>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="accent-blue-600"
                    checked={allowLocalSave}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAllowLocalSave(e.target.checked)}
                  />
                  允许在本地保存结果
                </label>
              </div>
              <p className="text-xs text-slate-500">提示：启用本地保存后，可在同一设备浏览器中查看最近一次结果。</p>
            </div>

            {lastSaved && (
              <div className="card space-y-4 border-blue-200 bg-blue-50/60">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm text-slate-600">最近一次评估记录</div>
                    <div className="text-base font-semibold text-slate-800">{formatTimestamp(lastSaved.ts)}</div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button className="btn btn-primary text-sm" onClick={restoreFromLastSaved}>
                      查看最近结果
                    </button>
                    <button className="btn btn-ghost text-sm" onClick={clearLocalSnapshot}>
                      清除本地记录
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-blue-200 bg-white/80 p-4">
                    <div className="text-xs uppercase tracking-wide text-slate-500">PHQ-9</div>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="text-2xl font-bold text-slate-900">{lastSaved.phqTotal}</div>
                      <span className={badgeClass(lastSaved.phqLevel)}>{severityText(lastSaved.phqLevel)}</span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-blue-200 bg-white/80 p-4">
                    <div className="text-xs uppercase tracking-wide text-slate-500">GAD-7</div>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="text-2xl font-bold text-slate-900">{lastSaved.gadTotal}</div>
                      <span className={badgeClass(lastSaved.gadLevel)}>{severityText(lastSaved.gadLevel)}</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  本地数据仅保存在当前浏览器，可随时通过“清除本地记录”移除。
                </p>
              </div>
            )}
          </>
        )}

        {step === 'phq9' && (
          <>
            <Questionnaire
              title="PHQ-9 抑郁症状筛查"
              subtitle="过去两周内，这些问题对你造成的困扰频率？"
              items={PHQ9_ITEMS}
              responses={phq9}
              onChange={(index: number, value: number) =>
                setPhq9((prev: number[]) => prev.map((v: number, i: number) => (i === index ? value : v)))
              }
            />
            <div className="flex items-center justify-between">
              <button className="btn btn-ghost" onClick={() => setStep('intro')}>返回</button>
              <button className="btn btn-primary" onClick={() => setStep('gad7')} disabled={!allAnswered(phq9)}>下一步</button>
            </div>
          </>
        )}

        {step === 'gad7' && (
          <>
            <Questionnaire
              title="GAD-7 广泛性焦虑筛查"
              subtitle="过去两周内，这些问题对你造成的困扰频率？"
              items={GAD7_ITEMS}
              responses={gad7}
              onChange={(index: number, value: number) =>
                setGad7((prev: number[]) => prev.map((v: number, i: number) => (i === index ? value : v)))
              }
            />
            <div className="flex items-center justify-between">
              <button className="btn btn-ghost" onClick={() => setStep('phq9')}>上一步</button>
              <button className="btn btn-primary" onClick={() => setStep('result')} disabled={!allAnswered(gad7)}>
                查看结果
              </button>
            </div>
          </>
        )}

        {step === 'result' && (
          <>
            <div className="card space-y-3">
              <h2 className="text-xl font-semibold">结果总览</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-slate-600">PHQ-9</div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="text-2xl font-bold">{phqTotal}</div>
                    <span className={badgeClass(phqLevel)}>{phqInfo.label}</span>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-slate-600">GAD-7</div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="text-2xl font-bold">{gadTotal}</div>
                    <span className={badgeClass(gadLevel)}>{gadInfo.label}</span>
                  </div>
                </div>
              </div>

              {triageRes.level === 'none' && (
                <div className="badge">未检测到立即风险</div>
              )}
              {triageRes.level === 'high' && (
                <div className="badge badge-warning">建议尽快联系专业人员进行评估</div>
              )}
              {triageRes.level === 'crisis' && (
                <div className="badge badge-danger">如出现持续的自伤/自杀想法或计划，请立即联系当地紧急服务或就近医院急诊</div>
              )}
              {triageRes.reasons.length > 0 && (
                <ul className="text-sm text-slate-700 list-disc pl-5">
                  {triageRes.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="card space-y-4">
              <h3 className="text-lg font-semibold">严重度解读</h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-slate-200 p-4">
                  <div className="text-sm font-semibold text-slate-800">PHQ-9 抑郁症状</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{phqInfo.description}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    <span className="font-medium text-slate-700">建议：</span>
                    {phqInfo.recommendation}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                  <div className="text-sm font-semibold text-slate-800">GAD-7 焦虑症状</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{gadInfo.description}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    <span className="font-medium text-slate-700">建议：</span>
                    {gadInfo.recommendation}
                  </p>
                </div>
              </div>
            </div>

            {crisisSupportTips.length > 0 && (
              <div className="card space-y-3 border-red-200 bg-red-50/70">
                <h3 className="text-lg font-semibold text-red-700">安全与求助建议</h3>
                <p className="text-sm text-red-700/90">
                  当前量表结果提示较高的风险，请优先关注安全并尽快寻求专业人员协助：
                </p>
                <ul className="list-disc space-y-2 pl-5 text-sm text-red-800">
                  {crisisSupportTips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="card">
              <h3 className="text-lg font-semibold mb-2">基于 CBT 的自助建议</h3>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                {tips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
              <p className="text-xs text-slate-500 mt-3">本内容仅用于健康教育与自助管理，不能替代专业评估与治疗。</p>
            </div>

            <div className="flex items-center justify-between">
              <button className="btn btn-ghost" onClick={() => setStep('gad7')}>上一步</button>
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="accent-blue-600"
                    checked={allowLocalSave}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAllowLocalSave(e.target.checked)}
                  />
                  允许在本地保存结果
                </label>
                <button
                  className="btn"
                  onClick={() => {
                    setPhq9(Array(PHQ9_ITEMS.length).fill(-1))
                    setGad7(Array(GAD7_ITEMS.length).fill(-1))
                    setStep('intro')
                  }}
                >重新开始</button>
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="mx-auto container-narrow px-4 py-8 text-xs text-slate-500">
        <div>免责声明：本应用不提供医疗诊断或紧急服务。如遇危机，请立即联系当地紧急服务或就近医院急诊。</div>
      </footer>
    </div>
  )
}
