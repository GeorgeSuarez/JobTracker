import { useState } from 'react'
import type { JobApplication, JobStatus } from '../types'
import './JobForm.css'

interface JobFormProps {
  onAdd: (job: JobApplication) => void
  onCancel: () => void
}

const statuses: JobStatus[] = ['Submitted', 'In Progress', 'Accepted', 'Rejected', 'Ghosted']

export default function JobForm({ onAdd, onCancel }: JobFormProps) {
  const [formData, setFormData] = useState<Partial<JobApplication>>({
    jobTitle: '',
    companyName: '',
    companyUrl: '',
    status: 'Submitted',
    dateApplied: new Date().toISOString().split('T')[0],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.jobTitle || !formData.companyName) return

    const newJob: JobApplication = {
      id: crypto.randomUUID(),
      jobTitle: formData.jobTitle,
      companyName: formData.companyName,
      companyUrl: formData.companyUrl || '',
      status: (formData.status as JobStatus) || 'Submitted',
      dateApplied: formData.dateApplied || new Date().toISOString().split('T')[0],
    }

    onAdd(newJob)
  }

  return (
    <form className="job-form" onSubmit={handleSubmit}>
      <h2>Add New Application</h2>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="new-title">Job Title *</label>
          <input
            id="new-title"
            type="text"
            required
            value={formData.jobTitle}
            onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
            placeholder="e.g. Frontend Engineer"
          />
        </div>
        <div className="form-group">
          <label htmlFor="new-company">Company *</label>
          <input
            id="new-company"
            type="text"
            required
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            placeholder="e.g. Acme Inc"
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="new-url">Company URL</label>
          <input
            id="new-url"
            type="url"
            value={formData.companyUrl}
            onChange={(e) => setFormData({ ...formData, companyUrl: e.target.value })}
            placeholder="https://careers.company.com"
          />
        </div>
        <div className="form-group">
          <label htmlFor="new-status">Status</label>
          <select
            id="new-status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as JobStatus })}
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="new-date">Date Applied</label>
        <input
          id="new-date"
          type="date"
          value={formData.dateApplied}
          onChange={(e) => setFormData({ ...formData, dateApplied: e.target.value })}
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn-primary">
          Add Application
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}
