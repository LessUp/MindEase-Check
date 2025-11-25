/**
 * 存储服务抽象层
 * 提供统一接口，支持多平台适配
 */
import type { 
  AssessmentRecord, 
  ToolUsageRecord, 
  DailyMood, 
  UserPreferences,
  Platform 
} from '../types'

// ========================================
// 存储接口定义
// ========================================
export interface IStorageAdapter {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T): Promise<void>
  remove(key: string): Promise<void>
  clear(): Promise<void>
  keys(): Promise<string[]>
}

// ========================================
// Web LocalStorage 适配器
// ========================================
export class WebStorageAdapter implements IStorageAdapter {
  private prefix: string

  constructor(prefix = 'mindease_') {
    this.prefix = prefix
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const item = localStorage.getItem(this.prefix + key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    localStorage.setItem(this.prefix + key, JSON.stringify(value))
  }

  async remove(key: string): Promise<void> {
    localStorage.removeItem(this.prefix + key)
  }

  async clear(): Promise<void> {
    const keys = await this.keys()
    keys.forEach(key => localStorage.removeItem(key))
  }

  async keys(): Promise<string[]> {
    return Object.keys(localStorage).filter(k => k.startsWith(this.prefix))
  }
}

// ========================================
// 存储键名常量
// ========================================
export const STORAGE_KEYS = {
  ASSESSMENTS: 'assessments',
  TOOL_USAGES: 'tool_usages',
  MOODS: 'moods',
  PREFERENCES: 'preferences',
  USER: 'user',
  LAST_SYNC: 'last_sync',
  DEVICE_ID: 'device_id',
} as const

// ========================================
// 数据服务
// ========================================
export class DataService {
  private storage: IStorageAdapter

  constructor(storage: IStorageAdapter) {
    this.storage = storage
  }

  // === 评估记录 ===
  async getAssessments(): Promise<AssessmentRecord[]> {
    return (await this.storage.get<AssessmentRecord[]>(STORAGE_KEYS.ASSESSMENTS)) || []
  }

  async saveAssessment(record: AssessmentRecord): Promise<void> {
    const records = await this.getAssessments()
    const index = records.findIndex(r => r.id === record.id)
    if (index >= 0) {
      records[index] = record
    } else {
      records.push(record)
    }
    // 按时间倒序排列
    records.sort((a, b) => b.completedAt - a.completedAt)
    await this.storage.set(STORAGE_KEYS.ASSESSMENTS, records)
  }

  async deleteAssessment(id: string): Promise<void> {
    const records = await this.getAssessments()
    const filtered = records.filter(r => r.id !== id)
    await this.storage.set(STORAGE_KEYS.ASSESSMENTS, filtered)
  }

  async getAssessmentsByScale(scaleId: string): Promise<AssessmentRecord[]> {
    const records = await this.getAssessments()
    return records.filter(r => r.scaleId === scaleId)
  }

  async getRecentAssessments(days = 30): Promise<AssessmentRecord[]> {
    const records = await this.getAssessments()
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
    return records.filter(r => r.completedAt >= cutoff)
  }

  // === 工具使用记录 ===
  async getToolUsages(): Promise<ToolUsageRecord[]> {
    return (await this.storage.get<ToolUsageRecord[]>(STORAGE_KEYS.TOOL_USAGES)) || []
  }

  async saveToolUsage(record: ToolUsageRecord): Promise<void> {
    const records = await this.getToolUsages()
    records.push(record)
    // 只保留最近100条
    const trimmed = records.slice(-100)
    await this.storage.set(STORAGE_KEYS.TOOL_USAGES, trimmed)
  }

  // === 心情记录 ===
  async getMoods(): Promise<DailyMood[]> {
    return (await this.storage.get<DailyMood[]>(STORAGE_KEYS.MOODS)) || []
  }

  async saveMood(mood: DailyMood): Promise<void> {
    const moods = await this.getMoods()
    const index = moods.findIndex(m => m.date === mood.date)
    if (index >= 0) {
      moods[index] = mood
    } else {
      moods.push(mood)
    }
    moods.sort((a, b) => b.date.localeCompare(a.date))
    await this.storage.set(STORAGE_KEYS.MOODS, moods)
  }

  // === 用户偏好 ===
  async getPreferences(): Promise<UserPreferences> {
    const prefs = await this.storage.get<UserPreferences>(STORAGE_KEYS.PREFERENCES)
    return prefs || {
      theme: 'system',
      language: 'zh-CN',
      enableNotifications: false,
      enableLocalStorage: true,
    }
  }

  async savePreferences(prefs: Partial<UserPreferences>): Promise<void> {
    const current = await this.getPreferences()
    await this.storage.set(STORAGE_KEYS.PREFERENCES, { ...current, ...prefs })
  }

  // === 设备ID ===
  async getDeviceId(): Promise<string> {
    let deviceId = await this.storage.get<string>(STORAGE_KEYS.DEVICE_ID)
    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random().toString(36).slice(2)}`
      await this.storage.set(STORAGE_KEYS.DEVICE_ID, deviceId)
    }
    return deviceId
  }

  // === 统计分析 ===
  async getScoreStatistics(scaleId: string, days = 30) {
    const records = await this.getAssessmentsByScale(scaleId)
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
    const recent = records.filter(r => r.completedAt >= cutoff)

    if (recent.length === 0) return null

    const scores = recent.map(r => r.totalScore)
    const average = scores.reduce((a, b) => a + b, 0) / scores.length

    // 计算趋势（简单线性趋势）
    let trend: 'improving' | 'stable' | 'worsening' = 'stable'
    if (recent.length >= 3) {
      const firstHalf = recent.slice(Math.floor(recent.length / 2))
      const secondHalf = recent.slice(0, Math.floor(recent.length / 2))
      const firstAvg = firstHalf.reduce((a, r) => a + r.totalScore, 0) / firstHalf.length
      const secondAvg = secondHalf.reduce((a, r) => a + r.totalScore, 0) / secondHalf.length
      const diff = secondAvg - firstAvg
      if (diff < -2) trend = 'improving'
      else if (diff > 2) trend = 'worsening'
    }

    return {
      scaleId,
      average: Math.round(average * 10) / 10,
      min: Math.min(...scores),
      max: Math.max(...scores),
      trend,
      recordCount: recent.length,
      periodDays: days,
    }
  }

  // === 导出数据 ===
  async exportAllData() {
    return {
      assessments: await this.getAssessments(),
      toolUsages: await this.getToolUsages(),
      moods: await this.getMoods(),
      preferences: await this.getPreferences(),
      exportedAt: Date.now(),
    }
  }

  // === 清除数据 ===
  async clearAllData(): Promise<void> {
    await this.storage.clear()
  }
}

// ========================================
// 创建默认实例（Web平台）
// ========================================
export const webStorage = new WebStorageAdapter()
export const dataService = new DataService(webStorage)
