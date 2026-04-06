const API = '/api'

export async function fetchExpenses() {
  const res = await fetch(`${API}/expenses`)
  if (!res.ok) throw new Error(`fetchExpenses failed: ${res.status}`)
  return res.json()
}

export async function createExpense(exp) {
  const res = await fetch(`${API}/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(exp),
  })
  return res.json()
}

export async function updateExpense(exp) {
  const res = await fetch(`${API}/expenses/${exp.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(exp),
  })
  return res.json()
}

export async function deleteExpense(id) {
  await fetch(`${API}/expenses/${id}`, { method: 'DELETE' })
}

export async function fetchDestDates() {
  const res = await fetch(`${API}/dest-dates`)
  return res.json()
}

export async function updateDestDates(destDates) {
  const res = await fetch(`${API}/dest-dates`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(destDates),
  })
  return res.json()
}

export async function createDestination(destination, color, emoji, parent) {
  const res = await fetch(`${API}/dest-dates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ destination, color, emoji, parent }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || `createDestination failed: ${res.status}`)
  }
  return res.json()
}

export async function deleteDestination(destination) {
  const res = await fetch(`${API}/dest-dates/${encodeURIComponent(destination)}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error(`deleteDestination failed: ${res.status}`)
  return res.json()
}

export async function bulkReplaceExpenses(expenses) {
  const res = await fetch(`${API}/expenses/bulk-replace`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ expenses }),
  })
  return res.json()
}
