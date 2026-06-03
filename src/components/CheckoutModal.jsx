import { useState } from 'react';
import { CreditCard, QrCode, Truck, ShieldCheck, X, Loader2 } from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose, totalAmount, onPaymentSuccess }) {
  const [activeTab, setActiveTab] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  
  // Card Form State
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardErrors, setCardErrors] = useState({});

  // UPI Form State
  const [upiId, setUpiId] = useState('');
  const [upiError, setUpiError] = useState('');

  // COD Form State
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [codErrors, setCodErrors] = useState({});

  if (!isOpen) return null;

  // Format Card Number (adds spaces every 4 digits)
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const matches = value.match(/\d{1,4}/g);
    setCardNumber(matches ? matches.join(' ') : '');
  };

  // Format Expiry Date (MM/YY)
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      setCardExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else {
      setCardExpiry(value);
    }
  };

  // Format CVV (Max 3 digits)
  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 3) setCardCvv(value);
  };

  // Form validations
  const validateCard = () => {
    const errors = {};
    if (!cardName.trim()) errors.name = 'Cardholder name is required';
    if (cardNumber.replace(/\s/g, '').length !== 16) errors.number = 'Invalid card number (must be 16 digits)';
    
    const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    if (!expiryRegex.test(cardExpiry)) {
      errors.expiry = 'Invalid expiration date (MM/YY)';
    } else {
      // Check if expired
      const [m, y] = cardExpiry.split('/');
      const expiryDate = new Date(`20${y}`, m - 1);
      if (expiryDate < new Date()) {
        errors.expiry = 'Card has expired';
      }
    }

    if (cardCvv.length !== 3) errors.cvv = 'CVV must be 3 digits';
    
    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateUpi = () => {
    if (!upiId.trim() || !upiId.includes('@')) {
      setUpiError('Please enter a valid UPI ID (e.g. username@bank)');
      return false;
    }
    setUpiError('');
    return true;
  };

  const validateCod = () => {
    const errors = {};
    if (!address.trim()) errors.address = 'Delivery address is required';
    if (phone.replace(/\D/g, '').length < 10) errors.phone = 'Please enter a valid 10-digit phone number';
    setCodErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePay = (e) => {
    e.preventDefault();

    let isValid = false;
    let paymentDetails = {};

    if (activeTab === 'card') {
      isValid = validateCard();
      paymentDetails = { method: 'CARD', summary: `Visa ending in ${cardNumber.slice(-4)}`, payer: cardName };
    } else if (activeTab === 'upi') {
      isValid = validateUpi();
      paymentDetails = { method: 'UPI', summary: upiId, payer: 'Customer' };
    } else if (activeTab === 'cod') {
      isValid = validateCod();
      paymentDetails = { method: 'COD', summary: 'Cash on Delivery', payer: 'Customer', address, phone };
    }

    if (!isValid) return;

    // Start checkout mockup animation
    setProcessing(true);
    
    const steps = [
      'Establishing handshake with Eclipse Vault...',
      'Verifying payment parameters...',
      'Encrypting data package...',
      'Processing transaction approval...',
      'Generative receipt confirmation signed...'
    ];

    let currentStep = 0;
    setProcessingStep(steps[0]);

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setProcessingStep(steps[currentStep]);
      } else {
        clearInterval(interval);
        setProcessing(false);
        onPaymentSuccess(paymentDetails);
      }
    }, 1000);
  };

  return (
    <div className="modal-backdrop">
      <div className="checkout-modal glassmorphism" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-area">
            <ShieldCheck className="gold-text" size={22} />
            <h2>Secure Gateway</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} disabled={processing}>
            <X size={20} />
          </button>
        </div>

        {/* Amount bar */}
        <div className="amount-bar">
          <span>Finalizing Order Total</span>
          <span className="amount-value">₹{totalAmount.toLocaleString('en-IN')}</span>
        </div>

        {processing ? (
          /* Processing State */
          <div className="processing-state">
            <Loader2 className="spinner gold-text" size={48} />
            <h3>Processing Payment</h3>
            <p className="step-text">{processingStep}</p>
            <span className="security-notice">Please do not refresh the browser or close this window.</span>
          </div>
        ) : (
          /* Normal State: Tabs and Form */
          <div className="modal-content">
            {/* Tabs Selector */}
            <div className="checkout-tabs">
              <button 
                className={`tab-btn ${activeTab === 'card' ? 'active' : ''}`}
                onClick={() => setActiveTab('card')}
              >
                <CreditCard size={16} />
                <span>Card</span>
              </button>
              <button 
                className={`tab-btn ${activeTab === 'upi' ? 'active' : ''}`}
                onClick={() => setActiveTab('upi')}
              >
                <QrCode size={16} />
                <span>UPI</span>
              </button>
              <button 
                className={`tab-btn ${activeTab === 'cod' ? 'active' : ''}`}
                onClick={() => setActiveTab('cod')}
              >
                <Truck size={16} />
                <span>COD</span>
              </button>
            </div>

            {/* Forms Panel */}
            <form onSubmit={handlePay} className="checkout-form">
              {activeTab === 'card' && (
                <div className="form-fields">
                  <div className="input-group">
                    <label>Cardholder Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. ALEXANDRA VAULT"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      className={cardErrors.name ? 'input-error' : ''}
                    />
                    {cardErrors.name && <span className="error-text">{cardErrors.name}</span>}
                  </div>

                  <div className="input-group">
                    <label>Card Number</label>
                    <input 
                      type="text" 
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className={cardErrors.number ? 'input-error' : ''}
                    />
                    {cardErrors.number && <span className="error-text">{cardErrors.number}</span>}
                  </div>

                  <div className="form-row">
                    <div className="input-group">
                      <label>Expiration Date</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        className={cardErrors.expiry ? 'input-error' : ''}
                      />
                      {cardErrors.expiry && <span className="error-text">{cardErrors.expiry}</span>}
                    </div>

                    <div className="input-group">
                      <label>CVV</label>
                      <input 
                        type="password" 
                        placeholder="000"
                        value={cardCvv}
                        onChange={handleCvvChange}
                        className={cardErrors.cvv ? 'input-error' : ''}
                      />
                      {cardErrors.cvv && <span className="error-text">{cardErrors.cvv}</span>}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'upi' && (
                <div className="form-fields">
                  <p className="tab-info-text">
                    Transfer instantly from your preferred banking app using a UPI Virtual Payment Address (VPA).
                  </p>
                  <div className="input-group">
                    <label>UPI ID</label>
                    <input 
                      type="text" 
                      placeholder="e.g. mobile@upi or name@bank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value.toLowerCase())}
                      className={upiError ? 'input-error' : ''}
                    />
                    {upiError && <span className="error-text">{upiError}</span>}
                  </div>
                </div>
              )}

              {activeTab === 'cod' && (
                <div className="form-fields">
                  <p className="tab-info-text">
                    Pay in cash upon physical delivery. Secure pin verification required at doorstep.
                  </p>
                  <div className="input-group">
                    <label>Delivery Address</label>
                    <textarea 
                      placeholder="Enter your complete premium delivery location..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={codErrors.address ? 'input-error' : ''}
                      rows={3}
                    />
                    {codErrors.address && <span className="error-text">{codErrors.address}</span>}
                  </div>

                  <div className="input-group">
                    <label>Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      className={codErrors.phone ? 'input-error' : ''}
                    />
                    {codErrors.phone && <span className="error-text">{codErrors.phone}</span>}
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                className="btn-gold secure-submit-btn"
                style={{ width: '100%', marginTop: '1rem' }}
              >
                {activeTab === 'cod' ? 'Confirm Delivery Details' : 'Authorize Secure Payment'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
