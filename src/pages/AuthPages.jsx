import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AppContext";

// ── Login Page ──────────────────────────────────────────────
export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState("customer");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const DEMO_USERS = {
    customer:   { email: "customer@demo.com", password: "demo123", role: "customer",   name: "Demo Customer" },
    shop_owner: { email: "shop@demo.com",     password: "demo123", role: "shop_owner", name: "Demo Shop Owner" },
    admin:      { email: "admin@demo.com",    password: "demo123", role: "admin",      name: "RentStyle Admin" },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const demo = Object.values(DEMO_USERS).find(
      (u) => u.email === email && u.password === password
    );
    if (demo) {
      login({ id: `u-${Date.now()}`, ...demo });
      navigate(demo.role === "admin" ? "/admin" : demo.role === "shop_owner" ? "/shop-dashboard" : "/dashboard");
    } else {
      setError("Invalid credentials. Use the demo accounts below.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", paddingTop: "var(--nav-height)", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1.25rem" }}>
        <div style={{ width: "100%", maxWidth: 440 }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <Link to="/" style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 700, color: "var(--color-primary)" }}>
              RentStyle<span style={{ color: "var(--rose-gold)" }}>.</span>
            </Link>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 600, marginTop: "1rem" }}>Welcome back</h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", marginTop: "0.375rem" }}>Sign in to your RentStyle Nashik account</p>
          </div>

          {/* Role Tabs */}
          <div style={{ display: "flex", background: "var(--ivory)", borderRadius: "var(--radius-full)", padding: "0.25rem", marginBottom: "1.5rem", gap: "0.25rem" }}>
            {[
              { value: "customer", label: "Customer" },
              { value: "shop_owner", label: "Shop Owner" },
              { value: "admin", label: "Admin" },
            ].map((r) => (
              <button
                key={r.value}
                onClick={() => { setRole(r.value); setEmail(DEMO_USERS[r.value].email); setPassword("demo123"); }}
                style={{
                  flex: 1, padding: "0.5rem", borderRadius: "var(--radius-full)",
                  background: role === r.value ? "var(--white)" : "transparent",
                  border: "none", cursor: "pointer", fontFamily: "var(--font-ui)",
                  fontSize: "0.8125rem", fontWeight: 600,
                  color: role === r.value ? "var(--color-primary)" : "var(--color-text-muted)",
                  boxShadow: role === r.value ? "var(--shadow-sm)" : "none",
                  transition: "var(--transition-fast)",
                }}
              >
                {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ background: "var(--white)", borderRadius: "var(--radius-2xl)", padding: "2rem", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-md)" }}>
            {error && (
              <div style={{ background: "#FEE2E2", color: "var(--status-repair)", borderRadius: "var(--radius-md)", padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "0.875rem" }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="label">Email Address</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                id="login-email"
              />
            </div>

            <div className="form-group">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
                <label className="label" style={{ marginBottom: 0 }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: "0.8125rem", color: "var(--color-primary)" }}>Forgot?</Link>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  id="login-password"
                  style={{ paddingRight: "2.75rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)" }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: "center", padding: "0.875rem", fontSize: "1rem" }}>
              Sign In
            </button>

            {/* Demo Credentials */}
            <div style={{ marginTop: "1rem", background: "var(--ivory)", borderRadius: "var(--radius-md)", padding: "0.875rem", fontSize: "0.8125rem" }}>
              <div style={{ fontWeight: 700, marginBottom: "0.375rem", color: "var(--color-text-muted)" }}>Demo Credentials:</div>
              <div style={{ color: "var(--color-text-muted)" }}>{DEMO_USERS[role].email} / demo123</div>
            </div>
          </form>

          <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "var(--color-primary)", fontWeight: 600 }}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Register Page ───────────────────────────────────────────
export function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer" });
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ id: `u-${Date.now()}`, ...form });
    navigate(form.role === "shop_owner" ? "/shop-dashboard" : "/dashboard");
  };

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", paddingTop: "var(--nav-height)", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1.25rem" }}>
        <div style={{ width: "100%", maxWidth: 480 }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <Link to="/" style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 700, color: "var(--color-primary)" }}>
              RentStyle<span style={{ color: "var(--rose-gold)" }}>.</span>
            </Link>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 600, marginTop: "1rem" }}>Create your account</h1>
          </div>

          <form onSubmit={handleSubmit} style={{ background: "var(--white)", borderRadius: "var(--radius-2xl)", padding: "2rem", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-md)" }}>
            {/* Role */}
            <div className="form-group">
              <label className="label">I am a...</label>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                {[{ value: "customer", label: "👤 Customer" }, { value: "shop_owner", label: "🏪 Shop Owner" }].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => update("role", r.value)}
                    style={{
                      flex: 1, padding: "0.75rem",
                      background: form.role === r.value ? "var(--blush-light)" : "var(--ivory)",
                      border: `2px solid ${form.role === r.value ? "var(--color-primary)" : "var(--color-border)"}`,
                      borderRadius: "var(--radius-md)", cursor: "pointer",
                      fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: "0.875rem",
                      color: form.role === r.value ? "var(--color-primary)" : "var(--color-text-muted)",
                      transition: "var(--transition-fast)",
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="label">Full Name</label>
              <input className="input" type="text" placeholder="Priya Sharma" value={form.name} onChange={(e) => update("name", e.target.value)} required id="reg-name" />
            </div>
            <div className="form-group">
              <label className="label">Email Address</label>
              <input className="input" type="email" placeholder="priya@email.com" value={form.email} onChange={(e) => update("email", e.target.value)} required id="reg-email" />
            </div>
            <div className="form-group">
              <label className="label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"} className="input"
                  placeholder="At least 8 characters" value={form.password}
                  onChange={(e) => update("password", e.target.value)} required id="reg-password"
                  style={{ paddingRight: "2.75rem" }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)" }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: "center", padding: "0.875rem", fontSize: "1rem", marginTop: "0.25rem" }}>
              Create Account <ArrowRight size={16} />
            </button>

            <p style={{ fontSize: "0.78125rem", color: "var(--color-text-muted)", textAlign: "center", marginTop: "1rem" }}>
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>

          <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--color-primary)", fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
