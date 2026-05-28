import express from 'express'
import cors from 'cors'
import db from './db.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// GET all jobs
app.get('/api/jobs', (_req, res) => {
  try {
    const jobs = db.prepare('SELECT * FROM jobs ORDER BY dateApplied DESC').all()
    res.json(jobs)
  } catch {
    res.status(500).json({ error: 'Failed to fetch jobs' })
  }
})

// GET single job
app.get('/api/jobs/:id', (req, res) => {
  try {
    const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.id)
    if (!job) {
      res.status(404).json({ error: 'Job not found' })
      return
    }
    res.json(job)
  } catch {
    res.status(500).json({ error: 'Failed to fetch job' })
  }
})

// CREATE job
app.post('/api/jobs', (req, res) => {
  try {
    const { id, jobTitle, companyName, companyUrl, status, dateApplied } = req.body

    if (!id || !jobTitle || !companyName || !status || !dateApplied) {
      res.status(400).json({ error: 'Missing required fields' })
      return
    }

    const stmt = db.prepare(
      'INSERT INTO jobs (id, jobTitle, companyName, companyUrl, status, dateApplied) VALUES (?, ?, ?, ?, ?, ?)'
    )
    stmt.run(id, jobTitle, companyName, companyUrl || '', status, dateApplied)

    const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(id)
    res.status(201).json(job)
  } catch {
    res.status(500).json({ error: 'Failed to create job' })
  }
})

// UPDATE job
app.put('/api/jobs/:id', (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    const fields: string[] = []
    const values: unknown[] = []

    if (updates.jobTitle !== undefined) {
      fields.push('jobTitle = ?')
      values.push(updates.jobTitle)
    }
    if (updates.companyName !== undefined) {
      fields.push('companyName = ?')
      values.push(updates.companyName)
    }
    if (updates.companyUrl !== undefined) {
      fields.push('companyUrl = ?')
      values.push(updates.companyUrl)
    }
    if (updates.status !== undefined) {
      fields.push('status = ?')
      values.push(updates.status)
    }
    if (updates.dateApplied !== undefined) {
      fields.push('dateApplied = ?')
      values.push(updates.dateApplied)
    }

    if (fields.length === 0) {
      res.status(400).json({ error: 'No fields to update' })
      return
    }

    values.push(id)
    const stmt = db.prepare(`UPDATE jobs SET ${fields.join(', ')} WHERE id = ?`)
    stmt.run(...values)

    const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(id)
    res.json(job)
  } catch {
    res.status(500).json({ error: 'Failed to update job' })
  }
})

// DELETE job
app.delete('/api/jobs/:id', (req, res) => {
  try {
    const { id } = req.params
    const result = db.prepare('DELETE FROM jobs WHERE id = ?').run(id)

    if (result.changes === 0) {
      res.status(404).json({ error: 'Job not found' })
      return
    }

    res.status(204).send()
  } catch {
    res.status(500).json({ error: 'Failed to delete job' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
