import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Share2, Globe, MessageCircle, Mail, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{
      background: "var(--charcoal)",
      color: "rgba(255,255,255,0.75)",
      paddingTop: "4rem",
    }}>
      <div className="container">
        {/* Top Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "3rem",
          paddingBottom: "3rem",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}>
          {/* Brand */}
          <div style={{ gridColumn: "span 1" }}>
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "#fff",
              marginBottom: "0.75rem",
            }}>
              RentStyle<span style={{ color: "var(--rose-gold)" }}>.</span>
            </div>
            <p style={{ fontSize: "0.875rem", lineHeight: 1.7, maxWidth: 260, marginBottom: "1.25rem" }}>
              Discover local fashion rentals across Nashik. Compare, choose, and rent with confidence.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.825rem", marginBottom: "1.25rem" }}>
              <MapPin size={13} style={{ color: "var(--rose-gold)", flexShrink: 0 }} />
              Serving Nashik, Maharashtra
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {[
              { icon: <Share2 size={16} />, href: "#", label: "Instagram" },
                { icon: <Globe size={16} />, href: "#", label: "Facebook" },
                { icon: <MessageCircle size={16} />, href: "#", label: "WhatsApp" },
                { icon: <Mail size={16} />, href: "#", label: "Email" },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  style={{
                    width: 34, height: 34,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "rgba(255,255,255,0.7)",
                    transition: "var(--transition-fast)",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--color-primary)"; e.currentTarget.style.borderColor = "var(--color-primary)"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* For Customers */}
          <div>
            <h4 style={{ color: "#fff", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "0.8125rem", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "1rem" }}>
              For Customers
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {[
                { to: "/search", label: "Browse Collection" },
                { to: "/categories", label: "All Categories" },
                { to: "/shops", label: "Explore Shops" },
                { to: "/compare", label: "Compare Garments" },
                { to: "/how-it-works", label: "How It Works" },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    style={{ fontSize: "0.875rem", transition: "var(--transition-fast)", display: "inline-block" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.paddingLeft = "4px"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = ""; e.currentTarget.style.paddingLeft = "0"; }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Shops */}
          <div>
            <h4 style={{ color: "#fff", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "0.8125rem", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "1rem" }}>
              For Rental Shops
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {[
                { to: "/partner", label: "Become a Partner" },
                { to: "/shop-dashboard", label: "Shop Dashboard" },
                { to: "/garment-lifecycle", label: "Garment Lifecycle" },
                { to: "/login?role=shop", label: "Shop Login" },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    style={{ fontSize: "0.875rem", transition: "var(--transition-fast)", display: "inline-block" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.paddingLeft = "4px"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = ""; e.currentTarget.style.paddingLeft = "0"; }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ color: "#fff", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "0.8125rem", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "1rem" }}>
              Stay Updated
            </h4>
            <p style={{ fontSize: "0.875rem", marginBottom: "1rem" }}>
              Get the latest rental styles and offers from Nashik shops.
            </p>
            <div style={{
              display: "flex",
              background: "rgba(255,255,255,0.08)",
              borderRadius: "var(--radius-full)",
              padding: "0.25rem",
              border: "1px solid rgba(255,255,255,0.12)",
            }}>
              <input
                type="email"
                placeholder="Your email"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  padding: "0.5rem 0.875rem",
                  fontSize: "0.875rem",
                  outline: "none",
                  fontFamily: "var(--font-body)",
                }}
              />
              <button className="btn btn-primary btn-sm" style={{ borderRadius: "var(--radius-full)" }}>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          padding: "1.5rem 0",
          fontSize: "0.8125rem",
        }}>
          <span>© 2026 RentStyle Nashik. All rights reserved. This is a demo prototype.</span>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {[
              { to: "/privacy", label: "Privacy Policy" },
              { to: "/terms", label: "Terms of Use" },
              { to: "/contact", label: "Contact" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                style={{ transition: "var(--transition-fast)" }}
                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                onMouseLeave={e => e.currentTarget.style.color = ""}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
