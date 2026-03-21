import { API_ENDPOINTS } from '../../constants/api'
import { apiDelete, apiGet, apiPost, apiPut } from '../../services/httpClient'
import type { JobItem, JobsListResponse } from '../../types/domain'


export type JobListQuery = {
  page?: number
  limit?: number
  search?: string
  status?: string
  tags?: string[]
}

function toQueryString(query: JobListQuery) {
  const params = new URLSearchParams()
  if (query.page != null) params.set('page', String(query.page))
  if (query.limit != null) params.set('limit', String(query.limit))
  if (query.search?.trim()) params.set('search', query.search.trim())
  if (query.status?.trim()) params.set('status', query.status.trim())
  if (query.tags && query.tags.length > 0) params.set('tags', query.tags.join(','))
  const q = params.toString()
  return q ? `?${q}` : ''
}

function normalizeJob(job: JobItem): JobItem {
  const id = job._id || job.id || ''
  const salaryMin = job.salaryMin ?? job.salaryFrom ?? null
  const salaryMax = job.salaryMax ?? job.salaryTo ?? null

  return {
    ...job,
    _id: id,
    id,
    company: job.company || job.companyName || '',
    companyName: job.companyName || job.company || '',
    salaryMin,
    salaryMax,
    salaryFrom: salaryMin,
    salaryTo: salaryMax,
  }
}

export async function getJobs(query: JobListQuery = {}): Promise<JobsListResponse> {
  const response = await apiGet<JobsListResponse | JobItem[]>(
    `${API_ENDPOINTS.JOBS_LIST}${toQueryString(query)}`,
  )

  if (Array.isArray(response)) {
    return { items: response.map(normalizeJob), total: response.length }
  }
  return {
    items: Array.isArray(response.items) ? response.items.map(normalizeJob) : [],
    total: typeof response.total === 'number' ? response.total : 0,
  }
}

export async function getJobById(jobId: string) {
  const data = await apiGet<JobItem>(API_ENDPOINTS.JOBS_DETAIL(jobId))
  return normalizeJob(data)
}

export async function getMyRecruiterJobs() {
  const data = await apiGet<JobItem[]>(API_ENDPOINTS.JOBS_MY_LIST)
  return Array.isArray(data) ? data.map(normalizeJob) : []
}

export function createJob(payload: Partial<JobItem>) {
  return apiPost<JobItem>(API_ENDPOINTS.JOBS_CREATE, payload)
}

export function updateJob(jobId: string, payload: Partial<JobItem>) {
  return apiPut<JobItem>(API_ENDPOINTS.JOBS_UPDATE(jobId), payload)
}

export function deleteJob(jobId: string) {
  return apiDelete<{ message: string }>(API_ENDPOINTS.JOBS_DELETE(jobId))
}

export function saveJob(jobId: string) {
  return apiPost<{ message: string }>(API_ENDPOINTS.JOBS_SAVE(jobId), {})
}

export function unsaveJob(jobId: string) {
  return apiDelete<{ message: string }>(API_ENDPOINTS.JOBS_SAVE(jobId))
}

export function getJobStats(jobId: string) {
  return apiGet<{ total: number; byStatus: Record<string, number>; detailViewCount: number }>(
    API_ENDPOINTS.JOBS_STATS(jobId),
  )
}

export function trackJobView(jobId: string) {
  return apiPost<{ detailViewCount: number }>(API_ENDPOINTS.JOBS_TRACK_VIEW(jobId), {})
}


export const deleteMultipleJobs = async (ids: string[]) => {
  return await apiPost<{ message: string }>('/jobs/bulk-delete', { 
    jobIds: ids 
  });
};