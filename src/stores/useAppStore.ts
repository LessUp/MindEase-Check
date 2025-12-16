import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AssessmentRecord, DailyMood, TabType, UserPreferences, UserProfile } from '../core/types'

interface AppState {
  // Navigation
  activeTab: TabType
  setActiveTab: (tab: TabType) => void

  // Assessment Records
  assessments: AssessmentRecord[]
  addAssessment: (record: AssessmentRecord) => void
  deleteAssessment: (id: string) => void
  clearAssessments: () => void

  // Mood Records
  moods: DailyMood[]
  addMood: (value: number) => void
  clearMoods: () => void

  // Preferences
  preferences: UserPreferences
  setPreferences: (patch: Partial<UserPreferences>) => void

  // User Profile
  profile: UserProfile | null
  setProfile: (profile: UserProfile) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Navigation
      activeTab: 'home',
      setActiveTab: (tab) => set({ activeTab: tab }),

      // Assessment Records
      assessments: [],
      addAssessment: (record) =>
        set((state) => ({
          assessments: [record, ...state.assessments].slice(0, 50), // Keep last 50
        })),
      deleteAssessment: (id) =>
        set((state) => ({
          assessments: state.assessments.filter((r) => r.id !== id),
        })),
      clearAssessments: () => set({ assessments: [] }),

      // Mood Records
      moods: [],
      addMood: (value) =>
        set((state) => {
          const now = Date.now()
          const mood: DailyMood = {
            id: `mood_${now}`,
            date: now,
            value,
            synced: false,
          }

          return {
            moods: [mood, ...state.moods].slice(0, 30),
          }
        }),
      clearMoods: () => set({ moods: [] }),

      // Preferences
      preferences: {
        theme: 'system',
        enableNotifications: true,
        enableLocalStorage: true,
      },
      setPreferences: (patch) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            ...patch,
          },
        })),

      // User Profile
      profile: null,
      setProfile: (profile) => set({ profile }),
    }),
    {
      name: 'mindease-storage',
      partialize: (state) => ({
        assessments: state.assessments,
        moods: state.moods,
        preferences: state.preferences,
        profile: state.profile,
      }),
    }
  )
)
