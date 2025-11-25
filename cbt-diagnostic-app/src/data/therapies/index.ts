/**
 * 心理疗法知识库
 * 基于最新循证研究整理
 * 
 * 参考来源：
 * - Columbia University Psychiatry: Five Different Approaches to Therapy
 * - MDPI Medicina 2024: Next-Generation CBT for Depression
 * - PositivePsychology.com: ACT Hexaflex Model
 * - DialecticalBehaviorTherapy.com: DBT Core Skills
 * - NCBI: Gestalt Therapy and IPT Research
 */

export * from './types'
export * from './cbt'
export * from './dbt'
export * from './act'
export * from './ipt'
export * from './gestalt'
export * from './mindfulness'
export * from './distortions'

import { CBT_INFO } from './cbt'
import { DBT_INFO } from './dbt'
import { ACT_INFO } from './act'
import { IPT_INFO } from './ipt'
import { GESTALT_INFO } from './gestalt'
import { MINDFULNESS_INFO } from './mindfulness'
import type { TherapyInfo, TherapyType } from './types'

export const ALL_THERAPIES: TherapyInfo[] = [
  CBT_INFO,
  DBT_INFO,
  ACT_INFO,
  IPT_INFO,
  GESTALT_INFO,
  MINDFULNESS_INFO,
]

export const getTherapyById = (id: TherapyType): TherapyInfo | undefined => {
  return ALL_THERAPIES.find(t => t.id === id)
}

// 根据症状严重程度推荐疗法
export const getRecommendedTherapies = (
  phqLevel: string,
  gadLevel: string
): TherapyType[] => {
  const therapies: TherapyType[] = ['CBT', 'Mindfulness']
  
  // 焦虑为主
  if (['moderate', 'severe'].includes(gadLevel)) {
    therapies.push('ACT', 'DBT')
  }
  
  // 抑郁为主
  if (['moderate', 'moderately_severe', 'severe'].includes(phqLevel)) {
    therapies.push('IPT')
    if (!therapies.includes('ACT')) therapies.push('ACT')
  }
  
  // 情绪失调明显
  if (phqLevel === 'severe' || gadLevel === 'severe') {
    if (!therapies.includes('DBT')) therapies.push('DBT')
  }
  
  return [...new Set(therapies)]
}
