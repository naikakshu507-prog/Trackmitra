import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const stats = [
  { value: '12+', label: 'Routes Covered' },
  { value: '50+', label: 'Vehicles Live' },
  { value: '10K+', label: 'Daily Commuters' },
  { value: '3 Cities', label: 'Connected' },
];

const features = [
  { icon: '🗺️', title: 'Live GPS Tracking', desc: 'Watch your bus, taxi or rickshaw move in real-time on an interactive map.' },
  { icon: '⏱️', title: 'Accurate ETAs', desc: 'Know exactly when your ride arrives so you never miss it again.' },
  { icon: '💰', title: 'Fare Calculator', desc: 'Compare fares across bus, taxi and rickshaw before you travel.' },
  { icon: '🚌', title: 'Bus Routes', desc: 'Full city bus route map with stops, timings and live vehicle positions.' },
  { icon: '🛺', title: 'Rickshaw Finder', desc: 'Find the nearest auto rickshaw and estimate cost instantly.' },
  { icon: '🚕', title: 'Taxi Booking Info', desc: 'Get fare estimates and track available taxis in your area.' },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="landing">
      {/* Navbar */}
      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-brand">
          <span className="brand-icon">🏙️</span>
          <span className="brand-name">CityMove</span>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
        </div>
        <div className="nav-cta">
          <Link to="/login" className="btn-ghost nav-btn">Sign In</Link>
          <Link to="/register" className="btn-primary nav-btn">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-grid"></div>
          <div className="hero-blob blob1"></div>
          <div className="hero-blob blob2"></div>
          <div className="hero-blob blob3"></div>
        </div>

        <div className="hero-content">
          <div className="hero-badge fade-in">
            <span className="status-dot active"></span>
            Live tracking active across 3 cities
          </div>
          <h1 className="hero-title fade-in-1">
            Your City.<br />
            <span className="highlight">Your Ride.</span><br />
            On Time.
          </h1>
          <p className="hero-sub fade-in-2">
            Real-time GPS tracking for buses, taxis and auto rickshaws. Know exactly where your ride is, how long it'll take, and what it'll cost — before you leave home.
          </p>
          <div className="hero-btns fade-in-3">
            <Link to="/register" className="btn-primary hero-cta">Start Tracking Free →</Link>
            <Link to="/login" className="btn-ghost hero-cta">Sign In</Link>
          </div>

          {/* Floating vehicle cards */}
          <div className="float-cards fade-in-4">
            <div className="float-card">
              <span>🚌</span>
              <div>
                <strong>Bus 12A</strong>
                <p>Arrives in 4 min</p>
              </div>
              <span className="float-badge">Live</span>
            </div>
            <div className="float-card">
              <span>🚕</span>
              <div>
                <strong>Taxi nearby</strong>
                <p>₹45 · 2.3 km</p>
              </div>
              <span className="float-badge green">₹45</span>
            </div>
            <div className="float-card">
              <span>🛺</span>
              <div>
                <strong>Auto Rickshaw</strong>
                <p>₹28 · 1.8 km</p>
              </div>
              <span className="float-badge purple">₹28</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        {stats.map((s, i) => (
          <div key={i} className="stat-item">
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* Features */}
      <section className="features-section" id="features">
        <div className="section-header">
          <h2>Everything you need to <span className="highlight">get around</span></h2>
          <p>Designed for daily commuters in small and mid-sized Indian cities.</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card card">
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="how-section" id="how">
        <div className="section-header">
          <h2>Simple as <span className="highlight">1 – 2 – 3</span></h2>
        </div>
        <div className="steps">
          {[
            { n: '01', title: 'Create your account', desc: 'Sign up free in under 30 seconds with just your email.' },
            { n: '02', title: 'Choose your vehicle', desc: 'Select Bus, Taxi or Rickshaw and pick your start & end point.' },
            { n: '03', title: 'Track & Travel', desc: 'See live location, ETA and fare before you step out the door.' },
          ].map((s, i) => (
            <div key={i} className="step-card card">
              <span className="step-num">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="cta-content">
          <h2>Ready to commute smarter?</h2>
          <p>Join thousands of daily commuters tracking their rides live.</p>
          <Link to="/register" className="btn-primary cta-btn">Create Free Account →</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-brand">
          <span className="brand-icon">🏙️</span>
          <span className="brand-name">CityMove</span>
        </div>
        <p>© 2024 CityMove. Real-time transport tracking for Indian cities.</p>
      </footer>
    </div>
  );
}
