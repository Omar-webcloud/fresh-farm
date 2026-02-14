import React, { useEffect, useState, useMemo, useCallback } from "react";
import ProductCard from "./components/ProductCard";
import Popup from "./components/Popup";
import CartPanel from "./components/CartPanel";
import { FaShoppingCart, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import Hero from "./components/hero";
import { DEMO_PRODUCTS } from "./data/products";
import { bdPhone, publicImage } from "./utils/helpers";



import DealOfTheDay from "./components/DealOfTheDay";

export default function App() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState({});
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [pendingOtp, setPendingOtp] = useState(null);
  const [toast, setToast] = useState(null);
  const [email, setEmail] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const demo = DEMO_PRODUCTS.map((p) => ({ ...p, image: publicImage(p.title) }));
    setProducts(demo);
  }, []);

  const sendOtp = () => {
    if (!bdPhone(phoneInput)) return setToast({ type: "error", text: "Invalid Bangladeshi phone" });
    const code = Math.floor(1000 + Math.random() * 9000);
    setPendingOtp({ phone: phoneInput, code: code.toString() });
    setToast({ type: "info", text: `Demo OTP: ${code}` });
  };

  const verifyOtp = () => {
    if (!pendingOtp) return setToast({ type: "error", text: "No OTP sent" });
    if (otpInput === pendingOtp.code) {
      setUser({ phone: pendingOtp.phone });
      setPendingOtp(null);
      setToast({ type: "success", text: "Signed in" });
    } else setToast({ type: "error", text: "Invalid OTP" });
  };
  
  const signOut = () => { setUser(null); setCart({}); };

  const addToCart = (product) => {
    if (!user) return setToast({ type: "warning", text: "Sign in first" });
    setCart((c) => ({ ...c, [product.id]: (c[product.id] || 0) + 1 }));
    setToast({ type: "success", text: "Added to cart" });
  };

  const removeFromCart = (id) => {
    setCart((c) => { const copy = { ...c }; delete copy[id]; return copy; });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setToast({ type: "success", text: "Thank you for subscribing!" });
      setEmail("");
    } else {
      setToast({ type: "error", text: "Please enter a valid email." });
    }
  };

  const cartItems = useMemo(() => Object.entries(cart).map(([id, qty]) => {
    let product = products.find((p) => p.id === id);
    if (!product && id === "deal-1") {
       product = { 
          id: "deal-1", 
          title: "Premium Pumpkin", 
          price: 3.0, 
          image: "/pumpkin.jpg" 
       }; 
    }
    return product ? { ...product, quantity: qty } : null;
  }).filter(Boolean), [cart, products]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    return products.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [products, searchQuery]);

  const vegetables = useMemo(() => filteredProducts.filter(p => p.category === 'Vegetables'), [filteredProducts]);
  const fruits = useMemo(() => filteredProducts.filter(p => p.category === 'Fruits'), [filteredProducts]);

  // Performance optimization: Memoize the click handler to prevent unnecessary re-renders of ProductCard
  const handleProductClick = useCallback((product) => {
    setShowPopup(product);
  }, []);

  return (
    <div>
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-left">
          Fresh Farm
        </div>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="nav-right">
          {user ? (
            <>
              <span>{user.phone}</span>
              <button onClick={signOut}>Sign out</button>
            </>
          ) : (
            <button onClick={() => setShowPopup("auth")}>Sign in</button>
          )}
          <button onClick={() => setShowCart(true)} aria-label="Cart">
            <FaShoppingCart className="cart-icon" />
            <span className="cart-count">{cartItems.length}</span>
          </button>
        </div>
      </header>

      <Hero />
      <DealOfTheDay onAddToCart={addToCart} />

      <main id="products" className="products-section">
        <div className="category-section">
          <h2 className="category-header">Vegetables</h2>
          <div className="product-grid">
            {vegetables.map((p) => (
              <ProductCard key={p.id} product={p} onClick={handleProductClick} />
            ))}
          </div>
        </div>

        <div className="category-section">
          <h2 className="category-header">Fruits</h2>
          <div className="product-grid">
            {fruits.map((p) => (
              <ProductCard key={p.id} product={p} onClick={handleProductClick} />
            ))}
          </div>
        </div>
      </main>

      {showPopup && typeof showPopup !== "string" && (
        <Popup product={showPopup} onClose={() => setShowPopup(null)} onAddToCart={addToCart} />
      )}

      {showPopup === "auth" && (
        <Popup product={null} onClose={() => setShowPopup(null)} onAddToCart={() => {}}>
          {!pendingOtp ? (
            <>
              <input value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} placeholder="+8801XXXXXXXXX" />
              <button className="action-btn" onClick={sendOtp}>Send OTP</button>
            </>
          ) : (
            <>
              <input value={otpInput} onChange={(e) => setOtpInput(e.target.value)} placeholder="Enter OTP" />
              <button className="action-btn" onClick={verifyOtp}>Verify OTP</button>
            </>
          )}
        </Popup>
      )}

      {showCart && (
        <CartPanel cartItems={cartItems} onClose={() => setShowCart(false)} onRemove={removeFromCart} />
      )}

      {toast && <div className={`toast ${toast.type}`}>{toast.text}</div>}

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section about">
            <h3>About Fresh Farm</h3>
            <p>Your one-stop shop for the freshest produce, delivered straight from the farm to your table. We are committed to providing you with the highest quality, locally sourced products.</p>
          </div>
          <div className="footer-section links">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#products">Products</a></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">FAQs</a></li>
            </ul>
          </div>
          <div className="footer-section social">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="#"><FaFacebook /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaInstagram /></a>
            </div>
          </div>
          <div className="footer-section newsletter">
            <h3>Stay Updated</h3>
            <p>Subscribe to our newsletter for the latest updates and offers.</p>
            <form onSubmit={handleNewsletterSubmit}>
              <input 
                type="email" 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Omar. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
