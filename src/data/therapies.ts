import type { Phq9Severity, Gad7Severity } from '../domain/assessment/scoring'

export type TherapyType = 'CBT' | 'DBT' | 'ACT' | 'IPT' | 'Gestalt' | 'Mindfulness'

export type TherapyDifficulty = 'beginner' | 'intermediate' | 'advanced'

export interface TherapyTechnique {
  id: string
  name: string
  description: string
  steps: string[]
  duration: string
  difficulty: TherapyDifficulty
}

export interface TherapyInfo {
  id: TherapyType
  name: string
  fullName: string
  description: string
  keyPrinciples: string[]
  bestFor: string[]
  techniques: TherapyTechnique[]
}

export const ALL_THERAPIES: TherapyInfo[] = [
  {
    id: 'CBT',
    name: 'CBT',
    fullName: '认知行为疗法（CBT）',
    description: '通过识别并调整不合理的想法与行为模式，缓解情绪困扰并提升应对能力。',
    keyPrinciples: ['想法会影响情绪与行为', '用证据检验自动想法', '用小步行动恢复掌控感'],
    bestFor: ['抑郁情绪', '焦虑与担忧', '拖延与回避', '睡眠与压力管理'],
    techniques: [
      {
        id: 'thought-record',
        name: '思维记录',
        description: '记录触发事件-自动想法-情绪-证据-替代想法，建立更平衡的认知。',
        steps: ['写下触发事件', '记录自动想法与情绪强度', '列出支持与反驳证据', '形成替代想法并复评情绪'],
        duration: '5-10分钟',
        difficulty: 'beginner',
      },
      {
        id: 'behavioral-activation',
        name: '行为激活',
        description: '从可完成的小活动开始，逐步恢复兴趣与活力。',
        steps: ['列出3个小活动', '按难度排序', '从最容易的一项开始执行', '记录完成后的感受与收益'],
        duration: '10-20分钟',
        difficulty: 'beginner',
      },
      {
        id: 'worry-time',
        name: '担忧时间',
        description: '把担忧集中到固定时段处理，减少全天反复咀嚼。',
        steps: ['设定每天10-20分钟担忧时间', '其他时间出现担忧先写下', '到点再集中处理与制定行动', '结束后转向当下任务'],
        duration: '10-20分钟',
        difficulty: 'beginner',
      },
    ],
  },
  {
    id: 'DBT',
    name: 'DBT',
    fullName: '辩证行为疗法（DBT）',
    description: '在接纳与改变之间取得平衡，学习调节强烈情绪与提升人际应对能力。',
    keyPrinciples: ['接纳与改变并行', '情绪调节与痛苦耐受', '正念与人际效能'],
    bestFor: ['情绪波动', '冲动行为', '强烈焦虑', '压力下的失控感'],
    techniques: [
      {
        id: 'tipp',
        name: 'TIPP 技巧',
        description: '通过生理层面快速降低情绪唤醒水平。',
        steps: ['冷刺激（冷水洗脸/冰敷）', '短暂高强度运动', '节律呼吸', '肌肉放松'],
        duration: '2-5分钟',
        difficulty: 'beginner',
      },
      {
        id: 'wise-mind',
        name: '智慧心',
        description: '在理性心与情绪心之间找到更稳妥的决策视角。',
        steps: ['识别理性心/情绪心', '描述当下感受与事实', '问自己：智慧心会怎么做', '选择一个小而可行的下一步'],
        duration: '5分钟',
        difficulty: 'beginner',
      },
      {
        id: 'radical-acceptance',
        name: '全然接纳',
        description: '练习接纳无法改变的现实，减少二次痛苦。',
        steps: ['区分事实与评价', '承认现实存在', '放下“应该/不该”', '把精力转向可改变的行动'],
        duration: '5-10分钟',
        difficulty: 'intermediate',
      },
    ],
  },
  {
    id: 'ACT',
    name: 'ACT',
    fullName: '接纳承诺疗法（ACT）',
    description: '通过接纳内在体验、与想法保持距离，并以价值为导向采取行动，提升心理灵活性。',
    keyPrinciples: ['接纳而非对抗', '认知解离', '以价值为导向的承诺行动'],
    bestFor: ['反复负面想法', '回避与拖延', '慢性压力', '焦虑与抑郁并存'],
    techniques: [
      {
        id: 'defusion',
        name: '认知解离',
        description: '学习与想法保持距离，降低想法对行为的控制。',
        steps: ['写下一个困扰想法', '在前面加上“我注意到我在想…”', '观察想法变化', '把注意力拉回当下行动'],
        duration: '3-5分钟',
        difficulty: 'beginner',
      },
      {
        id: 'ace',
        name: '抛锚技术（ACE）',
        description: '在情绪风暴中稳定自己：承认、连接、投入。',
        steps: ['承认当下体验', '连接身体与呼吸', '投入一个有意义的小行动'],
        duration: '2-5分钟',
        difficulty: 'beginner',
      },
      {
        id: 'values',
        name: '价值澄清',
        description: '明确对你重要的方向，帮助做出更一致的选择。',
        steps: ['选择一个生活领域', '写下你想成为的人', '设定一个小目标', '安排在24小时内的行动'],
        duration: '10分钟',
        difficulty: 'intermediate',
      },
    ],
  },
  {
    id: 'Mindfulness',
    name: '正念',
    fullName: '正念练习（Mindfulness）',
    description: '通过把注意力带回当下，减少对想法与情绪的纠缠，提升觉察与稳定。',
    keyPrinciples: ['非评判觉察', '回到当下', '温柔而坚定地练习'],
    bestFor: ['焦虑紧张', '压力管理', '睡前放松', '提升专注'],
    techniques: [
      {
        id: 'breath',
        name: '呼吸觉察',
        description: '把注意力放在呼吸进出，思绪飘走时温柔拉回。',
        steps: ['选择舒适坐姿', '注意呼吸进出', '走神时觉察并拉回', '结束时做一次身体扫描'],
        duration: '3-5分钟',
        difficulty: 'beginner',
      },
      {
        id: 'body-scan',
        name: '身体扫描',
        description: '从头到脚觉察身体感觉，帮助放松。',
        steps: ['从头部开始', '逐段扫描身体', '觉察紧张并放松', '结束时回到呼吸'],
        duration: '5-10分钟',
        difficulty: 'beginner',
      },
      {
        id: '54321',
        name: '5-4-3-2-1 感官练习',
        description: '快速地面化，降低焦虑与过度唤醒。',
        steps: ['说出5样看到的', '4样触摸到的', '3样听到的', '2样闻到的', '1样尝到的'],
        duration: '1-3分钟',
        difficulty: 'beginner',
      },
    ],
  },
]

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

export function getRecommendedTherapies(
  phqLevel: Phq9Severity,
  gadLevel: Gad7Severity
): TherapyType[] {
  const recommended: TherapyType[] = ['CBT', 'Mindfulness']

  const phqElevated = phqLevel === 'moderate' || phqLevel === 'moderately_severe' || phqLevel === 'severe'
  const gadElevated = gadLevel === 'moderate' || gadLevel === 'severe'

  if (phqElevated) recommended.push('ACT')
  if (gadElevated) recommended.push('DBT')
  if (phqLevel === 'severe' || gadLevel === 'severe') recommended.push('DBT')

  return Array.from(new Set(recommended)).slice(0, 4)
}
