import React from 'react';

/**
 * Sidebar component for the side navigation panel
 */
function Sidebar({ darkMode, isOpen, onClose, user, onLogout, onEditProfile }) {
  if (!isOpen) return null;

  return (
    <div
      className={`side-pane${darkMode ? ' kg-dark' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 'unset',
        width: 320,
        height: '100vh',
        background: darkMode ? '#23272f' : '#fff',
        boxShadow: '2px 0 16px rgba(30,136,229,0.08)',
        zIndex: 3000,
        display: 'flex',
        flexDirection: 'column',
        padding: 32,
        transition: 'left 0.3s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#1E88E5', display: 'flex', alignItems: 'center' }}
          title="Collapse"
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L10 14L18 22" stroke="#1E88E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', marginTop: 24 }}>
        {/* Avatar */}
        <div className="sidebar-avatar" style={{
          width: 110,
          height: 110,
          borderRadius: '50%',
          background: darkMode ? '#181c23' : '#e3eaf2',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: darkMode ? '2px solid #1E88E5' : '2px solid #b3d2f7',
          overflow: 'hidden',
        }}>
          {user && user.photo ? (
            <img
              src={`data:image/jpeg;base64,${user.photo}`}
              alt="User"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
            />
          ) : (
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: 'block' }}
            >
              <circle cx="20" cy="20" r="20" fill="none" />
              <path
                d="M20 22c-4.418 0-8 2.239-8 5v1a1 1 0 001 1h14a1 1 0 001-1v-1c0-2.761-3.582-5-8-5zm0-2a5 5 0 100-10 5 5 0 000 10z"
                fill={darkMode ? '#b3d2f7' : '#888'}
              />
            </svg>
          )}
        </div>
        {/* User label */}
        <div style={{ fontWeight: 600, fontSize: 20, color: darkMode ? '#f7f9fb' : '#1E88E5', marginBottom: 8 }}>
          {user && user.username ? user.username : 'User'}
        </div>
        {/* Edit and Logout buttons (identical style) */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 12, marginTop: 4 }}>
          <button
            className="sidebar-logout-btn"
            style={{
              minWidth: 90,
              padding: '6px 0',
              borderRadius: 8,
              border: 'none',
              background: darkMode ? '#1E88E5' : '#1E88E5',
              color: '#fff',
              fontWeight: 600,
              fontSize: 15,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(30,136,229,0.08)',
              transition: 'background 0.2s',
              whiteSpace: 'nowrap',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={onEditProfile}
          >
            Edit
          </button>
          <button
            className="sidebar-logout-btn"
            style={{
              minWidth: 90,
              padding: '6px 0',
              borderRadius: 8,
              border: 'none',
              background: darkMode ? '#1E88E5' : '#1E88E5',
              color: '#fff',
              fontWeight: 600,
              fontSize: 15,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(30,136,229,0.08)',
              transition: 'background 0.2s',
              whiteSpace: 'nowrap',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
        {/* Divider - even closer to buttons */}
        <div style={{ width: '80%', height: 1, background: darkMode ? '#444' : '#e3eaf2', margin: '2px 0 14px 0' }} />
        {/* Sidebar menu items - centered between lines */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
          <div style={{ fontWeight: 500, fontSize: 18, color: darkMode ? '#f7f9fb' : '#1E88E5', textAlign: 'center' }}>Products</div>
          <div style={{ fontWeight: 500, fontSize: 18, color: darkMode ? '#f7f9fb' : '#1E88E5', textAlign: 'center' }}>Services</div>
          <div style={{ fontWeight: 500, fontSize: 18, color: darkMode ? '#f7f9fb' : '#1E88E5', textAlign: 'center' }}>Investor Relations</div>
          <div style={{ fontWeight: 500, fontSize: 18, color: darkMode ? '#f7f9fb' : '#1E88E5', textAlign: 'center' }}>About Us</div>
          <div style={{ fontWeight: 500, fontSize: 18, color: darkMode ? '#f7f9fb' : '#1E88E5', textAlign: 'center' }}>Contact Us</div>
        </div>
      </div>
      {/* Bottom developer credit */}
      <div style={{ width: '100%', marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '80%', height: 1, background: darkMode ? '#444' : '#e3eaf2', margin: '18px 0 8px 0' }} />
        <div style={{ fontSize: 15, color: darkMode ? '#b3d2f7' : '#888', textAlign: 'center', fontWeight: 500 }}>
          Developed by Naman Jain
        </div>
      </div>
    </div>
  );
}

export default Sidebar; 