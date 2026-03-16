import { useState, useEffect } from 'react'
import TabNav from './components/TabNav'
import Overview from './components/Overview'
import Expenses from './components/Expenses'
import Calendar from './components/Calendar'
import BudgetSheet from './components/BudgetSheet'
import SharePanel from './components/SharePanel'
import EditModal from './components/EditModal'
import { SEED_EXPENSES, SEED_DEST_DATES } from './seed'

const TABS = ['overview', 'expenses', 'calendar', 'budget', 'share']

export default function App() {
  const [tab, setTab] = useState('overview')
  const [expenses, setExpenses] = useState([])
  const [destDates, setDestDates] = useState({
    Mexico: { start: '', end: '' },
    Spain: { start: '', end: '' },
    'New York': { start: '', end: '' },
    Colombia: { start: '', end: '' },
  })
  const [editingExpense, setEditingExpense] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('trip_expenses')
    const savedDates = localStorage.getItem('trip_dest_dates')
    if (saved) {
      setExpenses(JSON.parse(saved))
      if (savedDates) setDestDates(JSON.parse(savedDates))
    } else {
      setExpenses(SEED_EXPENSES)
      setDestDates(SEED_DEST_DATES)
    }
  }, [])

  useEffect(() => {
    if (expenses.length > 0) {
      localStorage.setItem('trip_expenses', JSON.stringify(expenses))
    }
  }, [expenses])

  useEffect(() => {
    localStorage.setItem('trip_dest_dates', JSON.stringify(destDates))
  }, [destDates])

  function addExpense(exp) {
    setExpenses(prev => [...prev, { ...exp, id: Date.now() }])
  }

  function deleteExpense(id) {
    setExpenses(prev => prev.filter(e => e.id !== id))
  }

  function saveEdit(updated) {
    setExpenses(prev => prev.map(e => (e.id === updated.id ? updated : e)))
    setEditingExpense(null)
  }

  function updateDestDate(dest, key, val) {
    setDestDates(prev => ({ ...prev, [dest]: { ...prev[dest], [key]: val } }))
  }

  function importData(newExpenses, newDestDates) {
    setExpenses(newExpenses)
    if (newDestDates) setDestDates(newDestDates)
  }

  return (
    <div className="app">
      <h1 className="app-title">Summer Trip Budget Planner</h1>
      <TabNav tabs={TABS} active={tab} onChange={setTab} />
      <div className="tab-content">
        {tab === 'overview' && <Overview expenses={expenses} destDates={destDates} />}
        {tab === 'expenses' && (
          <Expenses expenses={expenses} onAdd={addExpense} onDelete={deleteExpense} onEdit={setEditingExpense} />
        )}
        {tab === 'calendar' && (
          <Calendar expenses={expenses} destDates={destDates} onUpdateDestDate={updateDestDate} />
        )}
        {tab === 'budget' && (
          <BudgetSheet expenses={expenses} onEdit={setEditingExpense} onDelete={deleteExpense} />
        )}
        {tab === 'share' && (
          <SharePanel expenses={expenses} destDates={destDates} onImport={importData} />
        )}
      </div>
      {editingExpense && (
        <EditModal expense={editingExpense} onSave={saveEdit} onClose={() => setEditingExpense(null)} />
      )}
    </div>
  )
}
