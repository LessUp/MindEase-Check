/**
 * 核心类型定义 - 可跨平台复用
 * 适用于 Web、微信小程序、React Native 等
 */

// ========================================
// 用户相关
// ========================================
export interface User {
  id: string
  nickname?: string
  avatar?: string
  createdAt: number
  lastSyncAt?: number
  preferences: UserPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: 'zh-CN' | 'zh-TW' | 'en'
  enableNotifications: boolean
  enableLocalStorage: boolean
  reminderTime?: string // HH:mm format
}

// ========================================
// 评估量表
// ========================================
export type ScaleType = 'PHQ9' | 'GAD7' | 'PSS10' | 'PSQI' | 'SAS' | 'SDS'

export interface ScaleInfo {
  id: ScaleType
  name: string
  fullName: string
  description: string
  questionCount: number
  maxScore: number
  estimatedTime: string // e.g., "3-5分钟"
  category: 'depression' | 'anxiety' | 'stress' | 'sleep' | 'general'
}

export interface ScaleQuestion {
  id: number
  text: string
  options: ScaleOption[]
}

export interface ScaleOption {
  value: number
  label: string
  description?: string
}

// ========================================
// 评估记录
// ========================================
export interface AssessmentRecord {
  id: string
  scaleId: ScaleType
  userId?: string
  answers: number[]
  totalScore: number
  severity: string
  completedAt: number
  duration?: number // 完成用时(秒)
  notes?: string
  synced: boolean
}

export interface AssessmentHistory {
  records: AssessmentRecord[]
  lastUpdated: number
}

// ========================================
// 统计分析
// ========================================
export interface ScoreStatistics {
  scaleId: ScaleType
  average: number
  min: number
  max: number
  trend: 'improving' | 'stable' | 'worsening'
  recordCount: number
  periodDays: number
}

export interface DailyMood {
  date: string // YYYY-MM-DD
  mood: 1 | 2 | 3 | 4 | 5 // 1=很差 5=很好
  note?: string
  factors?: string[] // 影响因素
}

// ========================================
// 工具使用记录
// ========================================
export interface ToolUsageRecord {
  id: string
  toolId: string
  toolType: 'breathing' | 'meditation' | 'grounding' | 'relaxation' | 'journaling'
  startedAt: number
  completedAt?: number
  duration?: number
  rating?: 1 | 2 | 3 | 4 | 5
  userId?: string
  synced: boolean
}

// ========================================
// 同步相关
// ========================================
export interface SyncPayload {
  userId: string
  deviceId: string
  timestamp: number
  assessments: AssessmentRecord[]
  toolUsages: ToolUsageRecord[]
  moods: DailyMood[]
  preferences: UserPreferences
  checksum: string
}

export interface SyncResult {
  success: boolean
  timestamp: number
  mergedCount: number
  conflicts?: SyncConflict[]
}

export interface SyncConflict {
  type: 'assessment' | 'tool' | 'mood'
  localId: string
  remoteId: string
  resolution: 'local' | 'remote' | 'merge'
}

// ========================================
// 平台适配
// ========================================
export type Platform = 'web' | 'wechat-miniprogram' | 'react-native' | 'electron'

export interface PlatformCapabilities {
  storage: 'localStorage' | 'asyncStorage' | 'wxStorage'
  notification: boolean
  share: boolean
  audio: boolean
  haptics: boolean
  biometrics: boolean
}
