import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { useAuth } from '../context/AuthContext';
import './VehicleSelectPage.css';

const vehicles = [
  {
    id: 'bus',
    emoji: '🚌',
    label: 'Bus',
    tagline: 'Fixed routes · Cheapest fare',
    desc: 'City bus service covering all major routes. Best for planned trips on fixed corridors.',
    color: '#f59e0b',
    colorBg: 'rgba(245,158,11,0.08)',
    features: ['Fixed route stops', 'Every 15–30 min', 'From ₹5/trip', 'Seats available'],
  },
  {
    id: 'taxi',
    emoji: '🚕',
    label: 'Taxi',
    tagline: 'Door-to-door · Metered fare',
    desc: 'Private cab service for direct pickup and drop anywhere in the city. Available 24/7.',
    color: '#10b981',
    colorBg: 'rgba(16,185,129,0.08)',
    features: ['Any pickup point', 'Available 24/7', 'From ₹30/trip', 'AC available'],
  },
  {
    id: 'rickshaw',
    emoji: '🛺',
    label: 'Auto Rickshaw',
    tagline: 'Short trips · Negotiable fare',
    desc: 'Auto rickshaws for quick last-mile connectivity. Perfect for short distances in the city.',
    color: '#8b5cf6',
    colorBg: 'rgba(139,92,246,0.08)',
    features: ['Short distances', 'Quick availability', 'From ₹15/trip', 'Narrow lane access'],
  },
];

export default function VehicleSelectPage() {
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Traveller';

  const handleSelect = (vehicleId) => {
    navigate(`/track?vehicle=${vehicleId}`);
  };

  return (
    <AppLayout title="Choose Vehicle">
      <div className="vsel-page">
        <div className="vsel-header fade-in">
          <h1>Where are you headed, <span className="vsel-name">{firstName}?</span></h1>
          <p>Choose your mode of transport to see live tracking, routes and fare estimate</p>
        </div>

        <div className="vsel-cards fade-in-1">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className={`vsel-card card ${hovered === v.id ? 'hovered' : ''}`}
              style={{ '--vc': v.color, '--vcbg': v.colorBg }}
              onMouseEnter={() => setHovered(v.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleSelect(v.id)}
            >
              {/* Glow ring */}
              <div className="vsel-glow"></div>

              {/* Icon */}
              <div className="vsel-icon-wrap">
                <span className="vsel-emoji">{v.emoji}</span>
              </div>

              {/* Info */}
              <div className="vsel-info">
                <h2>{v.label}</h2>
                <p className="vsel-tagline">{v.tagline}</p>
                <p className="vsel-desc">{v.desc}</p>

                <ul className="vsel-features">
                  {v.features.map((f, i) => (
                    <li key={i}>
                      <span className="vsel-tick">✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>

              <button className="vsel-btn">
                Track {v.label} →
              </button>
            </div>
          ))}
        </div>

        {/* Quick compare strip */}
        <div className="vsel-compare card fade-in-2">
          <h3>Quick Fare Comparison</h3>
          <div className="compare-row">
            <div className="cmp-item">
              <span>🚌</span>
              <div>
                <strong>Bus</strong>
                <span>₹5 – ₹50</span>
              </div>
            </div>
            <div className="cmp-divider">vs</div>
            <div className="cmp-item">
              <span>🚕</span>
              <div>
                <strong>Taxi</strong>
                <span>₹30 – ₹500</span>
              </div>
            </div>
            <div className="cmp-divider">vs</div>
            <div className="cmp-item">
              <span>🛺</span>
              <div>
                <strong>Rickshaw</strong>
                <span>₹15 – ₹200</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
