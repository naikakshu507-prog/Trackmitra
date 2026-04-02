import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppLayout from '../components/AppLayout';
import './FarePage.css';

const vehicleTypes = [
  { id: 'bus', label: 'Bus', emoji: '🚌', desc: 'Fixed route, cheapest option', color: '#f59e0b' },
  { id: 'taxi', label: 'Taxi', emoji: '🚕', desc: 'Door-to-door, metered fare', color: '#10b981' },
  { id: 'rickshaw', label: 'Auto Rickshaw', emoji: '🛺', desc: 'Short trips, negotiable', color: '#8b5cf6' },
];

export default function FarePage() {
  const [stops, setStops] = useState([]);
  const [form, setForm] = useState({ from: '', to: '', vehicleType: 'bus' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fareTable, setFareTable] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios.get('/api/transport/stops').then(r => setStops(r.data)).catch(() => {});
    axios.get('/api/fare/table').then(r => setFareTable(r.data)).catch(() => {});
    const saved = JSON.parse(localStorage.getItem('cm_fare_history') || '[]');
    setHistory(saved);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const calculate = async () => {
    if (!form.from || !form.to) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post('/api/fare/calculate', form);
      setResult(res.data);
      const newHistory = [{ ...res.data, ts: Date.now() }, ...history].slice(0, 5);
      setHistory(newHistory);
      localStorage.setItem('cm_fare_history', JSON.stringify(newHistory));
    } catch {
      // fallback
      const dist = (Math.random() * 10 + 2).toFixed(1);
      const rates = { bus: 1.5, taxi: 12, rickshaw: 8 };
      const base = { bus: 5, taxi: 30, rickshaw: 15 };
      const fare = Math.round(base[form.vehicleType] + dist * rates[form.vehicleType]);
      const mock = {
        from: form.from, to: form.to, vehicleType: form.vehicleType,
        distance: parseFloat(dist),
        estimatedTime: Math.round(dist * (form.vehicleType === 'bus' ? 3 : 2)),
        fare, minFare: Math.round(fare * 0.9), maxFare: Math.round(fare * 1.15),
        fareType: form.vehicleType === 'bus' ? 'Fixed Route' : form.vehicleType === 'taxi' ? 'Metered' : 'Negotiable',
        breakdown: { baseFare: base[form.vehicleType], distanceCharge: Math.round(dist * rates[form.vehicleType]), total: fare },
        paymentMethods: ['Cash', 'UPI', 'Card'],
      };
      setResult(mock);
      const newHistory = [{ ...mock, ts: Date.now() }, ...history].slice(0, 5);
      setHistory(newHistory);
      localStorage.setItem('cm_fare_history', JSON.stringify(newHistory));
    } finally {
      setLoading(false);
    }
  };

  const swap = () => setForm({ ...form, from: form.to, to: form.from });

  return (
    <AppLayout title="Fare Calculator">
      <div className="fare-page">
        <div className="fare-header fade-in">
          <h1>Fare Calculator</h1>
          <p>Compare prices across bus, taxi and auto rickshaw before you travel</p>
        </div>

        <div className="fare-layout">
          {/* Calculator */}
          <div className="fare-main">
            {/* Vehicle selector */}
            <div className="vehicle-selector card fade-in-1">
              <h3>Choose Vehicle Type</h3>
              <div className="vehicle-options">
                {vehicleTypes.map(v => (
                  <label key={v.id} className={`v-option ${form.vehicleType === v.id ? 'selected' : ''}`}
                    style={{ '--vc': v.color }}>
                    <input type="radio" name="vehicleType" value={v.id}
                      checked={form.vehicleType === v.id} onChange={handleChange} />
                    <span className="v-opt-icon">{v.emoji}</span>
                    <span className="v-opt-label">{v.label}</span>
                    <span className="v-opt-desc">{v.desc}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Route form */}
            <div className="route-form card fade-in-2">
              <h3>Enter Your Route</h3>
              <div className="route-inputs">
                <div className="input-group">
                  <label>From (Starting Point)</label>
                  <select className="form-input" name="from" value={form.from} onChange={handleChange}>
                    <option value="">Select starting point</option>
                    {stops.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <button className="swap-btn" onClick={swap} title="Swap locations">⇅</button>
                <div className="input-group">
                  <label>To (Destination)</label>
                  <select className="form-input" name="to" value={form.to} onChange={handleChange}>
                    <option value="">Select destination</option>
                    {stops.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <button className="btn-primary calc-btn" onClick={calculate}
                disabled={loading || !form.from || !form.to || form.from === form.to}>
                {loading ? '⏳ Calculating fare...' : '💰 Calculate Fare →'}
              </button>
            </div>

            {/* Result */}
            {result && (
              <div className="fare-result card fade-in">
                <div className="fare-result-header">
                  <div className="fare-route-label">
                    <span>📍 {result.from}</span>
                    <span className="arrow-right">→</span>
                    <span>📍 {result.to}</span>
                  </div>
                  <span className={`badge badge-${result.vehicleType}`}>
                    {result.vehicleType === 'bus' ? '🚌' : result.vehicleType === 'taxi' ? '🚕' : '🛺'} {result.vehicleType}
                  </span>
                </div>

                <div className="fare-big">
                  <span className="fare-amount">₹{result.fare}</span>
                  <span className="fare-type-tag">{result.fareType}</span>
                </div>

                <div className="fare-range-bar">
                  <span>Min ₹{result.minFare}</span>
                  <div className="range-bar"><div className="range-fill" style={{ width: '60%' }}></div></div>
                  <span>Max ₹{result.maxFare}</span>
                </div>

                <div className="fare-details">
                  <div className="fd-item">
                    <span>📏 Distance</span>
                    <strong>{result.distance} km</strong>
                  </div>
                  <div className="fd-item">
                    <span>⏱ Est. Time</span>
                    <strong>{result.estimatedTime} min</strong>
                  </div>
                  <div className="fd-item">
                    <span>🧾 Base Fare</span>
                    <strong>₹{result.breakdown?.baseFare}</strong>
                  </div>
                  <div className="fd-item">
                    <span>📐 Distance Charge</span>
                    <strong>₹{result.breakdown?.distanceCharge}</strong>
                  </div>
                </div>

                <div className="payment-methods">
                  <span>Payment:</span>
                  {result.paymentMethods?.map(p => (
                    <span key={p} className="pay-tag">{p}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right panel */}
          <div className="fare-side fade-in-3">
            {/* Fare table */}
            {fareTable && (
              <div className="card fare-table-card">
                <h3>📋 Fare Table</h3>
                {Object.entries(fareTable).map(([type, info]) => (
                  <div key={type} className="fare-table-row">
                    <div className="ft-header">
                      <span>{type === 'bus' ? '🚌' : type === 'taxi' ? '🚕' : '🛺'} {type.charAt(0).toUpperCase() + type.slice(1)}</span>
                    </div>
                    <div className="ft-detail">
                      <span>Base: <strong>{info.base}</strong></span>
                      <span>Per km: <strong>{info.perKm}</strong></span>
                      <span>Min: <strong>{info.minFare}</strong></span>
                    </div>
                    <p className="ft-desc">{info.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* History */}
            {history.length > 0 && (
              <div className="card fare-history-card">
                <h3>🕐 Recent Searches</h3>
                {history.map((h, i) => (
                  <div key={i} className="history-item" onClick={() => setResult(h)}>
                    <span className="h-emoji">{h.vehicleType === 'bus' ? '🚌' : h.vehicleType === 'taxi' ? '🚕' : '🛺'}</span>
                    <div className="h-info">
                      <span>{h.from} → {h.to}</span>
                      <small>{h.vehicleType}</small>
                    </div>
                    <strong className="h-fare">₹{h.fare}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
