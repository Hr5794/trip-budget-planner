// Color palette for auto-assigning colors to new destinations
export const DEST_COLOR_PALETTE = [
  '#1D9E75', '#D85A30', '#378ADD', '#D4537E',
  '#8B5CF6', '#059669', '#D97706', '#6366F1',
  '#EC4899', '#14B8A6', '#F59E0B', '#3B82F6',
]

// Legacy fallback for "multiple" destination
export const DEST_COLORS = {
  multiple: '#888780',
}


export const CAT_LABELS = {
  flight: '\u2708 Flight',
  hotel: '\u{1F3E8} Hotel',
  airbnb: '\u{1F3E0} Airbnb',
  food: '\u{1F37D} Food',
  transport: '\u{1F686} Transport',
  activity: '\u{1F3AD} Activity',
  other: '\u{1F4E6} Other',
}

export const CAT_BG = {
  flight: '#B5D4F4',
  hotel: '#CECBF6',
  airbnb: '#F5C4B3',
  food: '#C0DD97',
  transport: '#FAC775',
  activity: '#9FE1CB',
  other: '#D3D1C7',
}

export const CAT_TEXT = {
  flight: '#185FA5',
  hotel: '#3C3489',
  airbnb: '#993C1D',
  food: '#3B6D11',
  transport: '#854F0B',
  activity: '#0F6E56',
  other: '#5F5E5A',
}

export const CAT_PILL_BG = {
  flight: '#E6F1FB',
  hotel: '#EEEDFE',
  airbnb: '#FAECE7',
  food: '#EAF3DE',
  transport: '#FAEEDA',
  activity: '#E1F5EE',
  other: '#F1EFE8',
}

export const CATEGORIES = Object.keys(CAT_LABELS)

// Get a destination's color — from stored data, or fallback to palette
export function getDestColor(dest, destDates) {
  if (dest === 'multiple') return '#888780'
  const dd = destDates && destDates[dest]
  if (dd && dd.color) return dd.color
  // Fallback: pick from palette based on position
  const keys = destDates ? Object.keys(destDates) : []
  const idx = keys.indexOf(dest)
  if (idx >= 0) return DEST_COLOR_PALETTE[idx % DEST_COLOR_PALETTE.length]
  return '#888780'
}

// Pick the next available color from the palette
export function nextDestColor(destDates) {
  const usedColors = Object.values(destDates || {}).map(d => d.color).filter(Boolean)
  const available = DEST_COLOR_PALETTE.find(c => !usedColors.includes(c))
  return available || DEST_COLOR_PALETTE[Object.keys(destDates || {}).length % DEST_COLOR_PALETTE.length]
}
