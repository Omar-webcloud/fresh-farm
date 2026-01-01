import React, { useEffect, useState, useMemo } from "react";
import ProductCard from "./components/ProductCard";
import Popup from "./components/Popup";
import CartPanel from "./components/CartPanel";
import { FaShoppingCart, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import Hero from "./components/hero";

const DEMO_PRODUCTS = [
  { id: "p1", title: "Tomato", price: 1.5, stock: 120, category: "Vegetables", description: "Fresh local tomatoes." },
  { id: "p2", title: "Banana", price: 0.6, stock: 200, category: "Fruits", description: "Sweet ripe bananas." },
  { id: "p3", title: "Spinach", price: 1.2, stock: 80, category: "Vegetables", description: "Fresh green spinach." },
  { id: "p4", title: "Mango", price: 2.5, stock: 50, category: "Fruits", description: "Seasonal mangoes." },
  { id: "p5", title: "Carrot", price: 0.9, stock: 140, category: "Vegetables", description: "Crunchy orange carrots." },
  { id: "p6", title: "Apple", price: 1.8, stock: 90, category: "Fruits", description: "Juicy apples." },
];

const bdPhone = (num) => /^(\\+8801)[3-9][0-9]{8}$/.test(num);
const publicImage = (query) => `/${query.toLowerCase()}.jpg`;

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
    const product = products.find((p) => p.id === id);
    return { ...product, quantity: qty };
  }), [cart, products]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    return products.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [products, searchQuery]);

  const vegetables = useMemo(() => filteredProducts.filter(p => p.category === 'Vegetables'), [filteredProducts]);
  const fruits = useMemo(() => filteredProducts.filter(p => p.category === 'Fruits'), [filteredProducts]);

  return (
    <div>
      <header className="navbar">
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
            <FaShoppingCart style={{ fontSize: "1.3em", verticalAlign: "middle" }} />
            <span style={{ marginLeft: 6 }}>{cartItems.length}</span>
          </button>
        </div>
      </header>

      <Hero />

      <main id="products" className="products-section">
        <div className="category-section">
          <h2 className="category-header">Vegetables</h2>
          <div className="product-grid">
            {vegetables.map((p) => (
              <ProductCard key={p.id} product={p} onClick={() => setShowPopup(p)} />
            ))}
          </div>
        </div>

        <div className="category-section">
          <h2 className="category-header">Fruits</h2>
          <div className="product-grid">
            {fruits.map((p) => (
              <ProductCard key={p.id} product={p} onClick={() => setShowPopup(p)} />
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
              <button onClick={sendOtp}>Send OTP</button>
            </>
          ) : (
            <>
              <input value={otpInput} onChange={(e) => setOtpInput(e.target.value)} placeholder="Enter OTP" />
              <button onClick={verifyOtp}>Verify OTP</button>
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
