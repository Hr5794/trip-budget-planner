const SEED_EXPENSES = [
  { desc: 'Round-trip flights (2 pax) NYC\u2013Mexico City', amount: 680, cat: 'flight', dest: 'Mexico', date: '2025-06-01', notes: 'Booked via Google Flights, conf #AA123' },
  { desc: 'Airbnb Condesa 7 nights', amount: 840, cat: 'airbnb', dest: 'Mexico', date: '2025-06-05', notes: 'Check-in after 3pm' },
  { desc: 'Flights Mexico City to Madrid', amount: 980, cat: 'flight', dest: 'Spain', date: '2025-06-15', notes: '' },
  { desc: 'Hotel Barcelona 5 nights', amount: 1100, cat: 'hotel', dest: 'Spain', date: '2025-06-18', notes: 'Hotel Arts, breakfast included' },
  { desc: 'Flights Madrid\u2013Bogot\u00e1', amount: 760, cat: 'flight', dest: 'Colombia', date: '2025-07-01', notes: '' },
  { desc: 'Airbnb Cartagena 6 nights', amount: 620, cat: 'airbnb', dest: 'Colombia', date: '2025-07-04', notes: 'Old city, rooftop included' },
  { desc: 'Flights Bogot\u00e1\u2013New York JFK', amount: 430, cat: 'flight', dest: 'New York', date: '2025-07-12', notes: '' },
  { desc: 'Hotel Midtown 3 nights', amount: 750, cat: 'hotel', dest: 'New York', date: '2025-07-14', notes: '' },
  { desc: 'Food budget estimate', amount: 1500, cat: 'food', dest: 'multiple', date: '', notes: 'Approx $75/day per person' },
  { desc: 'Train/transit across trip', amount: 380, cat: 'transport', dest: 'multiple', date: '', notes: 'Metro + Renfe in Spain' },
]

const SEED_DEST_DATES = {
  Mexico: { start: '2025-06-05', end: '2025-06-14', color: '#1D9E75', emoji: '\u{1F1F2}\u{1F1FD}' },
  Spain: { start: '2025-06-16', end: '2025-06-30', color: '#D85A30', emoji: '\u{1F1EA}\u{1F1F8}' },
  'New York': { start: '2025-07-13', end: '2025-07-16', color: '#378ADD', emoji: '\u{1F5FD}' },
  Colombia: { start: '2025-07-02', end: '2025-07-11', color: '#D4537E', emoji: '\u{1F1E8}\u{1F1F4}' },
}

module.exports = { SEED_EXPENSES, SEED_DEST_DATES }
