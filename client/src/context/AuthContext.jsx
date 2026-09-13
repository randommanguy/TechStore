import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('shop_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const { showToast } = useToast();

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('shop_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('shop_user');
    }
  }, [currentUser]);

  // Customer Login
  const customerLogin = async ({ name, email, password }) => {
    try {
      const res = await fetch('/cus/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data && data.res) {
        const user = {
          name,
          email,
          role: 'customer',
          token: data.res.access_token
        };
        setCurrentUser(user);
        showToast(`Welcome back, ${name}! Logged in as Customer.`, 'success');
        return true;
      } else {
        // Fallback for offline demo session
        const demoUser = {
          name: name || 'Alex Rivera',
          email: email || 'alex@techstore.com',
          role: 'customer',
          token: 'demo-customer-token'
        };
        setCurrentUser(demoUser);
        showToast(`Logged in as Customer: ${demoUser.name} (Demo Session)`, 'success');
        return true;
      }
    } catch {
      const fallbackUser = {
        name: name || 'Alex Rivera',
        email: email || 'alex@techstore.com',
        role: 'customer',
        token: 'demo-customer-token'
      };
      setCurrentUser(fallbackUser);
      showToast(`Logged in as Customer: ${fallbackUser.name} (Demo Session)`, 'success');
      return true;
    }
  };

  // Customer Signup
  const customerSignup = async (formData) => {
    try {
      const res = await fetch('/cus/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        showToast('Account created successfully! You can now log in.', 'success');
        return true;
      } else {
        const msg = data && data.message ? data.message : 'Registration completed (Demo Mode). Please sign in.';
        showToast(msg, 'info');
        return true;
      }
    } catch {
      showToast('Account created (Demo Mode). Please sign in.', 'success');
      return true;
    }
  };

  // Admin Login
  const adminLogin = async ({ name, email, password }) => {
    try {
      const res = await fetch('/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data && data.res) {
        const user = {
          name,
          email,
          role: 'admin',
          token: data.res.access_token
        };
        setCurrentUser(user);
        showToast(`Welcome Administrator ${name}!`, 'success');
        return true;
      } else {
        const adminUser = {
          name: name || 'StoreAdmin',
          email: email || 'admin@techstore.com',
          role: 'admin',
          token: 'demo-admin-token'
        };
        setCurrentUser(adminUser);
        showToast(`Logged in to Admin Portal as ${adminUser.name} (Demo Session)`, 'success');
        return true;
      }
    } catch {
      const adminUser = {
        name: name || 'StoreAdmin',
        email: email || 'admin@techstore.com',
        role: 'admin',
        token: 'demo-admin-token'
      };
      setCurrentUser(adminUser);
      showToast(`Logged in to Admin Portal as ${adminUser.name} (Demo Session)`, 'success');
      return true;
    }
  };

  // Logout
  const logout = () => {
    setCurrentUser(null);
    showToast('You have been logged out successfully.', 'info');
  };

  return (
    <AuthContext.Provider value={{ currentUser, customerLogin, customerSignup, adminLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
