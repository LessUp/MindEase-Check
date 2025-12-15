import type { Phq9Severity, Gad7Severity } from '../domain/assessment/scoring'

export interface TherapyTool {
  id: string
  name: string
  category: 'cbt' | 'act' | 'dbt' | 'relax' | 'meditation'
  description: string
  forDepression: boolean
  forAnxiety: boolean
  minSeverity: 'minimal' | 'mild' | 'moderate' | 'severe'
}

export const THERAPY_TOOLS: TherapyTool[] = [
  {
    id: 'breathing',
    name: '四箱呼吸法',
    category: 'relax',
    description: '通过有节奏的呼吸练习快速平复情绪，减轻焦虑反应。',
    forDepression: true,
    forAnxiety: true,
    minSeverity: 'minimal',
  },
  {
    id: 'meditation',
    name: '正念冥想',
    category: 'meditation',
    description: '3分钟分阶段冥想引导，包含呼吸专注、身体扫描和正念观察。',
    forDepression: true,
    forAnxiety: true,
    minSeverity: 'minimal',
  },
  {
    id: 'whitenoise',
    name: '白噪音疗愈',
    category: 'relax',
    description: '褐噪音帮助屏蔽环境干扰，促进放松和专注。',
    forDepression: false,
    forAnxiety: true,
    minSeverity: 'minimal',
  },
  {
    id: 'distortion',
    name: '认知纠偏',
    category: 'cbt',
    description: '识别并挑战常见的认知扭曲模式，建立更健康的思维方式。',
    forDepression: true,
    forAnxiety: true,
    minSeverity: 'mild',
  },
  {
    id: 'values',
    name: '价值观澄清',
    category: 'act',
    description: '探索对你真正重要的事物，指引有意义的行动方向。',
    forDepression: true,
    forAnxiety: false,
    minSeverity: 'mild',
  },
  {
    id: 'defusion',
    name: '认知解离',
    category: 'act',
    description: '学习与负面想法保持距离，减少其对行为的控制。',
    forDepression: true,
    forAnxiety: true,
    minSeverity: 'moderate',
  },
  {
    id: 'distress-tolerance',
    name: '痛苦耐受',
    category: 'dbt',
    description: '在危机时刻使用的技能，帮助度过困难而不使情况恶化。',
    forDepression: true,
    forAnxiety: true,
    minSeverity: 'moderate',
  },
  {
    id: 'emotion-regulation',
    name: '情绪调节',
    category: 'dbt',
    description: '理解和管理强烈情绪的策略，减少情绪波动。',
    forDepression: true,
    forAnxiety: true,
    minSeverity: 'mild',
  },
]

const SEVERITY_ORDER = ['minimal', 'mild', 'moderate', 'moderately_severe', 'severe'] as const

function severityIndex(s: string): number {
  const idx = SEVERITY_ORDER.indexOf(s as typeof SEVERITY_ORDER[number])
  return idx >= 0 ? idx : 0
}

export function getRecommendedTherapies(
  phqLevel: Phq9Severity,
  gadLevel: Gad7Severity
): TherapyTool[] {
  const phqIdx = severityIndex(phqLevel)
  const gadIdx = severityIndex(gadLevel)
  const maxIdx = Math.max(phqIdx, gadIdx)

  return THERAPY_TOOLS.filter((tool) => {
    const toolIdx = severityIndex(tool.minSeverity)
    if (toolIdx > maxIdx + 1) return false

    if (phqIdx >= 1 && tool.forDepression) return true
    if (gadIdx >= 1 && tool.forAnxiety) return true
    if (maxIdx === 0) return tool.minSeverity === 'minimal'

    return false
  }).slice(0, 6)
}
