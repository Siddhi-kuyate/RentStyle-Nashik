import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft, MapPin, CheckCircle, Clock, Wrench, Calendar,
  GitCompare, Heart, Share2, Phone, MessageCircle, Navigation,
  Tag, Info, ChevronRight, Star, Shield, CreditCard,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GarmentCard from "../components/GarmentCard";
import ProductReviews from "../components/ProductReviews";
import RazorpayModal from "../components/RazorpayModal";
import { getGarmentReviews, calculateReviewStats } from "../data/reviewsData";
import { GARMENTS } from "../data/garments";
import { SHOPS } from "../data/shops";
import { useCompare, useFavorites, useApp } from "../context/AppContext";

const STATUS_LABELS = {
  available: { label: "Available", color: "var(--status-available)", bg: "#DCFCE7" },
  booked: { label: "Booked", color: "var(--status-booked)", bg: "#FEF3C7" },
  rented: { label: "Currently Rented", color: "var(--status-rented)", bg: "#DBEAFE" },
  returned: { label: "Returned", color: "var(--status-returned)", bg: "#EDE9FE" },
  cleaning: { label: "Cleaning in Progress", color: "var(--status-cleaning)", bg: "#ECFEFF" },
  repair: { label: "Under Repair", color: "var(--status-repair)", bg: "#FEE2E2" },
};

const LIFECYCLE_ICONS = {
  Available: "✅",
  Booked: "📅",
  Rented: "👗",
  Returned: "📦",
  Inspection: "🔍",
  Cleaning: "🧺",
  Repair: "🔧",
  "Final Inspection": "✅",
};

