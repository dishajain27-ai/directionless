import { Star, ShoppingBag, Eye, Heart } from 'lucide-react';

export default function ProductCard({ 
  product, 
  onAddToCart, 
  onOpenDetail, 
  isMobile, 
  cardRef, 
  onMouseDown,
  style,
  isWishlisted,
  onToggleWishlist
}) {
  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  return (
    <div
      ref={cardRef}
      className="product-card glassmorphism-card"
      style={{
        width: '100%',
        position: 'relative',
        cursor: 'pointer',
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '8px',
        overflow: 'hidden',
        ...style
      }}
      onClick={() => onOpenDetail(product)}
      onMouseDown={onMouseDown}
    >
      {/* Product Image Area */}
      <div className="product-image-container">
        <img 
          src={product.image} 
          alt={product.name} 
          className="product-image"
          draggable="false"
        />
        <div className="product-category">{product.category}</div>
        
        {/* Floating Heart Wishlist toggle */}
        <button 
          className={`wishlist-toggle-btn ${isWishlisted ? 'wishlisted' : ''}`}
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
          title={isWishlisted ? "Remove Coordinates" : "Align Coordinates"}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 10,
            background: isWishlisted ? 'hsl(var(--accent-gold))' : 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isWishlisted ? '#000' : '#fff',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            backdropFilter: 'blur(4px)'
          }}
        >
          <Heart size={13} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Quick View Overlay */}
        <button 
          className="quick-view-btn"
          onClick={(e) => { e.stopPropagation(); onOpenDetail(product); }}
          title="Quick View"
        >
          <Eye size={16} />
        </button>
      </div>

      {/* Product Info */}
      <div className="product-info">
        <div className="product-header">
          <h3 className="product-name">{product.name}</h3>
          <div className="product-rating">
            <Star className="star-icon" size={13} fill="currentColor" />
            <span>{product.rating}</span>
          </div>
        </div>

        <p className="product-description">{product.description}</p>
        
        {/* Purchase Area */}
        <div className="product-footer">
          <span className="product-price">₹{product.price.toLocaleString('en-IN')}</span>
          <button 
            className="add-to-cart-btn btn-gold-sm"
            onClick={handleAddToCart}
          >
            <ShoppingBag size={14} style={{ marginRight: '6px' }} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
