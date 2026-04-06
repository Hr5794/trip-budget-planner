import { useState } from 'react'
import { CATEGORIES, CAT_LABELS, CAT_PILL_BG, CAT_TEXT, getDestColor } from '../constants'
import { fmt, getChildren } from '../utils'
import DestSelect from './DestSelect'

export default function BudgetSheet({ expenses, destinations, destDates, onEdit, onDelete }) {
  const [filterDest, setFilterDest] = useState('')
  const [filterCat, setFilterCat] = useState('')

  let filtered = [...expenses]
  if (filterDest) {
    const children = getChildren(filterDest, destDates)
    const matchDests = [filterDest, ...children]
    filtered = filtered.filter(e => matchDests.includes(e.dest))
  }
  if (filterCat) filtered = filtered.filter(e => e.cat === filterCat)
  filtered.sort((a, b) => (a.date || '').localeCompare(b.date || ''))

  const filteredTotal = filtered.reduce((s, e) => s + e.amount, 0)

  return (
    <div className="budget-sheet">
      <div className="bs-filters">
        <label>
          Destination
          <DestSelect
            name="filterDest"
            value={filterDest}
            onChange={e => setFilterDest(e.target.value)}
            destDates={destDates}
            allOption
          />
        </label>
        <label>
          Category
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)}>
            <option value="">All</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
          </select>
        </label>
      </div>

      <div className="expense-table-wrap">
        <table className="expense-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Destination</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(exp => (
              <tr key={exp.id}>
                <td className="td-date">{exp.date || '\u2014'}</td>
                <td>
                  <div className="td-desc">{exp.desc}</div>
                  {exp.notes && <div className="td-notes">{exp.notes}</div>}
                </td>
                <td>
                  <span className="cat-pill" style={{ backgroundColor: CAT_PILL_BG[exp.cat], color: CAT_TEXT[exp.cat] }}>
                    {CAT_LABELS[exp.cat]}
                  </span>
                </td>
                <td>
                  <span className="dest-dot" style={{ backgroundColor: getDestColor(exp.dest, destDates) }} />
                  {exp.dest}
                </td>
                <td className="td-amount">{fmt(exp.amount)}</td>
                <td className="td-actions">
                  <button className="btn-icon" onClick={() => onEdit(exp)} title="Edit">&#9998;</button>
                  <button className="btn-icon btn-danger" onClick={() => onDelete(exp.id)} title="Delete">&times;</button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} className="bs-footer-label">{filtered.length} expense{filtered.length !== 1 ? 's' : ''}</td>
              <td className="td-amount">{fmt(filteredTotal)}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
