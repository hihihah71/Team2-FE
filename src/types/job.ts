export type Job = {
  id: string
  title?: string
  companyName?: string
  location?: string
  salaryFrom?: number
  salaryTo?: number
  createdAt?: string
  [key: string]: unknown
}

