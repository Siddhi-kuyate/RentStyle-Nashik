import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search, MapPin, Bell, Heart, GitCompare, User, Menu, X,
  Home, BookOpen, ShoppingBag, ChevronDown, LogOut, Settings,
} from "lucide-react";
import { useAuth, useCompare, useFavorites } from "../context/AppContext";

export default function Navbar({ transparent = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();
  const { compareList } = useCompare();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navClass = `navbar ${transparent && !scrolled ? "transparent" : scrolled ? "scrolled" : "solid"}`;
  const textColor = transparent && !scrolled ? "#fff" : "var(--color-text)";
  const logoColor = transparent && !scrolled ? "#fff" : "var(--color-primary)";

  return (
    <>
      <nav className={navClass} style={{ paddingLeft: "1.25rem", paddingRight: "1.25rem" }}>
        <div style={{ maxWidth: "var(--max-width)", margin: "0 auto", width: "100%", display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {/* Logo */}
          <Link to="/" className="nav-logo" style={{ color: logoColor, flexShrink: 0 }}>
            RentStyle<span style={{ color: transparent && !scrolled ? "rgba(255,255,255,0.7)" : "var(--rose-gold)" }}>.</span>
          </Link>

          {/* Desktop Nav */}
          <ul className="nav-links" style={{ display: "flex", gap: "0.25rem", marginLeft: "1rem", flex: 1 }}>
            {[
              { to: "/search", label: "Browse" },
              { to: "/shops", label: "Shops" },
              { to: "/categories", label: "Categories" },
              { to: "/compare", label: "Compare" },
            ].map((item) => (
              <li key={item.to} className="hidden-mobile">
                <Link
                  to={item.to}
                  className="nav-link"
                  style={{ color: textColor }}
                >
                  {item.label}
                  {item.to === "/compare" && compareList.length > 0 && (
                    <span style={{
                      marginLeft: "0.3rem",
                      background: "var(--color-primary)",
                      color: "#fff",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      borderRadius: "99px",
                      padding: "0 5px",
                      verticalAlign: "middle",
                    }}>{compareList.length}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginLeft: "auto" }}>
            <button
              className="btn btn-ghost btn-sm hidden-mobile"
              style={{ color: textColor, border: "none", background: "transparent", padding: "0.5rem" }}
              onClick={() => navigate("/search")}
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {compareList.length > 0 && (
              <Link
                to="/compare"
                className="btn btn-ghost btn-sm hidden-mobile"
                style={{
                  color: textColor,
                  border: `1.5px solid ${transparent && !scrolled ? "rgba(255,255,255,0.4)" : "var(--color-border)"}`,
                  position: "relative",
                  gap: "0.375rem",
                }}
              >
                <GitCompare size={15} />
                Compare ({compareList.length})
              </Link>
            )}

            {isLoggedIn ? (
              <div ref={userMenuRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: transparent && !scrolled ? "rgba(255,255,255,0.15)" : "var(--ivory)",
                    border: `1px solid ${transparent && !scrolled ? "rgba(255,255,255,0.3)" : "var(--color-border)"}`,
                    borderRadius: "var(--radius-full)",
                    padding: "0.4rem 0.875rem 0.4rem 0.4rem",
                    cursor: "pointer",
                    color: textColor,
                    transition: "var(--transition-fast)",
                    fontFamily: "var(--font-ui)",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  <div style={{
                    width: 28, height: 28,
                    borderRadius: "50%",
                    background: "var(--color-primary)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontSize: "0.75rem", fontWeight: 700,
                  }}>
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="hidden-mobile">{user?.name?.split(" ")[0]}</span>
                  <ChevronDown size={14} />
                </button>

                {userMenuOpen && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 8px)", right: 0,
                    background: "var(--white)", border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-lg)",
                    minWidth: 220, overflow: "hidden", zIndex: 200,
                    animation: "slideUp 0.2s ease",
                  }}>
                    <div style={{ padding: "0.875rem 1rem", borderBottom: "1px solid var(--color-border-lt)" }}>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--color-text)" }}>{user?.name}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{user?.email}</div>
                      <span className="badge badge-pending" style={{ marginTop: "0.375rem", fontSize: "0.7rem" }}>
                        {user?.role === "admin" ? "Admin" : user?.role === "shop_owner" ? "Shop Owner" : "Customer"}
                      </span>
                    </div>
                    {[
                      { to: user?.role === "admin" ? "/admin" : user?.role === "shop_owner" ? "/shop-dashboard" : "/dashboard", icon: <Home size={15} />, label: "Dashboard" },
                      { to: "/dashboard/favorites", icon: <Heart size={15} />, label: "Saved Dresses" },
                      { to: "/dashboard/bookings", icon: <BookOpen size={15} />, label: "My Bookings" },
                    ].map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setUserMenuOpen(false)}
                        style={{
                          display: "flex", alignItems: "center", gap: "0.75rem",
                          padding: "0.75rem 1rem",
                          fontSize: "0.875rem", color: "var(--color-text)",
                          transition: "var(--transition-fast)",
                          fontFamily: "var(--font-ui)",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "var(--ivory)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        {item.icon} {item.label}
                      </Link>
                    ))}
                    <div style={{ borderTop: "1px solid var(--color-border-lt)" }}>
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); navigate("/"); }}
                        style={{
                          display: "flex", alignItems: "center", gap: "0.75rem", width: "100%",
                          padding: "0.75rem 1rem", fontSize: "0.875rem",
                          color: "var(--wine)", fontFamily: "var(--font-ui)",
                          cursor: "pointer", border: "none", background: "none",
                          transition: "var(--transition-fast)",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "#FEE2E2"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Link
                  to="/login"
                  className="btn btn-ghost btn-sm"
                  style={{
                    color: textColor,
                    borderColor: transparent && !scrolled ? "rgba(255,255,255,0.4)" : "var(--color-border)",
                  }}
                >
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm hidden-mobile">
                  Join Free
                </Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              className="mobile-only"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: textColor, padding: "0.375rem",
              }}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 99,
          background: "var(--white)", paddingTop: "var(--nav-height)",
          overflowY: "auto",
        }}>
          <div style={{ padding: "1.5rem" }}>
            {[
              { to: "/", label: "Home", icon: <Home size={18} /> },
              { to: "/search", label: "Browse All", icon: <Search size={18} /> },
              { to: "/shops", label: "Shops", icon: <MapPin size={18} /> },
              { to: "/compare", label: "Compare", icon: <GitCompare size={18} /> },
              { to: "/dashboard", label: "My Account", icon: <User size={18} /> },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex", alignItems: "center", gap: "1rem",
                  padding: "1rem 0",
                  borderBottom: "1px solid var(--color-border-lt)",
                  fontSize: "1.0625rem", fontWeight: 500,
                  color: "var(--color-text)", fontFamily: "var(--font-ui)",
                }}
              >
                <span style={{ color: "var(--color-primary)" }}>{item.icon}</span>
                {item.label}
              </Link>
            ))}
            {!isLoggedIn && (
              <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <Link to="/login" className="btn btn-secondary" onClick={() => setMobileOpen(false)} style={{ justifyContent: "center" }}>Sign In</Link>
                <Link to="/register" className="btn btn-primary" onClick={() => setMobileOpen(false)} style={{ justifyContent: "center" }}>Create Account</Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <nav className="mobile-nav">
        {[
          { to: "/", icon: <Home size={20} />, label: "Home" },
          { to: "/search", icon: <Search size={20} />, label: "Search" },
          { to: "/compare", icon: <GitCompare size={20} />, label: "Compare", badge: compareList.length },
          { to: "/dashboard/bookings", icon: <BookOpen size={20} />, label: "Bookings" },
          { to: isLoggedIn ? "/dashboard" : "/login", icon: <User size={20} />, label: "Profile" },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="mobile-nav__item"
            style={{ position: "relative" }}
          >
            {item.badge > 0 && (
              <span style={{
                position: "absolute", top: 2, right: "calc(50% - 18px)",
                background: "var(--color-primary)",
                color: "#fff", fontSize: "0.6rem", fontWeight: 700,
                borderRadius: "99px", padding: "0 4px", minWidth: 14, textAlign: "center",
              }}>{item.badge}</span>
            )}
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      <style>{`
        .hidden-mobile { display: flex; }
        .mobile-only { display: none; }
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .mobile-only { display: flex !important; }
        }
      `}</style>
    </>
  );
}
