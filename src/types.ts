export type JobStatus = 'Accepted' | 'Rejected' | 'In Progress' | 'Submitted' | 'Ghosted'

export type ViewType = 'card' | 'list'

export type SortType = 'date' | 'status'

export interface JobApplication {
  id: string
  jobTitle: string
  companyName: string
  companyUrl: string
  status: JobStatus
  dateApplied: string
}
