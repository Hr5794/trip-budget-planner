import { useState } from 'react'
import { CATEGORIES, CAT_LABELS } from '../constants'
import DestSelect from './DestSelect'

export default function EditModal({ expense, destinations, destDates, onSave, onClose }) {
  const [form, setForm] = useState({ ...expense })

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSave(form)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>Edit Expense</h2>
        <form onSubmit={handleSubmit} className="edit-form">
          <label>
            Description
            <input name="desc" value={form.desc} onChange={handleChange} required />
          </label>
          <label>
            Amount
            <input name="amount" type="number" step="0.01" value={form.amount} onChange={handleChange} required />
          </label>
          <label>
            Date
            <input name="date" type="date" value={form.date} onChange={handleChange} />
          </label>
          <label>
            Category
            <select name="cat" value={form.cat} onChange={handleChange}>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{CAT_LABELS[c]}</option>
              ))}
            </select>
          </label>
          <label>
            Destination
            <DestSelect name="dest" value={form.dest} onChange={handleChange} destDates={destDates} />
          </label>
          <label>
            Notes
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} />
          </label>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}
