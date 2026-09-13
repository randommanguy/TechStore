import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar({ activeView, onNavigate, onOpenModal }) {
  const { currentUser, logout } = useAuth();
  const { totalCount } = useCart();

  const handleAdminClick = () => {
    if (currentUser && currentUser.role === 'admin') {
      onNavigate('admin');
    } else {
      onOpenModal('adminAuth');
    }
  };

  const handleLogout = () => {
    logout();
    if (activeView === 'admin') {
      onNavigate('storefront');
    }
  };

  return (
    <header className="navbar">
      <div className="nav-brand" onClick={() => onNavigate('storefront')}>
        <div className="brand-icon">🛒</div>
        <div>
          <div className="brand-title">TechStore</div>
          <div className="brand-subtitle">Online Electronics</div>
        </div>
      </div>

      <div className="nav-links">
        <button
          className={`nav-btn ${activeView === 'storefront' ? 'primary' : ''}`}
          onClick={() => onNavigate('storefront')}
        >
          <span>🏬</span> Shop
        </button>

        <button
          className="nav-btn primary"
          onClick={() => onOpenModal('cart')}
        >
          <span>🛍️</span> Cart
          <span className="cart-badge">{totalCount}</span>
        </button>

        <div id="userNavSection">
          {!currentUser ? (
            <button
              className="nav-btn"
              onClick={() => onOpenModal('customerAuth')}
            >
              <span>👤</span> Customer Login
            </button>
          ) : (
            <div className="user-status">
              <span>{currentUser.role === 'admin' ? '🛡️' : '👤'}</span>
              <span>
                {currentUser.role === 'admin' ? 'Admin' : 'Customer'}:{' '}
                <strong>{currentUser.name}</strong>
              </span>
              <button
                className="btn-sm-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>

        <button
          className={`nav-btn ${activeView === 'admin' ? 'primary' : ''}`}
          onClick={handleAdminClick}
        >
          <span>🛡️</span> Admin Portal
        </button>
      </div>
    </header>
  );
}
