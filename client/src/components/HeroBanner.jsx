import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function HeroBanner() {
  const { currentUser } = useAuth();

  return (
    <section className="store-banner">
      <div className="banner-content">
        <span className="banner-badge">
          {currentUser ? `Member Access • ${currentUser.role === 'admin' ? 'Admin' : 'Customer'}` : 'Exclusive Collection'}
        </span>
        <h1>Discover Premium Tech &amp; Electronics</h1>
        <p>
          {currentUser
            ? `Welcome back, ${currentUser.name}! Explore top-rated gadgets, audio gear, laptops, and wearables with live inventory and shopping cart.`
            : 'Sign in to discover premium tech, live inventory stock, real-time pricing, and seamless cart ordering.'}
        </p>
      </div>
    </section>
  );
}
