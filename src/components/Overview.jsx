import { DESTINATIONS, DEST_COLORS, FLAGS, CAT_LABELS, CAT_BG, CATEGORIES } from '../constants'
import { fmt } from '../utils'

export default function Overview({ expenses, destDates }) {
  const total = expenses.reduce((s, e) => s + e.amount, 0)

  const nights = DESTINATIONS.reduce((sum, d) => {
    const dd = destDates[d]
    if (dd && dd.start && dd.end) {
      const diff = (new Date(dd.end) - new Date(dd.start)) / (1000 * 60 * 60 * 24)
      return sum + Math.max(0, diff)
    }
    return sum
  }, 0)

  const perNight = nights > 0 ? total / nights : 0

  function destTotal(dest) {
    return expenses.filter(e => e.dest === dest).reduce((s, e) => s + e.amount, 0)
  }

  function catTotal(cat) {
    return expenses.filter(e => e.cat === cat).reduce((s, e) => s + e.amount, 0)
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
          <div className="metric-value">{DESTINATIONS.length}</div>
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

      <h3 className="section-title">Destinations</h3>
      <div className="dest-cards">
        {DESTINATIONS.map(d => {
          const dd = destDates[d]
          const range = dd && dd.start && dd.end
            ? `${dd.start} \u2192 ${dd.end}`
            : 'No dates set'
          return (
            <div key={d} className="dest-card" style={{ borderLeftColor: DEST_COLORS[d] }}>
              <div className="dest-card-header">
                <span className="dest-flag">{FLAGS[d]}</span>
                <span className="dest-name">{d}</span>
              </div>
              <div className="dest-card-dates">{range}</div>
              <div className="dest-card-total">{fmt(destTotal(d))}</div>
            </div>
          )
        })}
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
