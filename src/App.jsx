import React, { useEffect, useState, useMemo } from "react";
import ProductCard from "./components/ProductCard";
import Popup from "./components/Popup";
import CartPanel from "./components/CartPanel";
import { FaShoppingCart } from "react-icons/fa";

/* ---------- Demo Products ---------- */
const DEMO_PRODUCTS = [
  { id: "p1", title: "Tomato", price: 1.5, stock: 120, category: "Vegetables", description: "Fresh local tomatoes." },
  { id: "p2", title: "Banana", price: 0.6, stock: 200, category: "Fruits", description: "Sweet ripe bananas." },
  { id: "p3", title: "Spinach", price: 1.2, stock: 80, category: "Vegetables", description: "Fresh green spinach." },
  { id: "p4", title: "Mango", price: 2.5, stock: 50, category: "Fruits", description: "Seasonal mangoes." },
  { id: "p5", title: "Carrot", price: 0.9, stock: 140, category: "Vegetables", description: "Crunchy orange carrots." },
  { id: "p6", title: "Apple", price: 1.8, stock: 90, category: "Fruits", description: "Juicy apples." },
];

/* ---------- Helper Functions ---------- */
const bdPhone = (num) => /^(\+8801)[3-9][0-9]{8}$/.test(num);
const publicImage = (query) => `https://placehold.co/600x400?text=${encodeURIComponent(query)}`;


/* ---------- Main App ---------- */
export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [pendingOtp, setPendingOtp] = useState(null);
  const [toast, setToast] = useState(null);

  /* Load products */
  useEffect(() => {
    const demo = DEMO_PRODUCTS.map((p) => ({ ...p, image: publicImage(p.title) }));
    setProducts(demo);
  }, []);

  /* Mock OTP login */
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

  /* Cart Functions */
  const addToCart = (product) => {
    if (!user) return setToast({ type: "warning", text: "Sign in first" });
    setCart((c) => ({ ...c, [product.id]: (c[product.id] || 0) + 1 }));
    setToast({ type: "success", text: "Added to cart" });
  };
  const removeFromCart = (id) => {
    setCart((c) => { const copy = { ...c }; delete copy[id]; return copy; });
  };
  const cartItems = useMemo(() => Object.entries(cart).map(([id, qty]) => {
    const product = products.find((p) => p.id === id);
    return { ...product, quantity: qty };
  }), [cart, products]);
  // const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div>
      {/* Navbar */}
      <header className="navbar">
        <div className="logo">Fresh Farm</div>
        <div className="subtitle" style={{ fontSize: "1.05rem", fontWeight: 500, marginTop: 4, color: "#fff", opacity: 0.85 }}>
      Fresh fruits and veggies straight off the farm
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

      {/* Product Grid */}
      <main className="product-grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onClick={() => setShowPopup(p)} />
        ))}
      </main>

      {/* Popup */}
      {showPopup && typeof showPopup !== "string" && (
        <Popup
          product={showPopup}
          onClose={() => setShowPopup(null)}
          onAddToCart={addToCart}
        />
      )}

      {/* Auth Popup */}
      {showPopup === "auth" && (
        <Popup
          product={null}
          onClose={() => setShowPopup(null)}
          onAddToCart={() => {}}
        >
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

      {/* Cart Panel */}
      {showCart && (
        <CartPanel
          cartItems={cartItems}
          onClose={() => setShowCart(false)}
          onRemove={removeFromCart}
        />
      )}

      {/* Toast */}
      {toast && <div className={`toast ${toast.type}`}>{toast.text}</div>}


<footer className="footer">
  <div className="footer-links">
    <a href="#" onClick={() => setToast({ type: "info", text: "Help coming soon!" })}>Help</a>
    <a href="#" onClick={() => setToast({ type: "info", text: "Terms & Conditions coming soon!" })}>Terms & Conditions</a>
  </div>
  <div className="footer-lang">
    <label htmlFor="lang-select">Language:</label>
    <select id="lang-select" defaultValue="en">
      <option value="en">English</option>
      <option value="bn">বাংলা</option>
    </select>
  </div>
</footer>

    </div>
  );
}


