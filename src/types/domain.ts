export type UserRole = 'student' | 'recruiter'

export type JobStatus = 'draft' | 'open' | 'closed'
export type ApplicationStatus =
  | 'pending'
  | 'shortlisted'
  | 'interview'
  | 'rejected'
  | 'offered'

export type UserSummary = {
  _id: string
  fullName: string
  email: string
}

export type JobItem = {
  id?: string
  _id: string
  title: string
  company: string
  companyName?: string
  location?: string
  description?: string
  requirements?: string
  phone?: string
  imageUrl?: string
  experienceYears?: number | null
  salaryMin?: number | null
  salaryMax?: number | null
  salaryFrom?: number | null
  salaryTo?: number | null
  deadline?: string | null
  tags?: string[]
  detailViewCount?: number
  status?: JobStatus
  createdAt?: string
  updatedAt?: string
}

export type JobsListResponse = {
  items: JobItem[]
  total: number
}

export type CvItem = {
  _id: string
  name: string
  fileUrl?: string
  fileMimeType?: string
  fileSize?: number
  isDefault?: boolean
  createdAt?: string
  updatedAt?: string
}

export type ApplicationItem = {
  cvSource?: 'uploaded_cv' | 'profile_default'
  rejectedBy?: 'student' | 'recruiter' | null
  profileCvSnapshot?: {
    fullName?: string
    email?: string
    phone?: string
    address?: string
    summary?: string
    skills?: string[]
    educations?: unknown[]
    experiences?: unknown[]
    projects?: unknown[]
  }
  statusHistory?: Array<{
    status: ApplicationStatus
    updatedAt?: string
  }>
  _id: string
  jobId: string | JobItem
  applicantId: string | UserSummary
  cvId?: string | CvItem | null
  status: ApplicationStatus
  coverLetter?: string
  createdAt?: string
  updatedAt?: string
}

export type ApplicationsMeResponse = {
  applications: ApplicationItem[]
  savedJobs: JobItem[]
}

export type StudentDashboardStats = {
  totalApplications: number
  shortlisted: number
  interviews: number
  savedJobs: number
  cvsCount: number
  defaultCvName: string | null
}

export type RecruiterDashboardStats = {
  totalJobs: number
  openJobs: number
  totalApplications: number
  todayApplications: number
}

export type NotificationItem = {
  _id: string
  userId: string
  type: string
  title: string
  message: string
  entityType?: string
  entityId?: string
  isRead: boolean
  createdAt: string
  updatedAt?: string
}
