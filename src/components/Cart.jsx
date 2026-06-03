import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

export default function Cart({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout 
}) {
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 250;
  const total = subtotal + tax + shipping;

  if (!isOpen) return null;

  return (
    <div className="cart-backdrop" onClick={onClose}>
      <div 
        className="cart-drawer glassmorphism" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="cart-header">
          <div className="cart-header-title">
            <ShoppingBag size={20} className="gold-text" />
            <h2>Eclipse Bag</h2>
            <span className="cart-count">({cartItems.reduce((a, b) => a + b.quantity, 0)})</span>
          </div>
          <button className="close-cart-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <ShoppingBag size={48} className="empty-bag-icon float-slow" />
              <h3>Your Eclipse bag is empty</h3>
              <p>Explore our zero-gravity collection and add products to get started.</p>
              <button className="btn-outline" onClick={onClose} style={{ marginTop: '1.5rem' }}>
                Back to Collection
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item glassmorphism-card">
                  <div className="cart-item-img-container">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="cart-item-details">
                    <div className="cart-item-header">
                      <h4>{item.name}</h4>
                      <button 
                        className="remove-item-btn" 
                        onClick={() => onRemoveItem(item.id)}
                        title="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="cart-item-price">₹{item.price.toLocaleString('en-IN')}</p>
                    
                    {/* Quantity selectors */}
                    <div className="cart-item-quantity">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="qty-btn"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="qty-number">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="qty-btn"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Sum */}
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="cart-summary-row">
              <span>Tax (8%)</span>
              <span>₹{tax.toLocaleString('en-IN')}</span>
            </div>
            <div className="cart-summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`}</span>
            </div>
            <div className="cart-summary-divider"></div>
            <div className="cart-summary-row total-row">
              <span>Total</span>
              <span className="gold-text">₹{total.toLocaleString('en-IN')}</span>
            </div>

            <button 
              className="btn-gold checkout-btn" 
              onClick={onCheckout}
              style={{ width: '100%', marginTop: '1.5rem' }}
            >
              Proceed to checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
