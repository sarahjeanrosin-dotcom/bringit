import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const ACTIVITIES = [
  { id: 'beach',        label: 'Beach',          emoji: '🏖️' },
  { id: 'hiking',       label: 'Hiking',         emoji: '🥾' },
  { id: 'swimming',     label: 'Swimming',        emoji: '🏊' },
  { id: 'snorkeling',   label: 'Snorkeling',      emoji: '🤿' },
  { id: 'skiing',       label: 'Skiing',          emoji: '⛷️' },
  { id: 'surfing',      label: 'Surfing',         emoji: '🏄' },
  { id: 'sightseeing',  label: 'Sightseeing',     emoji: '🗺️' },
  { id: 'dining',       label: 'Fine Dining',     emoji: '🍽️' },
  { id: 'nightlife',    label: 'Nightlife',       emoji: '🎉' },
  { id: 'festivals',    label: 'Festivals',       emoji: '🎪' },
  { id: 'sports',       label: 'Sports',          emoji: '⚽' },
  { id: 'yoga',         label: 'Yoga',            emoji: '🧘' },
  { id: 'running',      label: 'Running',         emoji: '🏃' },
  { id: 'cycling',      label: 'Cycling',         emoji: '🚴' },
  { id: 'kayaking',     label: 'Kayaking',        emoji: '🛶' },
  { id: 'rockClimbing', label: 'Rock Climbing',   emoji: '🧗' },
  { id: 'birdwatching', label: 'Birdwatching',    emoji: '🦅' },
  { id: 'photography',  label: 'Photography',     emoji: '📸' },
  { id: 'wildlife',     label: 'Wildlife',        emoji: '🦁' },
  { id: 'scuba',        label: 'Scuba Diving',    emoji: '🤿' },
  { id: 'fishing',      label: 'Fishing',         emoji: '🎣' },
  { id: 'camping',      label: 'Camping',         emoji: '🏕️' },
  { id: 'spa',          label: 'Spa & Wellness',  emoji: '💆' },
  { id: 'work',         label: 'Work / Remote',   emoji: '💻' },
];

const WEATHER_OPTIONS = [
  { id: 'hot',   label: 'Hot & Sunny',  emoji: '☀️',  desc: '80°F+ / 27°C+' },
  { id: 'mild',  label: 'Mild',         emoji: '⛅',  desc: '60–80°F / 15–27°C' },
  { id: 'cold',  label: 'Cold',         emoji: '❄️',  desc: 'Below 40°F / 5°C' },
  { id: 'rainy', label: 'Rainy',        emoji: '🌧️', desc: 'Expect rain / storms' },
];

const TRAVEL_MODES = [
  { id: 'plane',     label: 'Plane',      emoji: '✈️' },
  { id: 'car',       label: 'Own Car',    emoji: '🚗' },
  { id: 'rentalCar', label: 'Rental Car', emoji: '🚙' },
  { id: 'train',     label: 'Train',      emoji: '🚂' },
  { id: 'bus',       label: 'Bus',        emoji: '🚌' },
  { id: 'cruise',    label: 'Cruise',     emoji: '🚢' },
];

const ACCOMMODATIONS = [
  { id: 'hotel',   label: 'Hotel',              emoji: '🏨' },
  { id: 'airbnb',  label: 'Airbnb',             emoji: '🏡' },
  { id: 'hostel',  label: 'Hostel',             emoji: '🛏️' },
  { id: 'camping', label: 'Camping',            emoji: '⛺' },
  { id: 'cruise',  label: 'Cruise',             emoji: '🚢' },
  { id: 'family',  label: 'Family / Friends',   emoji: '👨‍👩‍👧' },
];

const STEPS = ['Trip Basics', 'Weather & Travel', 'Accommodation', 'Activities', 'Travelers'];

const TODAY = new Date().toISOString().split('T')[0];

function diffDays(start, end) {
  return Math.max(1, Math.round((new Date(end) - new Date(start)) / 86400000));
}

