import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppLayout from '../components/AppLayout';
import './RoutesPage.css';

const typeColors = { bus: '#f59e0b', taxi: '#10b981', rickshaw: '#8b5cf6' };
const typeEmoji = { bus: '🚌', taxi: '🚕', rickshaw: '🛺' };

export default function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axios.get('/api/transport/routes')
      .then(r => setRoutes(r.data))
      .catch(() => {});
  }, []);

  const filtered = filter === 'all' ? routes : routes.filter(r => r.vehicleType === filter);

  return (
    <AppLayout title="Routes">
      <div className="routes-page">
        <div className="routes-header fade-in">
          <div>
            <h1>City Routes</h1>
            <p>All bus, taxi and rickshaw routes in the city</p>
          </div>
          <div className="filter-tabs">
            {['all', 'bus', 'taxi', 'rickshaw'].map(f => (
              <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                {f === 'all' ? '🗺️ All' : `${typeEmoji[f]} ${f.charAt(0).toUpperCase() + f.slice(1)}`}
              </button>
            ))}
          </div>
        </div>

        <div className="routes-layout">
          <div className="routes-list fade-in-1">
            {filtered.map((r, i) => (
              <div key={r.id} className={`route-card card ${selected?.id === r.id ? 'active' : ''}`}
                onClick={() => setSelected(r === selected ? null : r)}
                style={{ '--rc': r.color || typeColors[r.vehicleType] }}>
                <div className="route-card-header">
                  <div className="route-icon-wrap">
                    <span className="route-icon">{typeEmoji[r.vehicleType]}</span>
                  </div>
                  <div className="route-info">
                    <h3>{r.name}</h3>
                    <div className="route-meta">
                      <span>⏱ {r.frequency}</span>
                      <span>🕐 {r.operatingHours}</span>
                    </div>
                  </div>
                  <span className={`badge badge-${r.vehicleType}`}>{r.vehicleType}</span>
                </div>

                {selected?.id === r.id && (
                  <div className="route-stops">
                    <h4>Stops</h4>
                    <div className="stops-list">
                      {r.stops.map((stop, si) => (
                        <div key={si} className="stop-item">
                          <div className="stop-dot" style={{ background: r.color }}></div>
                          {si < r.stops.length - 1 && <div className="stop-line" style={{ background: r.color }}></div>}
                          <span>{stop}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="empty-state card">
                <span>🔍</span>
                <p>No routes found for selected filter.</p>
              </div>
            )}
          </div>

          {/* Info panel */}
          <div className="routes-info-panel fade-in-2">
            <div className="card info-card">
              <h3>📊 Route Summary</h3>
              <div className="summary-list">
                {['bus', 'taxi', 'rickshaw'].map(t => {
                  const count = routes.filter(r => r.vehicleType === t).length;
                  return (
                    <div key={t} className="summary-item">
                      <span>{typeEmoji[t]} {t.charAt(0).toUpperCase() + t.slice(1)}</span>
                      <span className="summary-count" style={{ color: typeColors[t] }}>{count} routes</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card info-card">
              <h3>ℹ️ Route Tips</h3>
              <ul className="tips-list">
                <li>Bus routes run on fixed schedules — check frequency before planning.</li>
                <li>Taxis are available 24/7 for on-demand trips anywhere in the city.</li>
                <li>Rickshaws cover short local loops and are ideal for last-mile travel.</li>
                <li>Click any route to see all stops along the way.</li>
              </ul>
            </div>

            <div className="card info-card operating">
              <h3>🕐 Operating Hours</h3>
              <div className="hours-table">
                <div className="hours-row"><span>🚌 Bus</span><span>5:30 AM – 10:00 PM</span></div>
                <div className="hours-row"><span>🚕 Taxi</span><span>24 / 7</span></div>
                <div className="hours-row"><span>🛺 Rickshaw</span><span>5:00 AM – 10:00 PM</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
