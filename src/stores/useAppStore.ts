import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AssessmentRecord, TabType, UserProfile } from '../core/types'

interface AppState {
  // Navigation
  activeTab: TabType
  setActiveTab: (tab: TabType) => void

  // Assessment Records
  assessments: AssessmentRecord[]
  addAssessment: (record: AssessmentRecord) => void
  clearAssessments: () => void

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
      clearAssessments: () => set({ assessments: [] }),

      // User Profile
      profile: null,
      setProfile: (profile) => set({ profile }),
    }),
    {
      name: 'mindease-storage',
      partialize: (state) => ({
        assessments: state.assessments,
        profile: state.profile,
      }),
    }
  )
)
