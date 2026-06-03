import { X, Star, ShoppingBag, Check, Heart } from 'lucide-react';

export default function ProductDetailModal({ product, isOpen, onClose, onAddToCart, isWishlisted, onToggleWishlist }) {
  if (!isOpen || !product) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="detail-modal glassmorphism" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button className="detail-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="detail-grid">
          {/* Left Column: Image */}
          <div className="detail-image-section">
            <img src={product.image} alt={product.name} />
          </div>

          {/* Right Column: Specs */}
          <div className="detail-info-section">
            <span className="detail-category">{product.category}</span>
            <h2 className="detail-name">{product.name}</h2>
            
            {/* Rating */}
            <div className="detail-rating-row">
              <div className="detail-stars">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={15} 
                    className="detail-star"
                    fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} 
                  />
                ))}
              </div>
              <span className="detail-rating-val">{product.rating} / 5.0</span>
            </div>

            {/* Price */}
            <div className="detail-price">₹{product.price.toLocaleString('en-IN')}</div>

            {/* Desc */}
            <p className="detail-description">{product.description}</p>

            <div className="detail-divider"></div>

            {/* Premium Highlights */}
            <div className="detail-highlights">
              <h3>Formula Highlights</h3>
              <ul>
                <li>
                  <Check size={14} className="gold-text" />
                  <span>Cruelty-Free, 100% Vegan formulation</span>
                </li>
                <li>
                  <Check size={14} className="gold-text" />
                  <span>L’Éclipse micro-milled pigmentation hold</span>
                </li>
                <li>
                  <Check size={14} className="gold-text" />
                  <span>Interactive Zero-Gravity airless design</span>
                </li>
              </ul>
            </div>

            {/* Action */}
            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
              <button 
                className="btn-gold detail-add-btn" 
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                style={{ flex: 1, margin: 0 }}
              >
                <ShoppingBag size={16} style={{ marginRight: '8px' }} />
                Add to Eclipse Bag
              </button>
              
              <button
                className={`btn-outline ${isWishlisted ? 'wishlisted' : ''}`}
                onClick={() => onToggleWishlist(product.id)}
                style={{
                  width: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isWishlisted ? 'hsl(var(--accent-gold))' : 'none',
                  borderColor: isWishlisted ? 'hsl(var(--accent-gold))' : 'rgba(255,255,255,0.15)',
                  color: isWishlisted ? '#000' : '#fff',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  margin: 0,
                  padding: 0
                }}
                title={isWishlisted ? "Remove Coordinates" : "Align Coordinates"}
              >
                <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
