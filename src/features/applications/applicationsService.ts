import { API_ENDPOINTS } from '../../constants/api'
import { apiGet, apiPatch, apiPost } from '../../services/httpClient'
import type {
  ApplicationItem,
  ApplicationStatus,
  ApplicationsMeResponse,
} from '../../types/domain'


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const TOKEN_KEY = 'access_token'

function toAbsoluteFileUrl(fileUrl?: string) {
  if (!fileUrl) return ''
  if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) return fileUrl
  if (!fileUrl.startsWith('/')) return fileUrl
  const token = window.localStorage.getItem(TOKEN_KEY)
  const separator = fileUrl.includes('?') ? '&' : '?'
  const withToken = token ? `${fileUrl}${separator}token=${encodeURIComponent(token)}` : fileUrl
  const apiOrigin = API_BASE_URL.replace(/\/api\/?$/, '')
  return `${apiOrigin}${withToken}`
}

function normalizeApplication(app: ApplicationItem): ApplicationItem {
  const cv =
    app.cvId && typeof app.cvId === 'object'
      ? { ...app.cvId, fileUrl: toAbsoluteFileUrl(app.cvId.fileUrl) }
      : app.cvId
  return {
    ...app,
    cvId: cv,
  }
}

export function getMyApplicationsAndSavedJobs() {
  return apiGet<ApplicationsMeResponse>(API_ENDPOINTS.APPLICATIONS_ME).then((data) => ({
    ...data,
    applications: Array.isArray(data.applications)
      ? data.applications.map(normalizeApplication)
      : [],
  }))
}

export function applyToJob(payload: {
  jobId: string
  cvId?: string
  cvSource?: 'uploaded_cv' | 'profile_default'
  coverLetter?: string
}) {
  return apiPost<ApplicationItem>(API_ENDPOINTS.APPLICATIONS_CREATE, payload).then(normalizeApplication)
}

export function getApplicantsByJob(jobId: string) {
  return apiGet<ApplicationItem[]>(API_ENDPOINTS.APPLICATIONS_BY_JOB(jobId)).then((items) =>
    Array.isArray(items) ? items.map(normalizeApplication) : [],
  )
}

export function getApplicantByJob(jobId: string, applicantId: string) {
  return apiGet<ApplicationItem>(
    API_ENDPOINTS.APPLICATIONS_BY_JOB_APPLICANT(jobId, applicantId),
  ).then(normalizeApplication)
}

export const updateApplicationStatus = async (
  id: string,
  status: ApplicationStatus,
  metadata?: any 
) => {
  // Sửa dòng dưới đây để dùng đường dẫn trực tiếp
  return apiPatch<ApplicationItem>(`/applications/${id}`, {
    status,
    ...metadata // Chứa interviewDate để gửi lên Backend
  }).then(normalizeApplication);
};

export function rejectMyApplication(applicationId: string) {
  return apiPatch<ApplicationItem>(API_ENDPOINTS.APPLICATIONS_REJECT_SELF(applicationId), {}).then(
    normalizeApplication,
  )
}


export function acceptOffer(applicationId: string) {
  return apiPatch<ApplicationItem>(
    `/applications/${applicationId}/accept-offer`,
    {}
  ).then(normalizeApplication)
}

export function refuseOffer(applicationId: string) {
  return apiPatch<ApplicationItem>(
    `/applications/${applicationId}/refuse-offer`,
    {}
  ).then(normalizeApplication)
}


export async function bulkUpdateApplicationStatus(applicationIds: string[], status: ApplicationStatus) {
  // Đăng Vũ cần tạo endpoint này ở Backend: PATCH /applications/bulk-status
  return apiPatch<ApplicationItem[]>(`/applications/bulk-status`, {
    applicationIds,
    status,
  }).then(items => Array.isArray(items) ? items.map(normalizeApplication) : []);
}

export const acceptInterview = async (id: string) => {
  return apiPatch<ApplicationItem>(`/applications/${id}/accept-interview`, {}).then(normalizeApplication)
}