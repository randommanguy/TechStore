import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import ProductCatalog from './components/ProductCatalog';
import AdminPortal from './components/AdminPortal';
import CartModal from './components/CartModal';
import CheckoutNoticeModal from './components/CheckoutNoticeModal';
import CustomerAuthModal from './components/CustomerAuthModal';
import AdminAuthModal from './components/AdminAuthModal';
import ToastContainer from './components/ToastContainer';
import Footer from './components/Footer';

function MainLayout() {
  const [activeView, setActiveView] = useState('storefront'); // 'storefront' | 'admin'
  const [activeModal, setActiveModal] = useState(null); // 'cart' | 'checkoutNotice' | 'customerAuth' | 'adminAuth' | null
  const { currentUser } = useAuth();

  const handleNavigate = (view) => {
    if (view === 'admin') {
      if (currentUser?.role === 'admin') {
        setActiveView('admin');
      } else {
        setActiveModal('adminAuth');
      }
    } else {
      setActiveView('storefront');
    }
  };

  const closeModal = () => setActiveModal(null);

  return (
    <>
      <Navbar
        activeView={activeView}
        onNavigate={handleNavigate}
        onOpenModal={(modal) => setActiveModal(modal)}
      />

      {activeView === 'storefront' && (
        <>
          <HeroBanner />
          <ProductCatalog onOpenAuthModal={(modal) => setActiveModal(modal)} />
        </>
      )}

      {activeView === 'admin' && (
        <AdminPortal onBackToStore={() => setActiveView('storefront')} />
      )}

      <Footer />

      {/* Modals */}
      <CartModal
        isOpen={activeModal === 'cart'}
        onClose={closeModal}
        onProceedCheckout={() => setActiveModal('checkoutNotice')}
        onOpenAuthModal={(modal) => setActiveModal(modal)}
      />

      <CheckoutNoticeModal
        isOpen={activeModal === 'checkoutNotice'}
        onClose={closeModal}
      />

      <CustomerAuthModal
        isOpen={activeModal === 'customerAuth'}
        onClose={closeModal}
      />

      <AdminAuthModal
        isOpen={activeModal === 'adminAuth'}
        onClose={closeModal}
        onSuccess={() => setActiveView('admin')}
      />

      <ToastContainer />
    </>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <MainLayout />
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
