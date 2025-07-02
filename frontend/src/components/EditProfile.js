import React, { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function EditProfile({ user, onClose, onProfileUpdated, darkMode }) {
  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApply = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('user_id', user.username);
    if (username !== user.username) formData.append('username', username);
    if (password) formData.append('password', password);
    if (photo) formData.append('photo', photo);
    try {
      const res = await fetch(`${API_URL}/update_profile`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        // If photo updated, convert to base64 for frontend
        if (photo) {
          readFileAsBase64(photo).then(base64 => {
            onProfileUpdated({ username: data.username, photo: base64 });
            onClose();
          });
        } else {
          onProfileUpdated({ username: data.username, photo: data.photo });
          onClose();
        }
      } else {
        setError(data.error || 'Update failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 320, // right of sidebar
      width: 'calc(100vw - 320px)',
      height: '100vh',
      background: darkMode ? 'rgba(24,28,35,0.85)' : 'rgba(255,255,255,0.85)',
      zIndex: 4000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <form
        onSubmit={handleApply}
        style={{
          background: darkMode ? '#23272f' : '#fff',
          borderRadius: 16,
          boxShadow: '0 4px 32px rgba(30,136,229,0.12)',
          padding: 40,
          minWidth: 340,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        encType="multipart/form-data"
      >
        <h2 style={{ color: darkMode ? '#f7f9fb' : '#1E88E5', marginBottom: 24 }}>Edit Profile</h2>
        <input
          type="text"
          placeholder="New Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          style={{
            marginBottom: 16,
            padding: 10,
            borderRadius: 8,
            border: `1px solid ${darkMode ? '#444' : '#b3d2f7'}`,
            background: darkMode ? '#181c23' : '#f7f9fb',
            color: darkMode ? '#f7f9fb' : '#1E88E5',
            width: 220,
            fontSize: 16
          }}
        />
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            marginBottom: 16,
            padding: 10,
            borderRadius: 8,
            border: `1px solid ${darkMode ? '#444' : '#b3d2f7'}`,
            background: darkMode ? '#181c23' : '#f7f9fb',
            color: darkMode ? '#f7f9fb' : '#1E88E5',
            width: 220,
            fontSize: 16
          }}
        />
        <div style={{ width: 220, marginBottom: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <label htmlFor="profile-photo-upload" style={{
            display: 'inline-block',
            padding: '8px 18px',
            borderRadius: 8,
            background: darkMode ? '#1E88E5' : '#1E88E5',
            color: '#fff',
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            marginBottom: 6,
            boxShadow: '0 2px 8px rgba(30,136,229,0.08)',
            transition: 'background 0.2s',
            textAlign: 'center',
          }}>
            Choose Photo
            <input
              id="profile-photo-upload"
              type="file"
              accept="image/*"
              onChange={e => setPhoto(e.target.files[0])}
              style={{ display: 'none' }}
            />
          </label>
          <span style={{ color: darkMode ? '#f7f9fb' : '#1E88E5', fontSize: 14, marginLeft: 2, textAlign: 'center' }}>
            {photo ? photo.name : 'No file chosen'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '8px 32px',
              borderRadius: 8,
              border: 'none',
              background: darkMode ? '#1E88E5' : '#1E88E5',
              color: '#fff',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(30,136,229,0.08)',
              transition: 'background 0.2s',
            }}
          >
            {loading ? 'Applying...' : 'Apply'}
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 32px',
              borderRadius: 8,
              border: 'none',
              background: darkMode ? '#444' : '#e3eaf2',
              color: darkMode ? '#f7f9fb' : '#1E88E5',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(30,136,229,0.08)',
              transition: 'background 0.2s',
            }}
          >
            Cancel
          </button>
        </div>
        {error && <div style={{ color: '#e74c3c', fontWeight: 500, marginTop: 8 }}>{error}</div>}
      </form>
    </div>
  );
}

export default EditProfile; 