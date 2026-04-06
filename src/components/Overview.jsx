import { useState } from 'react'
import { CAT_LABELS, CAT_BG, CATEGORIES, getDestColor, nextDestColor } from '../constants'
import { fmt, getTopLevel, getChildren, destTotalWithChildren } from '../utils'

export default function Overview({ expenses, destDates, destinations, onAddDestination, onDeleteDestination }) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newDestName, setNewDestName] = useState('')
  const [newDestEmoji, setNewDestEmoji] = useState('')
  const [newDestColor, setNewDestColor] = useState(() => nextDestColor(destDates))
  const [newDestParent, setNewDestParent] = useState('')
  const [addError, setAddError] = useState('')

  const total = expenses.reduce((s, e) => s + e.amount, 0)

  const nights = destinations.reduce((sum, d) => {
    const dd = destDates[d]
    if (dd && dd.start && dd.end) {
      const diff = (new Date(dd.end) - new Date(dd.start)) / (1000 * 60 * 60 * 24)
      return sum + Math.max(0, diff)
    }
    return sum
  }, 0)

  const perNight = nights > 0 ? total / nights : 0

  const topLevel = getTopLevel(destDates)

  function destTotal(dest) {
    return expenses.filter(e => e.dest === dest).reduce((s, e) => s + e.amount, 0)
  }

  function catTotal(cat) {
    return expenses.filter(e => e.cat === cat).reduce((s, e) => s + e.amount, 0)
  }

  async function handleAddDest(e) {
    e.preventDefault()
    const name = newDestName.trim()
    if (!name) return
    setAddError('')
    try {
      await onAddDestination(name, newDestColor, newDestEmoji, newDestParent)
      setNewDestName('')
      setNewDestEmoji('')
      setNewDestParent('')
      setNewDestColor(nextDestColor({ ...destDates, [name]: { color: newDestColor } }))
      setShowAddForm(false)
    } catch (err) {
      setAddError(err.message)
    }
  }

  async function handleRemoveDest(dest) {
    if (!confirm(`Remove "${dest}"? Its expenses will be reassigned to "Multiple".`)) return
    await onDeleteDestination(dest)
  }

  function formatRange(dd) {
    return dd && dd.start && dd.end ? `${dd.start} \u2192 ${dd.end}` : 'No dates set'
  }

  function renderDestCard(d, isChild = false) {
    const dd = destDates[d]
    const color = getDestColor(d, destDates)
    const children = getChildren(d, destDates)
    const hasChildren = children.length > 0
    const cardTotal = hasChildren ? destTotalWithChildren(d, expenses, destDates) : destTotal(d)

    return (
      <div key={d} className={`dest-card ${isChild ? 'dest-card-child' : ''}`} style={{ borderLeftColor: color }}>
        <div className="dest-card-header">
          <span className="dest-flag">{dd?.emoji || ''}</span>
          <span className="dest-name">{d}</span>
          <button
            className="btn-icon btn-danger btn-remove-dest"
            onClick={() => handleRemoveDest(d)}
            title={`Remove ${d}`}
          >
            &times;
          </button>
        </div>
        <div className="dest-card-dates">{formatRange(dd)}</div>
        <div className="dest-card-total">
          {fmt(cardTotal)}
          {hasChildren && <span className="dest-card-total-label"> total</span>}
        </div>
        {hasChildren && (
          <div className="dest-card-children">
            {destTotal(d) > 0 && (
              <div className="dest-child-row">
                <span className="dest-child-name">{d} (general)</span>
                <span className="dest-child-amount">{fmt(destTotal(d))}</span>
              </div>
            )}
            {children.map(c => (
              <div key={c} className="dest-child-row">
                <span className="dest-child-name">
                  {destDates[c]?.emoji ? `${destDates[c].emoji} ` : ''}{c}
                </span>
                <span className="dest-child-amount">{fmt(destTotal(c))}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="overview">
      <div className="metric-cards">
        <div className="metric-card">
          <div className="metric-label">Total Budget</div>
          <div className="metric-value">{fmt(total)}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Destinations</div>
          <div className="metric-value">{destinations.length}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Est. Nights</div>
          <div className="metric-value">{nights}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Per Night Avg</div>
          <div className="metric-value">{fmt(perNight)}</div>
        </div>
      </div>

      <div className="section-title-row">
        <h3 className="section-title">Destinations</h3>
        <button className="btn-secondary btn-sm" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : '+ Add Destination'}
        </button>
      </div>

      {showAddForm && (
        <form className="add-dest-form" onSubmit={handleAddDest}>
          <input
            type="text"
            value={newDestName}
            onChange={e => setNewDestName(e.target.value)}
            placeholder="Destination name (e.g. Barcelona)"
            autoFocus
          />
          <input
            type="text"
            className="emoji-input"
            value={newDestEmoji}
            onChange={e => setNewDestEmoji(e.target.value)}
            placeholder="\u{1F3D6}\u{FE0F}"
            maxLength={4}
          />
          <input
            type="color"
            className="color-input"
            value={newDestColor}
            onChange={e => setNewDestColor(e.target.value)}
            title="Pick a color"
          />
          <select
            className="parent-select"
            value={newDestParent}
            onChange={e => setNewDestParent(e.target.value)}
          >
            <option value="">No parent (top-level)</option>
            {topLevel.map(d => (
              <option key={d} value={d}>{destDates[d]?.emoji ? `${destDates[d].emoji} ` : ''}{d}</option>
            ))}
          </select>
          <button type="submit" className="btn-primary btn-sm">Add</button>
          {addError && <span className="add-dest-error">{addError}</span>}
        </form>
      )}

      <div className="dest-cards">
        {topLevel.map(d => renderDestCard(d))}
      </div>

      <h3 className="section-title">Category Breakdown</h3>
      <div className="cat-breakdown">
        {CATEGORIES.map(cat => {
          const ct = catTotal(cat)
          const pct = total > 0 ? (ct / total) * 100 : 0
          if (ct === 0) return null
          return (
            <div key={cat} className="cat-row">
              <span className="cat-row-label">{CAT_LABELS[cat]}</span>
              <div className="cat-bar-track">
                <div
                  className="cat-bar-fill"
                  style={{ width: `${pct}%`, backgroundColor: CAT_BG[cat] }}
                />
              </div>
              <span className="cat-row-amount">{fmt(ct)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
