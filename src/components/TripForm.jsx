import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const ACTIVITIES = [
  { id: 'beach',      label: 'Beach',        emoji: '🏖️' },
  { id: 'hiking',     label: 'Hiking',       emoji: '🥾' },
  { id: 'swimming',   label: 'Swimming',     emoji: '🏊' },
  { id: 'skiing',     label: 'Skiing',       emoji: '⛷️' },
  { id: 'surfing',    label: 'Surfing',      emoji: '🏄' },
  { id: 'sightseeing',label: 'Sightseeing',  emoji: '🗺️' },
  { id: 'dining',     label: 'Fine Dining',  emoji: '🍽️' },
  { id: 'nightlife',  label: 'Nightlife',    emoji: '🎉' },
  { id: 'festivals',  label: 'Festivals',    emoji: '🎪' },
  { id: 'sports',     label: 'Sports',       emoji: '⚽' },
  { id: 'yoga',       label: 'Yoga',         emoji: '🧘' },
  { id: 'running',    label: 'Running',      emoji: '🏃' },
  { id: 'photography',label: 'Photography',  emoji: '📸' },
  { id: 'wildlife',   label: 'Wildlife',     emoji: '🦁' },
  { id: 'scuba',      label: 'Scuba Diving', emoji: '🤿' },
  { id: 'fishing',    label: 'Fishing',      emoji: '🎣' },
  { id: 'camping',    label: 'Camping',      emoji: '🏕️' },
  { id: 'work',       label: 'Work / Remote',emoji: '💻' },
];

const WEATHER_OPTIONS = [
  { id: 'hot',   label: 'Hot & Sunny',  emoji: '☀️',  desc: '80°F+ / 27°C+' },
  { id: 'mild',  label: 'Mild',         emoji: '⛅',  desc: '60–80°F / 15–27°C' },
  { id: 'cold',  label: 'Cold',         emoji: '❄️',  desc: 'Below 40°F / 5°C' },
  { id: 'rainy', label: 'Rainy',        emoji: '🌧️', desc: 'Expect rain / storms' },
];

const TRAVEL_MODES = [
  { id: 'plane',  label: 'Plane',   emoji: '✈️' },
  { id: 'car',    label: 'Car',     emoji: '🚗' },
  { id: 'train',  label: 'Train',   emoji: '🚂' },
  { id: 'bus',    label: 'Bus',     emoji: '🚌' },
  { id: 'cruise', label: 'Cruise',  emoji: '🚢' },
];

const ACCOMMODATIONS = [
  { id: 'hotel',   label: 'Hotel',   emoji: '🏨' },
  { id: 'airbnb',  label: 'Airbnb',  emoji: '🏡' },
  { id: 'hostel',  label: 'Hostel',  emoji: '🛏️' },
  { id: 'camping', label: 'Camping', emoji: '⛺' },
  { id: 'cruise',  label: 'Cruise',  emoji: '🚢' },
  { id: 'family',  label: 'Family / Friends', emoji: '👨‍👩‍👧' },
];

const STEPS = ['Trip Basics', 'Weather & Travel', 'Accommodation', 'Activities', 'Travelers'];

export default function TripForm({ onSubmit }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    destination: '',
    zipCode: '',
    days: 5,
    travelers: 2,
    hasKids: false,
    isInternational: false,
    weather: '',
    travelMode: '',
    accommodation: '',
    activities: [],
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const toggleActivity = (id) => {
    setForm(f => ({
      ...f,
      activities: f.activities.includes(id)
        ? f.activities.filter(a => a !== id)
        : [...f.activities, id],
    }));
  };

  const canNext = () => {
    if (step === 0) return form.name.trim() && form.destination.trim() && form.days >= 1;
    if (step === 1) return form.weather && form.travelMode;
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
              {i < step ? '✓' : i === step ? s : s}
            </span>
          ))}
        </div>
        <div style={{ height: 6, borderRadius: 9999, background: '#e2e8f0', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${((step) / (STEPS.length - 1)) * 100}%`,
            background: 'linear-gradient(135deg, #0ea5e9, #14b8a6)',
            borderRadius: 9999,
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      {/* Step 0: Trip Basics */}
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
                <input
                  className="input-field"
                  placeholder="e.g. 90210"
                  value={form.zipCode}
                  onChange={e => set('zipCode', e.target.value)}
                />
              </div>
              <div>
                <label>Number of Days</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button
                    style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid #e2e8f0', background: 'white', fontSize: '1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => set('days', Math.max(1, form.days - 1))}
                    type="button"
                  >−</button>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, minWidth: 40, textAlign: 'center', color: '#0ea5e9' }}>{form.days}</span>
                  <button
                    style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid #e2e8f0', background: 'white', fontSize: '1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => set('days', Math.min(60, form.days + 1))}
                    type="button"
                  >+</button>
                  <span style={{ color: '#64748b', fontSize: '0.9rem' }}>night{form.days !== 1 ? 's' : ''}</span>
                </div>
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

      {/* Step 1: Weather & Travel */}
      {step === 1 && (
        <div className="slide-in">
          <div className="form-section">
            <div className="form-section-title">🌤️ Expected Weather</div>
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
            <div className="form-section-title">🚀 Mode of Travel</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
              {TRAVEL_MODES.map(m => (
                <button
                  key={m.id}
                  type="button"
                  className={`chip-toggle ${form.travelMode === m.id ? 'active' : ''}`}
                  onClick={() => set('travelMode', m.id)}
                >
                  {m.emoji} {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Accommodation */}
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

      {/* Step 3: Activities */}
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

      {/* Step 4: Travelers */}
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
                ['📅', `${form.days} nights`],
                ['👥', `${form.travelers} traveler${form.travelers !== 1 ? 's' : ''}${form.hasKids ? ' + kids' : ''}`],
                ['🌤️', form.weather],
                ['🚀', form.travelMode],
                ['🏨', form.accommodation],
                ['🌐', form.isInternational ? 'International' : 'Domestic'],
                ['🎯', form.activities.length ? `${form.activities.length} activities` : 'No activities'],
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
