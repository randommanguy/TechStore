import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const stockClass = isOutOfStock ? 'out' : isLowStock ? 'low' : '';
  const stockLabel = isOutOfStock
    ? 'Out of Stock'
    : isLowStock
    ? `Only ${product.stock} left!`
    : `In Stock: ${product.stock}`;

  const placeholderImg =
    product.image_url ||
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80';

  const handleAdd = () => {
    addToCart(product, qty);
  };

  return (
    <div className="product-card">
      <div className="product-img-wrapper">
        <img
          src={placeholderImg}
          alt={product.name}
          className="product-img"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `https://placehold.co/600x400/2563eb/ffffff?text=${encodeURIComponent(product.brand || 'Product')}`;
          }}
        />
        <span className="product-category-tag">{product.category}</span>
      </div>

      <div className="product-body">
        <div className="product-brand">{product.brand || 'Store Item'}</div>
        <h3 className="product-title" title={product.name}>
          {product.name}
        </h3>
        <p className="product-desc">
          {product.description || 'Quality product available from our inventory catalog.'}
        </p>

        <div className="product-footer">
          <div className="product-price-box">
            <span className="product-price">${parseFloat(product.price).toFixed(2)}</span>
            <span className={`product-stock ${stockClass}`}>{stockLabel}</span>
          </div>

          <div className="add-cart-controls">
            <input
              type="number"
              className="qty-input"
              value={qty}
              min="1"
              max={product.stock}
              disabled={isOutOfStock}
              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
            />
            <button
              className="btn-add-cart"
              disabled={isOutOfStock}
              onClick={handleAdd}
            >
              <span>🛒</span> Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
