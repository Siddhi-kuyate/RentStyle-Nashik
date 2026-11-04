import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Store, User, Phone, Mail, MapPin, Package,
  CheckCircle, Clock, ArrowRight, ChevronRight,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const NASHIK_AREAS = [
  "College Road", "Gangapur Road", "Panchavati", "Canada Corner",
  "Indira Nagar", "Nashik Road", "Satpur", "Cidco", "Other",
];

const CATEGORIES = [
  "Party Wear", "Lehenga", "Wedding Wear", "Sarees", "Bridal Wear",
  "Sherwani", "Suits", "Gowns", "Kids Wear", "Accessories",
];

const INITIAL = {
  shopName: "",
  ownerName: "",
  phone: "",
  email: "",
  area: "",
  address: "",
  categories: [],
  garmentCount: "",
  businessDetails: "",
};

export default function PartnerPage() {
  const [form, setForm] = useState(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const toggleCategory = (cat) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.shopName.trim()) e.shopName = "Shop name is required";
    if (!form.ownerName.trim()) e.ownerName = "Owner name is required";
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone)) e.phone = "Enter a valid 10-digit Indian mobile number";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.area) e.area = "Please select an area";
    if (form.categories.length === 0) e.categories = "Select at least one category";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    // In a real app, POST to API. Here we simulate success.
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--color-bg)", paddingTop: "var(--nav-height)" }}>
        <Navbar />
        <div style={{
          maxWidth: 560, margin: "0 auto", padding: "5rem 1.5rem",
          textAlign: "center",
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "var(--blush-light)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 2rem",
            fontSize: "2.5rem",
          }}>
            ✅
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700, marginBottom: "1rem", color: "var(--charcoal)" }}>
            Application Submitted!
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "1.0625rem", lineHeight: 1.7, marginBottom: "0.75rem" }}>
            Thank you for registering <strong>{form.shopName}</strong>. Your application is now pending admin verification.
          </p>
          <div style={{
            background: "var(--ivory)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-border)",
            padding: "1.25rem 1.5rem",
            marginBottom: "2rem",
            textAlign: "left",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.625rem" }}>
              <Clock size={16} style={{ color: "var(--status-booked)" }} />
              <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Status: Pending Verification</span>
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", lineHeight: 1.6 }}>
              Our team will review your application and contact you at <strong>{form.email}</strong> within 2–3 business days.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/" className="btn btn-primary" style={{ gap: "0.5rem" }}>
              Back to Home <ArrowRight size={15} />
            </Link>
            <Link to="/shops" className="btn btn-secondary">
              View Shop Directory
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", paddingTop: "var(--nav-height)" }}>
      <Navbar />

      {/* Hero */}
      <section style={{
        background: "linear-gradient(135deg, var(--charcoal) 0%, var(--charcoal-lt) 100%)",
        color: "#fff",
        padding: "3.5rem 0",
      }}>
        <div className="container">
          <p style={{ color: "var(--blush)", fontSize: "0.8125rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "0.625rem" }}>
            For Rental Shops
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, marginBottom: "0.75rem", lineHeight: 1.1 }}>
            Become a Partner Shop
          </h1>
          <p style={{ opacity: 0.8, fontSize: "1.0625rem", maxWidth: 540, lineHeight: 1.7 }}>
            Bring your collection online and let customers discover your garments across Nashik.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ background: "var(--ivory)", padding: "3rem 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
            {[
              { emoji: "🌐", title: "Online Discovery", desc: "Customers across Nashik can find your shop and garments." },
              { emoji: "⚖️", title: "Smart Comparison", desc: "Your garments appear in side-by-side comparisons." },
              { emoji: "🔍", title: "Garment Lifecycle", desc: "Build trust with transparent inspection & cleaning tracking." },
              { emoji: "📱", title: "Mobile Friendly", desc: "Your shop looks great on mobile, tablet and desktop." },
            ].map((b) => (
              <div key={b.title} style={{
                background: "var(--white)",
                borderRadius: "var(--radius-xl)",
                padding: "1.5rem",
                border: "1px solid var(--color-border-lt)",
                boxShadow: "var(--shadow-sm)",
                textAlign: "center",
              }}>
                <div style={{ fontSize: "2.25rem", marginBottom: "0.75rem" }}>{b.emoji}</div>
                <h3 style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "1rem", marginBottom: "0.375rem" }}>{b.title}</h3>
                <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", lineHeight: 1.6 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="section">
        <div className="container" style={{ maxWidth: 680 }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem,3vw,2.25rem)", fontWeight: 700, marginBottom: "0.5rem" }}>
              Partner Registration
            </h2>
            <p style={{ color: "var(--color-text-muted)" }}>
              Fill in the details below. Your listing will go live after admin verification.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{
            background: "var(--white)",
            borderRadius: "var(--radius-2xl)",
            padding: "2.5rem",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-card)",
          }}>
            {/* Shop Name */}
            <div className="form-group">
              <label className="label" htmlFor="partner-shop-name">Shop Name *</label>
              <div style={{ position: "relative" }}>
                <Store size={16} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
                <input
                  id="partner-shop-name"
                  className="input"
                  style={{ paddingLeft: "2.5rem" }}
                  placeholder="e.g. Fashion Boutique Rental"
                  value={form.shopName}
                  onChange={(e) => handleChange("shopName", e.target.value)}
                />
              </div>
              {errors.shopName && <p style={{ color: "var(--status-repair)", fontSize: "0.8125rem", marginTop: "0.25rem" }}>{errors.shopName}</p>}
            </div>

            {/* Owner Name */}
            <div className="form-group">
              <label className="label" htmlFor="partner-owner-name">Owner Name *</label>
              <div style={{ position: "relative" }}>
                <User size={16} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
                <input
                  id="partner-owner-name"
                  className="input"
                  style={{ paddingLeft: "2.5rem" }}
                  placeholder="Your full name"
                  value={form.ownerName}
                  onChange={(e) => handleChange("ownerName", e.target.value)}
                />
              </div>
              {errors.ownerName && <p style={{ color: "var(--status-repair)", fontSize: "0.8125rem", marginTop: "0.25rem" }}>{errors.ownerName}</p>}
            </div>

            {/* Phone & Email */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="label" htmlFor="partner-phone">Phone Number *</label>
                <div style={{ position: "relative" }}>
                  <Phone size={16} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
                  <input
                    id="partner-phone"
                    className="input"
                    style={{ paddingLeft: "2.5rem" }}
                    placeholder="10-digit mobile"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                    inputMode="tel"
                  />
                </div>
                {errors.phone && <p style={{ color: "var(--status-repair)", fontSize: "0.8125rem", marginTop: "0.25rem" }}>{errors.phone}</p>}
              </div>
              <div className="form-group">
                <label className="label" htmlFor="partner-email">Email Address *</label>
                <div style={{ position: "relative" }}>
                  <Mail size={16} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
                  <input
                    id="partner-email"
                    className="input"
                    style={{ paddingLeft: "2.5rem" }}
                    type="email"
                    placeholder="shop@example.com"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
                {errors.email && <p style={{ color: "var(--status-repair)", fontSize: "0.8125rem", marginTop: "0.25rem" }}>{errors.email}</p>}
              </div>
            </div>

            {/* Area */}
            <div className="form-group">
              <label className="label" htmlFor="partner-area">Area in Nashik *</label>
              <div style={{ position: "relative" }}>
                <MapPin size={16} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
                <select
                  id="partner-area"
                  className="input"
                  style={{ paddingLeft: "2.5rem", appearance: "none" }}
                  value={form.area}
                  onChange={(e) => handleChange("area", e.target.value)}
                >
                  <option value="">Select area</option>
                  {NASHIK_AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              {errors.area && <p style={{ color: "var(--status-repair)", fontSize: "0.8125rem", marginTop: "0.25rem" }}>{errors.area}</p>}
            </div>

            {/* Address */}
            <div className="form-group">
              <label className="label" htmlFor="partner-address">Shop Address</label>
              <textarea
                id="partner-address"
                className="input"
                style={{ minHeight: 80, resize: "vertical" }}
                placeholder="Full shop address (will be verified before showing publicly)"
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>

            {/* Categories */}
            <div className="form-group">
              <label className="label">Categories You Offer *</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    style={{
                      padding: "0.35rem 0.875rem",
                      borderRadius: "var(--radius-full)",
                      border: `1.5px solid ${form.categories.includes(cat) ? "var(--color-primary)" : "var(--color-border)"}`,
                      background: form.categories.includes(cat) ? "var(--blush-light)" : "transparent",
                      color: form.categories.includes(cat) ? "var(--color-primary)" : "var(--color-text-muted)",
                      fontSize: "0.875rem", cursor: "pointer",
                      fontFamily: "var(--font-ui)", fontWeight: 500,
                      transition: "var(--transition-fast)",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {errors.categories && <p style={{ color: "var(--status-repair)", fontSize: "0.8125rem", marginTop: "0.375rem" }}>{errors.categories}</p>}
            </div>

            {/* Garment Count */}
            <div className="form-group">
              <label className="label" htmlFor="partner-garment-count">Approximate Number of Garments</label>
              <div style={{ position: "relative" }}>
                <Package size={16} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
                <input
                  id="partner-garment-count"
                  className="input"
                  style={{ paddingLeft: "2.5rem" }}
                  placeholder="e.g. 50"
                  value={form.garmentCount}
                  onChange={(e) => handleChange("garmentCount", e.target.value)}
                  type="number"
                  min="1"
                />
              </div>
            </div>

            {/* Business Details */}
            <div className="form-group">
              <label className="label" htmlFor="partner-business">Additional Business Details</label>
              <textarea
                id="partner-business"
                className="input"
                style={{ minHeight: 100, resize: "vertical" }}
                placeholder="Tell us about your shop, how long you've been in business, specialties, etc."
                value={form.businessDetails}
                onChange={(e) => handleChange("businessDetails", e.target.value)}
              />
            </div>

            {/* Status Note */}
            <div style={{
              background: "var(--blush-light)",
              borderRadius: "var(--radius-md)",
              padding: "1rem 1.25rem",
              marginBottom: "1.5rem",
              display: "flex", gap: "0.75rem", alignItems: "flex-start",
            }}>
              <Clock size={16} style={{ color: "var(--status-booked)", flexShrink: 0, marginTop: "0.125rem" }} />
              <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", lineHeight: 1.6 }}>
                <strong style={{ color: "var(--color-text)" }}>Verification Process:</strong> After submission, your application will be reviewed by our admin team. Your shop will appear as "Pending Verification" until approved. Real details will only be shown publicly after verification.
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%", gap: "0.5rem" }}>
              Submit Partner Application <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
