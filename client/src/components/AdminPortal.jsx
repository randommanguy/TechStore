import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { PRESET_IMAGES } from '../constants/defaultProducts';

export default function AdminPortal({ onBackToStore }) {
  const { products, addProduct, adjustStock, deleteProduct } = useProducts();

  // Add Product form state
  const [prodName, setProdName] = useState('');
  const [prodBrand, setProdBrand] = useState('');
  const [prodCategory, setProdCategory] = useState('Electronics');
  const [prodPrice, setProdPrice] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImg, setProdImg] = useState('');

  // Stats
  const totalItems = products.length;
  const totalStock = products.reduce((sum, p) => sum + parseInt(p.stock || 0, 10), 0);
  const activeCategoriesCount = new Set(products.map(p => p.category)).size;

  const handleSubmit = (e) => {
    e.preventDefault();
    addProduct({
      name: prodName.trim(),
      brand: prodBrand.trim(),
      category: prodCategory,
      price: prodPrice,
      stock: prodStock,
      description: prodDesc.trim(),
      image_url: prodImg.trim()
    });

    // Reset form
    setProdName('');
    setProdBrand('');
    setProdCategory('Electronics');
    setProdPrice('');
    setProdStock('');
    setProdDesc('');
    setProdImg('');
  };

  return (
    <main className="container admin-view-panel">
      <div className="admin-header">
        <div>
          <h2>🛡️ Administrator Management Portal</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manage product catalog, inventory stock, and categories
          </p>
        </div>
        <button className="btn-secondary" onClick={onBackToStore}>
          ⬅️ Back to Storefront
        </button>
      </div>

      {/* Admin Stats */}
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-label">Total Catalog Items</div>
          <div className="stat-val">{totalItems}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Stock in Units</div>
          <div className="stat-val">{totalStock}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Categories</div>
          <div className="stat-val">{activeCategoriesCount}</div>
        </div>
      </div>

      {/* Add Product Section */}
      <div className="admin-section">
        <h3>➕ Add New Product to Storefront</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Sony WH-1000XM5 Headphones"
                value={prodName}
                onChange={(e) => setProdName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Brand *</label>
              <input
                type="text"
                required
                placeholder="e.g. Sony"
                value={prodBrand}
                onChange={(e) => setProdBrand(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select
                required
                value={prodCategory}
                onChange={(e) => setProdCategory(e.target.value)}
              >
                <option value="Electronics">Electronics</option>
                <option value="Audio">Audio</option>
                <option value="Wearables">Wearables</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div className="form-group">
              <label>Price (USD $) *</label>
              <input
                type="number"
                min="1"
                step="0.01"
                required
                placeholder="299.99"
                value={prodPrice}
                onChange={(e) => setProdPrice(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Stock Quantity *</label>
              <input
                type="number"
                min="1"
                step="1"
                required
                placeholder="25"
                value={prodStock}
                onChange={(e) => setProdStock(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              rows="2"
              placeholder="Short description of the product..."
              value={prodDesc}
              onChange={(e) => setProdDesc(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Image URL (or select sample placeholder below)</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={prodImg}
              onChange={(e) => setProdImg(e.target.value)}
            />
            <div className="form-hint" style={{ marginTop: '6px' }}>
              Quick Presets:{' '}
              {PRESET_IMAGES.map((preset, index) => (
                <span key={preset.label}>
                  <a
                    href="#"
                    className="preset-img-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setProdImg(preset.url);
                    }}
                  >
                    {preset.label}
                  </a>
                  {index < PRESET_IMAGES.length - 1 ? ' | ' : ''}
                </span>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary">
            Add Product
          </button>
        </form>
      </div>

      {/* Inventory Table Section */}
      <div className="admin-section">
        <h3>📦 Current Inventory Management</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="inventory-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>#{p.id}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {p.brand || ''}
                    </div>
                  </td>
                  <td>
                    <span
                      className="product-category-tag"
                      style={{ position: 'static', display: 'inline-block' }}
                    >
                      {p.category}
                    </span>
                  </td>
                  <td>${parseFloat(p.price).toFixed(2)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button
                        className="cart-qty-btn"
                        onClick={() => adjustStock(p.id, -5)}
                      >
                        -5
                      </button>
                      <span
                        style={{
                          fontWeight: 'bold',
                          minWidth: '28px',
                          textAlign: 'center'
                        }}
                      >
                        {p.stock}
                      </span>
                      <button
                        className="cart-qty-btn"
                        onClick={() => adjustStock(p.id, 5)}
                      >
                        +5
                      </button>
                    </div>
                  </td>
                  <td>
                    <button
                      className="cart-remove-btn"
                      onClick={() => deleteProduct(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
