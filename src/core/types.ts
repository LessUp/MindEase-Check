export type ScaleType = 'PHQ9' | 'GAD7'

export interface AssessmentRecord {
  id: string
  scaleId: ScaleType
  answers: number[]
  totalScore: number
  severity: string
  completedAt: number
  synced: boolean
}

export interface UserProfile {
  nickname?: string
  avatar?: string
  createdAt: number
}

export type TabType = 'home' | 'history' | 'profile'
