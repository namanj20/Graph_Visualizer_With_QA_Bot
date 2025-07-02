import React from 'react';

/**
 * Navbar component for the top navigation
 */
function Navbar({ darkMode, toggleDarkMode, onMenuClick }) {
  return (
    <nav className="navbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {/* Left: hamburger and logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Hamburger menu */}
        <div
          onClick={onMenuClick}
          style={{ cursor: 'pointer', width: 24, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Open menu"
          tabIndex={0}
          role="button"
          aria-label="Open menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect y="5" width="24" height="3" rx="1.5" fill="#1E88E5" />
            <rect y="10.5" width="24" height="3" rx="1.5" fill="#1E88E5" />
            <rect y="16" width="24" height="3" rx="1.5" fill="#1E88E5" />
          </svg>
        </div>
        {/* Logo (light/dark) */}
        <img
          src={darkMode ? '/dark.png' : '/light.jpg'}
          alt="Logo"
          style={{ height: '100%', maxHeight: 64, width: 'auto', borderRadius: 0, boxShadow: 'none', border: 'none', display: 'block', objectFit: 'contain', margin: 0, padding: 0 }}
        />
      </div>
      {/* Right: dark mode toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div
          onClick={toggleDarkMode}
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            width: 54,
            height: 32,
            borderRadius: 20,
            background: 'rgba(30,136,229,0.15)',
            border: `2px solid rgba(30,136,229,0.15)`,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            position: 'relative',
            transition: 'background 0.2s',
            marginLeft: 0,
          }}
          tabIndex={0}
          role="button"
          aria-pressed={darkMode}
        >
          {/* Sun icon (left, always solid blue) */}
          <svg width="20" height="20" style={{marginLeft: 4, opacity: darkMode ? 0.5 : 1, transition: 'opacity 0.2s'}} viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="13" cy="13" r="6" fill="#1E88E5" />
            <g stroke="#1E88E5" strokeWidth="2">
              <line x1="13" y1="2" x2="13" y2="6"/>
              <line x1="13" y1="20" x2="13" y2="24"/>
              <line x1="2" y1="13" x2="6" y2="13"/>
              <line x1="20" y1="13" x2="24" y2="13"/>
              <line x1="5.22" y1="5.22" x2="8.05" y2="8.05"/>
              <line x1="17.95" y1="17.95" x2="20.78" y2="20.78"/>
              <line x1="5.22" y1="20.78" x2="8.05" y2="17.95"/>
              <line x1="17.95" y1="8.05" x2="20.78" y2="5.22"/>
            </g>
          </svg>
          {/* Moon icon (right, always solid blue) */}
          <svg width="20" height="20" style={{marginLeft: 6, opacity: darkMode ? 1 : 0.5, transition: 'opacity 0.2s'}} viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 18.5C19.5 19.5 17.5 20 15.5 20C10.2533 20 6 15.7467 6 10.5C6 8.5 6.5 6.5 7.5 5C4.5 6.5 2.5 9.5 2.5 13C2.5 18.2467 6.75329 22.5 12 22.5C15.5 22.5 18.5 20.5 20 17.5C20.5 17.8333 21 18.1667 21 18.5Z" fill="#1E88E5" />
          </svg>
          {/* Toggle handle (translucent blue) */}
          <div style={{
            position: 'absolute',
            top: 3,
            left: darkMode ? 28 : 3,
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: 'rgba(30,136,229,0.15)',
            boxShadow: '0 2px 8px rgba(30,136,229,0.10)',
            transition: 'left 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }} />
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 