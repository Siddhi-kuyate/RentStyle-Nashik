import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users, Package, Home, CheckCircle, AlertTriangle,
  Settings, LogOut, ChevronRight, Shield, Bell, Eye,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AppContext";
import { SHOPS } from "../data/shops";
import { GARMENTS } from "../data/garments";

const SIDEBAR = [
  { id: "overview",  icon: <Home size={17} />,      label: "Overview" },
  { id: "shops",     icon: <Shield size={17} />,    label: "Shop Verification" },
  { id: "garments",  icon: <Package size={17} />,   label: "All Garments" },
  { id: "alerts",    icon: <AlertTriangle size={17} />, label: "Alerts" },
  { id: "settings",  icon: <Settings size={17} />,  label: "Settings" },
];

function AdminStatCard({ icon, label, value, color, bg }) {
  return (
    <div style={{ background: "var(--white)", borderRadius: "var(--radius-xl)", padding: "1.375rem", border: "1px solid var(--color-border-lt)", boxShadow: "var(--shadow-sm)", display: "flex", gap: "1rem", alignItems: "center" }}>
      <div style={{ width: 52, height: 52, borderRadius: "var(--radius-md)", background: bg || `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700, color: color || "var(--color-primary)", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>{label}</div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [shops, setShops] = useState(SHOPS);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== "admin") {
    return (
      <div style={{ minHeight: "100vh", paddingTop: "var(--nav-height)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
        <Navbar />
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem" }}>Admin access required</h2>
        <Link to="/login" className="btn btn-primary">Sign In as Admin</Link>
      </div>
    );
  }

  const verifyShop = (shopId) => {
    setShops((prev) => prev.map((s) => s.id === shopId ? { ...s, verified: true, verificationStatus: "verified" } : s));
  };

  const pendingShops = shops.filter((s) => !s.verified);
  const verifiedShops = shops.filter((s) => s.verified);
  const garmentAlerts = GARMENTS.filter((g) => ["cleaning", "repair"].includes(g.availability));

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", paddingTop: "var(--nav-height)" }}>
      <Navbar />

      <div style={{ display: "flex", maxWidth: "var(--max-width)", margin: "0 auto" }}>
        <aside className="dashboard__sidebar">
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--color-border)", background: "linear-gradient(135deg, var(--blush-light), var(--ivory))" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🛡️</div>
            <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700 }}>RentStyle Admin</div>
            <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>{user.email}</div>
          </div>
          <nav style={{ padding: "0.75rem 0" }}>
            {SIDEBAR.map((item) => (
              <button key={item.id} onClick={() => setActiveTab(item.id)} className={`sidebar-link ${activeTab === item.id ? "active" : ""}`} style={{ width: "100%", textAlign: "left", border: "none", background: "none", cursor: "pointer" }}>
                {item.icon} {item.label}
                {item.id === "alerts" && garmentAlerts.length > 0 && (
                  <span style={{ marginLeft: "auto", background: "#FEE2E2", color: "var(--wine)", borderRadius: "99px", padding: "0 6px", fontSize: "0.7rem", fontWeight: 700 }}>{garmentAlerts.length}</span>
                )}
                {item.id === "shops" && pendingShops.length > 0 && (
                  <span style={{ marginLeft: "auto", background: "#FEF3C7", color: "#92400E", borderRadius: "99px", padding: "0 6px", fontSize: "0.7rem", fontWeight: 700 }}>{pendingShops.length}</span>
                )}
              </button>
            ))}
            <div style={{ borderTop: "1px solid var(--color-border-lt)", marginTop: "0.5rem", paddingTop: "0.5rem" }}>
              <button onClick={() => { logout(); navigate("/"); }} className="sidebar-link" style={{ width: "100%", textAlign: "left", border: "none", background: "none", cursor: "pointer", color: "var(--wine)" }}>
                <LogOut size={17} /> Sign Out
              </button>
            </div>
          </nav>
        </aside>

        <main style={{ flex: 1, padding: "2rem 2.5rem", minWidth: 0 }}>

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.375rem" }}>Admin Dashboard</h1>
              <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem" }}>Platform overview for RentStyle Nashik.</p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
                <AdminStatCard icon="🏪" label="Total Shops" value={shops.length} color="var(--color-primary)" />
                <AdminStatCard icon="✅" label="Verified Shops" value={verifiedShops.length} color="var(--status-available)" />
                <AdminStatCard icon="⏳" label="Pending Verification" value={pendingShops.length} color="var(--status-booked)" />
                <AdminStatCard icon="👗" label="Total Garments" value={GARMENTS.length} color="var(--rose-gold)" />
                <AdminStatCard icon="⚠️" label="Garments Needing Attention" value={garmentAlerts.length} color="var(--status-repair)" />
              </div>

              {/* Pending Shops */}
              {pendingShops.length > 0 && (
                <div style={{ marginBottom: "2rem" }}>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 600, marginBottom: "1rem" }}>⏳ Shops Awaiting Verification</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                    {pendingShops.slice(0, 3).map((shop) => (
                      <div key={shop.id} style={{ background: "var(--white)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ fontSize: "1.5rem" }}>🏪</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: "0.9375rem" }}>{shop.name}</div>
                          <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>{shop.area}, Nashik</div>
                        </div>
                        <span className="badge badge-pending">Pending</span>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <Link to={`/shop/${shop.id}`} className="btn btn-ghost btn-sm"><Eye size={13} /></Link>
                          <button onClick={() => verifyShop(shop.id)} className="btn btn-primary btn-sm" style={{ gap: "0.25rem" }}>
                            <CheckCircle size={13} /> Verify
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Garment Alerts */}
              {garmentAlerts.length > 0 && (
                <div>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 600, marginBottom: "1rem" }}>⚠️ Garments Needing Attention</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                    {garmentAlerts.map((g) => (
                      <div key={g.id} style={{ background: "var(--white)", borderRadius: "var(--radius-lg)", border: `1px solid ${g.availability === "repair" ? "#FEE2E2" : "#ECFEFF"}`, padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ width: 40, height: 48, borderRadius: "var(--radius-sm)", overflow: "hidden", flexShrink: 0, background: "var(--ivory)" }}>
                          <img src={g.image} alt={g.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => e.target.style.display = "none"} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: "0.9rem" }}>{g.name}</div>
                          <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>{g.garmentId}</div>
                        </div>
                        <span className={`badge ${g.availability === "repair" ? "badge-repair" : "badge-cleaning"}`}>
                          {g.availability}
                        </span>
                        <Link to={`/garment/${g.id}`} className="btn btn-ghost btn-sm"><Eye size={13} /></Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SHOP VERIFICATION */}
          {activeTab === "shops" && (
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>Shop Verification</h1>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                {shops.map((shop) => (
                  <div key={shop.id} style={{ background: "var(--white)", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border)", overflow: "hidden" }}>
                    <div style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
                      <div style={{ fontSize: "2rem" }}>🏪</div>
                      <div style={{ flex: 1, minWidth: 240 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
                          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.0625rem" }}>{shop.name}</h3>
                          <span className={`badge ${shop.verified ? "badge-verified" : "badge-pending"}`}>
                            {shop.verified ? "✓ Verified" : "⏳ Pending"}
                          </span>
                        </div>
                        <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>{shop.area}, Nashik</div>
                        <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>
                          Categories: {shop.categories.join(", ")}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "0.625rem" }}>
                        <Link to={`/shop/${shop.id}`} className="btn btn-ghost btn-sm">View Shop</Link>
                        {!shop.verified ? (
                          <button onClick={() => verifyShop(shop.id)} className="btn btn-primary btn-sm" style={{ gap: "0.375rem" }}>
                            <CheckCircle size={13} /> Verify Shop
                          </button>
                        ) : (
                          <button className="btn btn-ghost btn-sm" disabled style={{ opacity: 0.5, cursor: "not-allowed" }}>
                            <CheckCircle size={13} /> Verified
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ALL GARMENTS */}
          {activeTab === "garments" && (
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>All Garments ({GARMENTS.length})</h1>
              <div style={{ background: "var(--white)", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border)", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "var(--ivory)", borderBottom: "1px solid var(--color-border)" }}>
                      {["Garment", "ID", "Shop", "Price", "Status", ""].map((h) => (
                        <th key={h} style={{ padding: "0.875rem 1rem", textAlign: "left", fontFamily: "var(--font-ui)", fontSize: "0.75rem", fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {GARMENTS.map((g, i) => {
                      const shop = SHOPS.find((s) => s.id === g.shopId);
                      return (
                        <tr key={g.id} style={{ borderBottom: "1px solid var(--color-border-lt)", background: i % 2 === 0 ? "var(--white)" : "var(--off-white)" }}>
                          <td style={{ padding: "0.75rem 1rem" }}>
                            <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--charcoal)" }}>{g.name}</div>
                            <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{g.category.replace(/-/g, " ")}</div>
                          </td>
                          <td style={{ padding: "0.75rem 1rem", fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>{g.garmentId}</td>
                          <td style={{ padding: "0.75rem 1rem", fontSize: "0.8125rem" }}>{shop?.name || "—"}</td>
                          <td style={{ padding: "0.75rem 1rem", fontWeight: 700, color: "var(--color-primary)" }}>₹{g.rentalPrice}</td>
                          <td style={{ padding: "0.75rem 1rem" }}>
                            <span className={`badge ${
                              g.availability === "available" ? "badge-available" :
                              g.availability === "booked" ? "badge-booked" :
                              g.availability === "rented" ? "badge-rented" :
                              g.availability === "cleaning" ? "badge-cleaning" :
                              g.availability === "repair" ? "badge-repair" : "badge-demo"
                            }`}>{g.availability}</span>
                          </td>
                          <td style={{ padding: "0.75rem 1rem" }}>
                            <Link to={`/garment/${g.id}`} className="btn btn-ghost btn-sm"><Eye size={13} /></Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ALERTS */}
          {activeTab === "alerts" && (
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>Platform Alerts</h1>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {pendingShops.map((shop) => (
                  <div key={shop.id} style={{ background: "#FEF3C7", borderRadius: "var(--radius-lg)", border: "1px solid #FDE68A", padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "0.875rem" }}>
                    <AlertTriangle size={18} style={{ color: "#92400E", flexShrink: 0 }} />
                    <div style={{ flex: 1, fontSize: "0.875rem" }}>
                      <strong>{shop.name}</strong> is pending verification. Admin action required.
                    </div>
                    <button onClick={() => { verifyShop(shop.id); setActiveTab("shops"); }} className="btn btn-sm" style={{ background: "#92400E", color: "#fff", borderRadius: "var(--radius-full)" }}>
                      Verify Now
                    </button>
                  </div>
                ))}
                {garmentAlerts.map((g) => (
                  <div key={g.id} style={{ background: "#FEE2E2", borderRadius: "var(--radius-lg)", border: "1px solid #FECACA", padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "0.875rem" }}>
                    <AlertTriangle size={18} style={{ color: "var(--status-repair)", flexShrink: 0 }} />
                    <div style={{ flex: 1, fontSize: "0.875rem" }}>
                      <strong>{g.name}</strong> ({g.garmentId}) is currently <strong>{g.availability}</strong>. Check lifecycle status.
                    </div>
                    <Link to={`/garment/${g.id}`} className="btn btn-sm" style={{ background: "var(--status-repair)", color: "#fff", borderRadius: "var(--radius-full)" }}>
                      View
                    </Link>
                  </div>
                ))}
                {pendingShops.length === 0 && garmentAlerts.length === 0 && (
                  <div style={{ textAlign: "center", padding: "3rem", background: "var(--ivory)", borderRadius: "var(--radius-xl)" }}>
                    <CheckCircle size={48} style={{ color: "var(--status-available)", margin: "0 auto 1rem" }} />
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem" }}>All clear!</h3>
                    <p style={{ color: "var(--color-text-muted)" }}>No alerts at this time.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
