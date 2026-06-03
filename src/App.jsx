import { useState, useEffect } from 'react';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import ThreeBackground from './components/ThreeBackground';
import PhysicsGrid from './components/PhysicsGrid';
import Cart from './components/Cart';
import CheckoutModal from './components/CheckoutModal';
import ProductDetailModal from './components/ProductDetailModal';
import Invoice from './components/Invoice';
import { ContainerScroll } from './components/ContainerScroll';
import AuthModal from './components/AuthModal';
import OrdersModal from './components/OrdersModal';
import ProfileDrawer from './components/ProfileDrawer';
import { translations } from './data/translations';
import { products } from './data/products';
import './App.css';

export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const [activeFilter, setActiveFilter] = useState('ALL');
  
  // Auth state loaded from session storage
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('directionless_user_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('directionless_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  // Meesho-inspired profile portal states
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [balance, setBalance] = useState(0);
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem('directionless_lang');
      return saved || 'en';
    } catch {
      return 'en';
    }
  });

  // Load wishlist and balance when user logs in/out or switches accounts
  useEffect(() => {
    if (user) {
      try {
        const savedWishlist = localStorage.getItem(`directionless_wishlist_${user.email}`);
        setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
      } catch {
        setWishlist([]);
      }

      try {
        const savedBalance = localStorage.getItem(`directionless_balance_${user.email}`);
        if (savedBalance === null) {
          localStorage.setItem(`directionless_balance_${user.email}`, '500');
          setBalance(500); // Registration bonus
        } else {
          setBalance(parseInt(savedBalance, 10));
        }
      } catch {
        setBalance(500);
      }
    } else {
      setWishlist([]);
      setBalance(0);
    }
  }, [user]);

  // Wishlist toggle handler
  const handleToggleWishlist = (productId) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    setWishlist((prev) => {
      const updated = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      localStorage.setItem(`directionless_wishlist_${user.email}`, JSON.stringify(updated));
      return updated;
    });
  };

  // Balance loan updater
  const handleRequestLoan = (amount) => {
    if (!user) return;
    setBalance((prev) => {
      const updated = prev + amount;
      localStorage.setItem(`directionless_balance_${user.email}`, updated.toString());
      return updated;
    });
  };

  // Translations translator helper
  const t = (key) => {
    const dict = translations[language] || translations['en'];
    return dict[key] || translations['en'][key] || key;
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('directionless_lang', newLang);
  };

  const filteredProducts = activeFilter === 'ALL'
    ? products
    : products.filter(p => p.category.toUpperCase() === activeFilter);

  // Authenticate Success Callback
  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    localStorage.setItem('directionless_user_session', JSON.stringify(authenticatedUser));
    
    // Resume pending action if there is one
    if (pendingAction) {
      setCart((prevCart) => {
        const existing = prevCart.find((item) => item.id === pendingAction.id);
        if (existing) {
          return prevCart.map((item) =>
            item.id === pendingAction.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...prevCart, { ...pendingAction, quantity: 1 }];
      });
      setIsCartOpen(true);
      setPendingAction(null);
    }
  };

  // Sign out / Log out action
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('directionless_user_session');
    setCart([]); // Clear cart on sign out
    setIsCartOpen(false);
  };

  // Add Item to Cart (Intercepted by Auth Modal)
  const handleAddToCart = (product) => {
    if (!user) {
      setPendingAction(product);
      setIsAuthOpen(true);
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  // Update Cart Quantity
  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove Item from Cart
  const handleRemoveItem = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Checkout proceeds to Payment Modal
  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Triggered when payment gateway finishes successfully
  const handlePaymentSuccess = (paymentDetails) => {
    const orderId = `DIR-${Date.now().toString().slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subtotal * 0.08;
    const shipping = subtotal > 5000 ? 0 : 250;
    const totalAmount = subtotal + tax + shipping;

    const newOrder = {
      id: orderId,
      payment: paymentDetails,
      items: [...cart],
      total: totalAmount,
      timestamp: Date.now(),
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      userEmail: user ? user.email : 'guest@directionless.com'
    };

    setOrders((prev) => {
      const updated = [newOrder, ...prev];
      localStorage.setItem('directionless_orders', JSON.stringify(updated));
      return updated;
    });

    setActiveOrder(newOrder);
    setIsCheckoutOpen(false);
  };

  // Reset order and cart to continue shopping
  const handleCloseInvoice = () => {
    setActiveOrder(null);
    setCart([]); // Clear cart
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartTax = cartSubtotal * 0.08;
  const cartShipping = cartSubtotal > 5000 || cartSubtotal === 0 ? 0 : 250;
  const cartTotal = cartSubtotal + cartTax + cartShipping;

  // Staggered text entrance animations keyframes
  const titleLetters = "DIRECTIONLESS".split("");

  const titleContainerVar = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07, delayChildren: 0.3 }
    }
  };

  const letterVar = {
    hidden: { 
      opacity: 0, 
      y: 40, 
      filter: "blur(10px)",
      scale: 1.25
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      scale: 1,
      transition: { 
        type: "spring",
        damping: 14,
        stiffness: 90
      }
    }
  };

  const subtitleVar = {
    hidden: { opacity: 0, y: 15, filter: "blur(5px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { delay: 1.3, duration: 0.8, ease: "easeOut" } 
    }
  };

  const buttonVar = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { delay: 1.6, duration: 0.8, ease: "easeOut" } 
    }
  };

  const navVar = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { delay: 1.6, duration: 0.6, ease: "easeOut" } 
    }
  };

  const scrollIndicatorVar = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { delay: 1.8, duration: 0.8 } 
    }
  };

  return (
    <>
      {/* 3D Interactive Background */}
      <ThreeBackground />

      <div className="app-container">
        {activeOrder ? (

        /* SUCCESS SCREEN & AUTOMATED INVOICE VIEW */
        <main className="main-content invoice-view animate-fade-in">
          <Invoice
            orderId={activeOrder.id}
            paymentDetails={activeOrder.payment}
            cartItems={activeOrder.items}
            totalAmount={activeOrder.total}
            onClose={handleCloseInvoice}
          />
        </main>
      ) : (
        /* STANDARD STOREFRONT */
        <>
          {/* Navigation */}
          <motion.nav 
            className="navbar glassmorphism no-print"
            variants={navVar}
            initial="hidden"
            animate="visible"
          >
            <div className="nav-container">
              <div className="nav-logo">
                <a href="#"><h1>{t('hero_title')}</h1></a>
              </div>

              <div className="nav-links-right">
                <a href="#collection">{t('nav_products')}</a>
                <a href="#about">{t('nav_about')}</a>
                {user ? (
                  <button 
                    className="nav-cart-text-btn gold-text" 
                    onClick={() => setIsProfileOpen(true)}
                    title={`Logged in as ${user.name}. Click to view portal.`}
                  >
                    {user.name.split(' ')[0].toUpperCase()} ({t('nav_account')})
                  </button>
                ) : (
                  <button 
                    className="nav-cart-text-btn" 
                    onClick={() => setIsProfileOpen(true)}
                    title="Access Account Portal"
                  >
                    {t('nav_signin')}
                  </button>
                )}
                <button 
                  className="nav-cart-text-btn" 
                  onClick={() => setIsOrdersOpen(true)}
                  title="View Orders & Tracking"
                >
                  {t('nav_orders')}
                </button>
                <button 
                  className="nav-cart-text-btn" 
                  onClick={() => setIsCartOpen(true)}
                  title="Open Eclipse Bag"
                >
                  {t('nav_cart')} ({cartCount})
                </button>
              </div>
            </div>
          </motion.nav>

          {/* 100vh Landing Hero Banner */}
          <header className="landing-hero no-print">
            <div className="landing-content float-slow">
              <motion.h1 
                className="landing-title"
                variants={titleContainerVar}
                initial="hidden"
                animate="visible"
              >
                {titleLetters.map((char, index) => (
                  <motion.span 
                    key={index} 
                    variants={letterVar}
                    style={{ display: 'inline-block' }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </motion.h1>
              
              <motion.p 
                className="landing-subtitle"
                variants={subtitleVar}
                initial="hidden"
                animate="visible"
              >
                {t('hero_subtitle')}
              </motion.p>

              <motion.p 
                className="landing-subtitle-italic"
                variants={subtitleVar}
                initial="hidden"
                animate="visible"
              >
                {t('hero_desc')}
              </motion.p>

              <motion.div
                variants={buttonVar}
                initial="hidden"
                animate="visible"
              >
                <a href="#collection" className="explore-void-btn">
                  {t('hero_btn')}
                </a>
              </motion.div>
            </div>
          </header>

          {/* Integrated 3D Perspective Scroll Animation (Matches Aceternity UI design) */}
          <div className="no-print" style={{ width: '100%' }}>
            <ContainerScroll
              titleComponent={
                <h2 className="scroll-intro-title">
                  Unleash the Power of <br />
                  <span className="gold-text">COSMIC BEAUTY</span>
                </h2>
              }
            >
              <div className="scroll-card-content">
                <img 
                  src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2420&auto=format&fit=crop" 
                  alt="Cosmetics Laboratory"
                  className="scroll-card-image"
                  draggable={false}
                />
                <div className="scroll-card-overlay">
                  <h3>L’ÉCLIPSE LABORATORY</h3>
                  <p>Formula development under zero-gravity vacuum parameters.</p>
                </div>
              </div>
            </ContainerScroll>
          </div>

          {/* Main Layout */}
          <main className="main-content storefront-view">
            {/* Interactive Physics Product Grid Section */}
            <section id="collection" className="collection-section">
              <div className="collection-header">
                <h2 className="collection-title">The Zero-Gravity Collection</h2>
                <p className="collection-desc">
                  Cosmetics suspended in orbit. Select a category below to filter the alignment, 
                  and drag elements to disrupt zero-gravity physics.
                </p>
              </div>

              {/* Dynamic Filter Bar */}
              <div className="filter-bar">
                {['ALL', 'LIPS', 'EYES', 'FACE', 'TOOLS'].map((category) => (
                  <button
                    key={category}
                    className={`filter-btn ${activeFilter === category ? 'active' : ''}`}
                    onClick={() => setActiveFilter(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="interaction-instructions">
                <span className="dot gold-pulse"></span>
                <p>Curated Vanguard: Hover over cards to inspect shades, click to expand formulations.</p>
              </div>
              
              <PhysicsGrid
                products={filteredProducts}
                onAddToCart={handleAddToCart}
                onOpenDetail={setSelectedProduct}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
              />
            </section>

            {/* About / Manifesto Section (Matches Screenshot) */}
            <section id="about" className="about-section no-print">
              <div className="about-content">
                <p className="about-manifesto">
                  We believe in the beauty of the unknown. DIRECTIONLESS is not just makeup; it is an exploration of the self, unburdened by expectations.
                </p>
                
                <div className="about-stats-container">
                  <div className="about-stat-item">
                    <span className="about-stat-num">0%</span>
                    <span className="about-stat-lbl">CRUELTY</span>
                  </div>
                  <div className="about-stat-item">
                    <span className="about-stat-num">100%</span>
                    <span className="about-stat-lbl">VEGAN</span>
                  </div>
                  <div className="about-stat-item">
                    <span className="about-stat-num">∞</span>
                    <span className="about-stat-lbl">POSSIBILITIES</span>
                  </div>
                </div>
              </div>
            </section>
          </main>

          {/* Cart sliding drawer */}
          <Cart
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onCheckout={handleCheckout}
          />

          {/* Secure Payment Modal */}
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            totalAmount={cartTotal}
            onPaymentSuccess={handlePaymentSuccess}
          />

          {/* Product formulation detail modal */}
          <ProductDetailModal
            product={selectedProduct}
            isOpen={selectedProduct !== null}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
            isWishlisted={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
            onToggleWishlist={handleToggleWishlist}
          />

          {/* User Sign In / Sign Up Modal */}
          <AuthModal
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
            onSuccess={handleAuthSuccess}
          />

          {/* Cosmic Orders Vault & Shipment Tracking Modal */}
          <OrdersModal
            isOpen={isOrdersOpen}
            onClose={() => setIsOrdersOpen(false)}
            orders={user ? orders.filter(o => o.userEmail === user.email) : []}
            user={user}
            onOpenAuth={() => setIsAuthOpen(true)}
          />

          {/* Cosmic Account Portal (Meesho settings options) */}
          <ProfileDrawer
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            user={user}
            wishlistItems={products.filter(p => wishlist.includes(p.id))}
            onRemoveFromWishlist={handleToggleWishlist}
            onAddToCartFromWishlist={handleAddToCart}
            language={language}
            onChangeLanguage={handleLanguageChange}
            balance={balance}
            onRequestLoan={handleRequestLoan}
            onLogout={handleLogout}
            onOpenAuth={() => setIsAuthOpen(true)}
            products={products}
          />

          {/* Footer (New Premium Multi-column Layout) */}
          <footer className="footer-vanguard no-print">
            <div className="footer-grid">
              <div className="footer-brand-section">
                <h2 className="footer-brand">{t('hero_title')}</h2>
                <p className="footer-motto">{t('footer_motto')}</p>
                <div className="footer-social-row">
                  <a href="#instagram" className="social-link-icon">Instagram</a>
                  <a href="#twitter" className="social-link-icon">Twitter</a>
                  <a href="#tiktok" className="social-link-icon">TikTok</a>
                </div>
              </div>
              
              <div className="footer-links-col">
                <h3>Legal</h3>
                <ul>
                  <li><a href="#privacy">Privacy Policy</a></li>
                  <li><a href="#terms">Terms of Service</a></li>
                  <li><a href="#shipping">Shipping Policy</a></li>
                  <li><a href="#refund">Refund Policy</a></li>
                </ul>
              </div>

              <div className="footer-links-col">
                <h3>Contact</h3>
                <ul>
                  <li><a href="#support">Support Hub</a></li>
                  <li><a href="#faq">Frequently Asked</a></li>
                  <li><a href="#press">Press Room</a></li>
                  <li><a href="#careers">Careers</a></li>
                </ul>
              </div>

              <div className="footer-newsletter">
                <h3>{t('footer_newsletter_title')}</h3>
                <p>{t('footer_newsletter_desc')}</p>
                <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                  <input type="email" placeholder="Your Email" aria-label="Email for newsletter" />
                  <button type="submit">{t('footer_newsletter_btn')}</button>
                </form>
              </div>
            </div>

            <div className="footer-bottom-divider"></div>
            
            <div className="footer-bottom-layout">
              <p className="copyright-text">{t('footer_copyright')}</p>
              <div className="footer-bottom-links">
                <span className="gold-text">ZEROGRAVITY STORE</span>
              </div>
            </div>
          </footer>

        </>
      )}
      </div>
    </>
  );
}

