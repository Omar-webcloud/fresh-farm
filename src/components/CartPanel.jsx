import React from "react";
import { FaTimes } from "react-icons/fa";

export default function CartPanel({ cartItems, onClose, onRemove, onCheckout }) {
  const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const bdtTotal = Math.round(total * 122);
  return (
    <div className="cart-panel">
      <div className="cart-header">
        <h2>Your Cart</h2>
        <button className="close-btn" onClick={onClose} aria-label="Close cart">
          <FaTimes />
        </button>
      </div>
      {cartItems.length === 0 ? (
        <p>Cart is empty.</p>
      ) : (
        cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.title} loading="lazy" />
            <div>
              <h4>{item.title}</h4>
              <p>Qty: {item.quantity}</p>
              <p>৳{Math.round(item.price * 122)}</p>
            </div>
            <button onClick={() => onRemove(item.id)}>Remove</button>
          </div>
        ))
      )}
      <div className="cart-footer">
        <div className="cart-total">
          <span>Total:</span>
          <span>৳{bdtTotal}</span>
        </div>
        <button className="checkout-btn" onClick={onCheckout}>Checkout Now</button>
      </div>
    </div>
  );
}
