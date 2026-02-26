import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CATEGORIES } from '../data/packingItems';
import { countStats } from '../utils/generator';

export default function PackingList({ trip, grouped, onChange, onBack }) {
  const [newItem, setNewItem] = useState('');
  const [newCategory, setNewCategory] = useState('clothing');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editQty, setEditQty] = useState(1);
  const [collapsed, setCollapsed] = useState({});
  const [filterChecked, setFilterChecked] = useState(false);

  const { total, checked } = countStats(grouped);
  const pct = total > 0 ? Math.round((checked / total) * 100) : 0;

  const updateItem = (cat, itemId, patch) => {
    const next = { ...grouped };
    next[cat] = next[cat].map(i => i.id === itemId ? { ...i, ...patch } : i);
    onChange(next);
  };

  const removeItem = (cat, itemId) => {
    const next = { ...grouped };
    next[cat] = next[cat].filter(i => i.id !== itemId);
    if (next[cat].length === 0) delete next[cat];
    onChange(next);
  };

  const addItem = () => {
    if (!newItem.trim()) return;
    const next = { ...grouped };
    const item = { id: uuidv4(), name: newItem.trim(), category: newCategory, quantity: 1, checked: false, custom: true };
    if (!next[newCategory]) next[newCategory] = [];
    next[newCategory] = [...next[newCategory], item];
    onChange(next);
    setNewItem('');
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditQty(item.quantity);
  };

  const saveEdit = (cat, itemId) => {
    updateItem(cat, itemId, { name: editName, quantity: Number(editQty) });
    setEditingId(null);
  };

  const toggleCollapse = (cat) => {
    setCollapsed(c => ({ ...c, [cat]: !c[cat] }));
  };

  const checkAll = (val) => {
    const next = {};
    Object.entries(grouped).forEach(([cat, items]) => {
      next[cat] = items.map(i => ({ ...i, checked: val }));
    });
    onChange(next);
  };

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '1rem' }}>
      {/* Header */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              🎒 {trip.name}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
              📍 {trip.destination} · {trip.days} nights · {trip.travelers} traveler{trip.travelers !== 1 ? 's' : ''}
            </p>
          </div>
          <button className="btn-secondary" onClick={onBack} style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
            ← Back
          </button>
        </div>

        {/* Progress */}
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#334155' }}>
              {checked} of {total} items packed
            </span>
            <span style={{ fontWeight: 800, fontSize: '0.875rem', color: pct === 100 ? '#14b8a6' : '#0ea5e9' }}>
              {pct}% {pct === 100 ? '🎉 All packed!' : ''}
            </span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn-amber" onClick={() => checkAll(true)} style={{ fontSize: '0.8rem', padding: '0.4rem 0.875rem' }}>✓ Check All</button>
          <button className="btn-secondary" onClick={() => checkAll(false)} style={{ fontSize: '0.8rem', padding: '0.4rem 0.875rem' }}>↺ Uncheck All</button>
          <button
            className={`chip-toggle ${filterChecked ? 'active' : ''}`}
            onClick={() => setFilterChecked(f => !f)}
            style={{ fontSize: '0.8rem' }}
          >
            {filterChecked ? '👁️ Show all' : '🙈 Hide packed'}
          </button>
        </div>
      </div>

      {/* Categories */}
      {Object.entries(grouped).map(([cat, items]) => {
        const catInfo = CATEGORIES[cat] || { label: cat, emoji: '📦' };
        const visible = filterChecked ? items.filter(i => !i.checked) : items;
        if (visible.length === 0 && filterChecked) return null;
        const catChecked = items.filter(i => i.checked).length;

        return (
          <div key={cat} className="card category-section" style={{ marginBottom: '0.75rem', overflow: 'hidden' }}>
            <button
              type="button"
              onClick={() => toggleCollapse(cat)}
              style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '1rem 1rem 0.75rem', textAlign: 'left' }}
            >
              <div className="category-header" style={{ margin: 0 }}>
                <span style={{ fontSize: '1.25rem' }}>{catInfo.emoji}</span>
                <span style={{ flex: 1 }}>{catInfo.label}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginLeft: 'auto' }}>
                  {catChecked}/{items.length}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: '0.5rem' }}>
                  {collapsed[cat] ? '▶' : '▼'}
                </span>
              </div>
            </button>

            {!collapsed[cat] && (
              <div style={{ padding: '0 0.5rem 0.75rem' }}>
                {visible.map(item => (
                  <div key={item.id} className={`packing-item ${item.checked ? 'checked' : ''}`}>
                    {/* Checkbox */}
                    <div
                      className={`checkbox-custom ${item.checked ? 'checked' : ''}`}
                      onClick={() => updateItem(cat, item.id, { checked: !item.checked })}
                    >
                      {item.checked && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>

                    {/* Item content */}
                    {editingId === item.id ? (
                      <div style={{ flex: 1, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input
                          className="input-field"
                          style={{ flex: 1, padding: '0.375rem 0.625rem', fontSize: '0.875rem' }}
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && saveEdit(cat, item.id)}
                          autoFocus
                        />
                        <input
                          className="input-field"
                          type="number"
                          min="1"
                          style={{ width: 60, padding: '0.375rem 0.5rem', fontSize: '0.875rem' }}
                          value={editQty}
                          onChange={e => setEditQty(e.target.value)}
                        />
                        <button
                          className="btn-primary"
                          style={{ padding: '0.375rem 0.75rem', fontSize: '0.8rem' }}
                          onClick={() => saveEdit(cat, item.id)}
                        >✓</button>
                        <button
                          className="btn-secondary"
                          style={{ padding: '0.375rem 0.75rem', fontSize: '0.8rem' }}
                          onClick={() => setEditingId(null)}
                        >✕</button>
                      </div>
                    ) : (
                      <>
                        <span className="item-label" style={{ flex: 1, fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>
                          {item.name}
                          {item.custom && <span style={{ marginLeft: '0.375rem', fontSize: '0.65rem', background: '#fef3c7', color: '#b45309', padding: '1px 5px', borderRadius: 9999, fontWeight: 700 }}>custom</span>}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>×{item.quantity}</span>
                        <button
                          onClick={() => startEdit(item)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '0 0.25rem', fontSize: '0.875rem' }}
                          title="Edit"
                        >✏️</button>
                        <button
                          onClick={() => removeItem(cat, item.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fca5a5', padding: '0 0.25rem', fontSize: '0.875rem' }}
                          title="Remove"
                        >🗑️</button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Add custom item */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
        <div className="form-section-title" style={{ marginBottom: '0.75rem' }}>➕ Add Custom Item</div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <input
            className="input-field"
            placeholder="Item name..."
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addItem()}
            style={{ flex: '1 1 200px', minWidth: 0 }}
          />
          <select
            className="select-field"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            style={{ flex: '0 1 160px' }}
          >
            {Object.entries(CATEGORIES).map(([id, { label, emoji }]) => (
              <option key={id} value={id}>{emoji} {label}</option>
            ))}
          </select>
          <button className="btn-primary" onClick={addItem} style={{ whiteSpace: 'nowrap' }}>
            Add
          </button>
        </div>
      </div>

      {/* All packed celebration */}
      {pct === 100 && total > 0 && (
        <div style={{
          textAlign: 'center',
          padding: '1.5rem',
          background: 'linear-gradient(135deg, #ccfbf1, #e0f2fe)',
          borderRadius: '1.25rem',
          marginBottom: '1rem',
        }}>
          <div style={{ fontSize: '3rem' }}>🎉</div>
          <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0369a1', marginTop: '0.5rem' }}>
            You're all packed!
          </div>
          <div style={{ color: '#0f766e', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Time to go adventure! Have an amazing trip to {trip.destination} ✈️
          </div>
        </div>
      )}
    </div>
  );
}
