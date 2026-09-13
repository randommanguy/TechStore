import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AdminAuthModal({ isOpen, onClose, onSuccess }) {
  const [admName, setAdmName] = useState('');
  const [admEmail, setAdmEmail] = useState('');
  const [admPassword, setAdmPassword] = useState('');
  const { adminLogin } = useAuth();

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const fillDemoAdmin = () => {
    setAdmName('StoreAdmin');
    setAdmEmail('admin@techstore.com');
    setAdmPassword('AdminPassword123!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await adminLogin({
      name: admName.trim(),
      email: admEmail.trim(),
      password: admPassword
    });
    if (success) {
      onClose();
      if (onSuccess) onSuccess();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-title">
            <span>🛡️</span> Administrator Sign In
          </div>
          <button className="btn-close-modal" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <button
            type="button"
            className="btn-demo"
            onClick={fillDemoAdmin}
          >
            ⚡ Quick-Fill Demo Admin (admin@techstore.com)
          </button>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Admin Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. StoreAdmin"
                value={admName}
                onChange={(e) => setAdmName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Admin Email *</label>
              <input
                type="email"
                required
                placeholder="admin@techstore.com"
                value={admEmail}
                onChange={(e) => setAdmEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={admPassword}
                onChange={(e) => setAdmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%' }}
            >
              Log In to Admin Portal
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
