import { useState, useMemo, useEffect } from 'react'
import type { JobApplication, JobStatus } from '../types'
import { getJobs } from '../api/jobs'
import StatusBadge from '../components/StatusBadge'
import './HistoryPage.css'

export default function HistoryPage() {
  const [jobs, setJobs] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [groupBy, setGroupBy] = useState<'month' | 'status'>('month')

  useEffect(() => {
    let cancelled = false
    getJobs()
      .then((data) => {
        if (!cancelled) {
          setJobs(data)
          setError(null)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load jobs')
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  const groupedJobs = useMemo(() => {
    const sorted = [...jobs].sort(
      (a, b) => new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime(),
    )

    if (groupBy === 'month') {
      const groups: Record<string, JobApplication[]> = {}
      for (const job of sorted) {
        const month = new Date(job.dateApplied).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
        })
        groups[month] = groups[month] || []
        groups[month].push(job)
      }
      return groups
    }

    const groups: Record<string, JobApplication[]> = {}
    const order = ['Submitted', 'In Progress', 'Accepted', 'Rejected', 'Ghosted'] as JobStatus[]
    for (const status of order) {
      const filtered = sorted.filter((j) => j.status === status)
      if (filtered.length > 0) {
        groups[status] = filtered
      }
    }
    return groups
  }, [jobs, groupBy])

  const groupKeys = useMemo(() => Object.keys(groupedJobs), [groupedJobs])

  const totalCount = jobs.length
  const activeCount = jobs.filter((j) => j.status === 'In Progress' || j.status === 'Submitted').length

  return (
    <div className="history-page">
      <header className="history-header">
        <h1>Application History</h1>
        <div className="history-stats">
          <div className="stat">
            <span className="stat-value">{totalCount}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat">
            <span className="stat-value">{activeCount}</span>
            <span className="stat-label">Active</span>
          </div>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          <p>{error}</p>
        </div>
      )}

      <div className="history-controls">
        <span className="history-label">Group by</span>
        <div className="group-toggle">
          <button
            type="button"
            className={groupBy === 'month' ? 'active' : ''}
            onClick={() => setGroupBy('month')}
          >
            Month
          </button>
          <button
            type="button"
            className={groupBy === 'status' ? 'active' : ''}
            onClick={() => setGroupBy('status')}
          >
            Status
          </button>
        </div>
      </div>

      {loading ? (
        <p className="loading-state">Loading history…</p>
      ) : groupKeys.length === 0 ? (
        <p className="empty-state">No application history yet.</p>
      ) : (
        <div className="history-timeline">
          {groupKeys.map((group) => (
            <section key={group} className="history-group">
              <h2 className="group-heading">{group}</h2>
              <div className="history-list">
                {groupedJobs[group].map((job) => (
                  <div key={job.id} className="history-item">
                    <div className="history-dot" />
                    <div className="history-content">
                      <div className="history-main">
                        <h3>{job.jobTitle}</h3>
                        <StatusBadge status={job.status} />
                      </div>
                      <p className="history-company">{job.companyName}</p>
                      <p className="history-date">
                        {new Date(job.dateApplied).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      {job.companyUrl && (
                        <a
                          href={job.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="history-link"
                        >
                          View Job Board
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
