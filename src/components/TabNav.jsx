const TAB_LABELS = {
  overview: 'Overview',
  expenses: 'Expenses',
  calendar: 'Calendar',
  budget: 'Budget Sheet',
  share: 'Share',
}

export default function TabNav({ tabs, active, onChange }) {
  return (
    <nav className="tab-nav">
      {tabs.map(t => (
        <button
          key={t}
          className={`tab-btn ${t === active ? 'active' : ''}`}
          onClick={() => onChange(t)}
        >
          {TAB_LABELS[t] || t}
        </button>
      ))}
    </nav>
  )
}
