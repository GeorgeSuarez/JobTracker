import Database from 'better-sqlite3'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..')

const db = new Database(join(rootDir, 'jobs.db'))

db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    jobTitle TEXT NOT NULL,
    companyName TEXT NOT NULL,
    companyUrl TEXT,
    status TEXT NOT NULL,
    dateApplied TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

// Seed with demo data if empty
const { count } = db.prepare('SELECT COUNT(*) as count FROM jobs').get() as { count: number }
if (count === 0) {
  const seedData = [
    {
      id: '1',
      jobTitle: 'Senior Frontend Engineer',
      companyName: 'TechCorp',
      companyUrl: 'https://techcorp.com/careers',
      status: 'In Progress',
      dateApplied: '2025-05-20',
    },
    {
      id: '2',
      jobTitle: 'React Developer',
      companyName: 'StartupXYZ',
      companyUrl: '',
      status: 'Submitted',
      dateApplied: '2025-05-25',
    },
    {
      id: '3',
      jobTitle: 'Full Stack Engineer',
      companyName: 'GlobalSystems',
      companyUrl: 'https://globalsystems.io/jobs',
      status: 'Rejected',
      dateApplied: '2025-05-15',
    },
    {
      id: '4',
      jobTitle: 'UI Engineer',
      companyName: 'DesignStudio',
      companyUrl: '',
      status: 'Ghosted',
      dateApplied: '2025-04-10',
    },
  ]

  const insert = db.prepare(
    'INSERT INTO jobs (id, jobTitle, companyName, companyUrl, status, dateApplied) VALUES (?, ?, ?, ?, ?, ?)'
  )
  for (const job of seedData) {
    insert.run(job.id, job.jobTitle, job.companyName, job.companyUrl, job.status, job.dateApplied)
  }
}

export default db
