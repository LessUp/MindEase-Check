export type ScaleType = 'PHQ9' | 'GAD7' | 'PSS10' | 'PSQI' | 'SAS' | 'SDS'

export interface AssessmentRecord {
  id: string
  scaleId: ScaleType
  answers: number[]
  totalScore: number
  severity: string
  completedAt: number
  synced: boolean
}

export interface DailyMood {
  id: string
  date: number
  value: number
  synced: boolean
}

export interface UserProfile {
  nickname?: string
  avatar?: string
  createdAt: number
}

export type ThemePreference = 'light' | 'dark' | 'system'

export interface UserPreferences {
  theme: ThemePreference
  enableNotifications: boolean
  enableLocalStorage: boolean
}

export type TabType = 'home' | 'tools' | 'history' | 'profile'
