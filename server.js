const express = require('express')
const path = require('path')
const { Pool } = require('pg')
const { SEED_EXPENSES, SEED_DEST_DATES } = require('./seed-data')

const app = express()
app.use(express.json())

const dbUrl = process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL
console.log('DATABASE_URL present:', !!process.env.DATABASE_URL)
console.log('DATABASE_PUBLIC_URL present:', !!process.env.DATABASE_PUBLIC_URL)
console.log('Using URL host:', dbUrl ? new URL(dbUrl).hostname : 'none')

const pool = new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false },
})

// ── DB Init & Seed ──────────────────────────────────────────────

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS expenses (
      id SERIAL PRIMARY KEY,
      description TEXT NOT NULL,
      amount NUMERIC(10,2) NOT NULL,
      category VARCHAR(50) NOT NULL,
      destination VARCHAR(100) NOT NULL,
      date VARCHAR(10) DEFAULT '',
      notes TEXT DEFAULT ''
    )
  `)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS dest_dates (
      destination VARCHAR(100) PRIMARY KEY,
      start_date VARCHAR(10) DEFAULT '',
      end_date VARCHAR(10) DEFAULT '',
      color VARCHAR(20) DEFAULT ''
    )
  `)
  // Migration: add color column if missing (existing DBs)
  await pool.query(`
    ALTER TABLE dest_dates ADD COLUMN IF NOT EXISTS color VARCHAR(20) DEFAULT ''
  `)
  // Migration: add emoji column if missing (existing DBs)
  await pool.query(`
    ALTER TABLE dest_dates ADD COLUMN IF NOT EXISTS emoji VARCHAR(10) DEFAULT ''
  `)
  // Migration: add parent column for sub-destinations
  await pool.query(`
    ALTER TABLE dest_dates ADD COLUMN IF NOT EXISTS parent VARCHAR(100) DEFAULT ''
  `)

  const { rows } = await pool.query('SELECT COUNT(*) FROM expenses')
  if (parseInt(rows[0].count) === 0) {
    for (const e of SEED_EXPENSES) {
      await pool.query(
        'INSERT INTO expenses (description, amount, category, destination, date, notes) VALUES ($1,$2,$3,$4,$5,$6)',
        [e.desc, e.amount, e.cat, e.dest, e.date, e.notes]
      )
    }
    for (const [dest, dates] of Object.entries(SEED_DEST_DATES)) {
      await pool.query(
        'INSERT INTO dest_dates (destination, start_date, end_date, color, emoji) VALUES ($1,$2,$3,$4,$5)',
        [dest, dates.start, dates.end, dates.color || '', dates.emoji || '']
      )
    }
    console.log('Seeded database with demo data')
  }
}

// ── Helper: map DB row → frontend shape ─────────────────────────

function rowToExpense(r) {
  return {
    id: r.id,
    desc: r.description,
    amount: parseFloat(r.amount),
    cat: r.category,
    dest: r.destination,
    date: r.date,
    notes: r.notes,
  }
}

// ── Expenses API ────────────────────────────────────────────────

app.get('/api/expenses', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM expenses ORDER BY date')
  res.json(rows.map(rowToExpense))
})

app.post('/api/expenses', async (req, res) => {
  const { desc, amount, cat, dest, date, notes } = req.body
  const { rows } = await pool.query(
    'INSERT INTO expenses (description, amount, category, destination, date, notes) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
    [desc, amount, cat, dest, date || '', notes || '']
  )
  res.json(rowToExpense(rows[0]))
})

app.put('/api/expenses/:id', async (req, res) => {
  const { desc, amount, cat, dest, date, notes } = req.body
  const { rows } = await pool.query(
    'UPDATE expenses SET description=$1, amount=$2, category=$3, destination=$4, date=$5, notes=$6 WHERE id=$7 RETURNING *',
    [desc, amount, cat, dest, date || '', notes || '', req.params.id]
  )
  if (rows.length === 0) return res.status(404).json({ error: 'Not found' })
  res.json(rowToExpense(rows[0]))
})

