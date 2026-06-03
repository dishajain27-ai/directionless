import ProductCard from './ProductCard';

export default function PhysicsGrid({ products, onAddToCart, onOpenDetail, wishlist = [], onToggleWishlist }) {
  return (
    <div className="storefront-products-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onOpenDetail={onOpenDetail}
          isMobile={true} // Passing true sets the card to relative grid positioning
          isWishlisted={wishlist.includes(product.id)}
          onToggleWishlist={onToggleWishlist}
        />
      ))}
    </div>
  );
}
