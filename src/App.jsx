import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import TripForm from './components/TripForm';
import PackingList from './components/PackingList';
import History from './components/History';
import { generatePackingList } from './utils/generator';
import { loadTrips, addTrip, updateTrip, deleteTrip } from './utils/storage';

const VIEWS = { home: 'home', form: 'form', list: 'list', history: 'history' };

export default function App() {
  const [view, setView] = useState(VIEWS.home);
  const [trips, setTrips] = useState(() => loadTrips());
  const [activeTrip, setActiveTrip] = useState(null);

  // Persist whenever trips change
  useEffect(() => {
    // already persisted via storage helpers
  }, [trips]);

  const handleFormSubmit = (tripData) => {
    const packingList = generatePackingList(tripData);
    const trip = { ...tripData, packingList };
    const updated = addTrip(trip);
    setTrips(updated);
    setActiveTrip(trip);
    setView(VIEWS.list);
  };

  const handleListChange = (newGrouped) => {
    const updated = updateTrip({ ...activeTrip, packingList: newGrouped });
    setActiveTrip(t => ({ ...t, packingList: newGrouped }));
    setTrips(updated);
  };

  const handleOpenTrip = (trip) => {
    setActiveTrip(trip);
    setView(VIEWS.list);
  };

  const handleDuplicate = (trip) => {
    const copy = {
      ...trip,
      id: uuidv4(),
      name: `${trip.name} (copy)`,
      createdAt: new Date().toISOString(),
      // Reset all checked states
      packingList: Object.fromEntries(
        Object.entries(trip.packingList || {}).map(([cat, items]) => [
          cat,
          items.map(i => ({ ...i, id: uuidv4(), checked: false })),
        ])
      ),
    };
    const updated = addTrip(copy);
    setTrips(updated);
    setActiveTrip(copy);
    setView(VIEWS.list);
  };

  const handleDelete = (id) => {
    const updated = deleteTrip(id);
    setTrips(updated);
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Top nav */}
      <header className="gradient-header" style={{ padding: '0 1rem', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 16px rgba(0,0,0,0.15)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0' }}>
          {/* Logo */}
          <button
            onClick={() => setView(VIEWS.home)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span style={{ fontSize: '1.75rem' }}>🧳</span>
            <span className="font-display" style={{ color: 'white', fontSize: '1.6rem', letterSpacing: '0.5px', lineHeight: 1 }}>
              BringIt
            </span>
          </button>

          {/* Nav tabs */}
          <nav style={{ display: 'flex', gap: '0.25rem', background: 'rgba(0,0,0,0.15)', borderRadius: 9999, padding: '0.25rem' }}>
            <button
              className={`nav-tab ${view === VIEWS.home || view === VIEWS.form ? 'active' : ''}`}
              onClick={() => setView(VIEWS.home)}
            >
              🏠 Home
            </button>
            <button
              className={`nav-tab ${view === VIEWS.history ? 'active' : ''}`}
              onClick={() => setView(VIEWS.history)}
            >
              🗺️ My Trips
              {trips.length > 0 && (
                <span style={{
                  background: 'rgba(255,255,255,0.25)',
                  borderRadius: 9999,
                  padding: '0 6px',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  marginLeft: '0.25rem',
                }}>
                  {trips.length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main style={{ paddingBottom: '3rem' }}>
        {/* HOME */}
        {view === VIEWS.home && (
          <div className="slide-in" style={{ maxWidth: 640, margin: '0 auto', padding: '2.5rem 1rem 1rem' }}>
            {/* Hero */}
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '0.75rem' }}>
                <span className="floating-emoji">✈️</span>
                &nbsp;
                <span className="floating-emoji" style={{ animationDelay: '0.5s' }}>🧳</span>
                &nbsp;
                <span className="floating-emoji" style={{ animationDelay: '1s' }}>🌍</span>
              </div>
              <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', color: '#0369a1', lineHeight: 1.2, marginBottom: '0.75rem' }}>
                Pack smarter,<br />travel happier.
              </h1>
              <p style={{ color: '#475569', fontSize: '1rem', maxWidth: 420, margin: '0 auto 1.75rem', lineHeight: 1.6 }}>
                Tell BringIt where you're headed and we'll build a personalized packing list in seconds — tailored to your weather, activities, and travel style.
              </p>
              <button
                className="btn-primary"
                onClick={() => setView(VIEWS.form)}
                style={{ fontSize: '1.1rem', padding: '0.875rem 2.5rem' }}
              >
                🎒 Plan a New Trip
              </button>
              {trips.length > 0 && (
                <button
                  className="btn-secondary"
                  onClick={() => setView(VIEWS.history)}
                  style={{ marginLeft: '0.75rem' }}
                >
                  View My Trips →
                </button>
              )}
            </div>

            {/* Feature tiles */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
              {[
                { emoji: '🤖', title: 'Smart Generation', desc: 'Lists built from weather, activities, accommodation & more' },
                { emoji: '✏️', title: 'Fully Editable', desc: 'Add, remove and check off items as you pack' },
                { emoji: '📋', title: 'Duplicate Lists', desc: 'Reuse past lists for similar trips with one click' },
                { emoji: '👪', title: 'Group-Aware', desc: 'Quantities scale to your number of travelers' },
                { emoji: '🌐', title: 'Travel Mode', desc: 'International packing extras automatically included' },
                { emoji: '👶', title: 'Kid-Friendly', desc: 'Baby & kid items added when you bring the little ones' },
              ].map(f => (
                <div key={f.title} style={{
                  background: 'white',
                  borderRadius: '1.25rem',
                  padding: '1.25rem 1rem',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{f.emoji}</div>
                  <div style={{ fontWeight: 800, fontSize: '0.875rem', color: '#0f172a', marginBottom: '0.25rem' }}>{f.title}</div>
                  <div style={{ fontSize: '0.775rem', color: '#64748b', lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FORM */}
        {view === VIEWS.form && (
          <div style={{ paddingTop: '1.5rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.4rem', color: '#0f172a' }}>Plan Your Trip</h2>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Tell us about your adventure</p>
            </div>
            <TripForm onSubmit={handleFormSubmit} />
          </div>
        )}

        {/* PACKING LIST */}
        {view === VIEWS.list && activeTrip && (
          <div style={{ paddingTop: '1rem' }}>
            <PackingList
              trip={activeTrip}
              grouped={activeTrip.packingList || {}}
              onChange={handleListChange}
              onBack={() => setView(trips.length > 1 || (trips.length === 1 && trips[0].id === activeTrip.id) ? VIEWS.history : VIEWS.home)}
            />
          </div>
        )}

        {/* HISTORY */}
        {view === VIEWS.history && (
          <div style={{ paddingTop: '1.5rem' }}>
            <History
              trips={trips}
              onOpen={handleOpenTrip}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
            />
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <button className="btn-primary" onClick={() => setView(VIEWS.form)}>
                ➕ Plan a New Trip
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
