import { useState, useEffect } from 'react';
import { X, Globe, Heart, Share2, Wallet, Landmark, Star, LogOut, CheckCircle2, User, ChevronRight, ShieldCheck, ShoppingBag } from 'lucide-react';

export default function ProfileDrawer({
  isOpen,
  onClose,
  user,
  wishlistItems,
  onRemoveFromWishlist,
  onAddToCartFromWishlist,
  language,
  onChangeLanguage,
  balance,
  onRequestLoan,
  onLogout,
  onOpenAuth,
  products
}) {
  const [loanAmount, setLoanAmount] = useState('5000');
  const [loanStatus, setLoanStatus] = useState(''); // '', 'loading_risk', 'loading_orbit', 'approved'
  const [copySuccess, setCopySuccess] = useState(false);
  const [ratingVal, setRatingVal] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleRequestLoan = (e) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      onClose();
      return;
    }
    const amt = parseInt(loanAmount, 10);
    if (isNaN(amt) || amt <= 0) return;

    setLoanStatus('loading_risk');
    
    // Multi-stage zero-gravity credit evaluation animation
    setTimeout(() => {
      setLoanStatus('loading_orbit');
      setTimeout(() => {
        setLoanStatus('approved');
        onRequestLoan(amt);
        setTimeout(() => {
          setLoanStatus('');
        }, 2000);
      }, 1500);
    }, 1200);
  };

  const handleRatingSubmit = (e) => {
    e.preventDefault();
    setRatingLoading(true);
    setTimeout(() => {
      setRatingLoading(false);
      setRatingSubmitted(true);
      setReviewComment('');
      setTimeout(() => {
        setRatingSubmitted(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="cart-backdrop" onClick={onClose}>
      <div 
        className="cart-drawer glassmorphism" 
        onClick={(e) => e.stopPropagation()}
        style={{ width: '420px', maxWidth: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        {/* Header */}
        <div className="cart-header">
          <div className="cart-header-title">
            <User size={20} className="gold-text" />
            <h2>Cosmic Portal</h2>
          </div>
          <button className="close-cart-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="cart-body" style={{ flex: 1, overflowY: 'auto', padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* User Account / Identity Summary */}
          <div className="profile-identity-card glassmorphism-card" style={{ padding: '1.2rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: user ? 'radial-gradient(circle, hsl(var(--accent-gold)) 0%, hsl(var(--accent-violet)) 100%)' : 'rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <User size={20} style={{ color: user ? '#000' : 'rgba(255,255,255,0.4)' }} />
            </div>
            <div style={{ flex: 1 }}>
              {user ? (
                <>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#fff' }}>{user.name}</h4>
                  <span style={{ fontSize: '0.78rem', color: 'hsl(var(--text-muted))' }}>{user.email}</span>
                </>
              ) : (
                <>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#fff' }}>Cosmic Traveler (Guest)</h4>
                  <span style={{ fontSize: '0.78rem', color: 'hsl(var(--text-muted))' }}>Coordinates unaligned</span>
                </>
              )}
            </div>
            {!user && (
              <button 
                className="btn-gold-sm" 
                onClick={() => {
                  onOpenAuth();
                  onClose();
                }}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
              >
                Sign In
              </button>
            )}
          </div>

          {/* Stardust Wallet Balance (Meesho Balance) */}
          <div className="stardust-wallet-card glassmorphism-card" style={{
            padding: '1.2rem',
            borderRadius: '8px',
            border: '1px solid rgba(212,175,55,0.15)',
            background: 'linear-gradient(135deg, rgba(212,175,55,0.03) 0%, rgba(122,92,255,0.03) 100%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Wallet size={16} className="gold-text" />
                <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', letterSpacing: '0.05em' }}>STARDUST BALANCE</span>
              </div>
              <span className="gold-text" style={{ fontSize: '0.72rem', background: 'rgba(212,175,55,0.08)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>SECURED</span>
            </div>
            {user ? (
              <div style={{ fontSize: '2.1rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-sans)' }}>
                ₹{balance.toLocaleString('en-IN')}
              </div>
            ) : (
              <div style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', padding: '0.2rem 0' }}>
                Authenticate coordinates to activate balance vault.
              </div>
            )}
            {user && (
              <p style={{ margin: 0, fontSize: '0.72rem', color: 'hsl(var(--text-muted))', lineHeight: 1.4 }}>
                *Includes ₹500 Celestial onboarding credit. Use stardust credits for zero-gravity acquisitions.
              </p>
            )}
          </div>

          {/* Orbit Credit Loans Hub (Meesho Loans) */}
          <div className="orbit-loans-card glassmorphism-card" style={{
            padding: '1.2rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Landmark size={16} className="gold-text" />
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#fff', letterSpacing: '0.03em' }}>Orbit Loans Portal</h3>
            </div>
            
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', lineHeight: 1.45 }}>
              Need more stardust credits? Request instant interest-free cosmic loans directly to your wallet.
            </p>

            <form onSubmit={handleRequestLoan} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['2000', '5000', '10000'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setLoanAmount(amt)}
                    className={`filter-btn ${loanAmount === amt ? 'active' : ''}`}
                    style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem' }}
                    disabled={loanStatus !== ''}
                  >
                    ₹{parseInt(amt).toLocaleString('en-IN')}
                  </button>
                ))}
              </div>

              {loanStatus === '' && (
                <button 
                  type="submit" 
                  className="btn-gold" 
                  style={{ width: '100%', padding: '0.6rem', fontSize: '0.82rem' }}
                >
                  Request Orbit Loan
                </button>
              )}

              {loanStatus === 'loading_risk' && (
                <div style={{ textAlign: 'center', padding: '0.4rem', fontSize: '0.8rem', color: 'hsl(var(--accent-gold))' }} className="animate-pulse">
                  Evaluating gravity-risk parameters...
                </div>
              )}
              
              {loanStatus === 'loading_orbit' && (
                <div style={{ textAlign: 'center', padding: '0.4rem', fontSize: '0.8rem', color: 'hsl(var(--accent-violet))' }} className="animate-pulse">
                  Establishing loan orbital gateway...
                </div>
              )}

              {loanStatus === 'approved' && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.4rem', fontSize: '0.8rem', color: '#2ed573' }}>
                  <CheckCircle2 size={14} />
                  <span>Approved! Credits dispatched.</span>
                </div>
              )}
            </form>
          </div>

          {/* Wishlist Coordinates Section (Wishlist Products) */}
          <div className="wishlist-section-card glassmorphism-card" style={{
            padding: '1.2rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Heart size={16} className="gold-text" />
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#fff', letterSpacing: '0.03em' }}>Wishlist Coordinates</h3>
            </div>

            {!user ? (
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>
                Sign in to save zero-gravity coordinate alignment records.
              </p>
            ) : wishlistItems.length === 0 ? (
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>
                No coordinates aligned. Favorite products using the heart icon on cards.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '200px', overflowY: 'auto' }}>
                {wishlistItems.map((item) => (
                  <div key={item.id} className="wishlist-item-row" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '0.6rem',
                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                    gap: '0.8rem'
                  }}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      style={{ width: '36px', height: '36px', borderRadius: '4px', objectFit: 'cover', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }} 
                    />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
                        {item.name}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'hsl(var(--accent-gold))' }}>
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                      <button
                        onClick={() => onAddToCartFromWishlist(item)}
                        className="btn-gold-sm"
                        style={{ padding: '0.3rem 0.5rem' }}
                        title="Add to Cart"
                      >
                        <ShoppingBag size={12} />
                      </button>
                      <button
                        onClick={() => onRemoveFromWishlist(item.id)}
                        className="btn-outline"
                        style={{ padding: '0.3rem 0.5rem', border: '1px solid rgba(255,74,74,0.2)', color: '#ff4a4a', background: 'none' }}
                        title="Remove"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Change Language (Translate Alignment) */}
          <div className="language-setting-card glassmorphism-card" style={{
            padding: '1.2rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Globe size={16} className="gold-text" />
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#fff', letterSpacing: '0.03em' }}>Translate Alignment</h3>
            </div>

            <div style={{ position: 'relative' }}>
              <select
                value={language}
                onChange={(e) => onChangeLanguage(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '4px',
                  color: '#fff',
                  padding: '0.5rem 2rem 0.5rem 0.8rem',
                  fontSize: '0.82rem',
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  WebkitAppearance: 'none'
                }}
              >
                <option value="en">English (US/UK)</option>
                <option value="hi">Hindi (हिंदी)</option>
                <option value="ta">Tamil (தமிழ்)</option>
              </select>
              <ChevronRight size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%) rotate(90deg)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* Share Products / Store (Transmit Coordinates) */}
          <div className="share-setting-card glassmorphism-card" style={{
            padding: '1.2rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Share2 size={16} className="gold-text" />
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#fff', letterSpacing: '0.03em' }}>Transmit Coordinates</h3>
            </div>
            
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', lineHeight: 1.4 }}>
              Broadcast this zero-gravity storefront coordinates to other galactic travelers.
            </p>

            <button
              onClick={handleCopyLink}
              className="btn-outline"
              style={{
                width: '100%',
                padding: '0.5rem',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                borderColor: copySuccess ? '#2ed573' : 'rgba(255,255,255,0.1)'
              }}
            >
              {copySuccess ? (
                <>
                  <CheckCircle2 size={14} style={{ color: '#2ed573' }} />
                  <span style={{ color: '#2ed573' }}>Coordinates Copied!</span>
                </>
              ) : (
                <>
                  <Share2 size={14} />
                  <span>Copy Store Link</span>
                </>
              )}
            </button>
          </div>

          {/* Rate Us Option (Rate Meesho) */}
          <div className="rate-setting-card glassmorphism-card" style={{
            padding: '1.2rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Star size={16} className="gold-text" />
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#fff', letterSpacing: '0.03em' }}>Rate the Orbit</h3>
            </div>

            {ratingSubmitted ? (
              <div style={{ textAlign: 'center', padding: '0.5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                <CheckCircle2 size={24} className="gold-text" />
                <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>Review Transmitted!</span>
                <span style={{ fontSize: '0.72rem', color: 'hsl(var(--text-muted))' }}>Thank you for aligning our orbit stars.</span>
              </div>
            ) : (
              <form onSubmit={handleRatingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', padding: '0.2rem 0' }}>
                  {[1, 2, 3, 4, 5].map((val) => {
                    const isLit = val <= (hoverRating || ratingVal);
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setRatingVal(val)}
                        onMouseEnter={() => setHoverRating(val)}
                        onMouseLeave={() => setHoverRating(0)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, outline: 'none' }}
                      >
                        <Star 
                          size={24} 
                          fill={isLit ? 'hsl(var(--accent-gold))' : 'none'} 
                          className={isLit ? 'gold-text' : ''} 
                          style={{ color: isLit ? 'hsl(var(--accent-gold))' : 'rgba(255,255,255,0.15)', transition: 'color 0.15s ease' }}
                        />
                      </button>
                    );
                  })}
                </div>

                <input
                  type="text"
                  placeholder="Share feedback comments..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '4px',
                    color: '#fff',
                    padding: '0.4rem 0.6rem',
                    fontSize: '0.8rem',
                    outline: 'none'
                  }}
                />

                <button
                  type="submit"
                  className="btn-outline"
                  style={{ padding: '0.4rem', fontSize: '0.8rem', border: '1px solid rgba(212,175,55,0.25)', color: 'hsl(var(--accent-gold))' }}
                  disabled={ratingLoading}
                >
                  {ratingLoading ? 'Transmitting Review...' : 'Submit Rating'}
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Footer Panel: Logout Option */}
        {user && (
          <div className="cart-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '1rem' }}>
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="btn-outline"
              style={{
                width: '100%',
                padding: '0.6rem',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                color: '#ff4a4a',
                borderColor: 'rgba(255,74,74,0.15)',
                background: 'none'
              }}
            >
              <LogOut size={14} />
              <span>De-align Coordinates (Logout)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
