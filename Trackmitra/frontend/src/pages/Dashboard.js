import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AppLayout from '../components/AppLayout';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const tips = [
  '🚌 Bus Route 1 runs every 15 minutes on weekdays.',
  '🛺 Rickshaws are cheapest for trips under 3km.',
  '🚕 Taxis are available 24/7 across the city.',
  '📍 Enable location access for accurate ETAs.',
  '💡 Compare fares before you travel using the Fare Calculator.',
];

const vehicles = [
  { id: 'bus',      emoji: '🚌', label: 'Bus',           sub: 'Fixed routes & stops',     color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
  { id: 'taxi',     emoji: '🚕', label: 'Taxi',           sub: 'Door-to-door, 24/7',       color: '#10b981', bg: 'rgba(16,185,129,0.08)'  },
  { id: 'rickshaw', emoji: '🛺', label: 'Auto Rickshaw',  sub: 'Short trips, quick rides',  color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)'  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats,  setStats]  = useState({ bus: 3, taxi: 2, rickshaw: 2 });
  const [tipIdx, setTipIdx] = useState(0);
  const [time,   setTime]   = useState(new Date());

  useEffect(() => {
    const t1 = setInterval(() => setTime(new Date()), 1000);
    const t2 = setInterval(() => setTipIdx(i => (i + 1) % tips.length), 5000);
    axios.get('/api/transport/vehicles')
      .then(r => setStats({
        bus:      r.data.filter(v => v.type === 'bus').length,
        taxi:     r.data.filter(v => v.type === 'taxi').length,
        rickshaw: r.data.filter(v => v.type === 'rickshaw').length,
      }))
      .catch(() => {});
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);

  const greeting = () => {
    const h = time.getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = user?.name?.split(' ')[0] || 'Traveller';

  return (
    <AppLayout title="Dashboard">
      <div className="dashboard">

        {/* Greeting */}
        <div className="dash-header fade-in">
          <div>
            <p className="dash-greeting">{greeting()},</p>
            <h1 className="dash-name">{firstName} 👋</h1>
            <p className="dash-time">
              {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
              &nbsp;·&nbsp;
              {time.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <div className="live-badge">
            <span className="status-dot active"></span>
            <span>Live tracking active</span>
          </div>
        </div>

        {/* Tip banner */}
        <div className="tip-banner card fade-in-1">
          <span className="tip-icon">💡</span>
          <span className="tip-text">{tips[tipIdx]}</span>
        </div>

        {/* ── Big vehicle selector ── */}
        <h2 className="section-title fade-in-2">Choose Your Ride</h2>
        <p className="section-sub fade-in-2">Select a vehicle type to see live tracking, route and fare</p>

        <div className="dash-vehicles fade-in-2">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className="dv-card card"
              style={{ '--vc': v.color, '--vcbg': v.bg }}
              onClick={() => navigate(`/track?vehicle=${v.id}`)}
            >
              <div className="dv-glow"></div>
              <div className="dv-icon">{v.emoji}</div>
              <div className="dv-info">
                <h3>{v.label}</h3>
                <p>{v.sub}</p>
              </div>
              <div className="dv-live">
                <span className="status-dot active"></span>
                <span>{stats[v.id]} live</span>
              </div>
              <span className="dv-arrow">→</span>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="dash-stats fade-in-3">
          {[
            { label: 'Buses Active',  value: stats.bus,      icon: '🚌', color: '#f59e0b' },
            { label: 'Taxis Online',  value: stats.taxi,     icon: '🚕', color: '#10b981' },
            { label: 'Rickshaws',     value: stats.rickshaw, icon: '🛺', color: '#8b5cf6' },
            { label: 'Routes Live',   value: 6,              icon: '🗺️', color: '#3b82f6' },
          ].map((s, i) => (
            <div key={i} className="stat-card card">
              <div className="stat-card-icon" style={{ background: `${s.color}18`, color: s.color }}>{s.icon}</div>
              <div className="stat-card-info">
                <span className="stat-card-value">{s.value}</span>
                <span className="stat-card-label">{s.label}</span>
              </div>
              <span className="status-dot active"></span>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <h2 className="section-title fade-in-4">More Options</h2>
        <div className="quick-links fade-in-4">
          {[
            { icon: '🗺️', label: 'View All Routes',  sub: 'Browse all city routes',     to: '/routes'  },
            { icon: '💰', label: 'Fare Calculator',  sub: 'Compare trip costs',          to: '/fare'    },
            { icon: '👤', label: 'My Profile',       sub: 'History & settings',          to: '/profile' },
          ].map((q, i) => (
            <Link to={q.to} key={i} className="quick-card card">
              <span className="quick-icon">{q.icon}</span>
              <div>
                <strong>{q.label}</strong>
                <p>{q.sub}</p>
              </div>
              <span className="arrow">→</span>
            </Link>
          ))}
        </div>

      </div>
    </AppLayout>
  );
}
