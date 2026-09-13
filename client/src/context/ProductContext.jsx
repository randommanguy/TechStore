import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { DEFAULT_PRODUCTS } from '../constants/defaultProducts';
import { useToast } from './ToastContext';

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('shop_products');
      return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  });

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem('shop_products', JSON.stringify(products));
  }, [products]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCategory =
        activeCategory === 'all' ||
        p.category.toLowerCase() === activeCategory.toLowerCase();

      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query));

      return matchCategory && matchSearch;
    });
  }, [products, activeCategory, searchQuery]);

  // Admin: Add new product
  const addProduct = (prodData) => {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const newProduct = {
      id: newId,
      name: prodData.name,
      brand: prodData.brand,
      category: prodData.category,
      price: parseFloat(prodData.price),
      stock: parseInt(prodData.stock, 10),
      description: prodData.description || '',
      image_url: prodData.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'
    };

    setProducts(prev => [newProduct, ...prev]);
    showToast(`Product "${newProduct.name}" successfully added!`, 'success');
  };

  // Admin: Adjust stock
  const adjustStock = (productId, delta) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const newStock = Math.max(0, parseInt(p.stock || 0, 10) + delta);
          showToast(`Updated stock for "${p.name}" to ${newStock}.`, 'info');
          return { ...p, stock: newStock };
        }
        return p;
      })
    );
  };

  // Admin: Delete product
  const deleteProduct = (productId) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    if (window.confirm(`Are you sure you want to delete "${prod.name}"?`)) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      showToast(`Deleted "${prod.name}" from catalog.`, 'info');
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        filteredProducts,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        addProduct,
        adjustStock,
        deleteProduct
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
