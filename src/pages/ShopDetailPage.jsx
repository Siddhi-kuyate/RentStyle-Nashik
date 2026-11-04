import React from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Phone, MessageCircle, Navigation, Globe, Clock, CheckCircle, ChevronRight, ExternalLink } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GarmentCard from "../components/GarmentCard";
import { SHOPS } from "../data/shops";
import { GARMENTS } from "../data/garments";

export default function ShopDetailPage() {
  const { id } = useParams();
  const shop = SHOPS.find((s) => s.id === id);

  if (!shop) {
    return (
      <div style={{ minHeight: "100vh", paddingTop: "var(--nav-height)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
        <Navbar />
        <div style={{ fontSize: "3rem" }}>😕</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem" }}>Shop not found</h2>
        <Link to="/shops" className="btn btn-primary">View All Shops</Link>
      </div>
    );
  }

  const shopGarments = GARMENTS.filter((g) => g.shopId === id);
  const availableCount = shopGarments.filter((g) => g.availability === "available").length;

  const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(shop.name + " " + shop.area + " Nashik")}`;

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", paddingTop: "var(--nav-height)" }}>
      <Navbar />

      {/* Shop Hero */}
      <div style={{
        background: "linear-gradient(135deg, var(--ivory) 0%, var(--blush-light) 100%)",
        borderBottom: "1px solid var(--color-border)",
        padding: "3rem 0 2rem",
      }}>
        <div className="container">
          <nav style={{ display: "flex", gap: "0.5rem", fontSize: "0.8125rem", color: "var(--color-text-muted)", marginBottom: "2rem", alignItems: "center" }}>
            <Link to="/" style={{ color: "var(--color-text-muted)" }}>Home</Link>
            <ChevronRight size={12} />
            <Link to="/shops" style={{ color: "var(--color-text-muted)" }}>Shops</Link>
            <ChevronRight size={12} />
            <span style={{ color: "var(--color-text)" }}>{shop.name}</span>
          </nav>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "2rem", flexWrap: "wrap" }}>
            {/* Shop Avatar */}
            <div style={{
              width: 100, height: 100, borderRadius: "var(--radius-xl)",
              overflow: "hidden",
              background: "linear-gradient(135deg, var(--blush) 0%, var(--warm-beige-lt) 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, boxShadow: "var(--shadow-md)",
              border: "3px solid var(--white)",
            }}>
              {shop.image ? (
                <img src={shop.image} alt={shop.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: "3rem" }}>🏪</span>
              )}
            </div>

            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 700, color: "var(--charcoal)" }}>
                  {shop.name}
                </h1>
                <span className={`badge ${shop.verified ? "badge-verified" : "badge-pending"}`}>
                  {shop.verified ? "✓ Verified" : "⏳ Verification Pending"}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-text-muted)", fontSize: "0.9375rem", marginBottom: "0.75rem" }}>
                <MapPin size={14} style={{ color: "var(--rose-gold)", flexShrink: 0 }} />
                {shop.area}, {shop.city}, Maharashtra
              </div>

              <p style={{ color: "var(--color-text-muted)", fontSize: "0.9375rem", lineHeight: 1.6, maxWidth: 540, marginBottom: "1.25rem" }}>
                {shop.description}
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {shop.categories.map((cat) => (
                  <span key={cat} className="garment-card__tag">{cat}</span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", minWidth: 160 }}>
              {[
                { label: "Listed Garments", value: shopGarments.length },
                { label: "Available Now", value: availableCount },
                { label: "Rental Range", value: shop.rentalRange },
              ].map((stat) => (
                <div key={stat.label} style={{ background: "var(--white)", borderRadius: "var(--radius-md)", padding: "0.75rem 1rem", border: "1px solid var(--color-border)", textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1.375rem", fontWeight: 700, color: "var(--color-primary)" }}>
                    {stat.value !== "Details to be verified" ? stat.value : "—"}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontFamily: "var(--font-ui)", marginTop: "0.125rem" }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "2rem" }}>
          {/* Left: Collection */}
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.375rem", fontWeight: 600, marginBottom: "1.25rem" }}>
              Available at {shop.name}
              {shopGarments.length > 0 && <span style={{ color: "var(--color-text-muted)", fontWeight: 400, fontSize: "1rem", marginLeft: "0.5rem" }}>(Demo inventory)</span>}
            </h2>

            {shopGarments.length > 0 ? (
              <div className="grid-auto">
                {shopGarments.map((g) => <GarmentCard key={g.id} garment={g} />)}
              </div>
            ) : (
              <div style={{ background: "var(--ivory)", borderRadius: "var(--radius-xl)", padding: "3rem", textAlign: "center", border: "1px dashed var(--color-border)" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🏷️</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", marginBottom: "0.5rem" }}>No garments listed yet</h3>
                <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
                  This shop is pending verification. Their inventory will appear here once onboarded.
                </p>
              </div>
            )}
          </div>

          {/* Right: Shop Info */}
          <div>
            {/* Contact */}
            <div style={{ background: "var(--white)", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border)", overflow: "hidden", marginBottom: "1.25rem" }}>
              <div style={{ background: "linear-gradient(135deg, var(--color-primary), var(--burgundy-lt))", padding: "1rem 1.25rem" }}>
                <h3 style={{ color: "#fff", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "0.9375rem" }}>Contact This Shop</h3>
              </div>
              <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[
                  {
                    icon: <Navigation size={15} />,
                    label: "Get Directions",
                    action: () => window.open(mapsUrl, "_blank"),
                    primary: true,
                  },
                  {
                    icon: <Phone size={15} />,
                    label: shop.phone === "Details to be verified" ? "Phone: To be verified" : `Call: ${shop.phone}`,
                    action: shop.phone !== "Details to be verified" ? () => window.location.href = `tel:${shop.phone}` : null,
                    disabled: shop.phone === "Details to be verified",
                  },
                  {
                    icon: <MessageCircle size={15} />,
                    label: "WhatsApp (to be verified)",
                    action: null, disabled: !shop.whatsapp,
                  },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={item.action || undefined}
                    disabled={item.disabled || !item.action}
                    className={item.primary ? "btn btn-primary" : "btn btn-ghost"}
                    style={{ justifyContent: "flex-start", gap: "0.625rem", opacity: (item.disabled && !item.primary) ? 0.5 : 1, cursor: (item.disabled && !item.primary) ? "not-allowed" : "pointer" }}
                  >
                    {item.icon} {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Shop Details */}
            <div style={{ background: "var(--white)", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border)", padding: "1.25rem", marginBottom: "1.25rem" }}>
              <h3 style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "0.875rem", marginBottom: "1rem", color: "var(--charcoal)" }}>Shop Information</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[
                  { icon: <MapPin size={14} />, label: "Address", value: shop.address },
                  { icon: <Clock size={14} />, label: "Opening Hours", value: shop.openingHours },
                  { icon: <Globe size={14} />, label: "Website", value: shop.website || "Details to be verified" },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", gap: "0.75rem" }}>
                    <div style={{ color: "var(--rose-gold)", flexShrink: 0, marginTop: "0.125rem" }}>{item.icon}</div>
                    <div>
                      <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{item.label}</div>
                      <div style={{ fontSize: "0.875rem", color: item.value === "Details to be verified" ? "var(--color-text-muted)" : "var(--color-text)", fontStyle: item.value === "Details to be verified" ? "italic" : "normal" }}>
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div style={{ background: "var(--ivory)", borderRadius: "var(--radius-xl)", border: "2px dashed var(--warm-beige)", padding: "2rem", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🗺️</div>
              <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginBottom: "1rem" }}>
                Map integration ready. Configure Google Maps API to show exact shop location.
              </p>
              <a href={mapsUrl} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm" style={{ gap: "0.375rem" }}>
                <ExternalLink size={13} /> Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
