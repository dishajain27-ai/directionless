import { useState, useEffect } from 'react';
import { X, Lock, Mail, User, ShieldCheck } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState('signin'); // 'signin' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  // Clear state when tab changes
  useEffect(() => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrors({});
  }, [activeTab]);

  if (!isOpen) return null;

  const loadingPhrases = [
    'Establishing secure orbit...',
    'Verifying celestial credentials...',
    'Synchronizing cosmetic parameters...',
    'Access Granted. Welcome to the Cosmos.'
  ];

  // Simulated login/signup delay for rich micro-animation
  const triggerLoadingSequence = (callbackUser) => {
    setIsLoading(true);
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= loadingPhrases.length - 1) {
          clearInterval(stepInterval);
          setTimeout(() => {
            setIsLoading(false);
            onSuccess(callbackUser);
            onClose();
          }, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 900);
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email) newErrors.email = 'Email address is required';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Retrieve registered users from localStorage
    const savedUsers = JSON.parse(localStorage.getItem('directionless_users') || '[]');
    const matchedUser = savedUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    // Provide a default demo user for convenience
    const isDemoUser = email.toLowerCase() === 'demo@directionless.com' && password === 'cosmic123';
    
    if (matchedUser || isDemoUser) {
      const loggedUser = matchedUser || { name: 'Cosmic Traveler', email: 'demo@directionless.com' };
      triggerLoadingSequence(loggedUser);
    } else {
      setErrors({ form: 'Invalid email address or password combination.' });
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!email) newErrors.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Please enter a valid email address';
    
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const savedUsers = JSON.parse(localStorage.getItem('directionless_users') || '[]');
    const emailExists = savedUsers.some((u) => u.email.toLowerCase() === email.toLowerCase());

    if (emailExists) {
      setErrors({ email: 'This email is already registered.' });
      return;
    }

    // Save newly registered user
    const newUser = { name, email, password };
    savedUsers.push(newUser);
    localStorage.setItem('directionless_users', JSON.stringify(savedUsers));

    triggerLoadingSequence(newUser);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="checkout-modal glassmorphism" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '440px' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-area">
            <ShieldCheck size={20} className="gold-text" />
            <h2>{activeTab === 'signin' ? 'Access Account' : 'Create Account'}</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} disabled={isLoading}>
            <X size={18} />
          </button>
        </div>

        {/* Content Area */}
        <div className="modal-content">
          {isLoading ? (
            /* Loading Sequence Panel */
            <div className="processing-state animate-fade-in" style={{ padding: '3rem 1rem' }}>
              <div className="spinner-glow" style={{ position: 'relative', width: '50px', height: '50px', marginBottom: '1rem' }}>
                <div className="spinner" style={{ 
                  border: '3px solid rgba(212,175,55,0.1)', 
                  borderTop: '3px solid hsl(var(--accent-gold))', 
                  borderRadius: '50%', 
                  width: '100%', 
                  height: '100%',
                }} />
              </div>
              <p className="step-text" style={{ minHeight: '24px' }}>
                {loadingPhrases[loadingStep]}
              </p>
              <span className="security-notice">Zero-gravity secure channel active.</span>
            </div>
          ) : (
            /* Form Panel */
            <>
              {/* Tab Selector */}
              <div className="checkout-tabs" style={{ marginBottom: '1.8rem' }}>
                <button 
                  className={`tab-btn ${activeTab === 'signin' ? 'active' : ''}`}
                  onClick={() => setActiveTab('signin')}
                >
                  Sign In
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
                  onClick={() => setActiveTab('signup')}
                >
                  Sign Up
                </button>
              </div>

              {errors.form && (
                <div 
                  className="error-banner"
                  style={{
                    background: 'rgba(255, 74, 74, 0.08)',
                    border: '1px solid rgba(255, 74, 74, 0.2)',
                    padding: '0.8rem 1rem',
                    borderRadius: '4px',
                    color: '#ff4a4a',
                    fontSize: '0.82rem',
                    marginBottom: '1.2rem',
                    textAlign: 'center'
                  }}
                >
                  {errors.form}
                </div>
              )}

              {activeTab === 'signin' ? (
                /* SIGN IN FORM */
                <form className="checkout-form" onSubmit={handleSignIn}>
                  <div className="form-fields">
                    <div className="input-group">
                      <label>Email Address</label>
                      <div style={{ position: 'relative' }}>
                        <Mail 
                          size={14} 
                          style={{ 
                            position: 'absolute', 
                            left: '12px', 
                            top: '50%', 
                            transform: 'translateY(-50%)', 
                            color: 'hsl(var(--text-muted))' 
                          }} 
                        />
                        <input 
                          type="email" 
                          placeholder="traveler@orbit.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={errors.email ? 'input-error' : ''}
                          style={{ paddingLeft: '2.4rem', width: '100%' }}
                        />
                      </div>
                      {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>

                    <div className="input-group">
                      <label>Password</label>
                      <div style={{ position: 'relative' }}>
                        <Lock 
                          size={14} 
                          style={{ 
                            position: 'absolute', 
                            left: '12px', 
                            top: '50%', 
                            transform: 'translateY(-50%)', 
                            color: 'hsl(var(--text-muted))' 
                          }} 
                        />
                        <input 
                          type="password" 
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={errors.password ? 'input-error' : ''}
                          style={{ paddingLeft: '2.4rem', width: '100%' }}
                        />
                      </div>
                      {errors.password && <span className="error-text">{errors.password}</span>}
                    </div>
                  </div>

                  <p 
                    style={{ 
                      fontSize: '0.75rem', 
                      color: 'hsl(var(--text-secondary))', 
                      textAlign: 'center',
                      marginTop: '0.2rem'
                    }}
                  >
                    Demo credentials: <strong className="gold-text">demo@directionless.com</strong> / password: <strong className="gold-text">cosmic123</strong>
                  </p>

                  <button type="submit" className="btn-gold secure-submit-btn" style={{ marginTop: '0.8rem' }}>
                    Access Account
                  </button>
                </form>
              ) : (
                /* SIGN UP FORM */
                <form className="checkout-form" onSubmit={handleSignUp}>
                  <div className="form-fields">
                    <div className="input-group">
                      <label>Full Name</label>
                      <div style={{ position: 'relative' }}>
                        <User 
                          size={14} 
                          style={{ 
                            position: 'absolute', 
                            left: '12px', 
                            top: '50%', 
                            transform: 'translateY(-50%)', 
                            color: 'hsl(var(--text-muted))' 
                          }} 
                        />
                        <input 
                          type="text" 
                          placeholder="Your Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={errors.name ? 'input-error' : ''}
                          style={{ paddingLeft: '2.4rem', width: '100%' }}
                        />
                      </div>
                      {errors.name && <span className="error-text">{errors.name}</span>}
                    </div>

                    <div className="input-group">
                      <label>Email Address</label>
                      <div style={{ position: 'relative' }}>
                        <Mail 
                          size={14} 
                          style={{ 
                            position: 'absolute', 
                            left: '12px', 
                            top: '50%', 
                            transform: 'translateY(-50%)', 
                            color: 'hsl(var(--text-muted))' 
                          }} 
                        />
                        <input 
                          type="email" 
                          placeholder="traveler@orbit.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={errors.email ? 'input-error' : ''}
                          style={{ paddingLeft: '2.4rem', width: '100%' }}
                        />
                      </div>
                      {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>

                    <div className="input-group">
                      <label>Password</label>
                      <div style={{ position: 'relative' }}>
                        <Lock 
                          size={14} 
                          style={{ 
                            position: 'absolute', 
                            left: '12px', 
                            top: '50%', 
                            transform: 'translateY(-50%)', 
                            color: 'hsl(var(--text-muted))' 
                          }} 
                        />
                        <input 
                          type="password" 
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={errors.password ? 'input-error' : ''}
                          style={{ paddingLeft: '2.4rem', width: '100%' }}
                        />
                      </div>
                      {errors.password && <span className="error-text">{errors.password}</span>}
                    </div>

                    <div className="input-group">
                      <label>Confirm Password</label>
                      <div style={{ position: 'relative' }}>
                        <Lock 
                          size={14} 
                          style={{ 
                            position: 'absolute', 
                            left: '12px', 
                            top: '50%', 
                            transform: 'translateY(-50%)', 
                            color: 'hsl(var(--text-muted))' 
                          }} 
                        />
                        <input 
                          type="password" 
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={errors.confirmPassword ? 'input-error' : ''}
                          style={{ paddingLeft: '2.4rem', width: '100%' }}
                        />
                      </div>
                      {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                    </div>
                  </div>

                  <button type="submit" className="btn-gold secure-submit-btn">
                    Create Account
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
