import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search, MapPin, CheckCircle, Clock, Filter, ChevronRight,
  Store, Tag, ArrowRight,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SHOPS } from "../data/shops";
import { GARMENTS } from "../data/garments";

const AREAS = ["All Areas", "College Road", "Gangapur Road", "Panchavati", "Canada Corner", "Indira Nagar", "Nashik Road"];

export default function ShopsListPage() {
  const [query, setQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState("All Areas");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const results = useMemo(() => {
    let list = [...SHOPS];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.area.toLowerCase().includes(q) ||
          s.categories.some((c) => c.toLowerCase().includes(q))
      );
    }
    if (selectedArea !== "All Areas") list = list.filter((s) => s.area === selectedArea);
    if (verifiedOnly) list = list.filter((s) => s.verified);
    return list;
  }, [query, selectedArea, verifiedOnly]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", paddingTop: "var(--nav-height)" }}>
      <Navbar />

      {/* Page Header */}
      <section style={{
        background: "linear-gradient(135deg, var(--charcoal) 0%, var(--charcoal-lt) 100%)",
        color: "#fff",
        padding: "3.5rem 0",
      }}>
        <div className="container">
          <p style={{ color: "var(--blush)", fontSize: "0.8125rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "0.625rem" }}>
            Shop Directory
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, marginBottom: "0.75rem", lineHeight: 1.1 }}>
            Nashik Rental Shops
          </h1>
          <p style={{ opacity: 0.8, fontSize: "1.0625rem", maxWidth: 540, lineHeight: 1.7 }}>
            8 local rental shops listed — verification in progress. Real details will be confirmed once shops are onboarded.
          </p>
        </div>
      </section>

      {/* Filters */}
      <div style={{ background: "var(--ivory)", borderBottom: "1px solid var(--color-border)", padding: "1.25rem 0" }}>
        <div className="container">
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
            {/* Search */}
            <div style={{
              flex: 1, minWidth: 260,
              display: "flex", alignItems: "center", gap: "0.75rem",
              background: "var(--white)", border: "1.5px solid var(--color-border)",
              borderRadius: "var(--radius-full)", padding: "0.5rem 1rem",
              boxShadow: "var(--shadow-xs)",
            }}>
              <Search size={16} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search shops by name, area or category..."
                style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: "0.9375rem", color: "var(--color-text)", fontFamily: "var(--font-body)" }}
              />
            </div>

            {/* Area Filter */}
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="input"
              style={{ width: "auto", borderRadius: "var(--radius-full)", fontSize: "0.875rem" }}
            >
              {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>

            {/* Verified Toggle */}
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontFamily: "var(--font-ui)", fontSize: "0.875rem", fontWeight: 500, color: "var(--color-text)" }}>
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                style={{ accentColor: "var(--color-primary)", width: 15, height: 15 }}
              />
              Verified only
            </label>
          </div>
        </div>
      </div>

      {/* Shops Grid */}
      <div className="container" style={{ paddingTop: "2rem", paddingBottom: "3rem" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
            {results.length} shop{results.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {results.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏪</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.375rem", marginBottom: "0.5rem" }}>No shops found</h2>
            <p style={{ color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>Try adjusting your search or filters</p>
            <button onClick={() => { setQuery(""); setSelectedArea("All Areas"); setVerifiedOnly(false); }} className="btn btn-primary">
              Clear Filters
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {results.map((shop) => {
              const garmentCount = GARMENTS.filter((g) => g.shopId === shop.id).length;
              return (
                <ShopCard key={shop.id} shop={shop} garmentCount={garmentCount} />
              );
            })}
          </div>
        )}
      </div>

      {/* Partner CTA */}
      <section style={{ background: "var(--ivory)", padding: "4rem 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🏪</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem,3vw,2.25rem)", fontWeight: 700, marginBottom: "0.75rem" }}>
            Own a Rental Shop in Nashik?
          </h2>
          <p style={{ color: "var(--color-text-muted)", fontSize: "1.0625rem", maxWidth: 500, margin: "0 auto 2rem", lineHeight: 1.7 }}>
            Bring your collection online and let customers discover your garments.
          </p>
          <Link to="/partner" className="btn btn-primary btn-lg" style={{ gap: "0.5rem" }}>
            Become a Partner Shop <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ShopCard({ shop, garmentCount }) {
  const navigate = useNavigate();
  return (
    <div
      className="shop-card"
      onClick={() => navigate(`/shop/${shop.id}`)}
      style={{ cursor: "pointer" }}
    >
      <div className="shop-card__header">
        {shop.image ? (
          <img
            src={shop.image}
            alt={shop.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            loading="lazy"
          />
        ) : (
          <span style={{ fontSize: "3.5rem" }}>🏪</span>
        )}
        <span style={{ position: "absolute", top: "0.75rem", right: "0.75rem" }}
          className={`badge ${shop.verified ? "badge-verified" : "badge-pending"}`}
        >
          {shop.verified ? <><CheckCircle size={11} /> Verified</> : <><Clock size={11} /> Pending</>}
        </span>
      </div>
      <div className="shop-card__body">
        <h2 className="shop-card__name">{shop.name}</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8125rem", color: "var(--color-text-muted)", marginBottom: "0.75rem" }}>
          <MapPin size={12} style={{ color: "var(--rose-gold)" }} />
          {shop.area}, {shop.city}
        </div>
        <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", lineHeight: 1.6, marginBottom: "0.875rem" }}>
          {shop.description}
        </p>

        {/* Categories */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginBottom: "0.875rem" }}>
          {shop.categories.slice(0, 4).map((cat) => (
            <span key={cat} className="garment-card__tag">{cat}</span>
          ))}
          {shop.categories.length > 4 && (
            <span className="garment-card__tag">+{shop.categories.length - 4}</span>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "0.75rem", borderTop: "1px solid var(--color-border-lt)" }}>
          <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
            {garmentCount > 0 ? (
              <span style={{ color: "var(--color-primary)", fontWeight: 600 }}>{garmentCount} demo garments</span>
            ) : (
              <span>Inventory to be added</span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--color-primary)", fontSize: "0.8125rem", fontWeight: 600 }}>
            View Shop <ChevronRight size={14} />
          </div>
        </div>
      </div>
    </div>
  );
}
