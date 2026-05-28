import type { JobApplication } from '../types'

const API_URL = '/api'

export async function getJobs(): Promise<JobApplication[]> {
  const res = await fetch(`${API_URL}/jobs`)
  if (!res.ok) throw new Error('Failed to fetch jobs')
  return res.json()
}

export async function createJob(job: JobApplication): Promise<JobApplication> {
  const res = await fetch(`${API_URL}/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(job),
  })
  if (!res.ok) throw new Error('Failed to create job')
  return res.json()
}

export async function updateJob(
  id: string,
  updates: Partial<JobApplication>,
): Promise<JobApplication> {
  const res = await fetch(`${API_URL}/jobs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  if (!res.ok) throw new Error('Failed to update job')
  return res.json()
}

export async function deleteJob(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/jobs/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to delete job')
}
