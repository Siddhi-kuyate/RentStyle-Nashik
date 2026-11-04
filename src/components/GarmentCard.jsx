import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, MapPin, GitCompare, CheckCircle, Clock, Wrench, ShoppingBag, Star } from "lucide-react";
import { useCompare, useFavorites } from "../context/AppContext";
import { SHOPS } from "../data/shops";
import { getGarmentReviews, calculateReviewStats } from "../data/reviewsData";

const STATUS_CONFIG = {
  available:    { label: "Available",     className: "badge-available",  icon: <CheckCircle size={10} /> },
  booked:       { label: "Booked",        className: "badge-booked",     icon: <Clock size={10} /> },
  rented:       { label: "Rented",        className: "badge-rented",     icon: <ShoppingBag size={10} /> },
  returned:     { label: "Returned",      className: "badge-returned",   icon: <CheckCircle size={10} /> },
  cleaning:     { label: "Cleaning",      className: "badge-cleaning",   icon: <Clock size={10} /> },
  repair:       { label: "In Repair",     className: "badge-repair",     icon: <Wrench size={10} /> },
  "final-inspection": { label: "Final Inspection", className: "badge-inspection", icon: <Clock size={10} /> },
};

export default function GarmentCard({ garment, compact = false }) {
  const [imgError, setImgError] = useState(false);
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const { toggleFavorite, isFavorite } = useFavorites();
  const navigate = useNavigate();

  const shop = SHOPS.find((s) => s.id === garment.shopId);
  const statusCfg = STATUS_CONFIG[garment.availability] || STATUS_CONFIG.available;
  const inCompare = isInCompare(garment.id);
  const fav = isFavorite(garment.id);

  const reviewStats = React.useMemo(
    () => calculateReviewStats(getGarmentReviews(garment.id, garment.category)),
    [garment.id, garment.category]
  );

  const handleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) removeFromCompare(garment.id);
    else addToCompare(garment);
  };

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(garment.id);
  };

  return (
    <article className="garment-card" onClick={() => navigate(`/garment/${garment.id}`)}>
      {/* Image */}
      <div className="garment-card__image-wrap">
        {!imgError ? (
          <img
            src={garment.image}
            alt={garment.name}
            className="garment-card__image"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            background: "linear-gradient(135deg, var(--ivory) 0%, var(--blush) 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "3rem",
          }}>
            👗
          </div>
        )}
        <div className="garment-card__overlay" />

        {/* Hover Action Buttons */}
        <div className="garment-card__actions">
          <button
            onClick={handleCompare}
            className="btn btn-sm"
            style={{
              background: inCompare ? "var(--color-primary)" : "rgba(255,255,255,0.92)",
              color: inCompare ? "#fff" : "var(--color-text)",
              backdropFilter: "blur(8px)",
              border: "none",
            }}
          >
            <GitCompare size={13} />
            {inCompare ? "Remove" : "Compare"}
          </button>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/garment/${garment.id}`); }}
            className="btn btn-primary btn-sm"
          >
            View
          </button>
        </div>

        {/* Status Badge */}
        <div className="garment-card__badge">
          <span className={`badge ${statusCfg.className}`}>
            {statusCfg.icon}
            {statusCfg.label}
          </span>
        </div>

        {/* Demo Badge */}
        {garment.isDemo && (
          <div style={{ position: "absolute", top: "0.75rem", right: "2.75rem" }}>
            <span className="badge badge-demo" style={{ fontSize: "0.65rem", padding: "0.15rem 0.4rem" }}>DEMO</span>
          </div>
        )}

        {/* Favorite */}
        <button
          className={`garment-card__favorite ${fav ? "active" : ""}`}
          onClick={handleFavorite}
          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            size={15}
            fill={fav ? "var(--wine)" : "none"}
            stroke={fav ? "var(--wine)" : "var(--color-text-muted)"}
          />
        </button>
      </div>

      {/* Body */}
      <div className="garment-card__body">
        <div>
          <p style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--rose-gold)", marginBottom: "0.25rem" }}>
            {garment.category.replace(/-/g, " ")}
          </p>
          <h3 className="garment-card__name">{garment.name}</h3>
        </div>

        {shop && (
          <div className="garment-card__shop">
            <MapPin size={11} style={{ color: "var(--rose-gold)", flexShrink: 0 }} />
            <span>{shop.name}</span>
            <span style={{ marginLeft: "auto", color: "var(--warm-beige)" }}>•</span>
            <span style={{ marginLeft: "0.25rem" }}>{shop.area}</span>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "0.5rem" }}>
          <span className="garment-card__price">
            ₹{garment.rentalPrice.toLocaleString()} <span>/ rental</span>
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              fontSize: "0.75rem",
              color: "var(--charcoal)",
              fontWeight: 700,
              background: "var(--blush-light)",
              padding: "0.15rem 0.5rem",
              borderRadius: "var(--radius-full)",
            }}
          >
            <Star size={11} fill="#F59E0B" stroke="#F59E0B" />
            <span>{reviewStats.averageRating}</span>
            <span style={{ color: "var(--color-text-muted)", fontSize: "0.6875rem", fontWeight: 500 }}>
              ({reviewStats.totalCount})
            </span>
          </div>
        </div>

        {!compact && (
          <div className="garment-card__meta">
            {garment.sizes.slice(0, 3).map((size) => (
              <span key={size} className="garment-card__tag">{size}</span>
            ))}
            {garment.sizes.length > 3 && (
              <span className="garment-card__tag">+{garment.sizes.length - 3}</span>
            )}
            {garment.colors.slice(0, 2).map((color) => (
              <span key={color} className="garment-card__tag">{color}</span>
            ))}
          </div>
        )}

        {/* Trust Badges */}
        {!compact && (
          <div className="garment-card__trust">
            {garment.condition === "inspected" && (
              <span className="trust-badge">
                <CheckCircle size={12} />
                Inspected
              </span>
            )}
            {garment.cleaningStatus === "completed" && (
              <span className="trust-badge">
                <CheckCircle size={12} />
                Cleaned
              </span>
            )}
          </div>
        )}

        {/* Footer Buttons */}
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
          <button
            className="btn btn-primary btn-sm"
            style={{ flex: 1 }}
            onClick={(e) => { e.stopPropagation(); navigate(`/garment/${garment.id}`); }}
          >
            View Details
          </button>
          {shop && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={(e) => { e.stopPropagation(); navigate(`/shop/${shop.id}`); }}
              title="View Shop"
            >
              <MapPin size={13} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
