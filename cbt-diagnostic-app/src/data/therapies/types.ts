/**
 * 心理疗法知识库 - 类型定义
 */

export type TherapyType = 'CBT' | 'DBT' | 'ACT' | 'IPT' | 'Gestalt' | 'Mindfulness'

export interface TherapyInfo {
  id: TherapyType
  name: string
  fullName: string
  description: string
  keyPrinciples: string[]
  bestFor: string[]
  techniques: TherapyTechnique[]
  color: string
  icon: string
}

export interface TherapyTechnique {
  id: string
  name: string
  description: string
  steps: string[]
  duration: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export interface CognitiveDistortion {
  id: string
  name: string
  description: string
  example: string
  challenge: string
}
