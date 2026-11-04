import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart, BookOpen, Clock, Settings, LogOut, Home,
  ChevronRight, Star, Package, MapPin, Calendar, X, CreditCard, ShieldCheck,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GarmentCard from "../components/GarmentCard";
import RazorpayModal from "../components/RazorpayModal";
import { useAuth, useApp, useFavorites } from "../context/AppContext";
import { GARMENTS } from "../data/garments";
import { SHOPS } from "../data/shops";

const SIDEBAR_ITEMS = [
  { id: "overview",   icon: <Home size={17} />,     label: "Overview" },
  { id: "bookings",   icon: <BookOpen size={17} />, label: "My Bookings" },
  { id: "favorites",  icon: <Heart size={17} />,    label: "Saved Dresses" },
  { id: "recent",     icon: <Clock size={17} />,    label: "Recently Viewed" },
  { id: "profile",    icon: <Settings size={17} />, label: "My Profile" },
];

function BookingCard({ booking, onPayNow }) {
  const garment = GARMENTS.find((g) => g.id === booking.garmentId);
  const shop = SHOPS.find((s) => s.id === booking.shopId);

  return (
    <div style={{ background: "var(--white)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", overflow: "hidden" }}>
      <div style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
        {garment && (
          <div style={{ width: 72, height: 88, borderRadius: "var(--radius-md)", overflow: "hidden", flexShrink: 0, background: "var(--ivory)" }}>
            <img src={garment.image} alt={garment.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => e.target.style.display = "none"} />
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem" }}>
            <div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "0.9375rem", fontWeight: 600, color: "var(--charcoal)", marginBottom: "0.25rem" }}>
                {booking.garmentName}
              </h3>
              <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", marginBottom: "0.375rem" }}>
                <MapPin size={11} style={{ display: "inline", color: "var(--rose-gold)" }} /> {booking.shopName}
              </div>
            </div>
            <span className={`badge ${
              booking.status === "confirmed" ? "badge-available" :
              booking.status === "pending" ? "badge-booked" :
              booking.status === "completed" ? "badge-inspected" : "badge-demo"
            }`}>
              {booking.status}
            </span>
          </div>
          <div style={{ display: "flex", gap: "1rem", fontSize: "0.8125rem", color: "var(--color-text-muted)", flexWrap: "wrap" }}>
            <span><strong>Size:</strong> {booking.size}</span>
            <span><strong>Price:</strong> ₹{booking.rentalPrice}</span>
            {booking.deposit && <span><strong>Deposit:</strong> ₹{booking.deposit}</span>}
            {booking.rentalDate && <span><Calendar size={11} style={{ display: "inline" }} /> {new Date(booking.rentalDate).toLocaleDateString("en-IN")}</span>}
          </div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid var(--color-border-lt)", padding: "0.75rem 1rem", display: "flex", alignItems: "center", gap: "0.625rem", flexWrap: "wrap" }}>
        <Link to={`/garment/${booking.garmentId}`} className="btn btn-ghost btn-sm" style={{ gap: "0.25rem" }}>View Garment</Link>
        <Link to={`/shop/${booking.shopId}`} className="btn btn-ghost btn-sm" style={{ gap: "0.25rem" }}>View Shop</Link>
        
        {booking.status === "pending" && onPayNow && (
          <button
            onClick={() => onPayNow(booking)}
            className="btn btn-sm"
            style={{
              marginLeft: "auto",
              background: "linear-gradient(135deg, #0C2340 0%, #16365C 100%)",
              color: "#FFFFFF",
              border: "1px solid #2563EB",
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              fontSize: "0.75rem",
              fontWeight: 700,
            }}
          >
            <CreditCard size={13} /> Pay with Razorpay
          </button>
        )}

        {booking.status === "confirmed" && (
          <span
            style={{
              marginLeft: "auto",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
              fontSize: "0.6875rem",
              color: "#166534",
              background: "#DCFCE7",
              padding: "0.2rem 0.5rem",
              borderRadius: "var(--radius-full)",
              fontWeight: 700,
            }}
          >
            <ShieldCheck size={12} /> Paid via Razorpay ({booking.paymentId || "pay_verified"})
          </span>
        )}
      </div>
    </div>
  );
}

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [razorpayBooking, setRazorpayBooking] = useState(null);
  const { user, logout } = useAuth();
  const { state, dispatch } = useApp();
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  const handleDashboardPaymentSuccess = (paymentData) => {
    if (!razorpayBooking) return;
    dispatch({
      type: "UPDATE_BOOKING",
      payload: {
        id: razorpayBooking.id,
        status: "confirmed",
        paymentId: paymentData.paymentId,
        paymentMethod: paymentData.method,
        totalPaid: paymentData.amount,
      },
    });
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: `NOTIF-${Date.now()}`,
        title: "Payment Received via Razorpay",
        message: `Payment of ₹${paymentData.amount} verified for ${razorpayBooking.garmentName}.`,
        timestamp: new Date().toISOString(),
        read: false,
      },
    });
  };

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", paddingTop: "var(--nav-height)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
        <Navbar />
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem" }}>Sign in to view your dashboard</h2>
        <Link to="/login" className="btn btn-primary">Sign In</Link>
      </div>
    );
  }

  const favoriteGarments = GARMENTS.filter((g) => favorites.includes(g.id));
  const recentGarments = state.recentlyViewed
    .map((id) => GARMENTS.find((g) => g.id === id))
    .filter(Boolean)
    .slice(0, 6);

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", paddingTop: "var(--nav-height)" }}>
      <Navbar />

      <div style={{ display: "flex", maxWidth: "var(--max-width)", margin: "0 auto" }}>
        {/* Sidebar */}
        <aside className="dashboard__sidebar">
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--color-border)" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.75rem" }}>
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "0.9375rem" }}>{user.name}</div>
            <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>{user.email}</div>
          </div>

          <nav style={{ padding: "0.75rem 0" }}>
            {SIDEBAR_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`sidebar-link ${activeTab === item.id ? "active" : ""}`}
                style={{ width: "100%", textAlign: "left", border: "none", background: "none", cursor: "pointer" }}
              >
                {item.icon} {item.label}
                {item.id === "favorites" && favorites.length > 0 && (
                  <span style={{ marginLeft: "auto", background: "var(--blush)", color: "var(--color-primary)", borderRadius: "99px", padding: "0 6px", fontSize: "0.7rem", fontWeight: 700 }}>{favorites.length}</span>
                )}
                {item.id === "bookings" && state.bookings.length > 0 && (
                  <span style={{ marginLeft: "auto", background: "var(--blush)", color: "var(--color-primary)", borderRadius: "99px", padding: "0 6px", fontSize: "0.7rem", fontWeight: 700 }}>{state.bookings.length}</span>
                )}
              </button>
            ))}
            <div style={{ borderTop: "1px solid var(--color-border-lt)", marginTop: "0.5rem", paddingTop: "0.5rem" }}>
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="sidebar-link"
                style={{ width: "100%", textAlign: "left", border: "none", background: "none", cursor: "pointer", color: "var(--wine)" }}
              >
                <LogOut size={17} /> Sign Out
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: "2rem 2.5rem", minWidth: 0 }}>

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.375rem" }}>
                Welcome back, {user.name?.split(" ")[0]}! 👋
              </h1>
              <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem" }}>Here's a summary of your RentStyle activity.</p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
                {[
                  { label: "Total Bookings", value: state.bookings.length, icon: "📋" },
                  { label: "Saved Dresses", value: favorites.length, icon: "❤️" },
                  { label: "Compare List", value: state.compareList.length, icon: "⚖️" },
                  { label: "Recently Viewed", value: state.recentlyViewed.length, icon: "👁️" },
                ].map((s) => (
                  <div key={s.label} className="stat-card">
                    <div style={{ fontSize: "1.5rem" }}>{s.icon}</div>
                    <div className="stat-card__value">{s.value}</div>
                    <div className="stat-card__label">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 600, marginBottom: "1rem" }}>Quick Actions</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem", marginBottom: "2.5rem" }}>
                {[
                  { to: "/search", label: "Browse Garments", icon: "👗" },
                  { to: "/compare", label: "Open Compare", icon: "⚖️" },
                  { to: "/shops", label: "Explore Shops", icon: "🏪" },
                ].map((a) => (
                  <Link key={a.to} to={a.to} style={{
                    display: "flex", alignItems: "center", gap: "0.875rem",
                    background: "var(--white)", borderRadius: "var(--radius-lg)",
                    padding: "1rem 1.25rem", border: "1px solid var(--color-border)",
                    boxShadow: "var(--shadow-xs)", transition: "var(--transition-fast)",
                    fontFamily: "var(--font-ui)", fontWeight: 600,
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "var(--blush)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "var(--color-border)"}
                  >
                    <span style={{ fontSize: "1.25rem" }}>{a.icon}</span>
                    {a.label}
                    <ChevronRight size={14} style={{ marginLeft: "auto", color: "var(--color-text-muted)" }} />
                  </Link>
                ))}
              </div>

              {/* Recent bookings */}
              {state.bookings.length > 0 && (
                <>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 600, marginBottom: "1rem" }}>Recent Bookings</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {state.bookings.slice(-3).reverse().map((b) => (
                      <BookingCard key={b.id} booking={b} onPayNow={(bk) => setRazorpayBooking(bk)} />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* BOOKINGS */}
          {activeTab === "bookings" && (
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>My Bookings</h1>
              {state.bookings.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem", background: "var(--ivory)", borderRadius: "var(--radius-xl)" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📋</div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", marginBottom: "0.5rem" }}>No bookings yet</h3>
                  <p style={{ color: "var(--color-text-muted)", marginBottom: "1.25rem" }}>Browse garments and book your first rental</p>
                  <Link to="/search" className="btn btn-primary">Browse Garments</Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {[...state.bookings].reverse().map((b) => (
                    <BookingCard key={b.id} booking={b} onPayNow={(bk) => setRazorpayBooking(bk)} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* FAVORITES */}
          {activeTab === "favorites" && (
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>Saved Dresses</h1>
              {favoriteGarments.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem", background: "var(--ivory)", borderRadius: "var(--radius-xl)" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>❤️</div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", marginBottom: "0.5rem" }}>No saved dresses yet</h3>
                  <p style={{ color: "var(--color-text-muted)", marginBottom: "1.25rem" }}>Tap the heart on any garment to save it here</p>
                  <Link to="/search" className="btn btn-primary">Browse Garments</Link>
                </div>
              ) : (
                <div className="grid-auto">
                  {favoriteGarments.map((g) => <GarmentCard key={g.id} garment={g} />)}
                </div>
              )}
            </div>
          )}

          {/* RECENTLY VIEWED */}
          {activeTab === "recent" && (
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>Recently Viewed</h1>
              {recentGarments.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem", background: "var(--ivory)", borderRadius: "var(--radius-xl)" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>👁️</div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", marginBottom: "0.5rem" }}>Nothing viewed yet</h3>
                  <Link to="/search" className="btn btn-primary">Start Browsing</Link>
                </div>
              ) : (
                <div className="grid-auto">
                  {recentGarments.map((g) => <GarmentCard key={g.id} garment={g} />)}
                </div>
              )}
            </div>
          )}

          {/* PROFILE */}
          {activeTab === "profile" && (
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>My Profile</h1>
              <div style={{ background: "var(--white)", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border)", padding: "2rem", maxWidth: 480 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 700 }}>
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "1.0625rem" }}>{user.name}</div>
                    <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>{user.email}</div>
                    <span className="badge badge-pending" style={{ marginTop: "0.25rem" }}>{user.role}</span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="label">Full Name</label>
                  <input className="input" type="text" defaultValue={user.name} />
                </div>
                <div className="form-group">
                  <label className="label">Email</label>
                  <input className="input" type="email" defaultValue={user.email} />
                </div>
                <button className="btn btn-primary" style={{ marginTop: "0.5rem" }}>Save Changes (Demo)</button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Razorpay Standard Checkout Simulation Modal */}
      {razorpayBooking && (
        <RazorpayModal
          isOpen={Boolean(razorpayBooking)}
          onClose={() => setRazorpayBooking(null)}
          garment={
            GARMENTS.find((g) => g.id === razorpayBooking.garmentId) || {
              name: razorpayBooking.garmentName,
              rentalPrice: razorpayBooking.rentalPrice,
              deposit: razorpayBooking.deposit || 1000,
            }
          }
          selectedSize={razorpayBooking.size}
          rentalDate={razorpayBooking.rentalDate}
          shop={SHOPS.find((s) => s.id === razorpayBooking.shopId) || { name: razorpayBooking.shopName }}
          onPaymentSuccess={handleDashboardPaymentSuccess}
        />
      )}

      <Footer />
    </div>
  );
}
