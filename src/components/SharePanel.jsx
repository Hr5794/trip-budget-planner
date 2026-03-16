import { useState } from 'react'
import { CAT_LABELS } from '../constants'
import { encodeData, decodeData, exportCSV } from '../utils'

export default function SharePanel({ expenses, destDates, onImport }) {
  const [exportCode, setExportCode] = useState('')
  const [importCode, setImportCode] = useState('')
  const [status, setStatus] = useState('')

  function handleGenerate() {
    const code = encodeData(expenses, destDates)
    setExportCode(code)
    setStatus('')
  }

  function handleCopy() {
    navigator.clipboard.writeText(exportCode).then(() => {
      setStatus('Copied to clipboard!')
    })
  }

  function handleImport() {
    try {
      const data = decodeData(importCode)
      onImport(data.expenses, data.destDates)
      setImportCode('')
      setStatus('Data imported successfully!')
    } catch {
      setStatus('Error: invalid data code.')
    }
  }

  function handleCSV() {
    exportCSV(expenses, CAT_LABELS)
    setStatus('CSV downloaded!')
  }

  return (
    <div className="share-panel">
      <section className="share-section">
        <h3>Export Data</h3>
        <p className="share-desc">Generate a shareable code containing all your expenses and dates.</p>
        <button className="btn-primary" onClick={handleGenerate}>Generate Code</button>
        {exportCode && (
          <div className="share-code-wrap">
            <pre className="share-code">{exportCode}</pre>
            <button className="btn-secondary" onClick={handleCopy}>Copy to Clipboard</button>
          </div>
        )}
      </section>

      <section className="share-section">
        <h3>Import Data</h3>
        <p className="share-desc">Paste a code from someone else to load their data.</p>
        <textarea
          className="share-import-input"
          value={importCode}
          onChange={e => setImportCode(e.target.value)}
          placeholder="Paste code here..."
          rows={4}
        />
        <button className="btn-primary" onClick={handleImport} disabled={!importCode.trim()}>
          Load Data
        </button>
      </section>

      <section className="share-section">
        <h3>CSV Export</h3>
        <p className="share-desc">Download all expenses as a CSV spreadsheet.</p>
        <button className="btn-secondary" onClick={handleCSV}>Download CSV</button>
      </section>

      {status && <div className="share-status">{status}</div>}
    </div>
  )
}
