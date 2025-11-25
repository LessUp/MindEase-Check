/**
 * 全局应用状态管理
 * 使用 Zustand 实现轻量级状态管理
 */
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { AssessmentRecord, DailyMood, UserPreferences, ScaleType } from '../core/types'

// ========================================
// 状态类型定义
// ========================================
interface AppState {
  // 用户信息
  userId: string | null
  isLoggedIn: boolean
  preferences: UserPreferences

  // 评估记录
  assessments: AssessmentRecord[]
  currentAssessment: Partial<AssessmentRecord> | null

  // 心情记录
  moods: DailyMood[]

  // UI状态
  activeTab: 'home' | 'tools' | 'history' | 'profile'
  isMobileMenuOpen: boolean
  isLoading: boolean

  // Actions
  setUserId: (id: string | null) => void
  setPreferences: (prefs: Partial<UserPreferences>) => void
  
  addAssessment: (record: AssessmentRecord) => void
  deleteAssessment: (id: string) => void
  setCurrentAssessment: (assessment: Partial<AssessmentRecord> | null) => void
  
  addMood: (mood: DailyMood) => void
  
  setActiveTab: (tab: AppState['activeTab']) => void
  setMobileMenuOpen: (open: boolean) => void
  setLoading: (loading: boolean) => void
  
  // 统计方法
  getAssessmentsByScale: (scaleId: ScaleType) => AssessmentRecord[]
  getRecentAssessments: (days?: number) => AssessmentRecord[]
  getScoreHistory: (scaleId: ScaleType, limit?: number) => { date: string; score: number }[]
}

// ========================================
// 默认偏好设置
// ========================================
const defaultPreferences: UserPreferences = {
  theme: 'system',
  language: 'zh-CN',
  enableNotifications: false,
  enableLocalStorage: true,
}

// ========================================
// 创建 Store
// ========================================
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 初始状态
      userId: null,
      isLoggedIn: false,
      preferences: defaultPreferences,
      assessments: [],
      currentAssessment: null,
      moods: [],
      activeTab: 'home',
      isMobileMenuOpen: false,
      isLoading: false,

      // Actions
      setUserId: (id) => set({ userId: id, isLoggedIn: !!id }),
      
      setPreferences: (prefs) => set((state) => ({
        preferences: { ...state.preferences, ...prefs }
      })),

      addAssessment: (record) => set((state) => {
        const existing = state.assessments.findIndex(a => a.id === record.id)
        let newAssessments: AssessmentRecord[]
        
        if (existing >= 0) {
          newAssessments = [...state.assessments]
          newAssessments[existing] = record
        } else {
          newAssessments = [record, ...state.assessments]
        }
        
        // 按时间倒序排列，最多保留100条
        newAssessments.sort((a, b) => b.completedAt - a.completedAt)
        newAssessments = newAssessments.slice(0, 100)
        
        return { assessments: newAssessments }
      }),

      deleteAssessment: (id) => set((state) => ({
        assessments: state.assessments.filter(a => a.id !== id)
      })),

      setCurrentAssessment: (assessment) => set({ currentAssessment: assessment }),

      addMood: (mood) => set((state) => {
        const existing = state.moods.findIndex(m => m.date === mood.date)
        let newMoods: DailyMood[]
        
        if (existing >= 0) {
          newMoods = [...state.moods]
          newMoods[existing] = mood
        } else {
          newMoods = [mood, ...state.moods]
        }
        
        newMoods.sort((a, b) => b.date.localeCompare(a.date))
        newMoods = newMoods.slice(0, 365) // 保留一年
        
        return { moods: newMoods }
      }),

      setActiveTab: (tab) => set({ activeTab: tab }),
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
      setLoading: (loading) => set({ isLoading: loading }),

      // 统计方法
      getAssessmentsByScale: (scaleId) => {
        return get().assessments.filter(a => a.scaleId === scaleId)
      },

      getRecentAssessments: (days = 30) => {
        const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
        return get().assessments.filter(a => a.completedAt >= cutoff)
      },

      getScoreHistory: (scaleId, limit = 10) => {
        const records = get().getAssessmentsByScale(scaleId)
        return records.slice(0, limit).map(r => ({
          date: new Date(r.completedAt).toLocaleDateString('zh-CN'),
          score: r.totalScore,
        })).reverse()
      },
    }),
    {
      name: 'mindease-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userId: state.userId,
        preferences: state.preferences,
        assessments: state.assessments,
        moods: state.moods,
      }),
    }
  )
)

// ========================================
// 选择器钩子（优化性能）
// ========================================
export const useAssessments = () => useAppStore((state) => state.assessments)
export const usePreferences = () => useAppStore((state) => state.preferences)
export const useActiveTab = () => useAppStore((state) => state.activeTab)
export const useMoods = () => useAppStore((state) => state.moods)
