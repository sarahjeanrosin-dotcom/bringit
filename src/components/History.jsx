import { countStats } from '../utils/generator';

const WEATHER_EMOJI = { hot: '☀️', mild: '⛅', cold: '❄️', rainy: '🌧️' };
const TRAVEL_EMOJI  = { plane: '✈️', car: '🚗', train: '🚂', bus: '🚌', cruise: '🚢' };
const ACCOM_EMOJI   = { hotel: '🏨', airbnb: '🏡', hostel: '🛏️', camping: '⛺', cruise: '🚢', family: '👨‍👩‍👧' };

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function History({ trips, onOpen, onDuplicate, onDelete }) {
  if (trips.length === 0) {
    return (
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '2rem 1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>
          <span className="floating-emoji">🗺️</span>
        </div>
        <h2 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#0f172a', margin: '0 0 0.5rem' }}>
          No trips yet!
        </h2>
        <p style={{ color: '#64748b', fontSize: '1rem' }}>
          Create your first packing list to get started.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '1rem' }}>
      <h2 style={{ fontWeight: 800, fontSize: '1.25rem', color: '#0f172a', marginBottom: '1rem', paddingLeft: '0.25rem' }}>
        🗺️ Your Trips ({trips.length})
      </h2>
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {trips.map(trip => {
          const { total, checked } = countStats(trip.packingList || {});
          const pct = total > 0 ? Math.round((checked / total) * 100) : 0;

          return (
            <div key={trip.id} className="trip-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    🎒 {trip.name}
                    {trip.isInternational && <span className="badge badge-violet">🌐 Intl</span>}
                  </div>
                  <div style={{ color: '#475569', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    📍 {trip.destination} · {formatDate(trip.createdAt)}
                  </div>

                  {/* Badges */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.75rem' }}>
                    <span className="badge badge-sky">{trip.days}n</span>
                    <span className="badge badge-teal">👥 {trip.travelers}</span>
                    {trip.weather && <span className="badge badge-amber">{WEATHER_EMOJI[trip.weather]} {trip.weather}</span>}
                    {trip.travelMode && <span className="badge badge-sky">{TRAVEL_EMOJI[trip.travelMode] || ''} {trip.travelMode}</span>}
                    {trip.accommodation && <span className="badge badge-rose">{ACCOM_EMOJI[trip.accommodation] || ''} {trip.accommodation}</span>}
                    {trip.hasKids && <span className="badge badge-violet">👶 Kids</span>}
                  </div>

                  {/* Progress */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
                      <span>{checked}/{total} packed</span>
                      <span style={{ color: pct === 100 ? '#14b8a6' : '#0ea5e9' }}>{pct}%</span>
                    </div>
                    <div className="progress-bar" style={{ height: 6 }}>
                      <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                <button className="btn-primary" onClick={() => onOpen(trip)} style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                  📋 Open List
                </button>
                <button className="btn-amber" onClick={() => onDuplicate(trip)} style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                  📋 Duplicate
                </button>
                <button className="btn-danger" onClick={() => {
                  if (window.confirm(`Delete "${trip.name}"? This cannot be undone.`)) onDelete(trip.id);
                }} style={{ fontSize: '0.8rem' }}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
