// ── Destination hierarchy helpers ────────────────────────────────

export function getTopLevel(destDates) {
  return Object.keys(destDates).filter(d => !destDates[d].parent)
}

export function getChildren(parent, destDates) {
  return Object.keys(destDates).filter(d => destDates[d].parent === parent)
}

export function destTotalWithChildren(dest, expenses, destDates) {
  const children = getChildren(dest, destDates)
  const allDests = [dest, ...children]
  return expenses.filter(e => allDests.includes(e.dest)).reduce((s, e) => s + e.amount, 0)
}

export function fmt(n) {
  return '$' + Number(n).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function encodeData(expenses, destDates) {
  return btoa(JSON.stringify({ v: 1, expenses, destDates }))
}

export function decodeData(code) {
  const data = JSON.parse(atob(code.trim()))
  if (!data.expenses) throw new Error('Invalid data')
  return data
}

export function exportCSV(expenses, CAT_LABELS) {
  const rows = [['Date', 'Description', 'Category', 'Destination', 'Amount', 'Notes']]
  ;[...expenses]
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''))
    .forEach(e => {
      rows.push([
        e.date || '',
        `"${e.desc.replace(/"/g, '""')}"`,
        CAT_LABELS[e.cat],
        e.dest,
        e.amount.toFixed(2),
        `"${(e.notes || '').replace(/"/g, '""')}"`,
      ])
    })
  const blob = new Blob([rows.map(r => r.join(',')).join('\n')], { type: 'text/csv' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'summer_trip_budget.csv'
  a.click()
}
