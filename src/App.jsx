import { useState, useEffect } from 'react'
import TabNav from './components/TabNav'
import Overview from './components/Overview'
import Expenses from './components/Expenses'
import Calendar from './components/Calendar'
import BudgetSheet from './components/BudgetSheet'
import SharePanel from './components/SharePanel'
import EditModal from './components/EditModal'
import {
  fetchExpenses,
  createExpense,
  updateExpense,
  deleteExpense as apiDeleteExpense,
  fetchDestDates,
  updateDestDates,
  bulkReplaceExpenses,
  createDestination as apiCreateDestination,
  deleteDestination as apiDeleteDestination,
} from './api'

const TABS = ['overview', 'expenses', 'calendar', 'budget', 'share']

export default function App() {
  const [tab, setTab] = useState('overview')
  const [expenses, setExpenses] = useState([])
  const [destDates, setDestDates] = useState({})
  const [editingExpense, setEditingExpense] = useState(null)
  const [loading, setLoading] = useState(true)

  // Derive destinations list from destDates keys
  const destinations = Object.keys(destDates)

  useEffect(() => {
    async function load() {
      try {
        const [exps, dates] = await Promise.all([fetchExpenses(), fetchDestDates()])
        setExpenses(exps)
        if (Object.keys(dates).length > 0) setDestDates(dates)
      } catch (err) {
        console.error('Failed to load data:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function addExpense(exp) {
    const saved = await createExpense(exp)
    setExpenses(prev => [...prev, saved])
  }

  async function handleDelete(id) {
    await apiDeleteExpense(id)
    setExpenses(prev => prev.filter(e => e.id !== id))
  }

  async function saveEdit(updated) {
    const saved = await updateExpense(updated)
    setExpenses(prev => prev.map(e => (e.id === saved.id ? saved : e)))
    setEditingExpense(null)
  }

  async function handleUpdateDestDate(dest, key, val) {
    const updated = { ...destDates, [dest]: { ...destDates[dest], [key]: val } }
    setDestDates(updated)
    await updateDestDates(updated)
  }

  async function handleAddDestination(name, color, emoji, parent) {
    await apiCreateDestination(name, color, emoji, parent)
    setDestDates(prev => ({ ...prev, [name]: { start: '', end: '', color, emoji, parent: parent || '' } }))
  }

  async function handleDeleteDestination(name) {
    await apiDeleteDestination(name)
    setDestDates(prev => {
      const next = { ...prev }
      delete next[name]
      return next
    })
    // Reassign expenses from deleted dest to "multiple" in local state
    setExpenses(prev => prev.map(e => e.dest === name ? { ...e, dest: 'multiple' } : e))
  }

  async function importData(newExpenses, newDestDates) {
    const saved = await bulkReplaceExpenses(newExpenses)
    setExpenses(saved)
    if (newDestDates) {
      await updateDestDates(newDestDates)
      setDestDates(newDestDates)
    }
  }

  if (loading) {
    return <div className="app"><p style={{ textAlign: 'center', marginTop: 80 }}>Loading...</p></div>
  }

  return (
    <div className="app">
      <h1 className="app-title">Summer Trip Budget Planner</h1>
      <TabNav tabs={TABS} active={tab} onChange={setTab} />
      <div className="tab-content">
        {tab === 'overview' && (
          <Overview
            expenses={expenses}
            destDates={destDates}
            destinations={destinations}
            onAddDestination={handleAddDestination}
            onDeleteDestination={handleDeleteDestination}
          />
        )}
        {tab === 'expenses' && (
          <Expenses expenses={expenses} destinations={destinations} destDates={destDates} onAdd={addExpense} onDelete={handleDelete} onEdit={setEditingExpense} />
        )}
        {tab === 'calendar' && (
          <Calendar expenses={expenses} destDates={destDates} destinations={destinations} onUpdateDestDate={handleUpdateDestDate} />
        )}
        {tab === 'budget' && (
          <BudgetSheet expenses={expenses} destinations={destinations} destDates={destDates} onEdit={setEditingExpense} onDelete={handleDelete} />
        )}
        {tab === 'share' && (
          <SharePanel expenses={expenses} destDates={destDates} onImport={importData} />
        )}
      </div>
      {editingExpense && (
        <EditModal expense={editingExpense} destinations={destinations} destDates={destDates} onSave={saveEdit} onClose={() => setEditingExpense(null)} />
      )}
    </div>
  )
}
