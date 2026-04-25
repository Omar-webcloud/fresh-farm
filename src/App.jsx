import React, { useEffect, useState, useMemo } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductCard from "./components/ProductCard";
import Popup from "./components/Popup";
import CartPanel from "./components/CartPanel";
import {
  FaShoppingCart,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaSearch,
  FaTimes,
  FaUser,
  FaMapMarkerAlt,
  FaMoon,
  FaSun,
  FaTruck,
  FaBolt,
  FaShieldAlt,
  FaUndoAlt,
  FaHeart,
  FaArrowRight
} from "react-icons/fa";
import { DEMO_PRODUCTS } from "./data/products";
import { bdPhone, publicImage } from "./utils/helpers";

export default function App() {
  const [products, setProducts] = useState(() => 
    DEMO_PRODUCTS.map((p) => ({ ...p, image: p.image || publicImage(p.title) }))
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState(() => {
    const savedCart = sessionStorage.getItem("freshfarm_cart");
    return savedCart ? JSON.parse(savedCart) : {};
  });
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem("freshfarm_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [showPopup, setShowPopup] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [pendingOtp, setPendingOtp] = useState(null);
  const [email, setEmail] = useState("");
  const [theme, setTheme] = useState(() => sessionStorage.getItem("fresh_theme") || "dark");
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState(() => {
    const saved = sessionStorage.getItem("freshfarm_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const categoryItems = useMemo(() => {
    const categories = [
      { title: "Fruits", image: "/apple.jpg", fixed: true },
      { title: "Vegetables", image: "/broccoli.jpg", fixed: true },
      { title: "Groceries", default: "/tomato.jpg" },
      { title: "Dairy & Eggs", default: "/banana.jpg" },
      { title: "Beverages", default: "/orange.jpg" },
      { title: "Snacks", image: "/snacks_new.png", fixed: true },
      { title: "Meat & Fish", default: "/pumpkin.jpg" },
      { title: "Personal Care", default: "/apple.jpg" },
      { title: "Home & Kitchen", default: "/tomato.jpg" }
    ];

    return categories.map(cat => {
      if (cat.fixed) return { title: cat.title, image: cat.image };
      
      const product = products.find(p => {
        if (p.category !== cat.title) return false;
        if (p.image && p.image.startsWith("/")) return false;
        if (cat.title === "Snacks") {
          return p.title.toLowerCase().includes("chips") || p.title.toLowerCase().includes("crisps");
        }
        return true;
      });
      
      return {
        title: cat.title,
        image: product ? product.image : cat.default
      };
    });
  }, [products]);

  const serviceHighlights = [
    { icon: <FaTruck />, title: "Free Delivery", text: "On orders above ৳499" },
    { icon: <FaBolt />, title: "Express Delivery", text: "In 60 minutes" },
    { icon: <FaShieldAlt />, title: "Best Quality", text: "Sourced with care" },
    { icon: <FaUndoAlt />, title: "Easy Returns", text: "No questions asked" }
  ];

  useEffect(() => {
    if (showSearchOverlay || showCart || (showPopup && typeof showPopup !== "string")) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showSearchOverlay, showCart, showPopup]);

  useEffect(() => {
    sessionStorage.setItem("freshfarm_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    sessionStorage.setItem("freshfarm_user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    sessionStorage.setItem("fresh_theme", theme);
  }, [theme]);

  useEffect(() => {
    sessionStorage.setItem("freshfarm_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    setIsLoading(true);
    const endpoints = [
      "https://dummyjson.com/products/category/groceries?limit=100",
      "https://dummyjson.com/products/category/beauty?limit=100",
      "https://dummyjson.com/products/category/skin-care?limit=100",
      "https://dummyjson.com/products/category/kitchen-accessories?limit=100",
      "https://dummyjson.com/products/category/snacks?limit=100",
      "https://dummyjson.com/products/search?q=chips&limit=50",
      "https://dummyjson.com/products/search?q=chocolate&limit=50",
      "https://dummyjson.com/products/search?q=biscuits&limit=50",
      "https://dummyjson.com/products?limit=194",
    ];

    Promise.allSettled(endpoints.map((url) => fetch(url).then((res) => res.json())))
      .then((results) => {
        const allApiProducts = results
          .filter((res) => res.status === "fulfilled")
          .flatMap((res) => res.value.products || []);

        const mapped = allApiProducts
          .filter((p) => p?.title && !p.title.toLowerCase().includes("soft drink"))
          .map((p) => {
            const cat = p.category?.toLowerCase() || "";
            const tags = p.tags?.map(t => t.toLowerCase()) || [];
            
            let normalizedCategory = "Groceries";
            if (cat === "vegetables" || tags.includes("vegetables")) normalizedCategory = "Vegetables";
            else if (cat === "fruits" || tags.includes("fruits")) normalizedCategory = "Fruits";
            else if (cat === "meat" || tags.includes("meat")) normalizedCategory = "Meat & Fish";
            else if (cat === "dairy" || tags.includes("dairy")) normalizedCategory = "Dairy & Eggs";
            else if (cat === "beverages" || tags.includes("beverages")) normalizedCategory = "Beverages";
            else if (cat.includes("snacks") || cat.includes("confectionery") || tags.includes("snacks") || p.title.toLowerCase().includes("chips") || p.title.toLowerCase().includes("chocolate") || p.title.toLowerCase().includes("biscuit") || p.title.toLowerCase().includes("cookie") || p.title.toLowerCase().includes("snack")) normalizedCategory = "Snacks";
            else if (cat === "beauty" || cat === "skin-care" || cat.includes("personal")) normalizedCategory = "Personal Care";
            else if (cat.includes("kitchen") || cat.includes("home")) normalizedCategory = "Home & Kitchen";

            return {
              ...p,
              image: p.thumbnail || p.images?.[0] || "/fruit-bowl.png",
              category: normalizedCategory,
            };
          });

        setProducts((prev) => {
          const merged = [...prev, ...mapped];
          const seen = new Set();
          return merged.filter((item) => {
            const key = String(item.id);
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
        });
      })
      .catch(() => {
        toast.warning("Could not load extra products. Showing available items.");
      })
      .finally(() => {
        setIsLoading(false);
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
    sessionStorage.removeItem("freshfarm_user");
    sessionStorage.removeItem("freshfarm_cart");
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

  const toggleFavorite = (id) => {
    const isFav = favorites.includes(id);
    if (isFav) {
      toast.info("Removed from favorites", { position: "bottom-right", autoClose: 1500 });
      setFavorites((prev) => prev.filter((fid) => fid !== id));
    } else {
      toast.success("Added to favorites!", { position: "bottom-right", autoClose: 1500 });
      setFavorites((prev) => [...prev, id]);
    }
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
    let filtered = products;
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }
    if (searchQuery) {
      filtered = filtered.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return filtered;
  }, [products, searchQuery, selectedCategory]);

  const bestSellers = useMemo(() => filteredProducts.slice(0, 24), [filteredProducts]);

  return (
    <div className="app-shell">
      <div className="top-strip">Free delivery on orders above ৳499</div>
      <header className="navbar">
        <div className="brand">
          <img src="/logo.png" alt="FreshFarm Logo" className="logo-img" loading="lazy" />
          <span>FreshFarm</span>
        </div>
        <div className="search-bar">
          <div className="search-icon-wrapper">
            <FaSearch />
          </div>
          <input 
            type="text" 
            placeholder="Search for fruits, vegetables, groceries..."
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
        <button className="location-chip" aria-label="Location">
          <FaMapMarkerAlt />
          <span>Chattogram, 4000</span>
        </button>
        <div className="nav-right">
          <button
            className="nav-btn-icon"
            onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>
          {user ? (
            <button onClick={signOut} className="nav-btn-icon" aria-label="Sign out">
              <FaUser />
              <span className="nav-label">Account</span>
            </button>
          ) : (
            <button onClick={() => setShowPopup("auth")} className="nav-btn-icon" aria-label="Sign in">
              <FaUser />
              <span className="nav-label">Account</span>
            </button>
          )}
          <button onClick={() => setShowCart(true)} aria-label="Cart" className="nav-btn-icon">
            <FaShoppingCart className="cart-icon" />
            <span className="cart-count">{cartItems.length}</span>
          </button>
        </div>
      </header>

      <main className="page-wrap">
        <section className="hero-card">
          <div className="hero-copy">
            <span className="tiny-pill">Eat fresh, live healthy</span>
            <h1>Freshness you can <span>trust</span></h1>
            <p>Handpicked fruits, vegetables and groceries delivered fresh to your home.</p>
            <div className="hero-actions">
              <a href="#products" className="hero-button">Shop Now</a>
              <a href="#categories" className="ghost-btn">Explore more</a>
            </div>
          </div>
          <div className="hero-visual-wrap">
            <img className="hero-visual" src="/fruit-bowl.png" alt="Fresh vegetables and fruits" loading="lazy" />
            <div className="today-picks">
              <p>Today's Fresh Picks</p>
              <div className="pick-row">
                <img src="/orange.jpg" alt="Orange" loading="lazy" />
                <img src="/grapes.jpg" alt="Grapes" loading="lazy" />
                <img src="/spinach.jpg" alt="Spinach" loading="lazy" />
                <img src="/tomato.jpg" alt="Tomato" loading="lazy" />
              </div>
            </div>
          </div>
        </section>

        <section className="service-grid">
          {serviceHighlights.map((item) => (
            <div className="service-card" key={item.title}>
              <div className="service-icon">{item.icon}</div>
              <div>
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </section>

        <section id="categories" className="category-strip">
          <div className="section-head">
            <h2>Shop by Category</h2>
            <a href="#products">View all</a>
          </div>
          <div className="category-row">
            {categoryItems.map((item) => (
              <article 
                className={`category-card ${selectedCategory === item.title ? 'active' : ''}`} 
                key={item.title}
                onClick={() => {
                  setSelectedCategory(selectedCategory === item.title ? null : item.title);
                  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <img src={item.image} alt={item.title} loading="lazy" />
                <h3>{item.title}</h3>
              </article>
            ))}
          </div>
        </section>

        <section id="products" className="products-section">
          <div className="section-head">
            <h2>{selectedCategory ? `${selectedCategory}` : 'Best Sellers'}</h2>
            {selectedCategory && (
              <button className="clear-filter" onClick={() => setSelectedCategory(null)}>View All</button>
            )}
          </div>
          <div className="product-grid">
            {isLoading ? (
              <div className="loader-container">
                <div className="loader-spinner"></div>
                <p>Fetching fresh items...</p>
              </div>
            ) : bestSellers.length > 0 ? (
              bestSellers.map((p) => (
                <div className="product-shell" key={p.id}>
                  <button 
                    className={`fav-btn ${favorites.includes(p.id) ? 'active' : ''}`} 
                    aria-label="Wishlist"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(p.id);
                    }}
                  >
                    <FaHeart />
                  </button>
                  <ProductCard
                    product={p}
                    onClick={() => setShowPopup(p)}
                    onAddToCart={addToCart}
                  />
                </div>
              ))
            ) : (
              <div className="empty-state">No products found matching your criteria.</div>
            )}
          </div>
        </section>

        <section className="offer-grid">
          <article className="offer-card">
            <div>
              <h3>Flat 20% Off</h3>
              <p>On your first order</p>
              <button>Shop Now <FaArrowRight /></button>
            </div>
            <img src="/fruit-bowl.png" alt="Offer basket" loading="lazy" />
          </article>
          <article className="offer-card">
            <div>
              <h3>Super Savings</h3>
              <p>On groceries & staples</p>
              <button>Shop Now <FaArrowRight /></button>
            </div>
            <img src="/pumpkin.jpg" alt="Savings" loading="lazy" />
          </article>
          <article className="offer-card">
            <div>
              <h3>Up to 30% Off</h3>
              <p>On personal care</p>
              <button>Shop Now <FaArrowRight /></button>
            </div>
            <img src="/banana.jpg" alt="Personal care offer" loading="lazy" />
          </article>
        </section>
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
            <h3>
              <img src="/logo.png" alt="FreshFarm Logo" className="logo-img" loading="lazy" />
              FreshFarm
            </h3>
            <p>Fresh fruits, vegetables and groceries delivered fresh to your home.</p>
          </div>
          <div className="footer-section links">
            <h3>Shop</h3>
            <ul>
              <li><a href="#">Fruits</a></li>
              <li><a href="#">Vegetables</a></li>
              <li><a href="#">Groceries</a></li>
              <li><a href="#">View all</a></li>
            </ul>
          </div>
          <div className="footer-section social">
            <h3>Help & Support</h3>
            <div className="social-icons">
              <a href="#"><FaFacebook /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaInstagram /></a>
            </div>
          </div>
          <div className="footer-section newsletter">
            <h3>Stay updated with offers</h3>
            <p>Get the best deals and updates delivered to your inbox.</p>
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
          <p>&copy; 2026 FreshFarm. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

