import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";

// ── Eagerly loaded pages ───────────────────────────────────
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import GarmentDetailPage from "./pages/GarmentDetailPage";
import ShopDetailPage from "./pages/ShopDetailPage";
import ComparePage from "./pages/ComparePage";
import { LoginPage, RegisterPage } from "./pages/AuthPages";
import CustomerDashboard from "./pages/CustomerDashboard";
import ShopDashboard from "./pages/ShopDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// ── Lazily loaded pages ────────────────────────────────────
const ShopsListPage  = React.lazy(() => import("./pages/ShopsListPage"));
const CategoriesPage = React.lazy(() => import("./pages/CategoriesPage"));
const PartnerPage    = React.lazy(() => import("./pages/PartnerPage"));

// Global ChatBot Widget
import ChatBot from "./components/ChatBot";

// Simple loading spinner
function PageLoader() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--color-bg)",
      flexDirection: "column",
      gap: "1rem",
    }}>
      <div style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        border: "3px solid var(--blush)",
        borderTopColor: "var(--color-primary)",
        animation: "spin 0.8s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// Simple Forgot Password Page (inline — small enough)
function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", paddingTop: "var(--nav-height)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 400, padding: "2.5rem 1.5rem" }}>
        <div style={{ background: "var(--white)", borderRadius: "var(--radius-2xl)", padding: "2.5rem", boxShadow: "var(--shadow-lg)", border: "1px solid var(--color-border)" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔒</div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 700, color: "var(--charcoal)", marginBottom: "0.5rem" }}>Reset Password</h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.9375rem" }}>Enter your email and we'll send you reset instructions.</p>
          </div>
          {submitted ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>✅</div>
              <p style={{ fontWeight: 600, marginBottom: "0.375rem" }}>Email sent!</p>
              <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>Check your inbox for reset instructions.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
              <div className="form-group">
                <label className="label" htmlFor="forgot-email">Email Address</label>
                <input id="forgot-email" type="email" className="input" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "0.875rem", fontSize: "1rem" }}>
                Send Reset Link
              </button>
            </form>
          )}
          <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
            <a href="/login" style={{ color: "var(--color-primary)", fontWeight: 600 }}>← Back to Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
}

// 404 page
function NotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--color-bg)",
      gap: "1.5rem",
      textAlign: "center",
      padding: "2rem",
    }}>
      <div style={{ fontSize: "5rem" }}>👗</div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 4vw, 3rem)", color: "var(--charcoal)" }}>
        Page Not Found
      </h1>
      <p style={{ color: "var(--color-text-muted)", fontSize: "1.0625rem", maxWidth: 400 }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a href="/" className="btn btn-primary" style={{ textDecoration: "none" }}>
        Back to Home
      </a>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* ── Main pages ──────────────────────────────── */}
            <Route path="/"            element={<HomePage />} />
            <Route path="/search"      element={<SearchPage />} />
            <Route path="/garment/:id" element={<GarmentDetailPage />} />
            <Route path="/shop/:id"    element={<ShopDetailPage />} />
            <Route path="/compare"     element={<ComparePage />} />
            <Route path="/shops"       element={<ShopsListPage />} />
            <Route path="/categories"  element={<CategoriesPage />} />
            <Route path="/partner"     element={<PartnerPage />} />

            {/* ── Auth ────────────────────────────────────── */}
            <Route path="/login"           element={<LoginPage />} />
            <Route path="/register"        element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* ── Customer Dashboard ──────────────────────── */}
            {/* Tabs are managed internally via URL awareness in the component */}
            <Route path="/dashboard"             element={<CustomerDashboard />} />
            <Route path="/dashboard/favorites"   element={<CustomerDashboard />} />
            <Route path="/dashboard/bookings"    element={<CustomerDashboard />} />
            <Route path="/dashboard/history"     element={<CustomerDashboard />} />
            <Route path="/dashboard/profile"     element={<CustomerDashboard />} />

            {/* ── Shop Owner Dashboard ────────────────────── */}
            <Route path="/shop-dashboard"            element={<ShopDashboard />} />
            <Route path="/shop-dashboard/garments"   element={<ShopDashboard />} />
            <Route path="/shop-dashboard/bookings"   element={<ShopDashboard />} />
            <Route path="/shop-dashboard/lifecycle"  element={<ShopDashboard />} />

            {/* ── Admin Dashboard ─────────────────────────── */}
            <Route path="/admin"          element={<AdminDashboard />} />
            <Route path="/admin/shops"    element={<AdminDashboard />} />
            <Route path="/admin/garments" element={<AdminDashboard />} />
            <Route path="/admin/users"    element={<AdminDashboard />} />
            <Route path="/admin/bookings" element={<AdminDashboard />} />

            {/* ── 404 ─────────────────────────────────────── */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <ChatBot />
      </BrowserRouter>
    </AppProvider>
  );
}
