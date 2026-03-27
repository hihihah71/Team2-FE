import { API_ENDPOINTS } from '../../constants/api'
import { apiGet, apiPatch, apiPut } from '../../services/httpClient'

export type ProfilePayload = {
  personalInfo: Record<string, unknown>
  companyInfo: Record<string, unknown>
  skills: string[]
  experiences: unknown[]
  educations: unknown[]
  socialLinks: Record<string, string>
  projects: unknown[]
  languages: unknown[]
  certifications: unknown[]
  activities: unknown[]
  hobbies: string[]
}

export function getMyProfile() {
  return apiGet<Partial<ProfilePayload>>(API_ENDPOINTS.PROFILE_ME)
}

export function saveMyProfile(payload: ProfilePayload) {
  return apiPut<void>(API_ENDPOINTS.PROFILE_SAVE, payload)
}

export function submitRecruiterVerificationRequest(payload: { note: string; evidenceImages: string[] }) {
  return apiPatch(API_ENDPOINTS.PROFILE_RECRUITER_VERIFICATION_REQUEST, payload)
}