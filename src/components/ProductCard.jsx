import React, { useState } from "react";

// Performance optimization: Prevent re-renders when props (product, onClick) don't change
const ProductCard = React.memo(function ProductCard({ product, onClick }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="product-card" onClick={() => onClick(product)}>
      <img 
        src={product.image} 
        alt={product.title} 
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
        className={imageLoaded ? "lazy-loaded" : ""}
      />
      <h3>{product.title}</h3>
      <p>${product.price}</p>
    </div>
  );
});

export default ProductCard;
