import React from 'react';
import { useCart } from '../context/CartContext';

export default function CheckoutNoticeModal({ isOpen, onClose }) {
  const { cart, subtotal, total } = useCart();

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-title" style={{ color: 'var(--danger)' }}>
            <span>⚠️</span> Checkout Unavailable
          </div>
          <button className="btn-close-modal" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🛑</div>
            <h3 style={{ marginBottom: '0.5rem' }}>Checkout Currently Disabled</h3>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.95rem',
                marginBottom: '1rem'
              }}
            >
              Online checkout is temporarily unavailable in this preview version.
              <br />
              Your cart items, quantities, and calculated totals are preserved.
            </p>

            <div
              style={{
                background: '#f1f5f9',
                padding: '0.75rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                textAlign: 'left'
              }}
            >
              <strong>Cart State Summary:</strong>
              <div style={{ marginTop: '4px' }}>
                <div><strong>Items in Cart:</strong> {cart.length} distinct item(s)</div>
                <div><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</div>
                <div><strong>Final Estimated Total:</strong> ${total.toFixed(2)}</div>
                <div style={{ marginTop: '6px', color: 'var(--danger)', fontWeight: 600 }}>
                  Status: Checkout is currently disabled in this preview version.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>
            Return to Store
          </button>
        </div>
      </div>
    </div>
  );
}
