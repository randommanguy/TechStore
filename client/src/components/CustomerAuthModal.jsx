import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function CustomerAuthModal({ isOpen, onClose }) {
  const [tab, setTab] = useState('login'); // 'login' | 'signup'
  const { customerLogin, customerSignup } = useAuth();

  // Login form state
  const [loginName, setLoginName] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupMainAddr, setSignupMainAddr] = useState('');
  const [signupSecAddr, setSignupSecAddr] = useState('');
  const [signupDOB, setSignupDOB] = useState('');

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const fillDemoCustomer = () => {
    setLoginName('AlexRivera');
    setLoginEmail('alex@techstore.com');
    setLoginPassword('Password123!');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const success = await customerLogin({
      name: loginName.trim(),
      email: loginEmail.trim(),
      password: loginPassword
    });
    if (success) {
      onClose();
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const success = await customerSignup({
      name: signupName.trim(),
      email: signupEmail.trim(),
      password: signupPassword,
      main_address: signupMainAddr.trim(),
      secondary_address: signupSecAddr.trim(),
      DOB: signupDOB
    });
    if (success) {
      setTab('login');
      setLoginName(signupName);
      setLoginEmail(signupEmail);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-title">
            <span>👤</span> Customer Authentication
          </div>
          <button className="btn-close-modal" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-tabs">
            <button
              className={`tab-btn ${tab === 'login' ? 'active' : ''}`}
              onClick={() => setTab('login')}
            >
              Sign In
            </button>
            <button
              className={`tab-btn ${tab === 'signup' ? 'active' : ''}`}
              onClick={() => setTab('signup')}
            >
              Create Account
            </button>
          </div>

          {tab === 'login' ? (
            <div>
              <button
                type="button"
                className="btn-demo"
                onClick={fillDemoCustomer}
              >
                ⚡ Quick-Fill Demo Customer (alex@techstore.com)
              </button>

              <form onSubmit={handleLoginSubmit}>
                <div className="form-group">
                  <label>Account Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AlexRivera"
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="alex@techstore.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                  <div className="form-hint">
                    At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character.
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%' }}
                >
                  Sign In as Customer
                </button>
              </form>
            </div>
          ) : (
            <div>
              <form onSubmit={handleSignupSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="StrongPass123!"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                  />
                  <div className="form-hint">
                    Must contain min 8 chars, upper &amp; lower case, special symbol, no spaces.
                  </div>
                </div>

                <div className="form-group">
                  <label>Primary Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="123 Market St, Suite 4B"
                    value={signupMainAddr}
                    onChange={(e) => setSignupMainAddr(e.target.value)}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Secondary Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="Suite 200"
                      value={signupSecAddr}
                      onChange={(e) => setSignupSecAddr(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Date of Birth *</label>
                    <input
                      type="date"
                      required
                      value={signupDOB}
                      onChange={(e) => setSignupDOB(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%' }}
                >
                  Create Customer Account
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
