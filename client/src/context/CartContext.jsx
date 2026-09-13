import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('shop_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { showToast } = useToast();
  const { currentUser } = useAuth();

  useEffect(() => {
    localStorage.setItem('shop_cart', JSON.stringify(cart));
  }, [cart]);

  // Calculations
  const calculations = useMemo(() => {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal > 0 ? subtotal * 0.08 : 0;
    const shipping = subtotal > 0 ? (subtotal > 200 ? 0 : 9.99) : 0;
    const total = subtotal + tax + shipping;

    return { totalCount, subtotal, tax, shipping, total };
  }, [cart]);

  // Add to cart
  const addToCart = (product, quantity) => {
    if (!product) {
      showToast('Product not found.', 'error');
      return;
    }

    if (quantity <= 0) {
      showToast('Please enter a valid quantity.', 'warning');
      return;
    }

    const existingItem = cart.find(i => i.productId === product.id);
    const currentInCart = existingItem ? existingItem.quantity : 0;
    const newTotalQty = currentInCart + quantity;

    if (newTotalQty > product.stock) {
      showToast(`Sorry, only ${product.stock} units available in stock.`, 'warning');
      return;
    }

    if (existingItem) {
      setCart(prev =>
        prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: newTotalQty }
            : item
        )
      );
    } else {
      setCart(prev => [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          image_url: product.image_url,
          quantity: quantity
        }
      ]);
    }

    showToast(`Added ${quantity}x "${product.name}" to cart!`, 'success');

    // Attempt backend sync if customer has auth token
    if (currentUser?.role === 'customer' && currentUser.token) {
      fetch('/cus/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({ name: product.name, qty: quantity })
      }).catch(() => {});
    }
  };

  // Update quantity in cart
  const updateQuantity = (productId, newQty, productStock) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }

    if (productStock !== undefined && newQty > productStock) {
      showToast(`Maximum available stock is ${productStock}.`, 'warning');
      return;
    }

    setCart(prev =>
      prev.map(item =>
        item.productId === productId
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  // Remove from cart
  const removeFromCart = (productId) => {
    const item = cart.find(i => i.productId === productId);
    setCart(prev => prev.filter(i => i.productId !== productId));

    if (item) {
      showToast(`Removed "${item.name}" from cart.`, 'info');

      if (currentUser?.role === 'customer' && currentUser.token) {
        fetch('/cus/cart/del', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentUser.token}`
          },
          body: JSON.stringify({ name: item.name })
        }).catch(() => {});
      }
    }
  };

  // Clear cart
  const clearCart = () => {
    if (cart.length === 0) return;
    setCart([]);
    showToast('Shopping cart has been cleared.', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        ...calculations
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
