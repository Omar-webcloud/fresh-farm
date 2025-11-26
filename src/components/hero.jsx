import React from 'react';

function Hero() {
  return (
    <div className="hero-container" style={{ backgroundImage: "url('/hero.jpg')" }}>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1>Welcome to <span>Fresh Farm</span></h1>
        <p>Your one-stop shop for the freshest produce, delivered straight from the farm to your table.</p>
        <a href="#products" className="hero-button">
          Shop Now
        </a>
      </div>
    </div>
  );
}

export default Hero;
