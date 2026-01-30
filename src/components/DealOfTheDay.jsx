import React, { useState, useEffect } from 'react';
import { FaClock, FaStar } from 'react-icons/fa';

export default function DealOfTheDay({ onAddToCart }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 10, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => String(time).padStart(2, '0');


  const dealProduct = {
    id: "deal-1",
    title: "Premium Pumpkin",
    price: 3.0,
    category: "Vegetables",
    image: "/pumpkin.jpg" 
  };

  return (
    <section className="deal-section">
      <div className="deal-container">
        <div className="deal-image-wrapper">
          <div className="discount-badge">-40%</div>
          <img src={dealProduct.image} alt={dealProduct.title} className="deal-image" />
        </div>
        
        <div className="deal-content">
          <div className="limit-alert">
            <FaClock className="clock-icon" /> Limited Time Offer
          </div>
          
          <h2 className="deal-title">{dealProduct.title}</h2>
          
          <div className="deal-rating">
            <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
            <span>(128 Reviews)</span>
          </div>

          <p className="deal-description">
            Harvested just this morning! Our giant organic pumpkins are perfect for soups, pies, or decoration. 
            Sweet, rich in texture, and absolutely chemical-free.
          </p>

          <div className="deal-pricing">
            <span className="current-price">${dealProduct.price.toFixed(2)}</span>
            <span className="original-price">$5.00</span>
          </div>

          <div className="countdown-timer">
            <div className="time-box">
              <span className="time-value">{formatTime(timeLeft.hours)}</span>
              <span className="time-label">Hrs</span>
            </div>
            <span className="time-separator">:</span>
            <div className="time-box">
              <span className="time-value">{formatTime(timeLeft.minutes)}</span>
              <span className="time-label">Mins</span>
            </div>
            <span className="time-separator">:</span>
            <div className="time-box">
              <span className="time-value">{formatTime(timeLeft.seconds)}</span>
              <span className="time-label">Secs</span>
            </div>
          </div>

          <button className="deal-btn" onClick={() => onAddToCart(dealProduct)}>
            Add to Cart Now
          </button>
        </div>
      </div>
    </section>
  );
}
