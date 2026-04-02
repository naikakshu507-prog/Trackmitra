import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useSearchParams, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import io from 'socket.io-client';
import axios from 'axios';
import AppLayout from '../components/AppLayout';
import 'leaflet/dist/leaflet.css';
import './TrackingPage.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const makeIcon = (emoji, size = 38) => L.divIcon({
  html: `<div style="font-size:${size}px;line-height:1;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.6))">${emoji}</div>`,
  className: '',
  iconAnchor: [size / 2, size / 2],
});

const icons = {
  bus: makeIcon('🚌'),
  taxi: makeIcon('🚕'),
  rickshaw: makeIcon('🛺'),
};

const CITY_CENTER = [21.1458, 79.0882];

const VEHICLE_META = {
  bus:      { label: 'Bus',           emoji: '🚌', color: '#f59e0b' },
  taxi:     { label: 'Taxi',          emoji: '🚕', color: '#10b981' },
  rickshaw: { label: 'Auto Rickshaw', emoji: '🛺', color: '#8b5cf6' },
};

// Demo stops for when backend is offline
const DEMO_STOPS = [
  'City Center','Gandhi Chowk','Main Market','Railway Station',
  'District Hospital','Civil Lines','College Square','University',
  'Hotel Zone','IT Park','Airport','Old Market',
  'Cloth Market','Vegetable Mandi','Bus Stand','Station Road',
];

// Demo vehicles simulated in-browser
const generateDemoVehicles = () => [
  { id:'bus-001',    type:'bus',      route:'Route 1 – City Center',  driver:'Ramesh K.',  plateNo:'MH-31-AB-1234', rating:4.5, speed:32, passengers:18, eta:4,  lat: CITY_CENTER[0]+0.012,  lng: CITY_CENTER[1]-0.008 },
  { id:'bus-002',    type:'bus',      route:'Route 2 – Hospital',      driver:'Suresh M.',  plateNo:'MH-31-CD-5678', rating:4.2, speed:28, passengers:9,  eta:8,  lat: CITY_CENTER[0]-0.018, lng: CITY_CENTER[1]+0.012 },
  { id:'bus-003',    type:'bus',      route:'Route 3 – Airport',       driver:'Pradeep T.', plateNo:'MH-31-EF-9012', rating:4.7, speed:40, passengers:24, eta:12, lat: CITY_CENTER[0]+0.022, lng: CITY_CENTER[1]+0.018 },
  { id:'taxi-001',   type:'taxi',     route:'City Zone',               driver:'Ajay P.',    plateNo:'MH-31-GH-3456', rating:4.8, speed:45, passengers:2,  eta:3,  lat: CITY_CENTER[0]-0.006, lng: CITY_CENTER[1]-0.014 },
  { id:'taxi-002',   type:'taxi',     route:'Airport Express',         driver:'Vijay S.',   plateNo:'MH-31-IJ-7890', rating:4.6, speed:55, passengers:0,  eta:7,  lat: CITY_CENTER[0]+0.016, lng: CITY_CENTER[1]+0.006 },
  { id:'rick-001',   type:'rickshaw', route:'Market Loop',             driver:'Mohan L.',   plateNo:'MH-31-KL-1122', rating:4.3, speed:22, passengers:1,  eta:2,  lat: CITY_CENTER[0]-0.010, lng: CITY_CENTER[1]+0.016 },
  { id:'rick-002',   type:'rickshaw', route:'Station Road',            driver:'Ravi D.',    plateNo:'MH-31-MN-3344', rating:4.4, speed:18, passengers:0,  eta:5,  lat: CITY_CENTER[0]+0.008, lng: CITY_CENTER[1]-0.018 },
];

