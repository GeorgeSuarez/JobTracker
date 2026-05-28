import { useState } from 'react'
import type { JobApplication, JobStatus, ViewType } from '../types'
import StatusBadge from './StatusBadge'
import './JobCard.css'

interface JobCardProps {
  job: JobApplication
  layout?: ViewType
  onUpdate: (id: string, updates: Partial<JobApplication>) => void
  onDelete: (id: string) => void
}

const statuses: JobStatus[] = ['Submitted', 'In Progress', 'Accepted', 'Rejected', 'Ghosted']

export default function JobCard({ job, layout = 'card', onUpdate, onDelete }: JobCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<JobApplication>(job)

  const handleSave = () => {
    onUpdate(job.id, formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData(job)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className={`job-card editing ${layout === 'list' ? 'list-layout' : ''}`}>
        <div className="form-group">
          <label htmlFor={`title-${job.id}`}>Job Title</label>
          <input
            id={`title-${job.id}`}
            type="text"
            value={formData.jobTitle}
            onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor={`company-${job.id}`}>Company</label>
          <input
            id={`company-${job.id}`}
            type="text"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor={`url-${job.id}`}>Company URL</label>
          <input
            id={`url-${job.id}`}
            type="url"
            value={formData.companyUrl}
            onChange={(e) => setFormData({ ...formData, companyUrl: e.target.value })}
            placeholder="https://..."
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor={`status-${job.id}`}>Status</label>
            <select
              id={`status-${job.id}`}
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
          <div className="form-group">
            <label htmlFor={`date-${job.id}`}>Date Applied</label>
            <input
              id={`date-${job.id}`}
              type="date"
              value={formData.dateApplied}
              onChange={(e) => setFormData({ ...formData, dateApplied: e.target.value })}
            />
          </div>
        </div>
        <div className="card-actions">
          <button type="button" className="btn-save" onClick={handleSave}>
            Save
          </button>
          <button type="button" className="btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`job-card ${layout === 'list' ? 'list-layout' : ''}`}>
      <div className="card-main">
        <div className="card-header">
          <h3>{job.jobTitle}</h3>
          <StatusBadge status={job.status} />
        </div>
        <p className="company-name">{job.companyName}</p>
      </div>

      {job.companyUrl && (
        <a
          href={job.companyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="company-link"
        >
          View Job Board
        </a>
      )}

      <p className="date-applied">
        Applied: {new Date(job.dateApplied).toLocaleDateString()}
      </p>

      <div className="card-actions">
        <button type="button" className="btn-edit" onClick={() => setIsEditing(true)}>
          Edit
        </button>
        <button type="button" className="btn-delete" onClick={() => onDelete(job.id)}>
          Delete
        </button>
      </div>
    </div>
  )
}
