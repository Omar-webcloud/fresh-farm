import React from "react";

export default function CartPanel({ cartItems, onClose, onRemove }) {
  const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  return (
    <div className="cart-panel">
      <div className="cart-header">
        <h2>Cart</h2>
        <button className="close-btn" onClick={onClose}>✖</button>
      </div>
      {cartItems.length === 0 ? (
        <p>Cart is empty.</p>
      ) : (
        cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.title} />
            <div>
              <h4>{item.title}</h4>
              <p>Qty: {item.quantity}</p>
              <p>${item.price}</p>
            </div>
            <button onClick={() => onRemove(item.id)}>Remove</button>
          </div>
        ))
      )}
      <div>Total: ${total.toFixed(2)}</div>
    </div>
  );
}
