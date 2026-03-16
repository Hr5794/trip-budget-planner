import { useState } from 'react'
import { CATEGORIES, CAT_LABELS, CAT_PILL_BG, CAT_TEXT, DESTINATIONS, DEST_COLORS } from '../constants'
import { fmt } from '../utils'

const EMPTY_FORM = { desc: '', amount: '', cat: 'flight', dest: 'Mexico', date: '', notes: '' }

export default function Expenses({ expenses, onAdd, onDelete, onEdit }) {
  const [form, setForm] = useState(EMPTY_FORM)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.desc || !form.amount) return
    onAdd({ ...form, amount: parseFloat(form.amount) })
    setForm(EMPTY_FORM)
  }

  const sorted = [...expenses].sort((a, b) => (a.date || '').localeCompare(b.date || ''))

  return (
    <div className="expenses">
      <form className="expense-form" onSubmit={handleSubmit}>
        <h3>Add Expense</h3>
        <div className="form-grid">
          <label>
            Description
            <input name="desc" value={form.desc} onChange={handleChange} placeholder="e.g. Flight to Madrid" required />
          </label>
          <label>
            Amount ($)
            <input name="amount" type="number" step="0.01" value={form.amount} onChange={handleChange} placeholder="0.00" required />
          </label>
          <label>
            Category
            <select name="cat" value={form.cat} onChange={handleChange}>
              {CATEGORIES.map(c => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
            </select>
          </label>
          <label>
            Destination
            <select name="dest" value={form.dest} onChange={handleChange}>
              {DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
              <option value="multiple">Multiple</option>
            </select>
          </label>
          <label>
            Date
            <input name="date" type="date" value={form.date} onChange={handleChange} />
          </label>
          <label>
            Notes
            <input name="notes" value={form.notes} onChange={handleChange} placeholder="Optional notes" />
          </label>
        </div>
        <button type="submit" className="btn-primary">Add Expense</button>
      </form>

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
            {sorted.map(exp => (
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
                  <span className="dest-dot" style={{ backgroundColor: DEST_COLORS[exp.dest] || DEST_COLORS.multiple }} />
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
        </table>
      </div>
    </div>
  )
}