export default function GarmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { dispatch } = useApp();

  const garment = GARMENTS.find((g) => g.id === id);
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [rentalDate, setRentalDate] = useState("");
  const [showLifecycle, setShowLifecycle] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [showRazorpay, setShowRazorpay] = useState(false);

  if (!garment) {
    return (
      <div style={{ minHeight: "100vh", paddingTop: "var(--nav-height)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
        <Navbar />
        <div style={{ fontSize: "3rem" }}>😕</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem" }}>Garment not found</h2>
        <Link to="/search" className="btn btn-primary">Browse All Garments</Link>
      </div>
    );
  }

  const shop = SHOPS.find((s) => s.id === garment.shopId);
  const statusCfg = STATUS_LABELS[garment.availability] || STATUS_LABELS.available;
  const inCompare = isInCompare(garment.id);
  const fav = isFavorite(garment.id);

  // Review stats for social proof
  const garmentReviews = React.useMemo(
    () => getGarmentReviews(garment.id, garment.category),
    [garment.id, garment.category]
  );
  const reviewStats = React.useMemo(
    () => calculateReviewStats(garmentReviews),
    [garmentReviews]
  );

  // Related garments (same category, different garment)
  const related = GARMENTS.filter((g) => g.category === garment.category && g.id !== garment.id).slice(0, 4);

  const handleBook = () => {
    if (!selectedSize) {
      alert("Please select a size first before proceeding to checkout.");
      return;
    }
    setShowRazorpay(true);
  };

  const handlePaymentSuccess = (paymentData) => {
    dispatch({
      type: "ADD_BOOKING",
      payload: {
        id: `BK-${Date.now()}`,
        garmentId: garment.id,
        garmentName: garment.name,
        shopId: garment.shopId,
        shopName: shop?.name || "Nashik Boutique",
        size: selectedSize,
        rentalDate: rentalDate || new Date().toISOString().split("T")[0],
        rentalPrice: garment.rentalPrice,
        deposit: garment.deposit,
        totalPaid: paymentData.amount,
        paymentId: paymentData.paymentId,
        paymentMethod: paymentData.method,
        status: "confirmed",
        createdAt: new Date().toISOString(),
      },
    });

    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: `NOTIF-${Date.now()}`,
        title: "Booking Confirmed via Razorpay!",
        message: `Your booking for ${garment.name} (Size: ${selectedSize}) is confirmed. Payment ID: ${paymentData.paymentId}`,
        timestamp: new Date().toISOString(),
        read: false,
      },
    });
  };

  // Track recently viewed
  React.useEffect(() => {
    dispatch({ type: "ADD_RECENTLY_VIEWED", payload: garment.id });
  }, [garment.id]);

  const images = garment.images?.length ? garment.images : [garment.image];

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", paddingTop: "var(--nav-height)" }}>
      <Navbar />

      <div className="container" style={{ paddingTop: "1.5rem", paddingBottom: "4rem" }}>
        {/* Breadcrumb */}
        <nav style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
          <Link to="/" style={{ color: "var(--color-text-muted)" }}>Home</Link>
          <ChevronRight size={12} />
          <Link to="/search" style={{ color: "var(--color-text-muted)" }}>Browse</Link>
          <ChevronRight size={12} />
          <Link to={`/search?category=${garment.category}`} style={{ color: "var(--color-text-muted)" }}>{garment.category.replace(/-/g, " ")}</Link>
          <ChevronRight size={12} />
          <span style={{ color: "var(--color-text)" }}>{garment.name}</span>
        </nav>

        <div className="garment-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem" }}>
          {/* Left: Images */}
          <div>
            {/* Main Image */}
            <div style={{
              borderRadius: "var(--radius-xl)", overflow: "hidden",
              aspectRatio: "3/4", background: "var(--ivory)",
              position: "relative", marginBottom: "0.75rem",
              boxShadow: "var(--shadow-md)",
            }}>
              {!imgError ? (
                <img
                  src={images[selectedImg]}
                  alt={garment.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={() => setImgError(true)}
                />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "6rem" }}>👗</div>
              )}

              {garment.isDemo && (
                <div style={{ position: "absolute", top: "1rem", left: "1rem" }}>
                  <span className="badge badge-demo">DEMO DATA</span>
                </div>
              )}
              <div style={{ position: "absolute", top: "1rem", right: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <button
                  onClick={() => toggleFavorite(garment.id)}
                  style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-sm)" }}
                >
                  <Heart size={16} fill={fav ? "var(--wine)" : "none"} stroke={fav ? "var(--wine)" : "var(--color-text-muted)"} />
                </button>
                <button
                  style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-sm)" }}
                  onClick={() => navigator.share?.({ title: garment.name, url: window.location.href }) || alert("Share this URL: " + window.location.href)}
                >
                  <Share2 size={16} style={{ color: "var(--color-text-muted)" }} />
                </button>
              </div>
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div style={{ display: "flex", gap: "0.625rem" }}>
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedImg(i); setImgError(false); }}
                    style={{
                      width: 72, height: 72, borderRadius: "var(--radius-md)",
                      overflow: "hidden", border: `2px solid ${i === selectedImg ? "var(--color-primary)" : "var(--color-border)"}`,
                      cursor: "pointer", padding: 0, flexShrink: 0,
                    }}
                  >
                    <img src={img} alt={`View ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                ))}
              </div>
            )}

            {/* Garment Trust Card */}
            <div style={{ marginTop: "1.25rem", background: "var(--white)", borderRadius: "var(--radius-lg)", padding: "1.25rem", border: "1px solid var(--color-border-lt)" }}>
              <h3 style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "0.875rem", marginBottom: "0.875rem", color: "var(--charcoal)" }}>
                <Shield size={14} style={{ display: "inline", marginRight: "0.375rem", color: "var(--color-primary)" }} />
                Garment Trust
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", fontSize: "0.875rem" }}>
                  <CheckCircle size={15} style={{ color: "var(--status-available)", flexShrink: 0 }} />
                  <span>{garment.condition === "inspected" ? "Condition Inspected" : "Condition: " + garment.condition}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", fontSize: "0.875rem" }}>
                  <CheckCircle size={15} style={{ color: garment.cleaningStatus === "completed" ? "var(--status-available)" : "var(--status-inspection)", flexShrink: 0 }} />
                  <span>{garment.cleaningStatus === "completed" ? "Cleaning Completed" : "Cleaning: " + garment.cleaningStatus}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", fontSize: "0.875rem" }}>
                  <CheckCircle size={15} style={{ color: garment.availability === "available" ? "var(--status-available)" : "var(--status-inspection)", flexShrink: 0 }} />
                  <span>Garment ID: <strong style={{ fontFamily: "var(--font-ui)" }}>{garment.garmentId}</strong></span>
                </div>
              </div>
              <button
                onClick={() => setShowLifecycle(!showLifecycle)}
                style={{ marginTop: "0.875rem", background: "none", border: "none", cursor: "pointer", color: "var(--color-primary)", fontFamily: "var(--font-ui)", fontSize: "0.8125rem", fontWeight: 600, padding: 0, display: "flex", alignItems: "center", gap: "0.25rem" }}
              >
                {showLifecycle ? "Hide" : "View"} Full Lifecycle History
                <ChevronRight size={13} style={{ transform: showLifecycle ? "rotate(90deg)" : "none", transition: "var(--transition-fast)" }} />
              </button>

              {showLifecycle && (
                <div style={{ marginTop: "1rem", borderTop: "1px solid var(--color-border-lt)", paddingTop: "1rem" }}>
                  <div className="lifecycle-timeline">
                    {garment.lifecycleHistory?.map((event, i) => (
                      <div key={i} className="lifecycle-event">
                        <div className={`lifecycle-dot ${i === garment.lifecycleHistory.length - 1 ? "active" : "completed"}`} />
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                            <span style={{ fontSize: "0.8125rem" }}>{LIFECYCLE_ICONS[event.stage] || "📋"}</span>
                            <span style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: "0.8125rem", color: "var(--charcoal)" }}>{event.stage}</span>
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.125rem" }}>
                            {event.date} · {event.notes}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Details */}
          <div>
            {/* Status */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
              <span style={{
                display: "flex", alignItems: "center", gap: "0.375rem",
                background: statusCfg.bg, color: statusCfg.color,
                borderRadius: "var(--radius-full)", padding: "0.3rem 0.875rem",
                fontSize: "0.8125rem", fontWeight: 700,
              }}>
                <CheckCircle size={12} /> {statusCfg.label}
              </span>
              {garment.isDemo && <span className="badge badge-demo">DEMO DATA</span>}
            </div>

            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem,3vw,2.25rem)", fontWeight: 700, color: "var(--charcoal)", marginBottom: "0.5rem", lineHeight: 1.2 }}>
              {garment.name}
            </h1>

            <p style={{ fontSize: "0.8125rem", color: "var(--rose-gold)", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
              {garment.category.replace(/-/g, " ")}
            </p>

            {/* Rating & Review Counter Preview (Click to Jump) */}
            <div
              onClick={() => {
                const el = document.getElementById("customer-reviews");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.625rem",
                marginBottom: "1.25rem",
                cursor: "pointer",
                background: "var(--white)",
                padding: "0.4rem 0.875rem",
                borderRadius: "var(--radius-full)",
                border: "1px solid var(--color-border)",
                boxShadow: "var(--shadow-xs)",
                transition: "var(--transition-fast)",
              }}
              title="Click to view verified reviews"
            >
              <div style={{ display: "flex", gap: "0.15rem", color: "#F59E0B" }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    fill={s <= Math.round(reviewStats.averageRating) ? "#F59E0B" : "none"}
                    stroke="#F59E0B"
                  />
                ))}
              </div>
              <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--charcoal)" }}>
                {reviewStats.averageRating}
              </span>
              <span style={{ fontSize: "0.8125rem", color: "var(--color-primary)", textDecoration: "underline" }}>
                ({reviewStats.totalCount} verified reviews)
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--status-available)", fontWeight: 600 }}>
                • {reviewStats.fitStats.trueToSize}% True to Size
              </span>
            </div>

            {/* Price */}
            <div style={{ background: "var(--ivory)", borderRadius: "var(--radius-lg)", padding: "1rem 1.25rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700, color: "var(--color-primary)" }}>
                  ₹{garment.rentalPrice.toLocaleString()}
                </div>
                <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>per rental ({garment.rentalDuration})</div>
              </div>
              {garment.deposit && (
                <div>
                  <div style={{ fontFamily: "var(--font-ui)", fontSize: "1.125rem", fontWeight: 600, color: "var(--charcoal)" }}>
                    ₹{garment.deposit.toLocaleString()}
                  </div>
                  <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>security deposit</div>
                </div>
              )}
            </div>

            {/* Shop */}
            {shop && (
              <Link to={`/shop/${shop.id}`} style={{
                display: "flex", alignItems: "center", gap: "0.875rem",
                background: "var(--white)", border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)", padding: "0.875rem 1.125rem",
                marginBottom: "1.25rem", transition: "var(--transition-fast)",
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--blush)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--color-border)"}
              >
                <div style={{ width: 42, height: 42, borderRadius: "var(--radius-md)", background: "var(--blush-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", flexShrink: 0 }}>🏪</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: "0.9375rem", color: "var(--charcoal)" }}>{shop.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
                    <MapPin size={11} style={{ color: "var(--rose-gold)" }} />
                    {shop.area}, Nashik
                  </div>
                </div>
                <span className={`badge ${shop.verified ? "badge-verified" : "badge-pending"}`} style={{ fontSize: "0.7rem" }}>
                  {shop.verified ? "✓ Verified" : "⏳ Pending"}
                </span>
                <ChevronRight size={14} style={{ color: "var(--color-text-muted)" }} />
              </Link>
            )}

            {/* Details Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.25rem" }}>
              {[
                { label: "Material", value: garment.material },
                { label: "Gender", value: garment.gender },
                { label: "Duration", value: garment.rentalDuration },
                { label: "Garment ID", value: garment.garmentId },
                { label: "Occasion", value: garment.occasion.join(", ") },
                { label: "Colors", value: garment.colors.join(", ") },
              ].map((item) => (
                <div key={item.label} style={{ background: "var(--white)", borderRadius: "var(--radius-md)", padding: "0.75rem 1rem", border: "1px solid var(--color-border-lt)" }}>
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--color-text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.25rem" }}>{item.label}</div>
                  <div style={{ fontFamily: "var(--font-ui)", fontWeight: 500, fontSize: "0.875rem", color: "var(--charcoal)" }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* Size Selection */}
            <div style={{ marginBottom: "1.25rem" }}>
              <p style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.625rem" }}>
                Select Size {selectedSize && <span style={{ color: "var(--color-primary)" }}>— {selectedSize}</span>}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {garment.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      padding: "0.5rem 1rem", borderRadius: "var(--radius-full)",
                      border: `2px solid ${selectedSize === size ? "var(--color-primary)" : "var(--color-border)"}`,
                      background: selectedSize === size ? "var(--blush-light)" : "transparent",
                      color: selectedSize === size ? "var(--color-primary)" : "var(--color-text-muted)",
                      fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: "0.875rem",
                      cursor: "pointer", transition: "var(--transition-fast)",
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label className="label">Select Rental Date</label>
              <div style={{ position: "relative" }}>
                <Calendar size={15} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)", zIndex: 1 }} />
                <input
                  type="date"
                  className="input"
                  style={{ paddingLeft: "2.5rem" }}
                  value={rentalDate}
                  onChange={(e) => setRentalDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {garment.availability === "available" ? (
                <>
                  <button
                    onClick={handleBook}
                    className="btn btn-primary btn-lg"
                    style={{
                      justifyContent: "center",
                      background: "linear-gradient(135deg, #0C2340 0%, #16365C 100%)",
                      border: "1px solid #2563EB",
                      gap: "0.5rem",
                      boxShadow: "0 4px 16px rgba(12, 35, 64, 0.25)",
                    }}
                  >
                    <CreditCard size={18} /> Rent Now — Pay with Razorpay
                  </button>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}>
                    {shop?.phone !== "Details to be verified" && shop?.phone ? (
                      <a href={`tel:${shop.phone}`} className="btn btn-secondary" style={{ justifyContent: "center", gap: "0.375rem" }}>
                        <Phone size={14} /> Call Shop
                      </a>
                    ) : (
                      <button className="btn btn-ghost" disabled style={{ justifyContent: "center", gap: "0.375rem", opacity: 0.5, cursor: "not-allowed" }} title="Phone to be verified">
                        <Phone size={14} /> Call Shop
                      </button>
                    )}
                    <a href={`https://www.google.com/maps/search/${encodeURIComponent(shop?.name + " " + shop?.area + " Nashik")}`} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ justifyContent: "center", gap: "0.375rem" }}>
                      <Navigation size={14} /> Get Directions
                    </a>
                  </div>
                </>
              ) : (
                <div style={{ background: "var(--ivory)", borderRadius: "var(--radius-lg)", padding: "1rem", textAlign: "center", border: "1px solid var(--color-border)" }}>
                  <p style={{ fontWeight: 600, marginBottom: "0.375rem" }}>Not Available Right Now</p>
                  <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
                    This garment is currently {statusCfg.label.toLowerCase()}. Check back soon!
                  </p>
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}>
                <button
                  onClick={() => inCompare ? removeFromCompare(garment.id) : addToCompare(garment)}
                  className={`btn ${inCompare ? "btn-primary" : "btn-ghost"}`}
                  style={{ justifyContent: "center", gap: "0.375rem" }}
                >
                  <GitCompare size={14} /> {inCompare ? "In Compare" : "Add to Compare"}
                </button>
                <button
                  onClick={() => toggleFavorite(garment.id)}
                  className={`btn ${fav ? "btn-accent" : "btn-ghost"}`}
                  style={{ justifyContent: "center", gap: "0.375rem" }}
                >
                  <Heart size={14} fill={fav ? "#fff" : "none"} /> {fav ? "Saved" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews & Feedback Section */}
        <ProductReviews garment={garment} />

        {/* Razorpay Standard Checkout Simulation Modal */}
        <RazorpayModal
          isOpen={showRazorpay}
          onClose={() => setShowRazorpay(false)}
          garment={garment}
          selectedSize={selectedSize}
          rentalDate={rentalDate}
          shop={shop}
          onPaymentSuccess={handlePaymentSuccess}
        />

        {/* Related Garments */}
        {related.length > 0 && (
          <div style={{ marginTop: "4rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 600 }}>Similar Garments</h2>
              <Link to={`/search?category=${garment.category}`} className="btn btn-ghost btn-sm" style={{ gap: "0.375rem" }}>
                See All <ChevronRight size={13} />
              </Link>
            </div>
            <div className="grid-auto">
              {related.map((g) => <GarmentCard key={g.id} garment={g} />)}
            </div>
          </div>
        )}
      </div>

      <Footer />

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          .garment-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
