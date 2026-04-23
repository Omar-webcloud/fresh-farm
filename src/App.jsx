import React, { useEffect, useState, useMemo } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductCard from "./components/ProductCard";
import Popup from "./components/Popup";
import CartPanel from "./components/CartPanel";
import { FaShoppingCart, FaFacebook, FaTwitter, FaInstagram, FaSearch, FaTimes, FaHome, FaUser, FaStore } from "react-icons/fa";
import Hero from "./components/hero";
import { DEMO_PRODUCTS } from "./data/products";
import { bdPhone, publicImage } from "./utils/helpers";
import DealOfTheDay from "./components/DealOfTheDay";

export default function App() {
  const [products, setProducts] = useState(() => 
    DEMO_PRODUCTS.map((p) => ({ ...p, image: publicImage(p.title) }))
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState(() => {
    const savedCart = sessionStorage.getItem("fresh_farm_cart");
    return savedCart ? JSON.parse(savedCart) : {};
  });
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem("fresh_farm_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [showPopup, setShowPopup] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [pendingOtp, setPendingOtp] = useState(null);
  const [email, setEmail] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [heroPassed, setHeroPassed] = useState(false);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setHeroPassed(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (showSearchOverlay || showCart || (showPopup && typeof showPopup !== "string")) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showSearchOverlay, showCart, showPopup]);

  useEffect(() => {
    sessionStorage.setItem("fresh_farm_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    sessionStorage.setItem("fresh_farm_user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    fetch('https://dummyjson.com/products/category/groceries?limit=100')
      .then(res => res.json())
      .then(data => {
        const mapped = data.products
          .filter(p => !p.title.toLowerCase().includes("soft drink"))
          .map(p => ({
            ...p,
            image: p.thumbnail,
            category: p.tags.includes('vegetables') ? 'Vegetables' : (p.tags.includes('fruits') ? 'Fruits' : 'Other')
          }));
        setProducts(prev => [...prev, ...mapped]);
      });
  }, []);

  const sendOtp = () => {
    if (!bdPhone(phoneInput)) return toast.error("Invalid Bangladeshi phone");
    const code = Math.floor(1000 + Math.random() * 9000);
    setPendingOtp({ phone: phoneInput, code: code.toString() });
    toast.info(`Demo OTP: ${code}`, { autoClose: 10000 });
  };

  const verifyOtp = () => {
    if (!pendingOtp) return toast.error("No OTP sent");
    if (otpInput === pendingOtp.code) {
      setUser({ phone: pendingOtp.phone });
      setPendingOtp(null);
      toast.success("Signed in successfully!");
    } else toast.error("Invalid OTP");
  };
  
  const signOut = () => { 
    setUser(null); 
    setCart({}); 
    sessionStorage.removeItem("fresh_farm_user");
    sessionStorage.removeItem("fresh_farm_cart");
  };

  const addToCart = (product) => {
    setCart((c) => ({ ...c, [product.id]: (c[product.id] || 0) + 1 }));
    toast.success(`${product.title} added to cart!`, {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    });
  };

  const removeFromCart = (id) => {
    setCart((c) => { const copy = { ...c }; delete copy[id]; return copy; });
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return toast.warning("Your cart is empty");
    setCart({});
    setShowCart(false);
    toast.success("Order placed successfully!", {
      icon: "🎉"
    });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      toast.success("Thank you for subscribing! Stay fresh. 🌿");
      setEmail("");
    } else {
      toast.error("Please enter a valid email.");
    }
  };

  const cartItems = useMemo(() => Object.entries(cart).map(([id, qty]) => {
    let product = products.find((p) => String(p.id) === String(id));
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
  const others = useMemo(() => filteredProducts.filter(p => p.category === 'Other'), [filteredProducts]);

  return (
    <div>
      <header className={`navbar ${scrolled ? 'scrolled' : ''} ${heroPassed ? 'hero-passed' : ''}`}>
        <div className="nav-left">
          Fresh Farm
        </div>
        <div className="search-bar">
          <div className="search-icon-wrapper">
            <FaSearch />
          </div>
          <input 
            type="text" 
            placeholder="Search for fresh produce..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="clear-search-btn" 
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              <FaTimes />
            </button>
          )}
        </div>
        <div className="nav-right">
          {user ? (
            <button onClick={signOut} className="nav-btn-icon" aria-label="Sign out">
              <FaUser />
              <span className="nav-label">Sign out</span>
            </button>
          ) : (
            <button onClick={() => setShowPopup("auth")} className="nav-btn-icon" aria-label="Sign in">
              <FaUser />
              <span className="nav-label">Sign in</span>
            </button>
          )}
          <button onClick={() => setShowCart(true)} aria-label="Cart" className="nav-btn-icon">
            <FaShoppingCart className="cart-icon" />
            <span className="cart-count">{cartItems.length}</span>
          </button>
        </div>
      </header>

      <Hero />
      <DealOfTheDay onAddToCart={addToCart} />

      <main id="products" className="products-section">
        {vegetables.length > 0 && (
          <div className="category-section">
            <h2 className="category-header">Vegetables</h2>
            <div className="product-grid">
              {vegetables.map((p) => (
                <ProductCard 
                  key={p.id} 
                  product={p} 
                  onClick={() => setShowPopup(p)} 
                  onAddToCart={addToCart} 
                />
              ))}
            </div>
          </div>
        )}

        {fruits.length > 0 && (
          <div className="category-section">
            <h2 className="category-header">Fruits</h2>
            <div className="product-grid">
              {fruits.map((p) => (
                <ProductCard 
                  key={p.id} 
                  product={p} 
                  onClick={() => setShowPopup(p)} 
                  onAddToCart={addToCart} 
                />
              ))}
            </div>
          </div>
        )}

        {others.length > 0 && (
          <div className="category-section">
            <h2 className="category-header">Other Groceries</h2>
            <div className="product-grid">
              {others.map((p) => (
                <ProductCard 
                  key={p.id} 
                  product={p} 
                  onClick={() => setShowPopup(p)} 
                  onAddToCart={addToCart} 
                />
              ))}
            </div>
          </div>
        )}
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
        <CartPanel 
          cartItems={cartItems} 
          onClose={() => setShowCart(false)} 
          onRemove={removeFromCart} 
          onCheckout={handleCheckout}
        />
      )}

      <nav className="mobile-bottom-nav">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Home">
          <FaHome />
          <span>Home</span>
        </button>
        <button onClick={() => setShowSearchOverlay(true)} aria-label="Search">
          <FaSearch />
          <span>Search</span>
        </button>
        <a href="#products" aria-label="Products">
          <FaStore />
          <span>Shop</span>
        </a>
        <button onClick={() => setShowCart(true)} className="mobile-cart-btn" aria-label="Cart">
          <div className="cart-badge-wrapper">
            <FaShoppingCart />
            {cartItems.length > 0 && <span className="mobile-badge">{cartItems.length}</span>}
          </div>
          <span>Cart</span>
        </button>
        <button onClick={() => user ? signOut() : setShowPopup("auth")} aria-label="Account">
          <FaUser />
          <span>{user ? "Sign Out" : "Account"}</span>
        </button>
      </nav>

      {showSearchOverlay && (
        <div className="search-overlay" onClick={() => setShowSearchOverlay(false)}>
          <div className="search-overlay-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowSearchOverlay(false)}>
              <FaTimes />
            </button>
            <h2>Search Products</h2>
            <div className="search-bar overlay-search">
              <div className="search-icon-wrapper">
                <FaSearch />
              </div>
              <input 
                autoFocus
                type="text" 
                placeholder="Type to search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className="clear-search-btn" 
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  <FaTimes />
                </button>
              )}
            </div>
            {searchQuery && (
              <div className="search-results-hint">
                Showing results for "{searchQuery}"...
                <button className="view-results-btn" onClick={() => {
                  setShowSearchOverlay(false);
                  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                }}>View Results</button>
              </div>
            )}
          </div>
        </div>
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

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

