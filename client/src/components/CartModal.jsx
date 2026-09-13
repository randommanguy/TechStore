import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';

export default function CartModal({ isOpen, onClose, onProceedCheckout, onOpenAuthModal }) {
  const { currentUser } = useAuth();
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    tax,
    shipping,
    total
  } = useCart();

  const { products } = useProducts();

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getStockForProduct = (productId) => {
    const prod = products.find((p) => p.id === productId);
    return prod ? prod.stock : 999;
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-card large">
        <div className="modal-header">
          <div className="modal-title">
            <span>🛍️</span> Your Shopping Cart
          </div>
          <button className="btn-close-modal" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          {!currentUser ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🔒</div>
              <h3>Sign In Required</h3>
              <p>Please log in to your customer or admin account to view and manage your shopping cart.</p>
              <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button
                  className="btn-primary"
                  onClick={() => {
                    onClose();
                    onOpenAuthModal?.('customerAuth');
                  }}
                >
                  <span>👤</span> Customer Login
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    onClose();
                    onOpenAuthModal?.('adminAuth');
                  }}
                >
                  <span>🛡️</span> Admin Login
                </button>
              </div>
            </div>
          ) : cart.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛍️</div>
              <h3>Your Cart is Empty</h3>
              <p>Explore our products and add items to your shopping cart.</p>
            </div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table className="cart-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Total</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => {
                      const lineTotal = item.price * item.quantity;
                      const thumb =
                        item.image_url ||
                        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&auto=format&fit=crop&q=80';
                      const stock = getStockForProduct(item.productId);

                      return (
                        <tr key={item.productId}>
                          <td>
                            <div className="cart-item-info">
                              <img
                                src={thumb}
                                alt={item.name}
                                className="cart-item-thumb"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    'https://placehold.co/80x80/2563eb/ffffff?text=Item';
                                }}
                              />
                              <div>
                                <div className="cart-item-title">{item.name}</div>
                                <div
                                  style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--text-muted)'
                                  }}
                                >
                                  {item.brand || ''}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>${parseFloat(item.price).toFixed(2)}</td>
                          <td>
                            <div className="cart-qty-ctrl">
                              <button
                                className="cart-qty-btn"
                                onClick={() =>
                                  updateQuantity(item.productId, item.quantity - 1, stock)
                                }
                              >
                                -
                              </button>
                              <span
                                style={{
                                  minWidth: '20px',
                                  textAlign: 'center',
                                  fontWeight: 600
                                }}
                              >
                                {item.quantity}
                              </span>
                              <button
                                className="cart-qty-btn"
                                onClick={() =>
                                  updateQuantity(item.productId, item.quantity + 1, stock)
                                }
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td style={{ fontWeight: 600 }}>${lineTotal.toFixed(2)}</td>
                          <td>
                            <button
                              className="cart-remove-btn"
                              title="Remove item"
                              onClick={() => removeFromCart(item.productId)}
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="cart-summary">
                <div className="summary-row">
                  <span>Cart Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Estimated Tax (8%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Standard Shipping:</span>
                  <span>
                    {shipping === 0 ? (
                      <strong style={{ color: 'var(--success)' }}>
                        FREE (Orders over $200)
                      </strong>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="summary-row total">
                  <span>Calculated Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}

          <div className="store-notice-box">
            <strong>📌 Order Notice:</strong>
            The <strong>Checkout Process</strong> is currently disabled in this preview version. You can add items, adjust quantities, calculate live taxes/totals, and clear the cart.
          </div>
        </div>

        <div className="modal-footer">
          {currentUser && (
            <button className="btn-secondary" onClick={clearCart} disabled={cart.length === 0}>
              Clear Cart
            </button>
          )}
          <button className="btn-secondary" onClick={onClose}>
            Continue Shopping
          </button>
          {currentUser && (
            <button
              className="btn-primary"
              disabled={cart.length === 0}
              onClick={onProceedCheckout}
            >
              Proceed to Checkout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
