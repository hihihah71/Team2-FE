import { API_ENDPOINTS } from '../../constants/api'
import { apiDelete, apiGet, apiPost, apiPut } from '../../services/httpClient'
import type { CvItem } from '../../types/domain'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const TOKEN_KEY = 'access_token'

function toAbsoluteFileUrl(fileUrl?: string) {
  if (!fileUrl) return ''
  if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) return fileUrl
  if (!fileUrl.startsWith('/')) return fileUrl
  const apiOrigin = API_BASE_URL.replace(/\/api\/?$/, '')
  const token = window.localStorage.getItem(TOKEN_KEY)
  const separator = fileUrl.includes('?') ? '&' : '?'
  const withToken = token ? `${fileUrl}${separator}token=${encodeURIComponent(token)}` : fileUrl
  return `${apiOrigin}${withToken}`
}

function normalizeCv(cv: CvItem): CvItem {
  return {
    ...cv,
    fileUrl: toAbsoluteFileUrl(cv.fileUrl),
  }
}

export function getMyCVs() {
  return apiGet<CvItem[]>(API_ENDPOINTS.CVS_ME).then((items) =>
    Array.isArray(items) ? items.map(normalizeCv) : [],
  )
}

export function createCv(payload: { name: string; fileUrl?: string; isDefault?: boolean }) {
  return apiPost<CvItem>(API_ENDPOINTS.CVS_CREATE, payload).then(normalizeCv)
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result || '')
      const base64 = result.includes(',') ? result.split(',')[1] : result
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export async function uploadPdfCv(file: File, payload?: { name?: string; isDefault?: boolean }) {
  const base64 = await fileToBase64(file)
  const created = await apiPost<CvItem>(API_ENDPOINTS.CVS_CREATE, {
    name: payload?.name?.trim() || file.name,
    isDefault: payload?.isDefault || false,
    fileName: file.name,
    fileMimeType: file.type || 'application/pdf',
    fileDataBase64: base64,
  })
  return normalizeCv(created)
}

export function updateCv(cvId: string, payload: Partial<CvItem>) {
  return apiPut<CvItem>(API_ENDPOINTS.CVS_UPDATE(cvId), payload).then(normalizeCv)
}

export function deleteCv(cvId: string) {
  return apiDelete<{ message: string }>(API_ENDPOINTS.CVS_DELETE(cvId))
}
