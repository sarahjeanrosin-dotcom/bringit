const KEY = 'bringit_trips';

export function loadTrips() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTrips(trips) {
  localStorage.setItem(KEY, JSON.stringify(trips));
}

export function addTrip(trip) {
  const trips = loadTrips();
  trips.unshift(trip);
  saveTrips(trips);
  return trips;
}

export function updateTrip(updatedTrip) {
  const trips = loadTrips().map(t =>
    t.id === updatedTrip.id ? updatedTrip : t
  );
  saveTrips(trips);
  return trips;
}

export function deleteTrip(id) {
  const trips = loadTrips().filter(t => t.id !== id);
  saveTrips(trips);
  return trips;
}
