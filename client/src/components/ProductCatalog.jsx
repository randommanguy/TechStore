import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { CATEGORIES } from '../constants/defaultProducts';
import ProductCard from './ProductCard';

export default function ProductCatalog({ onOpenAuthModal }) {
  const { currentUser } = useAuth();
  const {
    filteredProducts,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery
  } = useProducts();

  // If user is not authenticated, show login gate
  if (!currentUser) {
    return (
      <main className="container">
        <div className="auth-gate-card">
          <div className="auth-gate-icon">🔒</div>
          <h2>Sign In to Browse Products</h2>
          <p>
            Exclusive catalog access is reserved for registered members and store administrators.
            Please sign in or create an account to view our live inventory, pricing, and add items to your cart.
          </p>
          <div className="auth-gate-actions">
            <button
              className="btn-primary"
              onClick={() => onOpenAuthModal('customerAuth')}
            >
              <span>👤</span> Sign In as Customer
            </button>
            <button
              className="btn-secondary"
              onClick={() => onOpenAuthModal('adminAuth')}
            >
              <span>🛡️</span> Admin Portal Login
            </button>
          </div>
          <div>
            <span className="auth-gate-hint">
              ⚡ Demo accounts available: 1-click quick fill on login screens
            </span>
          </div>
        </div>
      </main>
    );
  }

  // Authenticated view: full search, category filtering, and product grid
  return (
    <main className="container">
      <div className="store-toolbar">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search products by name, brand, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="category-filter">
          {CATEGORIES.map((cat) => {
            const label = cat === 'all' ? 'All Items' : cat;
            const isActive = activeCategory.toLowerCase() === cat.toLowerCase();

            return (
              <button
                key={cat}
                className={`category-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div
            style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '3rem 1rem',
              color: 'var(--text-muted)'
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔍</div>
            <h3>No products found</h3>
            <p>Try adjusting your search terms or filter category.</p>
          </div>
        )}
      </div>
    </main>
  );
}
