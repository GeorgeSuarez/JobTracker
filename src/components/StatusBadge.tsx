import type { JobStatus } from '../types'
import './StatusBadge.css'

interface StatusBadgeProps {
  status: JobStatus
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const className = `status-badge status-${status.toLowerCase().replace(/\s+/g, '-')}`
  return <span className={className}>{status}</span>
}
