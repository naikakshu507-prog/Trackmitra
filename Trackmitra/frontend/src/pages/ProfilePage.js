import React, { useState } from 'react';
import AppLayout from '../components/AppLayout';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('profile');

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const history = JSON.parse(localStorage.getItem('cm_fare_history') || '[]');
  const savedRoutes = JSON.parse(localStorage.getItem('cm_saved_routes') || '[]');

  const clearHistory = () => {
    localStorage.removeItem('cm_fare_history');
    window.location.reload();
  };

  return (
    <AppLayout title="Profile">
      <div className="profile-page">
        {/* Profile hero */}
        <div className="profile-hero card fade-in">
          <div className="profile-avatar-big">{initials}</div>
          <div className="profile-hero-info">
            <h1>{user?.name || 'User'}</h1>
            <p>{user?.email}</p>
            <div className="profile-badges">
              <span className="badge badge-bus">🧑 Commuter</span>
              <span className="badge" style={{ background: 'rgba(16,185,129,0.12)', color: 'var(--green)', border: '1px solid rgba(16,185,129,0.3)' }}>✅ Verified</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs fade-in-1">
          {['profile', 'history', 'settings'].map(t => (
            <button key={t} className={`ptab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t === 'profile' ? '👤 Profile' : t === 'history' ? '🕐 History' : '⚙️ Settings'}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'profile' && (
          <div className="tab-content fade-in">
            <div className="profile-grid">
              <div className="card profile-card">
                <h3>Personal Information</h3>
                <div className="profile-fields">
                  <div className="pf-item">
                    <span className="pf-label">Full Name</span>
                    <span className="pf-value">{user?.name || '—'}</span>
                  </div>
                  <div className="pf-item">
                    <span className="pf-label">Email</span>
                    <span className="pf-value">{user?.email || '—'}</span>
                  </div>
                  <div className="pf-item">
                    <span className="pf-label">Phone</span>
                    <span className="pf-value">{user?.phone || 'Not set'}</span>
                  </div>
                  <div className="pf-item">
                    <span className="pf-label">Member Since</span>
                    <span className="pf-value">{new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}</span>
                  </div>
                </div>
              </div>

              <div className="card profile-card">
                <h3>Quick Stats</h3>
                <div className="stats-mini">
                  {[
                    { icon: '🔍', label: 'Fare Searches', value: history.length },
                    { icon: '🗺️', label: 'Saved Routes', value: savedRoutes.length },
                    { icon: '🚌', label: 'Fav Vehicle', value: 'Bus' },
                    { icon: '⭐', label: 'Account Status', value: 'Active' },
                  ].map((s, i) => (
                    <div key={i} className="sm-item">
                      <span className="sm-icon">{s.icon}</span>
                      <span className="sm-value">{s.value}</span>
                      <span className="sm-label">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card about-app">
              <h3>About CityMove</h3>
              <p>CityMove is a real-time public transport tracking platform designed for small and mid-sized Indian cities. Track buses, taxis and auto rickshaws, plan routes and compare fares — all in one place.</p>
              <div className="app-links">
                <span className="app-tag">v1.0.0</span>
                <span className="app-tag">React + Node.js</span>
                <span className="app-tag">Socket.IO</span>
                <span className="app-tag">OpenStreetMap</span>
              </div>
            </div>
          </div>
        )}

        {tab === 'history' && (
          <div className="tab-content fade-in">
            <div className="card history-section">
              <div className="section-title-row">
                <h3>Recent Fare Searches</h3>
                {history.length > 0 && (
                  <button className="btn-ghost clear-btn" onClick={clearHistory}>Clear All</button>
                )}
              </div>
              {history.length === 0 ? (
                <div className="empty-ph">
                  <span>🔍</span>
                  <p>No fare searches yet. Try the Fare Calculator!</p>
                </div>
              ) : (
                <div className="history-list">
                  {history.map((h, i) => (
                    <div key={i} className="history-row">
                      <span className="hr-icon">{h.vehicleType === 'bus' ? '🚌' : h.vehicleType === 'taxi' ? '🚕' : '🛺'}</span>
                      <div className="hr-route">
                        <strong>{h.from} → {h.to}</strong>
                        <span>{h.vehicleType} · {h.distance} km · {h.estimatedTime} min</span>
                      </div>
                      <div className="hr-fare">
                        <strong>₹{h.fare}</strong>
                        <span>{new Date(h.ts).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'settings' && (
          <div className="tab-content fade-in">
            <div className="settings-list">
              {[
                { icon: '🔔', title: 'Push Notifications', desc: 'Alerts for bus arrivals and delays', toggle: true },
                { icon: '📍', title: 'Location Access', desc: 'Required for live ETA calculations', toggle: true },
                { icon: '🌙', title: 'Dark Mode', desc: 'Currently enabled (default)', toggle: true, checked: true },
                { icon: '🗺️', title: 'Default City', desc: 'Nagpur, Maharashtra', toggle: false },
              ].map((s, i) => (
                <div key={i} className="card settings-item">
                  <span className="s-icon">{s.icon}</span>
                  <div className="s-info">
                    <strong>{s.title}</strong>
                    <span>{s.desc}</span>
                  </div>
                  {s.toggle && (
                    <label className="toggle">
                      <input type="checkbox" defaultChecked={s.checked} />
                      <span className="toggle-slider"></span>
                    </label>
                  )}
                </div>
              ))}

              <button className="btn-ghost logout-full" onClick={logout}>
                ⏻ Sign Out of CityMove
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
