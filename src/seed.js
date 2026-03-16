export const SEED_EXPENSES = [
  { id: 1, desc: 'Round-trip flights (2 pax) NYC\u2013Mexico City', amount: 680, cat: 'flight', dest: 'Mexico', date: '2025-06-01', notes: 'Booked via Google Flights, conf #AA123' },
  { id: 2, desc: 'Airbnb Condesa 7 nights', amount: 840, cat: 'airbnb', dest: 'Mexico', date: '2025-06-05', notes: 'Check-in after 3pm' },
  { id: 3, desc: 'Flights Mexico City to Madrid', amount: 980, cat: 'flight', dest: 'Spain', date: '2025-06-15', notes: '' },
  { id: 4, desc: 'Hotel Barcelona 5 nights', amount: 1100, cat: 'hotel', dest: 'Spain', date: '2025-06-18', notes: 'Hotel Arts, breakfast included' },
  { id: 5, desc: 'Flights Madrid\u2013Bogot\u00e1', amount: 760, cat: 'flight', dest: 'Colombia', date: '2025-07-01', notes: '' },
  { id: 6, desc: 'Airbnb Cartagena 6 nights', amount: 620, cat: 'airbnb', dest: 'Colombia', date: '2025-07-04', notes: 'Old city, rooftop included' },
  { id: 7, desc: 'Flights Bogot\u00e1\u2013New York JFK', amount: 430, cat: 'flight', dest: 'New York', date: '2025-07-12', notes: '' },
  { id: 8, desc: 'Hotel Midtown 3 nights', amount: 750, cat: 'hotel', dest: 'New York', date: '2025-07-14', notes: '' },
  { id: 9, desc: 'Food budget estimate', amount: 1500, cat: 'food', dest: 'multiple', date: '', notes: 'Approx $75/day per person' },
  { id: 10, desc: 'Train/transit across trip', amount: 380, cat: 'transport', dest: 'multiple', date: '', notes: 'Metro + Renfe in Spain' },
]

export const SEED_DEST_DATES = {
  Mexico: { start: '2025-06-05', end: '2025-06-14' },
  Spain: { start: '2025-06-16', end: '2025-06-30' },
  'New York': { start: '2025-07-13', end: '2025-07-16' },
  Colombia: { start: '2025-07-02', end: '2025-07-11' },
}
