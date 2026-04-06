import { getTopLevel, getChildren } from '../utils'

export default function DestSelect({ name, value, onChange, destDates, includeMultiple = true, allOption = false }) {
  const topLevel = getTopLevel(destDates)

  return (
    <select name={name} value={value} onChange={onChange}>
      {allOption && <option value="">All</option>}
      {topLevel.map(d => {
        const children = getChildren(d, destDates)
        const emoji = destDates[d]?.emoji
        const label = emoji ? `${emoji} ${d}` : d
        if (children.length === 0) {
          return <option key={d} value={d}>{label}</option>
        }
        return (
          <optgroup key={d} label={label}>
            <option value={d}>{d} (general)</option>
            {children.map(c => {
              const cEmoji = destDates[c]?.emoji
              return <option key={c} value={c}>{cEmoji ? `${cEmoji} ` : ''}{c}</option>
            })}
          </optgroup>
        )
      })}
      {includeMultiple && <option value="multiple">Multiple</option>}
    </select>
  )
}
