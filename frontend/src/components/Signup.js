import React, { useState, useRef } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function Signup({ onSignup, switchToLogin, onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  const handleAvatarClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('photo', photo);
    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        if (onLogin) {
          if (photo) {
            readFileAsBase64(photo).then(base64 => {
              onLogin({ username, photo: base64 });
            });
          } else {
            onLogin({ username });
          }
        }
        return;
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-back">
      <h2 className="text-3xl font-semibold mb-4 text-gray-800">Sign Up</h2>
      <form className="w-full flex flex-col items-center" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="signup-avatar mx-auto mb-4 flex items-center justify-center relative" onClick={handleAvatarClick} style={{cursor:'pointer'}}>
          {photoPreview ? (
            <img src={photoPreview} alt="Avatar Preview" className="signup-avatar-img" />
          ) : (
            <>
              <div className="signup-avatar-placeholder"></div>
              <span className="signup-avatar-center-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1E88E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pencil-svg">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                </svg>
              </span>
            </>
          )}
          <input
            type="file"
            id="profilePictureInput"
            accept="image/*"
            ref={fileInputRef}
            onChange={handlePhotoChange}
            style={{ display: 'none' }}
          />
        </div>
        <input
          type="text"
          placeholder="Username"
          className="input-field"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="input-field"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <button className="action-button" type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      <p className="text-gray-600 mt-6">Already have an account? <span className="toggle-link" onClick={switchToLogin}>Login</span></p>
    </div>
  );
}

export default Signup; 