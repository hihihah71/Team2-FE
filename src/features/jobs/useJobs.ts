import { useEffect, useState } from 'react'
import type { JobItem } from '../../types/domain'
import { getJobs } from './jobsService'

type UseJobsOptions = {
  search?: string
  page?: number
  limit?: number
  tags?: string[]
  location?: string
  salaryMin?: number
}

export function useJobs(options: UseJobsOptions = {}) {
  const [jobs, setJobs] = useState<JobItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const tagsKey = options.tags?.join(',') ?? ''

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    getJobs({
      page: options.page,
      limit: options.limit,
      search: options.search,
      tags: options.tags,
    })
      .then((data) => {
        if (cancelled) return
        setJobs(data.items)
        setTotal(data.total)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const message = err instanceof Error ? err.message : 'Không thể tải danh sách việc làm.'
        setError(message)
        setJobs([])
        setTotal(0)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [options.limit, options.page, options.search, tagsKey, options.location, options.salaryMin])

  return { jobs, total, loading, error }
}
