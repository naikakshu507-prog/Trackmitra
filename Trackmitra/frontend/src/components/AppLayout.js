import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './AppLayout.css';

export default function AppLayout({ children, title }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="main-content">
        {/* Mobile header */}
        <header className="mobile-header">
          <button className="hamburger" onClick={() => setMobileOpen(true)}>
            <span></span><span></span><span></span>
          </button>
          <span className="mobile-title">{title || 'CityMove'}</span>
          <span className="brand-icon">🏙️</span>
        </header>
        <main className="page-main">
          {children}
        </main>
      </div>
    </div>
  );
}
