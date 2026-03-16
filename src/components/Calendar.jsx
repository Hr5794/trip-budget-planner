import { useState } from 'react'
import { DESTINATIONS, DEST_COLORS, FLAGS } from '../constants'
import { fmt } from '../utils'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function pad(n) { return String(n).padStart(2, '0') }

function dateStr(y, m, d) {
  return `${y}-${pad(m + 1)}-${pad(d)}`
}

export default function Calendar({ expenses, destDates, onUpdateDestDate }) {
  const [viewDate, setViewDate] = useState(new Date(2025, 5, 1)) // June 2025

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const lastDay = new Date(year, month + 1, 0).getDate()

  const monthLabel = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })

  function prevMonth() {
    setViewDate(new Date(year, month - 1, 1))
  }
  function nextMonth() {
    setViewDate(new Date(year, month + 1, 1))
  }

  // Build expense totals by date
  const expByDate = {}
  expenses.forEach(e => {
    if (e.date) {
      expByDate[e.date] = (expByDate[e.date] || 0) + e.amount
    }
  })

  // Build grid cells
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= lastDay; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  function getDestsForDate(ds) {
    const result = []
    for (const dest of DESTINATIONS) {
      const dd = destDates[dest]
      if (dd && dd.start && dd.end && ds >= dd.start && ds <= dd.end) {
        result.push(dest)
      }
    }
    return result
  }

  return (
    <div className="calendar">
      <div className="cal-header">
        <button className="btn-icon" onClick={prevMonth}>&larr;</button>
        <h3 className="cal-month">{monthLabel}</h3>
        <button className="btn-icon" onClick={nextMonth}>&rarr;</button>
      </div>

      <div className="cal-legend">
        {DESTINATIONS.map(d => (
          <span key={d} className="cal-legend-item">
            <span className="dest-dot" style={{ backgroundColor: DEST_COLORS[d] }} />
            {FLAGS[d]} {d}
          </span>
        ))}
      </div>

      <div className="cal-grid">
        {WEEKDAYS.map(w => (
          <div key={w} className="cal-weekday">{w}</div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} className="cal-cell empty" />
          const ds = dateStr(year, month, day)
          const dests = getDestsForDate(ds)
          const expTotal = expByDate[ds]
          return (
            <div key={ds} className={`cal-cell ${dests.length > 0 ? 'has-dest' : ''}`}>
              <span className="cal-day">{day}</span>
              <div className="cal-badges">
                {dests.map(d => (
                  <span key={d} className="cal-badge" style={{ backgroundColor: DEST_COLORS[d] }} title={d} />
                ))}
              </div>
              {expTotal && <div className="cal-expense">{fmt(expTotal)}</div>}
            </div>
          )
        })}
      </div>

      <h3 className="section-title">Destination Dates</h3>
      <div className="dest-date-editors">
        {DESTINATIONS.map(d => {
          const dd = destDates[d] || { start: '', end: '' }
          return (
            <div key={d} className="dest-date-card" style={{ borderLeftColor: DEST_COLORS[d] }}>
              <div className="dest-date-header">
                <span>{FLAGS[d]} {d}</span>
              </div>
              <div className="dest-date-inputs">
                <label>
                  From
                  <input
                    type="date"
                    value={dd.start}
                    onChange={e => onUpdateDestDate(d, 'start', e.target.value)}
                  />
                </label>
                <label>
                  To
                  <input
                    type="date"
                    value={dd.end}
                    onChange={e => onUpdateDestDate(d, 'end', e.target.value)}
                  />
                </label>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
