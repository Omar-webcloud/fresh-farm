import React, { useState } from "react";

export default function ProductCard({ product, onClick, onAddToCart }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const bdtPrice = Math.round(product.price * 122);

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
      <p>৳{bdtPrice}</p>
      <button 
        className="add-btn" 
        onClick={(e) => {
          e.stopPropagation();
          onAddToCart(product);
        }}
      >
        Add to Cart
      </button>
    </div>
  );
}