export default function TripForm({ onSubmit }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    destination: '',
    zipCode: '',
    startDate: '',
    endDate: '',
    days: 5,
    travelers: 2,
    hasKids: false,
    isInternational: false,
    weather: '',
    travelModes: [],
    accommodation: '',
    activities: [],
  });

  // UI state
  const [zipLoading, setZipLoading] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherNote, setWeatherNote] = useState('');

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  // ── Date helpers ──────────────────────────────────────────────
  const handleDates = (key, val) => {
    setForm(f => {
      const next = { ...f, [key]: val };
      if (next.startDate && next.endDate && next.endDate > next.startDate) {
        next.days = diffDays(next.startDate, next.endDate);
      }
      return next;
    });
  };

  // ── Zip auto-detect via Geolocation + Nominatim ──────────────
  const detectZip = () => {
    if (!navigator.geolocation) return;
    setZipLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          set('zipCode', data.address?.postcode || '');
        } catch { /* leave blank on error */ }
        setZipLoading(false);
      },
      () => setZipLoading(false)
    );
  };

  // ── Weather auto-fetch via Nominatim geocode + Open-Meteo ─────
  const fetchWeather = async () => {
    if (!form.destination.trim()) {
      setWeatherNote('Enter a destination first.');
      return;
    }
    setWeatherLoading(true);
    setWeatherNote('');
    try {
      // 1. Geocode destination
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(form.destination)}&format=json&limit=1`
      );
      const geoData = await geoRes.json();
      if (!geoData.length) {
        setWeatherNote('Destination not found — select weather manually.');
        setWeatherLoading(false);
        return;
      }
      const { lat, lon } = geoData[0];

      // 2. Clamp date range to Open-Meteo's 16-day forecast window
      const todayDate = new Date();
      const start = form.startDate ? new Date(form.startDate) : todayDate;
      const end   = form.endDate   ? new Date(form.endDate)   : new Date(start.getTime() + form.days * 86400000);
      const maxForecast = new Date(todayDate);
      maxForecast.setDate(maxForecast.getDate() + 15);

      if (start > maxForecast) {
        setWeatherNote('Dates are beyond the 16-day forecast window — select weather manually.');
        setWeatherLoading(false);
        return;
      }
      const clampedEnd = end > maxForecast ? maxForecast : end;
      const fmt = d => d.toISOString().split('T')[0];

      // 3. Fetch Open-Meteo forecast (free, no API key)
      const wxRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&daily=temperature_2m_max,precipitation_sum&start_date=${fmt(start)}&end_date=${fmt(clampedEnd)}&timezone=auto`
      );
      const wxData = await wxRes.json();

      if (!wxData.daily?.temperature_2m_max?.length) {
        setWeatherNote('Forecast unavailable — select weather manually.');
        setWeatherLoading(false);
        return;
      }

      const temps   = wxData.daily.temperature_2m_max.filter(v => v !== null);
      const precips = wxData.daily.precipitation_sum.filter(v => v !== null);
      const avgTemp   = temps.reduce((a, b) => a + b, 0) / temps.length;
      const avgPrecip = precips.length ? precips.reduce((a, b) => a + b, 0) / precips.length : 0;

      let weather;
      if (avgPrecip > 5)      weather = 'rainy';
      else if (avgTemp >= 27) weather = 'hot';
      else if (avgTemp < 5)   weather = 'cold';
      else                    weather = 'mild';

      set('weather', weather);
      setWeatherNote(`Forecast: avg ${Math.round(avgTemp)}°C, ${Math.round(avgPrecip)} mm/day precip`);
    } catch {
      setWeatherNote('Could not fetch forecast — select weather manually.');
    }
    setWeatherLoading(false);
  };

  // ── Activity / travelMode toggles ─────────────────────────────
  const toggleActivity = (id) => {
    setForm(f => ({
      ...f,
      activities: f.activities.includes(id)
        ? f.activities.filter(a => a !== id)
        : [...f.activities, id],
    }));
  };

  const toggleTravelMode = (id) => {
    setForm(f => ({
      ...f,
      travelModes: f.travelModes.includes(id)
        ? f.travelModes.filter(m => m !== id)
        : [...f.travelModes, id],
    }));
  };

  const canNext = () => {
    if (step === 0) return form.name.trim() && form.destination.trim() && form.days >= 1;
    if (step === 1) return form.weather && form.travelModes.length > 0;
    if (step === 2) return form.accommodation;
    if (step === 3) return true;
    if (step === 4) return form.travelers >= 1;
    return true;
  };

  const handleSubmit = () => {
    onSubmit({
      ...form,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="slide-in" style={{ maxWidth: 640, margin: '0 auto', padding: '1rem' }}>
      {/* Step indicator */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          {STEPS.map((s, i) => (
            <span key={i} style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              color: i === step ? '#0ea5e9' : i < step ? '#14b8a6' : '#94a3b8',
              flex: 1,
              textAlign: 'center',
            }}>
              {i < step ? '✓' : s}
            </span>
          ))}
        </div>
        <div style={{ height: 6, borderRadius: 9999, background: '#e2e8f0', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${(step / (STEPS.length - 1)) * 100}%`,
            background: 'linear-gradient(135deg, #0ea5e9, #14b8a6)',
            borderRadius: 9999,
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      {/* ── Step 0: Trip Basics ─────────────────────────────────── */}
      {step === 0 && (
        <div className="slide-in">
          <div className="form-section">
            <div className="form-section-title">🌍 Trip Details</div>
            <div style={{ display: 'grid', gap: '1rem' }}>

              <div>
                <label>Trip Name</label>
                <input
                  className="input-field"
                  placeholder="e.g. Summer Beach Vacation 🌴"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                />
              </div>

              <div>
                <label>Destination</label>
                <input
                  className="input-field"
                  placeholder="City, Country (e.g. Cancún, Mexico)"
                  value={form.destination}
                  onChange={e => set('destination', e.target.value)}
                />
              </div>

              <div>
                <label>Zip / Postal Code (departure)</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    className="input-field"
                    placeholder="e.g. 90210"
                    value={form.zipCode}
                    onChange={e => set('zipCode', e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={detectZip}
                    disabled={zipLoading}
                    style={{ whiteSpace: 'nowrap', padding: '0.625rem 1rem', fontSize: '0.85rem' }}
                    title="Auto-detect from your current location"
                  >
                    {zipLoading ? '⏳' : '📍 Detect'}
                  </button>
                </div>
              </div>

              <div>
                <label>Travel Dates</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Departure</label>
                    <input
                      type="date"
                      className="input-field"
                      value={form.startDate}
                      min={TODAY}
                      onChange={e => handleDates('startDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Return</label>
                    <input
                      type="date"
                      className="input-field"
                      value={form.endDate}
                      min={form.startDate || TODAY}
                      onChange={e => handleDates('endDate', e.target.value)}
                    />
                  </div>
                </div>
                {form.startDate && form.endDate ? (
                  <p style={{ fontSize: '0.85rem', color: '#0ea5e9', fontWeight: 700, marginTop: '0.5rem' }}>
                    📅 {form.days} night{form.days !== 1 ? 's' : ''}
                  </p>
                ) : (
                  <div style={{ marginTop: '0.75rem' }}>
                    <label style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Or set duration manually</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.375rem' }}>
                      <button
                        style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid #e2e8f0', background: 'white', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => set('days', Math.max(1, form.days - 1))}
                        type="button"
                      >−</button>
                      <span style={{ fontSize: '1.5rem', fontWeight: 800, minWidth: 40, textAlign: 'center', color: '#0ea5e9' }}>{form.days}</span>
                      <button
                        style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid #e2e8f0', background: 'white', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => set('days', Math.min(60, form.days + 1))}
                        type="button"
                      >+</button>
                      <span style={{ color: '#64748b', fontSize: '0.9rem' }}>night{form.days !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label style={{ marginBottom: '0.5rem' }}>International Trip?</label>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {[{ val: true, label: '🌐 Yes, international' }, { val: false, label: '🏠 No, domestic' }].map(opt => (
                    <button
                      key={String(opt.val)}
                      type="button"
                      className={`chip-toggle ${form.isInternational === opt.val ? 'active' : ''}`}
                      onClick={() => set('isInternational', opt.val)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ── Step 1: Weather & Travel ────────────────────────────── */}
      {step === 1 && (
        <div className="slide-in">
          <div className="form-section">
            <div className="form-section-title">🌤️ Expected Weather</div>

            {/* Auto-detect button */}
            <div style={{ marginBottom: '1rem' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={fetchWeather}
                disabled={weatherLoading}
                style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem' }}
              >
                {weatherLoading ? '⏳ Fetching…' : '🌐 Auto-detect from destination & dates'}
              </button>
              {weatherNote && (
                <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: weatherNote.startsWith('Forecast:') ? '#0ea5e9' : '#f59e0b', fontWeight: 600 }}>
                  {weatherNote}
                </p>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {WEATHER_OPTIONS.map(w => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => set('weather', w.id)}
                  style={{
                    padding: '1rem',
                    borderRadius: '1rem',
                    border: form.weather === w.id ? '2.5px solid #0ea5e9' : '2px solid #e2e8f0',
                    background: form.weather === w.id ? 'linear-gradient(135deg,#e0f2fe,#ccfbf1)' : 'white',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontSize: '2rem' }}>{w.emoji}</div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', marginTop: '0.25rem' }}>{w.label}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{w.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">🚀 Mode(s) of Travel</div>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '0.75rem' }}>Select all that apply — e.g. fly there, rent a car at the destination.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
              {TRAVEL_MODES.map(m => (
                <button
                  key={m.id}
                  type="button"
                  className={`chip-toggle ${form.travelModes.includes(m.id) ? 'active' : ''}`}
                  onClick={() => toggleTravelMode(m.id)}
                >
                  {m.emoji} {m.label}
                </button>
              ))}
            </div>
            {form.travelModes.length === 0 && (
              <p style={{ marginTop: '0.625rem', fontSize: '0.8rem', color: '#f59e0b', fontWeight: 600 }}>
                ⚠️ Select at least one transport mode to continue.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Step 2: Accommodation ───────────────────────────────── */}
      {step === 2 && (
        <div className="slide-in">
          <div className="form-section">
            <div className="form-section-title">🏨 Where Are You Staying?</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {ACCOMMODATIONS.map(a => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => set('accommodation', a.id)}
                  style={{
                    padding: '1rem',
                    borderRadius: '1rem',
                    border: form.accommodation === a.id ? '2.5px solid #0ea5e9' : '2px solid #e2e8f0',
                    background: form.accommodation === a.id ? 'linear-gradient(135deg,#e0f2fe,#ccfbf1)' : 'white',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.375rem',
                  }}
                >
                  <span style={{ fontSize: '2rem' }}>{a.emoji}</span>
                  <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Step 3: Activities ──────────────────────────────────── */}
      {step === 3 && (
        <div className="slide-in">
          <div className="form-section">
            <div className="form-section-title">🎯 Planned Activities</div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>Select all that apply — the more you pick, the smarter your list!</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
              {ACTIVITIES.map(a => (
                <button
                  key={a.id}
                  type="button"
                  className={`chip-toggle ${form.activities.includes(a.id) ? 'active' : ''}`}
                  onClick={() => toggleActivity(a.id)}
                >
                  {a.emoji} {a.label}
                </button>
              ))}
            </div>
            {form.activities.length === 0 && (
              <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#f59e0b', fontWeight: 600 }}>
                💡 Tip: selecting activities unlocks activity-specific gear suggestions!
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Step 4: Travelers ───────────────────────────────────── */}
      {step === 4 && (
        <div className="slide-in">
          <div className="form-section">
            <div className="form-section-title">👥 Who's Coming?</div>
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <div>
                <label>Number of Travelers</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                  <button
                    style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid #e2e8f0', background: 'white', fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => set('travelers', Math.max(1, form.travelers - 1))}
                    type="button"
                  >−</button>
                  <span style={{ fontSize: '2rem', fontWeight: 800, minWidth: 50, textAlign: 'center', color: '#0ea5e9' }}>
                    {form.travelers}
                  </span>
                  <button
                    style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid #e2e8f0', background: 'white', fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => set('travelers', Math.min(20, form.travelers + 1))}
                    type="button"
                  >+</button>
                </div>
                <div style={{ marginTop: '0.75rem', fontSize: '1.5rem' }}>
                  {Array.from({ length: Math.min(form.travelers, 10) }, (_, i) => (
                    <span key={i}>👤</span>
                  ))}
                  {form.travelers > 10 && <span style={{ fontSize: '0.8rem', color: '#64748b' }}> +{form.travelers - 10} more</span>}
                </div>
              </div>

              <div>
                <label>Traveling with kids or infants?</label>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  {[{ val: false, label: '🧑 Adults only' }, { val: true, label: '👶 Yes, kids too!' }].map(opt => (
                    <button
                      key={String(opt.val)}
                      type="button"
                      className={`chip-toggle ${form.hasKids === opt.val ? 'active' : ''}`}
                      onClick={() => set('hasKids', opt.val)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Summary card */}
          <div style={{
            background: 'linear-gradient(135deg, #f0f9ff, #f0fdfa)',
            borderRadius: '1.25rem',
            padding: '1.25rem',
            border: '2px solid #bae6fd',
          }}>
            <div style={{ fontWeight: 800, marginBottom: '0.75rem', color: '#0369a1' }}>📋 Trip Summary</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.875rem' }}>
              {[
                ['📍', form.destination],
                ['📅', form.startDate ? `${form.startDate} → ${form.endDate || '?'} (${form.days}n)` : `${form.days} nights`],
                ['👥', `${form.travelers} traveler${form.travelers !== 1 ? 's' : ''}${form.hasKids ? ' + kids' : ''}`],
                ['🌤️', form.weather],
                ['🚀', form.travelModes.length ? form.travelModes.join(', ') : '—'],
                ['🏨', form.accommodation],
                ['🌐', form.isInternational ? 'International' : 'Domestic'],
                ['🎯', form.activities.length ? `${form.activities.length} activities` : 'None selected'],
              ].map(([icon, val]) => (
                <div key={icon} style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
                  <span>{icon}</span>
                  <span style={{ color: '#334155', fontWeight: 600, textTransform: 'capitalize' }}>{val || '—'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Nav buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', gap: '0.75rem' }}>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => setStep(s => s - 1)}
          disabled={step === 0}
          style={{ opacity: step === 0 ? 0.4 : 1, cursor: step === 0 ? 'not-allowed' : 'pointer' }}
        >
          ← Back
        </button>
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            className="btn-primary"
            onClick={() => setStep(s => s + 1)}
            disabled={!canNext()}
          >
            Next →
          </button>
        ) : (
          <button
            type="button"
            className="btn-primary"
            onClick={handleSubmit}
            disabled={!canNext()}
            style={{ background: 'linear-gradient(135deg, #f59e0b, #14b8a6)' }}
          >
            🎒 Generate My List!
          </button>
        )}
      </div>
    </div>
  );
}
