import { create } from 'zustand'
import type { ProfilePayload } from '../../profile/profileService'

export type CVTemplateType = 'modern' | 'minimal' | 'creative'
export type AppMode = 'pdf' | 'web'

export interface CustomSection {
  id: string
  title: string
  icon?: string
  content: string
}

export interface CVStoreState {
  appMode: AppMode
  cvId: string | null
  cvName: string
  slug: string | null
  isPublic: boolean
  isReadOnly: boolean
  isSaving: boolean
  myCvs: any[]

  profile: Partial<ProfilePayload>
  templateId: CVTemplateType
  themeColor: string
  fontFamily: string
  spacing: 'compact' | 'normal' | 'spacious'
  avatarUrl: string | null
  sectionsOrder: string[]
  hiddenSections: string[]       // section IDs that are hidden
  hiddenItems: Record<string, number[]> // sectionId -> array of hidden item indices
  customSections: CustomSection[]
  
  // AI Assistant Drawer
  aiDrawer: {
    isOpen: boolean
    currentText: string
    currentPath: string | null // path in profile to update (e.g. 'personalInfo.summary')
  }

  // Actions
  setAppMode: (mode: AppMode) => void
  setCvId: (id: string | null) => void
  setCvName: (name: string) => void
  setSlug: (slug: string | null) => void
  setIsPublic: (isPublic: boolean) => void
  setIsReadOnly: (readOnly: boolean) => void
  setIsSaving: (saving: boolean) => void
  setMyCvs: (cvs: any[]) => void
  loadCvData: (data: any) => void

  setProfile: (profile: Partial<ProfilePayload>) => void
  updateField: (path: string, value: any) => void
  setTemplate: (id: CVTemplateType) => void
  setThemeColor: (color: string) => void
  setFontFamily: (font: string) => void
  setSpacing: (spacing: 'compact' | 'normal' | 'spacious') => void
  setAvatarUrl: (url: string | null) => void
  setSectionsOrder: (order: string[]) => void

  // Hide/Show
  toggleHideSection: (sectionId: string) => void
  toggleHideItem: (sectionId: string, index: number) => void

  // Custom sections
  addCustomSection: (title: string) => void
  removeCustomSection: (id: string) => void
  updateCustomSection: (id: string, content: string) => void
  
  // AI Actions
  setAiDrawer: (drawer: Partial<CVStoreState['aiDrawer']>) => void
  closeAiDrawer: () => void
}

export const DEFAULT_SECTIONS = [
  'summary',
  'experience',
  'education',
  'projects',
  'certifications',
  'skills',
]

const initialState = {
  appMode: 'pdf' as AppMode,
  cvId: null,
  cvName: 'Chưa đặt tên',
  slug: null,
  isPublic: false,
  isReadOnly: false,
  isSaving: false,
  myCvs: [],
  profile: {},
  templateId: 'modern' as CVTemplateType,
  themeColor: '#2563eb',
  fontFamily: '"Inter", sans-serif',
  spacing: 'normal' as const,
  avatarUrl: null,
  sectionsOrder: DEFAULT_SECTIONS,
  hiddenSections: [] as string[],
  hiddenItems: {} as Record<string, number[]>,
  customSections: [] as CustomSection[],
  aiDrawer: {
    isOpen: false,
    currentText: '',
    currentPath: null,
  },
}

export const useCVStore = create<CVStoreState>((set) => ({
  ...initialState,

  setAppMode: (mode) => set({ appMode: mode }),
  setCvId: (id) => set({ cvId: id }),
  setCvName: (name) => set({ cvName: name }),
  setSlug: (slug) => set({ slug }),
  setIsPublic: (isPublic) => set({ isPublic }),
  setIsReadOnly: (isReadOnly) => set({ isReadOnly }),
  setIsSaving: (isSaving) => set({ isSaving }),
  setMyCvs: (myCvs) => set({ myCvs }),

  loadCvData: (data) => {
    if (!data) return;
    set({
      profile: data.profile || {},
      cvName: data.name || 'Chưa đặt tên',
      templateId: data.templateId || 'modern',
      themeColor: data.themeColor || '#2563eb',
      fontFamily: data.fontFamily || '"Inter", sans-serif',
      spacing: data.spacing || 'normal',
      avatarUrl: data.avatarUrl || null,
      sectionsOrder: data.sectionsOrder || DEFAULT_SECTIONS,
      hiddenSections: data.hiddenSections || [],
      hiddenItems: data.hiddenItems || {},
      customSections: data.customSections || [],
    })
  },

  setProfile: (profile) => set({ profile }),

  updateField: (path, value) =>
    set((state) => {
      const parts = path.split('.')

      if (parts.length === 1) {
        return { profile: { ...state.profile, [parts[0]]: value } }
      }

      const newProfile = JSON.parse(JSON.stringify(state.profile))
      let curr = newProfile
      for (let i = 0; i < parts.length - 1; i++) {
        const p = parts[i]
        const next = parts[i + 1]
        if (!curr[p]) {
          curr[p] = isNaN(Number(next)) ? {} : []
        }
        curr = curr[p]
      }
      curr[parts[parts.length - 1]] = value
      return { profile: newProfile }
    }),

  setTemplate: (id) => set({ templateId: id }),
  setThemeColor: (color) => set({ themeColor: color }),
  setFontFamily: (font) => set({ fontFamily: font }),
  setSpacing: (spacing) => set({ spacing }),
  setAvatarUrl: (url) => set({ avatarUrl: url }),
  setSectionsOrder: (order) => set({ sectionsOrder: order }),

  toggleHideSection: (sectionId) =>
    set((state) => {
      const hidden = state.hiddenSections.includes(sectionId)
        ? state.hiddenSections.filter((s) => s !== sectionId)
        : [...state.hiddenSections, sectionId]
      return { hiddenSections: hidden }
    }),

  toggleHideItem: (sectionId, index) =>
    set((state) => {
      const existing = state.hiddenItems[sectionId] || []
      const updated = existing.includes(index)
        ? existing.filter((i) => i !== index)
        : [...existing, index]
      return { hiddenItems: { ...state.hiddenItems, [sectionId]: updated } }
    }),

  addCustomSection: (title) =>
    set((state) => {
      const id = `custom_${Date.now()}`
      const newSection: CustomSection = { id, title, content: '' }
      return {
        customSections: [...state.customSections, newSection],
        sectionsOrder: [...state.sectionsOrder, id],
      }
    }),

  removeCustomSection: (id) =>
    set((state) => ({
      customSections: state.customSections.filter((s) => s.id !== id),
      sectionsOrder: state.sectionsOrder.filter((s) => s !== id),
    })),

  updateCustomSection: (id, content) =>
    set((state) => ({
      customSections: state.customSections.map((s) =>
        s.id === id ? { ...s, content } : s
      ),
    })),

  setAiDrawer: (drawer) =>
    set((state) => ({
      aiDrawer: { ...state.aiDrawer, ...drawer },
    })),

  closeAiDrawer: () =>
    set((state) => ({
      aiDrawer: { ...state.aiDrawer, isOpen: false },
    })),
}))
