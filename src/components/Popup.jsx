import React from "react";
import { FaTimes } from "react-icons/fa";

export default function Popup({ product, children, onClose, onAddToCart }) {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close popup">
          <FaTimes />
        </button>
        {product && (
          <>
            <img src={product.image} alt={product.title} />
            <h2>{product.title}</h2>
            <p>{product.description}</p>
            <p>${product.price}</p>
            <button className="action-btn" onClick={() => onAddToCart(product)}>Add to Cart</button>
          </>
        )}
        {children}
      </div>
    </div>
  );
}
