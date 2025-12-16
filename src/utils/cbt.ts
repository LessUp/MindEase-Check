import type { Phq9Severity, Gad7Severity } from './scoring'

/**
 * 生成基于多种循证疗法的综合建议
 * 整合 CBT、DBT、ACT、IPT、正念等疗法技术
 */
export function generateCbtTips(
  phq: Phq9Severity,
  gad: Gad7Severity
): string[] {
  const tips: string[] = []

  // === CBT 基础建议 ===
  const cbtBasics = [
    '【CBT】建立日常作息与规律睡眠：固定起床/入睡时间，逐步减少晚间屏幕暴露',
    '【CBT】行为激活：列出3个微小、可完成的有益活动（如10分钟散步/淋浴/整理桌面），按难度从易到难完成',
    '【CBT】思维记录：对反复出现的负性想法，写下支持与反驳证据，形成更平衡的替代想法',
  ]
  tips.push(...cbtBasics)

  // === 正念基础（适合所有人）===
  tips.push('【正念】每日3-5分钟呼吸觉察练习：专注于呼吸的进出，思绪漫游时温柔地拉回')

  // === 根据抑郁程度添加建议 ===
  if (phq === 'moderate' || phq === 'moderately_severe' || phq === 'severe') {
    tips.push('【CBT】行为激活分级计划：把有意义的活动按难度分级，每天按阶梯递进')
    tips.push('【ACT】价值澄清：思考对你真正重要的人生方向，设定基于价值的小目标')
    tips.push('【IPT】人际连接：每周至少与1位亲友进行有意义的交流，分享感受')
  }

  if (phq === 'severe') {
    tips.push('【ACT】认知解离：当出现负面想法时，在想法前加上"我注意到我在想..."与它保持距离')
    tips.push('【DBT】智慧心：在做重要决定时，问自己"智慧心会怎么看？"，融合理性与直觉')
  }

  // === 根据焦虑程度添加建议 ===
  if (gad === 'moderate' || gad === 'severe') {
    tips.push('【DBT】TIPP技巧：情绪激动时尝试用冷水洗脸（激活潜水反射）或短暂剧烈运动')
    tips.push('【正念】5-4-3-2-1感官练习：注意5样能看到的、4样能触摸的、3样能听到的...')
    tips.push('【ACT】抛锚技术（ACE）：承认想法、连接身体、投入当下活动')
  }

  if (gad === 'severe') {
    tips.push('【CBT】概率重估：把担忧事件的真实概率量化，准备若发生时的应对步骤')
    tips.push('【DBT】全然接纳：对于无法改变的事实，练习接纳现实而非抗拒')
  }

  // === 情绪失调严重时 ===
  if (phq === 'severe' || gad === 'severe') {
    tips.push('【DBT】相反行动：当情绪冲动不适合时，尝试做与冲动相反的行为')
    tips.push('【格式塔】此时此地：用"我现在感到..."描述当下体验，增强觉察')
  }

  // === 通用结语 ===
  tips.push('如症状持续超过2周或影响日常功能，请尽快寻求专业帮助（心理咨询/精神科）')

  return tips
}

/**
 * 生成简短的应急技巧
 */
export function getEmergencyTips(): string[] {
  return [
    '深呼吸：吸气4秒，屏气4秒，呼气6秒',
    '5-4-3-2-1：注意周围5样看得到的东西',
    'TIPP：用冷水洗脸30秒',
    '抛锚：感受脚踩地面的感觉',
    '给情绪命名："我注意到我正在感到..."',
  ]
}
