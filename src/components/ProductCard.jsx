import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

export default function ProductCard({ product, onClick, onAddToCart }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const bdtPrice = Math.round(product.price * 122);

  return (
    <div className="product-card" onClick={() => onClick(product)}>
      <div className="img-container">
        <img 
          src={product.image} 
          alt={product.title} 
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={imageLoaded ? "lazy-loaded" : ""}
        />
      </div>
      <div className="product-details">
        <h3>{product.title}</h3>
        <div className="footer-row">
          <span className="price">৳{bdtPrice}</span>
          <button 
            className="add-btn" 
            aria-label="Add to cart"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
          >
            <FaPlus />
          </button>
        </div>
      </div>
    </div>
  );
}
