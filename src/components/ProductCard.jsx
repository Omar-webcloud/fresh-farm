import React from "react";

export default function ProductCard({ product, onClick }) {
  return (
    <div className="product-card" onClick={() => onClick(product)}>
      <img src={product.image} alt={product.title} />
      <h3>{product.title}</h3>
      <p>${product.price}</p>
    </div>
  );
}
