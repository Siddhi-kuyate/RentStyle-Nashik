import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { GitCompare, X, ArrowRight, CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCompare } from "../context/AppContext";
import { SHOPS } from "../data/shops";

const COMPARE_ROWS = [
  { key: "rentalPrice", label: "Rental Price", format: (v) => `₹${v?.toLocaleString() || "—"}` },
  { key: "deposit", label: "Security Deposit", format: (v) => v ? `₹${v.toLocaleString()}` : "—" },
  { key: "shopId", label: "Shop", format: (v) => SHOPS.find((s) => s.id === v)?.name || "—" },
  { key: "shopId", label: "Area", format: (v) => SHOPS.find((s) => s.id === v)?.area || "—" },
  { key: "sizes", label: "Sizes", format: (v) => v?.join(", ") || "—" },
  { key: "colors", label: "Colors", format: (v) => v?.join(", ") || "—" },
  { key: "material", label: "Material", format: (v) => v || "—" },
  { key: "rentalDuration", label: "Rental Duration", format: (v) => v || "—" },
  { key: "availability", label: "Availability", format: (v) => {
    const map = { available: "✅ Available", booked: "⏳ Booked", rented: "🔵 Rented", cleaning: "🧺 Cleaning", repair: "🔧 Repair" };
    return map[v] || v || "—";
  }},
  { key: "condition", label: "Condition", format: (v) => v === "inspected" ? "✅ Inspected" : v || "—" },
  { key: "cleaningStatus", label: "Cleaning", format: (v) => v === "completed" ? "✅ Completed" : v === "in-progress" ? "⏳ In Progress" : v || "—" },
  { key: "occasion", label: "Occasion", format: (v) => v?.join(", ") || "—" },
  { key: "gender", label: "Gender", format: (v) => v || "—" },
];

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const navigate = useNavigate();

  const placeholders = 4 - compareList.length;

  if (compareList.length === 0) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--color-bg)", paddingTop: "var(--nav-height)" }}>
        <Navbar />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "1.5rem", textAlign: "center", padding: "2rem" }}>
          <div style={{ fontSize: "4rem" }}>⚖️</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 600 }}>Compare Garments</h1>
          <p style={{ color: "var(--color-text-muted)", maxWidth: 400, lineHeight: 1.7 }}>
            Add 2–4 garments to compare them side by side across multiple Nashik rental shops. Look for the "Compare" button on any garment card.
          </p>
          <Link to="/search" className="btn btn-primary btn-lg" style={{ gap: "0.5rem" }}>
            Browse Garments <ArrowRight size={16} />
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", paddingTop: "var(--nav-height)" }}>
      <Navbar />

      <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700, color: "var(--charcoal)", marginBottom: "0.25rem" }}>
              Compare Garments
            </h1>
            <p style={{ color: "var(--color-text-muted)" }}>
              {compareList.length} of 4 garments selected. Compare rental price, condition, area and more.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Link to="/search" className="btn btn-ghost btn-sm" style={{ gap: "0.375rem" }}>
              <GitCompare size={14} /> Add More
            </Link>
            <button onClick={clearCompare} className="btn btn-ghost btn-sm" style={{ gap: "0.375rem", color: "var(--wine)" }}>
              <X size={14} /> Clear All
            </button>
          </div>
        </div>

        {/* Garment Headers */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0.75rem 0" }}>
            <thead>
              <tr>
                <th style={{ width: 160, textAlign: "left", verticalAlign: "bottom", paddingBottom: "1rem", fontFamily: "var(--font-ui)", fontSize: "0.8125rem", fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Feature
                </th>
                {compareList.map((garment) => (
                  <th key={garment.id} style={{ textAlign: "center", verticalAlign: "bottom", paddingBottom: "1rem" }}>
                    <div style={{ background: "var(--white)", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border)", overflow: "hidden", position: "relative", boxShadow: "var(--shadow-card)" }}>
                      <button
                        onClick={() => removeFromCompare(garment.id)}
                        style={{
                          position: "absolute", top: "0.5rem", right: "0.5rem",
                          background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer",
                          borderRadius: "50%", width: 24, height: 24,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "var(--wine)", zIndex: 2,
                        }}
                      >
                        <X size={12} />
                      </button>
                      <div style={{ aspectRatio: "3/4", overflow: "hidden", maxHeight: 200 }}>
                        <img
                          src={garment.image}
                          alt={garment.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      </div>
                      <div style={{ padding: "0.875rem" }}>
                        <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.9375rem", color: "var(--charcoal)", marginBottom: "0.375rem", lineHeight: 1.3 }}>
                          {garment.name}
                        </div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "var(--color-primary)" }}>
                          ₹{garment.rentalPrice?.toLocaleString()}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>per rental</div>
                        <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                          <Link
                            to={`/garment/${garment.id}`}
                            className="btn btn-primary btn-sm"
                            style={{ justifyContent: "center" }}
                          >
                            View Details
                          </Link>
                          <Link
                            to={`/shop/${garment.shopId}`}
                            className="btn btn-ghost btn-sm"
                            style={{ justifyContent: "center" }}
                          >
                            View Shop
                          </Link>
                        </div>
                      </div>
                    </div>
                  </th>
                ))}

                {/* Empty Slots */}
                {Array.from({ length: placeholders }).map((_, i) => (
                  <th key={`empty-${i}`} style={{ textAlign: "center", verticalAlign: "bottom", paddingBottom: "1rem" }}>
                    <div
                      onClick={() => navigate("/search")}
                      style={{
                        background: "var(--ivory)", borderRadius: "var(--radius-xl)",
                        border: "2px dashed var(--color-border)", padding: "2rem 1rem",
                        cursor: "pointer", display: "flex", flexDirection: "column",
                        alignItems: "center", gap: "0.75rem", minHeight: 300,
                        justifyContent: "center", transition: "var(--transition-fast)",
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = "var(--color-primary)"}
                      onMouseLeave={e => e.currentTarget.style.borderColor = "var(--color-border)"}
                    >
                      <div style={{ fontSize: "2rem" }}>+</div>
                      <div style={{ fontFamily: "var(--font-ui)", fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text-muted)" }}>Add Garment</div>
                      <Link to="/search" className="btn btn-ghost btn-sm" style={{ fontSize: "0.75rem" }}>Browse</Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {COMPARE_ROWS.map((row, rowI) => (
                <tr key={rowI} style={{ background: rowI % 2 === 0 ? "var(--white)" : "var(--ivory)" }}>
                  <td style={{
                    padding: "0.875rem 1rem", fontFamily: "var(--font-ui)", fontWeight: 600,
                    fontSize: "0.8125rem", color: "var(--color-text-muted)",
                    borderRadius: "var(--radius-sm)", verticalAlign: "middle",
                  }}>
                    {row.label}
                  </td>
                  {compareList.map((garment) => (
                    <td key={garment.id} style={{
                      padding: "0.875rem 1rem", textAlign: "center",
                      fontFamily: "var(--font-ui)", fontSize: "0.875rem", fontWeight: 500,
                      color: "var(--color-text)", borderRadius: "var(--radius-sm)", verticalAlign: "middle",
                    }}>
                      {row.format(garment[row.key])}
                    </td>
                  ))}
                  {Array.from({ length: placeholders }).map((_, i) => (
                    <td key={`ec-${i}`} style={{ padding: "0.875rem", textAlign: "center", color: "var(--color-text-light)" }}>—</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Research Note */}
        <div style={{ marginTop: "2rem", background: "var(--blush-light)", borderRadius: "var(--radius-lg)", padding: "1.25rem", border: "1px solid var(--blush)" }}>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", lineHeight: 1.7 }}>
            <strong style={{ color: "var(--color-primary)" }}>Research Note:</strong>{" "}
            This comparison is based on demo data. RentStyle Nashik presents factual information from listed garments without automatically labelling any option as "best". Customers can make an informed decision based on their own preferences.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