app.delete('/api/expenses/:id', async (req, res) => {
  await pool.query('DELETE FROM expenses WHERE id=$1', [req.params.id])
  res.json({ ok: true })
})

// Bulk replace (for Share tab import)
app.post('/api/expenses/bulk-replace', async (req, res) => {
  const { expenses } = req.body
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query('DELETE FROM expenses')
    for (const e of expenses) {
      await client.query(
        'INSERT INTO expenses (description, amount, category, destination, date, notes) VALUES ($1,$2,$3,$4,$5,$6)',
        [e.desc, e.amount, e.cat, e.dest, e.date || '', e.notes || '']
      )
    }
    await client.query('COMMIT')
    const { rows } = await client.query('SELECT * FROM expenses ORDER BY date')
    res.json(rows.map(rowToExpense))
  } catch (err) {
    await client.query('ROLLBACK')
    res.status(500).json({ error: err.message })
  } finally {
    client.release()
  }
})

// ── Dest Dates API ──────────────────────────────────────────────

app.get('/api/dest-dates', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM dest_dates ORDER BY destination')
  const result = {}
  rows.forEach(r => {
    result[r.destination] = { start: r.start_date, end: r.end_date, color: r.color || '', emoji: r.emoji || '', parent: r.parent || '' }
  })
  res.json(result)
})

app.put('/api/dest-dates', async (req, res) => {
  const destDates = req.body
  for (const [dest, dates] of Object.entries(destDates)) {
    await pool.query(
      `INSERT INTO dest_dates (destination, start_date, end_date, color, emoji, parent) VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (destination) DO UPDATE SET start_date=$2, end_date=$3, color=$4, emoji=$5, parent=$6`,
      [dest, dates.start || '', dates.end || '', dates.color || '', dates.emoji || '', dates.parent || '']
    )
  }
  res.json(destDates)
})

// Add a new destination
app.post('/api/dest-dates', async (req, res) => {
  const { destination, color, emoji, parent } = req.body
  if (!destination || !destination.trim()) {
    return res.status(400).json({ error: 'Destination name is required' })
  }
  const name = destination.trim()
  const { rows: existing } = await pool.query('SELECT 1 FROM dest_dates WHERE destination=$1', [name])
  if (existing.length > 0) {
    return res.status(409).json({ error: 'Destination already exists' })
  }
  await pool.query(
    'INSERT INTO dest_dates (destination, start_date, end_date, color, emoji, parent) VALUES ($1,$2,$3,$4,$5,$6)',
    [name, '', '', color || '', emoji || '', parent || '']
  )
  res.json({ destination: name, start: '', end: '', color: color || '', emoji: emoji || '', parent: parent || '' })
})

// Delete a destination and reassign its expenses to "multiple"
app.delete('/api/dest-dates/:destination', async (req, res) => {
  const dest = decodeURIComponent(req.params.destination)
  await pool.query('UPDATE expenses SET destination=$1 WHERE destination=$2', ['multiple', dest])
  await pool.query('DELETE FROM dest_dates WHERE destination=$1', [dest])
  res.json({ ok: true })
})

// ── Static files & SPA fallback ─────────────────────────────────

app.use(express.static(path.join(__dirname, 'dist')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// ── Start ───────────────────────────────────────────────────────

const PORT = process.env.PORT || 3001

async function startWithRetry(retries = 10, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      await initDB()
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
      return
    } catch (err) {
      console.error(`DB connect attempt ${i + 1}/${retries} failed:`, err.message)
      if (i < retries - 1) {
        console.log(`Retrying in ${delay / 1000}s...`)
        await new Promise(r => setTimeout(r, delay))
      }
    }
  }
  console.error('All DB connection attempts failed. Starting server without DB.')
  app.listen(PORT, () => console.log(`Server running on port ${PORT} (no DB)`))
}

startWithRetry()