export default function TrackingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preselected = searchParams.get('vehicle') || 'bus';

  const [vehicles,    setVehicles]    = useState(generateDemoVehicles());
  const [vType,       setVType]       = useState(preselected);
  const [from,        setFrom]        = useState('');
  const [to,          setTo]          = useState('');
  const [routeResult, setRouteResult] = useState(null);
  const [stops,       setStops]       = useState(DEMO_STOPS);
  const [calcLoading, setCalcLoading] = useState(false);
  const [selected,    setSelected]    = useState(null);
  const socketRef = useRef(null);

  // Try connecting to backend socket; fall back to local simulation
  useEffect(() => {
    try {
      socketRef.current = io('http://localhost:5000', { timeout: 3000, reconnectionAttempts: 2 });
      socketRef.current.on('allVehicles', (data) => { if (data?.length) setVehicles(data); });
      socketRef.current.on('vehicleUpdate', (updated) => {
        setVehicles(prev => prev.map(v => v.id === updated.id ? { ...v, ...updated } : v));
      });
      socketRef.current.on('routeData', (data) => { setRouteResult(data); setCalcLoading(false); });
    } catch {}

    // Always run local simulation regardless
    const sim = setInterval(() => {
      setVehicles(prev => prev.map(v => ({
        ...v,
        lat: v.lat + (Math.random() - 0.5) * 0.0008,
        lng: v.lng + (Math.random() - 0.5) * 0.0008,
        speed: Math.floor(Math.random() * 40) + 10,
        eta: Math.max(1, v.eta + Math.floor(Math.random() * 3) - 1),
      })));
    }, 3000);

    axios.get('/api/transport/stops').then(r => { if (r.data?.length) setStops(r.data); }).catch(() => {});

    return () => {
      clearInterval(sim);
      socketRef.current?.disconnect();
    };
  }, []);

  const filtered = vehicles.filter(v => v.type === vType);
  const meta     = VEHICLE_META[vType] || VEHICLE_META.bus;

  const calcFare = () => {
    if (!from || !to || from === to) return;
    setCalcLoading(true);
    setRouteResult(null);

    // Try socket first
    if (socketRef.current?.connected) {
      socketRef.current.emit('requestRoute', { from, to, vehicleType: vType });
      setTimeout(() => { if (calcLoading) fallbackCalc(); }, 3500);
      return;
    }
    fallbackCalc();
  };

  const fallbackCalc = () => {
    axios.post('/api/fare/calculate', { from, to, vehicleType: vType })
      .then(r => { setRouteResult(r.data); setCalcLoading(false); })
      .catch(() => {
        // Full offline fallback
        const dist  = parseFloat((Math.random() * 12 + 2).toFixed(1));
        const rates = { bus: 1.5, taxi: 12, rickshaw: 8 };
        const bases = { bus: 5,   taxi: 30, rickshaw: 15 };
        const fare  = Math.round(bases[vType] + dist * rates[vType]);
        setRouteResult({
          from, to, vehicleType: vType,
          distance: dist,
          estimatedTime: Math.round(dist * (vType === 'bus' ? 3.2 : 2.1)),
          fare,
          minFare: Math.round(fare * 0.9),
          maxFare: Math.round(fare * 1.15),
          stops:   Math.floor(dist / 1.5),
          fareType: vType === 'bus' ? 'Fixed Route' : vType === 'taxi' ? 'Metered' : 'Negotiable',
        });
        setCalcLoading(false);
      });
  };

  return (
    <AppLayout title="Live Tracking">
      <div className="tracking-page">

        {/* ── Header with vehicle switcher ── */}
        <div className="tp-header fade-in">
          <div className="tp-title-row">
            <button className="tp-back" onClick={() => navigate('/select-vehicle')}>← Back</button>
            <div>
              <h1>{meta.emoji} {meta.label} Tracking</h1>
              <p>{filtered.length} vehicles live in your city</p>
            </div>
          </div>
          <div className="tp-switcher">
            {Object.entries(VEHICLE_META).map(([k, v]) => (
              <button
                key={k}
                className={`tp-switch-btn ${vType === k ? 'active' : ''}`}
                style={{ '--vc': v.color }}
                onClick={() => { setVType(k); setRouteResult(null); }}
              >
                {v.emoji} {v.label}
              </button>
            ))}
          </div>
        </div>

        <div className="tracking-layout fade-in-1">

          {/* ── Left: Route Planner + Vehicle List ── */}
          <div className="tracking-panel">

            {/* Route planner */}
            <div className="route-planner card" style={{ '--vc': meta.color }}>
              <div className="rp-header">
                <h3>🔍 Plan Your Route</h3>
                <span className="rp-badge">{meta.emoji} {meta.label}</span>
              </div>

              <div className="planner-form">
                <div className="input-group">
                  <label>📍 From (Starting Point)</label>
                  <select className="form-input" value={from} onChange={e => setFrom(e.target.value)}>
                    <option value="">Select starting point</option>
                    {stops.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="swap-row">
                  <div className="swap-line"></div>
                  <button className="swap-btn" onClick={() => { const t = from; setFrom(to); setTo(t); }}>⇅</button>
                  <div className="swap-line"></div>
                </div>

                <div className="input-group">
                  <label>🏁 To (Destination)</label>
                  <select className="form-input" value={to} onChange={e => setTo(e.target.value)}>
                    <option value="">Select destination</option>
                    {stops.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <button
                  className="btn-primary calc-btn"
                  onClick={calcFare}
                  disabled={calcLoading || !from || !to || from === to}
                  style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.color}cc)`, color: '#0a0f1e' }}
                >
                  {calcLoading ? '⏳ Calculating...' : `Calculate ${meta.label} Route →`}
                </button>
              </div>

              {/* Route result */}
              {routeResult && (
                <div className="route-result">
                  <div className="rr-route">
                    <span className="rr-from">📍 {routeResult.from}</span>
                    <span className="rr-arrow">⟶</span>
                    <span className="rr-to">📍 {routeResult.to}</span>
                  </div>
                  <div className="rr-stats">
                    <div className="rr-stat">
                      <span className="rr-icon">📏</span>
                      <span className="rr-val">{routeResult.distance} km</span>
                      <span className="rr-lbl">Distance</span>
                    </div>
                    <div className="rr-stat">
                      <span className="rr-icon">⏱️</span>
                      <span className="rr-val">{routeResult.estimatedTime} min</span>
                      <span className="rr-lbl">Est. Time</span>
                    </div>
                    <div className="rr-stat highlight" style={{ '--vc': meta.color }}>
                      <span className="rr-icon">💰</span>
                      <span className="rr-val fare">₹{routeResult.fare}</span>
                      <span className="rr-lbl">{routeResult.fareType || 'Fare'}</span>
                    </div>
                    {routeResult.stops > 0 && (
                      <div className="rr-stat">
                        <span className="rr-icon">🛑</span>
                        <span className="rr-val">{routeResult.stops}</span>
                        <span className="rr-lbl">Stops</span>
                      </div>
                    )}
                  </div>
                  <p className="rr-range">Fare range: <strong>₹{routeResult.minFare}</strong> – <strong>₹{routeResult.maxFare}</strong></p>
                </div>
              )}
            </div>

            {/* Vehicle list */}
            <div className="card vehicle-panel">
              <h3>
                {meta.emoji} Live {meta.label}s
                <span className="count-badge">{filtered.length}</span>
              </h3>
              <div className="v-scroll">
                {filtered.map(v => (
                  <div key={v.id}
                    className={`v-item ${selected?.id === v.id ? 'selected' : ''}`}
                    style={{ '--vc': meta.color }}
                    onClick={() => setSelected(selected?.id === v.id ? null : v)}
                  >
                    <span className="v-em">{meta.emoji}</span>
                    <div className="v-details">
                      <strong>{v.route}</strong>
                      <span>{v.driver} · {v.plateNo}</span>
                    </div>
                    <div className="v-right">
                      <div className="v-eta">ETA {v.eta}m</div>
                      <div className="v-speed">{v.speed}<small>km/h</small></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Map ── */}
          <div className="map-wrap card">
            <div className="map-label">
              <span className="status-dot active"></span>
              Live {meta.label} positions · Updates every 3s
            </div>
            <MapContainer
              center={CITY_CENTER}
              zoom={13}
              style={{ height: '560px', width: '100%' }}
              className="map-container"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              {filtered.map(v => (
                <Marker
                  key={v.id}
                  position={[v.lat || CITY_CENTER[0], v.lng || CITY_CENTER[1]]}
                  icon={icons[v.type] || icons.bus}
                  eventHandlers={{ click: () => setSelected(v) }}
                >
                  <Popup>
                    <div className="map-popup">
                      <strong>{meta.emoji} {v.route}</strong><br />
                      Driver: {v.driver}<br />
                      Plate: {v.plateNo}<br />
                      Speed: {v.speed} km/h<br />
                      ETA: {v.eta} min<br />
                      Passengers: {v.passengers}<br />
                      Rating: ⭐ {v.rating}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
