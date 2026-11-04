import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Search, MapPin, Calendar, ArrowRight, Star, CheckCircle,
  GitCompare, Sparkles, Shield, ChevronRight, Play, Camera,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GarmentCard from "../components/GarmentCard";
import { CATEGORIES, GARMENTS } from "../data/garments";
import { SHOPS } from "../data/shops";
import { useApp } from "../context/AppContext";

// ── Step Cards ──────────────────────────────────────────────
const HOW_STEPS = [
  { num: "01", title: "Search", desc: "Browse by category, occasion, size, price or area. Find styles from multiple Nashik shops in one place.", emoji: "🔍" },
  { num: "02", title: "Compare", desc: "Select up to 4 garments side-by-side. Compare rental price, size, area, condition and availability.", emoji: "⚖️" },
  { num: "03", title: "Choose Your Shop", desc: "Pick the shop that suits you best. View their collection, location, contact details and directions.", emoji: "📍" },
  { num: "04", title: "Rent & Enjoy", desc: "Visit or contact the shop, complete the rental and enjoy your perfect look for the occasion!", emoji: "✨" },
];

const TRUST_POINTS = [
  { icon: <Shield size={20} />, title: "Garment Lifecycle Tracking", desc: "Every garment has a unique Garment ID and a complete history: inspection → cleaning → repair → available." },
  { icon: <CheckCircle size={20} />, title: "Condition Verified", desc: "Participating shops update inspection and cleaning status so you know exactly what you're renting." },
  { icon: <GitCompare size={20} />, title: "Cross-Shop Comparison", desc: "Compare similar outfits from different Nashik shops on rental price, size, area and availability." },
  { icon: <MapPin size={20} />, title: "Nashik-Local", desc: "Every listing is from a real Nashik rental shop. Discover shops in College Road, Gangapur Road, Panchavati and more." },
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();
  const { dispatch } = useApp();

  const handleSearch = (e) => {
    e?.preventDefault();
    if (query.trim()) {
      dispatch({ type: "SET_SEARCH_QUERY", payload: query });
      navigate(`/search?q=${encodeURIComponent(query)}`);
    } else {
      navigate("/search");
    }
  };

  const featuredGarments = GARMENTS.filter((g) => g.availability === "available").slice(0, 6);
  const popularGarments = [...GARMENTS]
    .sort((a, b) => b.rentalPrice - a.rentalPrice)
    .slice(0, 4);

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      <Navbar transparent />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero__bg">
          <img src="/hero.jpg" alt="Fashion rental Nashik" />
        </div>
        <div className="container" style={{ paddingTop: "var(--nav-height)", paddingBottom: "3rem" }}>
          <div className="hero__content">
            <div className="hero__tag">
              <Sparkles size={12} />
              Nashik's Fashion Rental Marketplace
            </div>
            <h1 className="hero__title">
              Find Your <em>Perfect</em><br />Rental Look<br />in Nashik
            </h1>
            <p className="hero__subtitle">
              Discover dresses, lehengas, gowns, sarees, sherwanis and more from rental shops across Nashik — all in one place.
            </p>

            {/* Search Box */}
            <form onSubmit={handleSearch} style={{ maxWidth: 720 }}>
              <div className="search-box">
                <Search size={18} style={{ color: "var(--color-text-light)", flexShrink: 0, marginLeft: "0.75rem" }} />
                <input
                  className="search-box__input"
                  type="text"
                  placeholder="What are you looking for? e.g. Lehenga, Party Dress, Gown..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search garments"
                  id="hero-search"
                />
                <div className="search-box__divider" />
                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0 0.75rem", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
                  <MapPin size={14} style={{ color: "var(--rose-gold)" }} />
                  Nashik
                </div>
                <div className="search-box__divider" />
                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0 0.75rem", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
                  <Calendar size={14} style={{ color: "var(--rose-gold)" }} />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{ border: "none", background: "transparent", color: "var(--color-text-muted)", fontSize: "0.875rem", outline: "none", cursor: "pointer", fontFamily: "var(--font-body)" }}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ borderRadius: "var(--radius-xl)" }}>
                  <Search size={16} />
                  Search
                </button>
              </div>
            </form>

            {/* Quick Tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "1.25rem" }}>
              <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", alignSelf: "center" }}>Popular:</span>
              {["Party Wear", "Lehenga", "Gown", "Sherwani", "Bridal"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => { setQuery(tag); navigate(`/search?q=${encodeURIComponent(tag)}`); }}
                  style={{
                    background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "var(--radius-full)", padding: "0.3rem 0.875rem",
                    fontSize: "0.8125rem", color: "rgba(255,255,255,0.9)",
                    cursor: "pointer", transition: "var(--transition-fast)",
                    fontFamily: "var(--font-ui)", fontWeight: 500,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.22)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem",
          color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", fontFamily: "var(--font-ui)",
          animation: "bounce 2s ease infinite",
        }}>
          <span>Scroll</span>
          <div style={{ width: 1, height: 40, background: "rgba(255,255,255,0.3)" }} />
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────── */}
      <section style={{
        background: "var(--color-primary)",
        color: "#fff",
        padding: "1.5rem 0",
      }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", textAlign: "center" }}>
            {[
              { value: "8+", label: "Nashik Shops" },
              { value: "32+", label: "Demo Garments" },
              { value: "10", label: "Categories" },
              { value: "5", label: "Areas Covered" },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: "0.8125rem", opacity: 0.75, marginTop: "0.25rem", fontFamily: "var(--font-ui)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <p style={{ color: "var(--rose-gold)", fontSize: "0.8125rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Browse by Type</p>
              <h2 className="section-title">Shop by Category</h2>
            </div>
            <Link to="/categories" className="btn btn-ghost btn-sm" style={{ gap: "0.375rem" }}>
              All Categories <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "1rem" }}>
            {CATEGORIES.map((cat) => {
              const count = GARMENTS.filter((g) => g.category === cat.id).length;
              return (
                <div
                  key={cat.id}
                  className="category-card"
                  onClick={() => navigate(`/search?category=${cat.id}`)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Browse ${cat.label}`}
                  onKeyDown={(e) => e.key === "Enter" && navigate(`/search?category=${cat.id}`)}
                >
                  {cat.image ? (
                    <div style={{ width: 60, height: 60, borderRadius: "50%", overflow: "hidden", border: "2px solid var(--color-border-lt)", flexShrink: 0, background: "var(--ivory)" }}>
                      <img src={cat.image} alt={cat.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                    </div>
                  ) : (
                    <div className="category-card__emoji">{cat.emoji}</div>
                  )}
                  <div className="category-card__label">{cat.label}</div>
                  <div className="category-card__count">{count} items</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURED GARMENTS ─────────────────────────────── */}
      <section className="section" style={{ background: "var(--ivory)" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <p style={{ color: "var(--rose-gold)", fontSize: "0.8125rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Demo Inventory</p>
              <h2 className="section-title">Popular Rental Styles</h2>
              <p className="section-subtitle">Explore demo garments from across Nashik rental shops</p>
            </div>
            <Link to="/search" className="btn btn-secondary btn-sm" style={{ gap: "0.375rem" }}>
              Browse All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid-auto">
            {featuredGarments.map((g) => (
              <GarmentCard key={g.id} garment={g} />
            ))}
          </div>
        </div>
      </section>

      {/* ── NASHIK SHOPS ─────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ color: "var(--rose-gold)", fontSize: "0.8125rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Directory</p>
            <h2 className="section-title" style={{ marginBottom: "0.75rem" }}>Explore Nashik Rental Shops</h2>
            <p className="section-subtitle" style={{ margin: "0 auto" }}>
              8 local rental shops listed — verification in progress. Real data to be added once shops are onboarded.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
            {SHOPS.map((shop) => (
              <Link to={`/shop/${shop.id}`} key={shop.id} className="shop-card" style={{ textDecoration: "none" }}>
                <div className="shop-card__header">
                  {shop.image ? (
                    <img
                      src={shop.image}
                      alt={shop.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      loading="lazy"
                    />
                  ) : (
                    <span style={{ fontSize: "3rem" }}>🏪</span>
                  )}
                  <span style={{
                    position: "absolute", top: "0.75rem", right: "0.75rem",
                  }} className={`badge ${shop.verified ? "badge-verified" : "badge-pending"}`}>
                    {shop.verified ? "✓ Verified" : "⏳ Pending"}
                  </span>
                </div>
                <div className="shop-card__body">
                  <h3 className="shop-card__name">{shop.name}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8125rem", color: "var(--color-text-muted)", marginBottom: "0.75rem" }}>
                    <MapPin size={12} style={{ color: "var(--rose-gold)" }} />
                    {shop.area}, {shop.city}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                    {shop.categories.slice(0, 3).map((cat) => (
                      <span key={cat} className="garment-card__tag">{cat}</span>
                    ))}
                    {shop.categories.length > 3 && (
                      <span className="garment-card__tag">+{shop.categories.length - 3}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Link to="/shops" className="btn btn-secondary" style={{ gap: "0.375rem" }}>
              View All Shops <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── COMPARE FEATURE ──────────────────────────────── */}
      <section className="section" style={{ background: "var(--ivory)" }}>
        <div className="container">
          <div style={{
            background: "linear-gradient(135deg, var(--color-primary) 0%, var(--burgundy-lt) 100%)",
            borderRadius: "var(--radius-2xl)",
            padding: "4rem 3rem",
            color: "#fff",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3rem",
            alignItems: "center",
          }}>
            <div>
              <p style={{ fontSize: "0.8125rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", opacity: 0.7, marginBottom: "0.75rem" }}>Research Feature</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem,3vw,2.5rem)", fontWeight: 700, marginBottom: "1rem", lineHeight: 1.2 }}>
                Compare Garments<br />Across Shops
              </h2>
              <p style={{ opacity: 0.85, lineHeight: 1.7, marginBottom: "1.75rem", fontSize: "1.0625rem" }}>
                Select up to 4 garments from different Nashik shops and compare them side by side — rental price, size, condition, area and more. Make an informed decision before you visit.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "2rem" }}>
                {["Rental price comparison", "Size & availability", "Shop area & distance", "Condition & cleaning status"].map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: "0.625rem", fontSize: "0.9375rem" }}>
                    <CheckCircle size={16} style={{ flexShrink: 0, color: "var(--blush)" }} />
                    {f}
                  </div>
                ))}
              </div>
              <Link to="/compare" className="btn" style={{ background: "#fff", color: "var(--color-primary)", fontWeight: 700 }}>
                <GitCompare size={16} /> Open Compare
              </Link>
            </div>
            <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: "var(--radius-xl)", padding: "1.5rem", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", fontSize: "0.8125rem" }}>
                <div style={{ fontWeight: 700, opacity: 0.7, paddingBottom: "0.5rem", borderBottom: "1px solid rgba(255,255,255,0.15)" }}>Feature</div>
                <div style={{ fontWeight: 700, opacity: 0.7, paddingBottom: "0.5rem", borderBottom: "1px solid rgba(255,255,255,0.15)" }}>Dress A</div>
                <div style={{ fontWeight: 700, opacity: 0.7, paddingBottom: "0.5rem", borderBottom: "1px solid rgba(255,255,255,0.15)" }}>Dress B</div>
                {[
                  ["Price", "₹700", "₹550"],
                  ["Size", "M", "L"],
                  ["Area", "College Rd", "Gangapur"],
                  ["Condition", "✓ Inspected", "✓ Inspected"],
                  ["Cleaning", "✓ Done", "✓ Done"],
                  ["Status", "Available", "Available"],
                ].map(([label, a, b]) => (
                  <React.Fragment key={label}>
                    <div style={{ opacity: 0.7, padding: "0.375rem 0", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>{label}</div>
                    <div style={{ fontWeight: 500, padding: "0.375rem 0", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>{a}</div>
                    <div style={{ fontWeight: 500, padding: "0.375rem 0", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>{b}</div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ color: "var(--rose-gold)", fontSize: "0.8125rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Simple Process</p>
            <h2 className="section-title" style={{ marginBottom: "0.75rem" }}>How It Works</h2>
          </div>
          <div className="how-it-works">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              {HOW_STEPS.map((step, i) => (
                <div key={step.num} className="step-card">
                  <div className="step-number">{step.num}</div>
                  <div style={{ fontSize: "2.5rem", margin: "0.5rem 0" }}>{step.emoji}</div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.625rem", color: "var(--charcoal)" }}>{step.title}</h3>
                  <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── GARMENT TRUST / LIFECYCLE ─────────────────────── */}
      <section className="section" style={{ background: "var(--ivory)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
            <div>
              <p style={{ color: "var(--rose-gold)", fontSize: "0.8125rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Research Feature</p>
              <h2 className="section-title" style={{ marginBottom: "1rem" }}>Garment Lifecycle & Trust</h2>
              <p style={{ color: "var(--color-text-muted)", lineHeight: 1.7, marginBottom: "1.75rem" }}>
                Every garment on RentStyle Nashik has a unique Garment ID and a complete lifecycle history — from the moment it's listed to every rental, cleaning and inspection.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
                {TRUST_POINTS.map((point) => (
                  <div key={point.title} style={{ display: "flex", gap: "1rem" }}>
                    <div style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", background: "var(--blush-light)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-primary)", flexShrink: 0 }}>
                      {point.icon}
                    </div>
                    <div>
                      <h4 style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: "0.9375rem", marginBottom: "0.25rem", color: "var(--charcoal)" }}>{point.title}</h4>
                      <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", lineHeight: 1.6 }}>{point.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/garment/NSK-G-1001" className="btn btn-primary" style={{ gap: "0.375rem" }}>
                See Lifecycle Example <ArrowRight size={15} />
              </Link>
            </div>

            {/* Timeline Visual */}
            <div style={{ background: "var(--white)", borderRadius: "var(--radius-xl)", padding: "2rem", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <span style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "0.8125rem", color: "var(--color-primary)" }}>NSK-G-1001</span>
                <span className="badge badge-available"><CheckCircle size={10} /> Available</span>
              </div>
              <div className="lifecycle-timeline">
                {[
                  { stage: "Available", date: "01 Aug 2026", note: "Initial listing", type: "completed" },
                  { stage: "Rented", date: "12 Aug 2026", note: "Booking #B001 collected", type: "completed" },
                  { stage: "Returned", date: "15 Aug 2026", note: "Returned on time", type: "completed" },
                  { stage: "Inspection", date: "15 Aug 2026", note: "Minor sequin fix done", type: "completed" },
                  { stage: "Cleaning", date: "16 Aug 2026", note: "Dry cleaned", type: "completed" },
                  { stage: "Final Inspection", date: "17 Aug 2026", note: "Passed ✓", type: "completed" },
                  { stage: "Available Again", date: "17 Aug 2026", note: "Ready for rental", type: "active" },
                ].map((event, i) => (
                  <div key={i} className="lifecycle-event">
                    <div className={`lifecycle-dot ${event.type}`} />
                    <div>
                      <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: "0.875rem", color: "var(--charcoal)" }}>{event.stage}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.125rem" }}>{event.date} · {event.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAP PLACEHOLDER ──────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <p style={{ color: "var(--rose-gold)", fontSize: "0.8125rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Nashik Coverage</p>
            <h2 className="section-title" style={{ marginBottom: "0.75rem" }}>Rental Shops on the Map</h2>
            <p className="section-subtitle" style={{ margin: "0 auto" }}>Interactive map integration ready. Google Maps / Mapbox can be configured via the admin panel.</p>
          </div>
          <div className="map-placeholder">
            <div style={{ fontSize: "3rem" }}>🗺️</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.375rem", color: "var(--charcoal)" }}>Nashik Rental Map</h3>
            <p style={{ color: "var(--color-text-muted)", maxWidth: 400, textAlign: "center" }}>
              Map integration ready. Configure Google Maps or Mapbox API key to see all 8 shops plotted across Nashik's areas.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem", justifyContent: "center", marginTop: "0.5rem" }}>
              {["📍 College Road (3 shops)", "📍 Gangapur Road (3 shops)", "📍 Panchavati (1 shop)", "📍 More areas"].map((a) => (
                <span key={a} className="badge badge-demo" style={{ fontSize: "0.8125rem" }}>{a}</span>
              ))}
            </div>
            <Link to="/shops" className="btn btn-primary" style={{ marginTop: "0.5rem" }}>View Shop Directory</Link>
          </div>
        </div>
      </section>

      {/* ── FUTURE FEATURES ──────────────────────────────── */}
      <section className="section" style={{ background: "var(--ivory)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <p style={{ color: "var(--rose-gold)", fontSize: "0.8125rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Coming Soon</p>
            <h2 className="section-title" style={{ marginBottom: "0.75rem" }}>Research & Future Features</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
            {[
              { emoji: "📸", title: "Image Search", badge: "Beta Architecture", desc: "Upload a photo of an outfit and find similar garments available for rent across Nashik shops.", link: "/search?image=true" },
              { emoji: "🪞", title: "Virtual Try-On", badge: "Coming Soon", desc: "See how garments look on you virtually before deciding to rent. AI-powered try-on integration planned.", link: "#" },
              { emoji: "🤖", title: "Smart Recommendations", badge: "Active", desc: "Personalised garment recommendations based on your category preference, size, price range and browsing history.", link: "/search" },
            ].map((feat) => (
              <div key={feat.title} style={{ background: "var(--white)", borderRadius: "var(--radius-xl)", padding: "2rem", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-sm)", textAlign: "center" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{feat.emoji}</div>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.75rem" }}>
                  <span className="badge badge-booked">{feat.badge}</span>
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1875rem", fontWeight: 600, marginBottom: "0.625rem" }}>{feat.title}</h3>
                <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>{feat.desc}</p>
                <Link to={feat.link} className="btn btn-ghost btn-sm" style={{ display: "inline-flex" }}>Learn More <ChevronRight size={13} /></Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNER CTA ──────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div style={{
            background: "linear-gradient(135deg, var(--charcoal) 0%, var(--charcoal-lt) 100%)",
            borderRadius: "var(--radius-2xl)",
            padding: "4rem 3rem",
            color: "#fff",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: "-30%", right: "-10%", width: "400px", height: "400px", borderRadius: "50%", background: "rgba(123,31,58,0.2)", filter: "blur(60px)" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <p style={{ fontSize: "0.8125rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", opacity: 0.6, marginBottom: "0.75rem" }}>For Rental Shops</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem,3.5vw,3rem)", fontWeight: 700, marginBottom: "1rem" }}>
                Own a Rental Shop in Nashik?
              </h2>
              <p style={{ opacity: 0.8, fontSize: "1.0625rem", maxWidth: 540, margin: "0 auto 2rem", lineHeight: 1.7 }}>
                Bring your collection online and let customers discover your garments. Join RentStyle Nashik's growing marketplace.
              </p>
              <Link to="/partner" className="btn btn-primary btn-lg" style={{ gap: "0.5rem" }}>
                Become a Partner Shop <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="section" style={{ background: "var(--ivory)" }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h2 className="section-title" style={{ marginBottom: "0.5rem" }}>Frequently Asked Questions</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { q: "Is RentStyle Nashik a rental shop?", a: "No. RentStyle Nashik is a discovery and comparison platform. We list garments from multiple local rental shops so you can compare options and then visit or contact the shop directly." },
              { q: "Is the listed data real?", a: "The 8 shop names and areas are real Nashik businesses. However, all garment inventory, prices and availability shown are demo data for demonstration purposes. Verified real data will be added as shops are onboarded." },
              { q: "What is the Garment Lifecycle feature?", a: "Each garment gets a unique ID (e.g. NSK-G-1001). Shops update garment status after each rental — inspection, cleaning, repair, and final inspection — so customers can see the garment's condition history." },
              { q: "How can my shop join?", a: "Click 'Become a Partner' and fill in the partner registration form. Your listing will go through admin verification before going live." },
              { q: "Is there a booking fee?", a: "RentStyle Nashik is a discovery platform. Booking and payment arrangements are made directly with each rental shop. We do not charge customers a booking fee." },
            ].map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
      `}</style>
    </div>
  );
}

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: "var(--white)", borderRadius: "var(--radius-lg)",
      border: `1px solid ${open ? "var(--blush)" : "var(--color-border)"}`,
      overflow: "hidden", transition: "var(--transition-fast)",
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", padding: "1.125rem 1.375rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          cursor: "pointer", background: "none", border: "none",
          fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: "0.9375rem",
          color: "var(--color-text)", textAlign: "left", gap: "1rem",
        }}
      >
        {question}
        <ChevronRight
          size={16}
          style={{
            color: "var(--color-text-muted)", flexShrink: 0,
            transform: open ? "rotate(90deg)" : "rotate(0)",
            transition: "var(--transition-fast)",
          }}
        />
      </button>
      {open && (
        <div style={{ padding: "0 1.375rem 1.125rem", color: "var(--color-text-muted)", fontSize: "0.9rem", lineHeight: 1.7 }}>
          {answer}
        </div>
      )}
    </div>
  );
}
