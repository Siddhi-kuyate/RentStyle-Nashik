import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CATEGORIES, GARMENTS } from "../data/garments";

export default function CategoriesPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", paddingTop: "var(--nav-height)" }}>
      <Navbar />

      {/* Header */}
      <section style={{
        background: "linear-gradient(135deg, var(--color-primary) 0%, var(--burgundy-lt) 100%)",
        color: "#fff",
        padding: "3.5rem 0",
        textAlign: "center",
      }}>
        <div className="container">
          <p style={{ fontSize: "0.8125rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", opacity: 0.7, marginBottom: "0.625rem" }}>
            Browse by Type
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, marginBottom: "0.75rem", lineHeight: 1.1 }}>
            All Categories
          </h1>
          <p style={{ opacity: 0.85, fontSize: "1.0625rem", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
            Find the perfect outfit for every occasion from rental shops across Nashik.
          </p>
        </div>
      </section>

      {/* Category Grid */}
      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem" }}>
            {CATEGORIES.map((cat) => {
              const count = GARMENTS.filter((g) => g.category === cat.id).length;
              const available = GARMENTS.filter((g) => g.category === cat.id && g.availability === "available").length;
              return (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  count={count}
                  available={available}
                  onClick={() => navigate(`/search?category=${cat.id}`)}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Browse All CTA */}
      <section style={{ background: "var(--ivory)", padding: "4rem 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem,3vw,2.25rem)", fontWeight: 700, marginBottom: "0.75rem" }}>
            Not sure what to search?
          </h2>
          <p style={{ color: "var(--color-text-muted)", fontSize: "1.0625rem", maxWidth: 480, margin: "0 auto 2rem", lineHeight: 1.7 }}>
            Browse all available garments from Nashik rental shops and use our smart filters to narrow down.
          </p>
          <Link to="/search" className="btn btn-primary btn-lg" style={{ gap: "0.5rem" }}>
            Browse All Garments <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function CategoryCard({ category, count, available, onClick }) {
  const PALETTES = {
    "party-wear":   { bg: "linear-gradient(135deg, #FFF0F5 0%, #FFE4EE 100%)", border: "#F9B8CE" },
    "lehenga":      { bg: "linear-gradient(135deg, #FFF5F0 0%, #FFE8DC 100%)", border: "#F9CDB8" },
    "wedding-wear": { bg: "linear-gradient(135deg, #FFF9E6 0%, #FFF0B8 100%)", border: "#F7D96D" },
    "sarees":       { bg: "linear-gradient(135deg, #F0FFF4 0%, #DCFCE7 100%)", border: "#86EFAC" },
    "bridal-wear":  { bg: "linear-gradient(135deg, #FFF0F5 0%, #EDE9FE 100%)", border: "#DDD6FE" },
    "sherwani":     { bg: "linear-gradient(135deg, #F0F9FF 0%, #DBEAFE 100%)", border: "#93C5FD" },
    "suits":        { bg: "linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%)", border: "#ADB5BD" },
    "gowns":        { bg: "linear-gradient(135deg, #F5F0FF 0%, #EDE9FE 100%)", border: "#C4B5FD" },
    "kids-wear":    { bg: "linear-gradient(135deg, #FFF7ED 0%, #FDE68A 50%, #FFF7ED 100%)", border: "#FCD34D" },
    "accessories":  { bg: "linear-gradient(135deg, #FFFBEB 0%, #FDE68A 100%)", border: "#F59E0B" },
  };

  const palette = PALETTES[category.id] || { bg: "var(--ivory)", border: "var(--color-border)" };

  return (
    <button
      onClick={onClick}
      style={{
        background: palette.bg,
        border: `1.5px solid ${palette.border}`,
        borderRadius: "var(--radius-xl)",
        padding: "2rem 1.5rem",
        textAlign: "center",
        cursor: "pointer",
        transition: "var(--transition-normal)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.875rem",
        boxShadow: "var(--shadow-xs)",
        width: "100%",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "var(--shadow-lg)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "var(--shadow-xs)";
      }}
    >
      {category.image ? (
        <div style={{
          width: 88, height: 88, borderRadius: "50%", overflow: "hidden",
          border: "3px solid var(--white)", boxShadow: "var(--shadow-md)", flexShrink: 0,
          background: "var(--ivory)", position: "relative"
        }}>
          <img src={category.image} alt={category.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
        </div>
      ) : (
        <div style={{ fontSize: "3.5rem", lineHeight: 1 }}>{category.emoji}</div>
      )}
      <div>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.25rem",
          fontWeight: 600,
          color: "var(--charcoal)",
          marginBottom: "0.25rem",
        }}>
          {category.label}
        </h2>
        <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
          {count} garment{count !== 1 ? "s" : ""}
          {available > 0 && (
            <span style={{ color: "var(--status-available)", fontWeight: 600, marginLeft: "0.375rem" }}>
              · {available} available
            </span>
          )}
        </p>
      </div>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.375rem",
        color: "var(--color-primary)",
        fontSize: "0.875rem",
        fontWeight: 600,
        fontFamily: "var(--font-ui)",
      }}>
        Browse <ArrowRight size={14} />
      </div>
    </button>
  );
}
