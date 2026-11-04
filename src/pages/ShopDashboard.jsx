import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package, Plus, Settings, LogOut, Home, BookOpen,
  ChevronRight, CheckCircle, Clock, Wrench, Edit2, Trash2, Eye,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AppContext";
import { GARMENTS, LIFECYCLE_STAGES } from "../data/garments";
import { SHOPS } from "../data/shops";

const SIDEBAR = [
  { id: "overview",   icon: <Home size={17} />,    label: "Dashboard" },
  { id: "garments",   icon: <Package size={17} />, label: "My Garments" },
  { id: "bookings",   icon: <BookOpen size={17} />, label: "Bookings" },
  { id: "lifecycle",  icon: <Clock size={17} />,    label: "Lifecycle Manager" },
  { id: "settings",   icon: <Settings size={17} />, label: "Shop Profile" },
];

const STATUS_COLORS = {
  available: "var(--status-available)",
  booked:    "var(--status-booked)",
  rented:    "var(--status-rented)",
  returned:  "var(--status-returned)",
  cleaning:  "var(--status-cleaning)",
  repair:    "var(--status-repair)",
};

const LIFECYCLE_ICONS = {
  Available: "✅", Booked: "📅", Rented: "👗", Returned: "📦",
  Inspection: "🔍", Cleaning: "🧺", Repair: "🔧", "Final Inspection": "✅",
};

function StatCard({ icon, label, value, color = "var(--color-primary)" }) {
  return (
    <div style={{ background: "var(--white)", borderRadius: "var(--radius-xl)", padding: "1.375rem", border: "1px solid var(--color-border-lt)", boxShadow: "var(--shadow-sm)", display: "flex", gap: "1rem", alignItems: "center" }}>
      <div style={{ width: 48, height: 48, borderRadius: "var(--radius-md)", background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.375rem", flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>{label}</div>
      </div>
    </div>
  );
}

export default function ShopDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [garments, setGarments] = useState(GARMENTS.filter((g) => g.shopId === "shop-001")); // demo shop
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedGarment, setSelectedGarment] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role === "customer") {
    return (
      <div style={{ minHeight: "100vh", paddingTop: "var(--nav-height)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
        <Navbar />
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem" }}>Shop Owner access required</h2>
        <Link to="/login" className="btn btn-primary">Sign In as Shop Owner</Link>
      </div>
    );
  }

  const shopName = user.name || "Demo Shop";
  const stats = {
    total: garments.length,
    available: garments.filter((g) => g.availability === "available").length,
    booked: garments.filter((g) => g.availability === "booked").length,
    rented: garments.filter((g) => g.availability === "rented").length,
    cleaning: garments.filter((g) => g.availability === "cleaning").length,
    repair: garments.filter((g) => g.availability === "repair").length,
  };

  const updateGarmentStatus = () => {
    if (!selectedGarment || !newStatus) return;
    setGarments((prev) =>
      prev.map((g) => {
        if (g.id !== selectedGarment.id) return g;
        return {
          ...g,
          availability: newStatus,
          currentStage: newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
          lifecycleHistory: [
            ...(g.lifecycleHistory || []),
            {
              stage: newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
              date: new Date().toLocaleDateString("en-IN"),
              updatedBy: user.name,
              notes: statusNote || "Status updated",
            },
          ],
        };
      })
    );
    setSelectedGarment(null);
    setNewStatus("");
    setStatusNote("");
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", paddingTop: "var(--nav-height)" }}>
      <Navbar />

      <div style={{ display: "flex", maxWidth: "var(--max-width)", margin: "0 auto" }}>
        {/* Sidebar */}
        <aside className="dashboard__sidebar">
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--color-border)" }}>
            <div style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>🏪</div>
            <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "0.9375rem" }}>{shopName}</div>
            <span className="badge badge-pending" style={{ marginTop: "0.375rem" }}>Shop Owner</span>
          </div>
          <nav style={{ padding: "0.75rem 0" }}>
            {SIDEBAR.map((item) => (
              <button key={item.id} onClick={() => setActiveTab(item.id)} className={`sidebar-link ${activeTab === item.id ? "active" : ""}`} style={{ width: "100%", textAlign: "left", border: "none", background: "none", cursor: "pointer" }}>
                {item.icon} {item.label}
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
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.375rem" }}>Shop Dashboard</h1>
              <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem" }}>Manage your garments, bookings and lifecycle status.</p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
                <StatCard icon="👗" label="Total Garments" value={stats.total} />
                <StatCard icon="✅" label="Available" value={stats.available} color="var(--status-available)" />
                <StatCard icon="📅" label="Booked" value={stats.booked} color="var(--status-booked)" />
                <StatCard icon="🧺" label="Cleaning" value={stats.cleaning} color="var(--status-cleaning)" />
                <StatCard icon="🔧" label="In Repair" value={stats.repair} color="var(--status-repair)" />
              </div>

              {/* Quick Actions */}
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 600, marginBottom: "1rem" }}>Quick Actions</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" }}>
                {[
                  { label: "Add New Garment", icon: <Plus size={16} />, action: () => { setShowAddForm(true); setActiveTab("garments"); } },
                  { label: "Manage Bookings", icon: <BookOpen size={16} />, action: () => setActiveTab("bookings") },
                  { label: "Lifecycle Manager", icon: <Clock size={16} />, action: () => setActiveTab("lifecycle") },
                ].map((a) => (
                  <button key={a.label} onClick={a.action} style={{ display: "flex", alignItems: "center", gap: "0.875rem", background: "var(--white)", borderRadius: "var(--radius-lg)", padding: "1rem 1.25rem", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-xs)", cursor: "pointer", fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: "0.9rem", transition: "var(--transition-fast)" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "var(--blush)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "var(--color-border)"}
                  >
                    <span style={{ color: "var(--color-primary)" }}>{a.icon}</span>
                    {a.label}
                    <ChevronRight size={14} style={{ marginLeft: "auto", color: "var(--color-text-muted)" }} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* GARMENTS */}
          {activeTab === "garments" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700 }}>My Garments</h1>
                <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary btn-sm" style={{ gap: "0.375rem" }}>
                  <Plus size={14} /> Add Garment
                </button>
              </div>

              {/* Add Form */}
              {showAddForm && (
                <div style={{ background: "var(--ivory)", borderRadius: "var(--radius-xl)", padding: "1.5rem", border: "1px solid var(--color-border)", marginBottom: "1.5rem" }}>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 600, marginBottom: "1rem" }}>Add New Garment (Demo Form)</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    {[
                      { label: "Garment Name", id: "g-name", type: "text", placeholder: "e.g. Red Lehenga Set" },
                      { label: "Category", id: "g-cat", type: "text", placeholder: "e.g. lehenga" },
                      { label: "Rental Price (₹)", id: "g-price", type: "number", placeholder: "e.g. 1500" },
                      { label: "Deposit (₹)", id: "g-deposit", type: "number", placeholder: "e.g. 3000" },
                    ].map((f) => (
                      <div key={f.id} className="form-group" style={{ marginBottom: 0 }}>
                        <label className="label">{f.label}</label>
                        <input className="input" type={f.type} placeholder={f.placeholder} id={f.id} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
                    <button className="btn btn-primary btn-sm" onClick={() => { alert("Demo: Garment would be saved to backend."); setShowAddForm(false); }}>Save Garment</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setShowAddForm(false)}>Cancel</button>
                  </div>
                </div>
              )}

              {/* Garment Table */}
              <div style={{ background: "var(--white)", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border)", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "var(--ivory)", borderBottom: "1px solid var(--color-border)" }}>
                      {["Garment", "ID", "Category", "Price", "Status", "Actions"].map((h) => (
                        <th key={h} style={{ padding: "0.875rem 1rem", textAlign: "left", fontFamily: "var(--font-ui)", fontSize: "0.75rem", fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {garments.map((g, i) => (
                      <tr key={g.id} style={{ borderBottom: "1px solid var(--color-border-lt)", background: i % 2 === 0 ? "var(--white)" : "var(--off-white)" }}>
                        <td style={{ padding: "0.875rem 1rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <div style={{ width: 44, height: 52, borderRadius: "var(--radius-sm)", overflow: "hidden", flexShrink: 0, background: "var(--ivory)" }}>
                              <img src={g.image} alt={g.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => e.target.style.display = "none"} />
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--charcoal)" }}>{g.name}</div>
                              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{g.sizes.join(", ")}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "0.875rem 1rem", fontFamily: "var(--font-ui)", fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>{g.garmentId}</td>
                        <td style={{ padding: "0.875rem 1rem", fontSize: "0.8125rem" }}>{g.category.replace(/-/g, " ")}</td>
                        <td style={{ padding: "0.875rem 1rem", fontWeight: 700, color: "var(--color-primary)" }}>₹{g.rentalPrice}</td>
                        <td style={{ padding: "0.875rem 1rem" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", fontWeight: 700, color: STATUS_COLORS[g.availability] || "var(--color-text-muted)" }}>
                            <span style={{ width: 7, height: 7, borderRadius: "50%", background: STATUS_COLORS[g.availability] || "var(--color-border)" }} />
                            {g.availability}
                          </span>
                        </td>
                        <td style={{ padding: "0.875rem 1rem" }}>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <Link to={`/garment/${g.id}`} className="btn btn-ghost btn-sm" title="View"><Eye size={13} /></Link>
                            <button className="btn btn-ghost btn-sm" onClick={() => { setSelectedGarment(g); setActiveTab("lifecycle"); }} title="Update Status"><Edit2 size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* LIFECYCLE */}
          {activeTab === "lifecycle" && (
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>Garment Lifecycle Manager</h1>
              <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem" }}>Update garment status after each rental, inspection, cleaning or repair.</p>

              <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "1.5rem" }}>
                {/* Garment Picker */}
                <div>
                  <h2 style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "0.875rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.875rem" }}>Select Garment</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {garments.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => setSelectedGarment(g)}
                        style={{
                          background: selectedGarment?.id === g.id ? "var(--blush-light)" : "var(--white)",
                          border: `1.5px solid ${selectedGarment?.id === g.id ? "var(--color-primary)" : "var(--color-border)"}`,
                          borderRadius: "var(--radius-md)", padding: "0.75rem",
                          cursor: "pointer", textAlign: "left",
                          transition: "var(--transition-fast)",
                        }}
                      >
                        <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: "0.875rem", color: "var(--charcoal)", marginBottom: "0.125rem" }}>{g.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{g.garmentId}</div>
                        <div style={{ marginTop: "0.375rem", fontSize: "0.75rem", fontWeight: 700, color: STATUS_COLORS[g.availability] }}>● {g.availability}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lifecycle Detail */}
                <div>
                  {selectedGarment ? (
                    <div>
                      <div style={{ background: "var(--white)", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border)", padding: "1.5rem", marginBottom: "1.25rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
                          <div style={{ width: 56, height: 68, borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--ivory)", flexShrink: 0 }}>
                            <img src={selectedGarment.image} alt={selectedGarment.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => e.target.style.display = "none"} />
                          </div>
                          <div>
                            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.0625rem", marginBottom: "0.25rem" }}>{selectedGarment.name}</h2>
                            <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>{selectedGarment.garmentId}</div>
                          </div>
                        </div>

                        {/* Status Update */}
                        <h3 style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "0.875rem", marginBottom: "0.75rem" }}>Update Status</h3>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.875rem" }}>
                          {["available", "booked", "rented", "returned", "cleaning", "repair"].map((s) => (
                            <button
                              key={s}
                              onClick={() => setNewStatus(s)}
                              style={{
                                padding: "0.375rem 0.875rem", borderRadius: "var(--radius-full)",
                                border: `2px solid ${newStatus === s ? STATUS_COLORS[s] : "var(--color-border)"}`,
                                background: newStatus === s ? `${STATUS_COLORS[s]}18` : "transparent",
                                color: newStatus === s ? STATUS_COLORS[s] : "var(--color-text-muted)",
                                fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: "0.8125rem",
                                cursor: "pointer", transition: "var(--transition-fast)",
                              }}
                            >
                              {LIFECYCLE_ICONS[s.charAt(0).toUpperCase() + s.slice(1)] || "📋"} {s}
                            </button>
                          ))}
                        </div>
                        <div className="form-group" style={{ marginBottom: "0.875rem" }}>
                          <label className="label">Notes (optional)</label>
                          <input className="input" type="text" placeholder="e.g. Minor stain removed" value={statusNote} onChange={(e) => setStatusNote(e.target.value)} />
                        </div>
                        <button onClick={updateGarmentStatus} className="btn btn-primary btn-sm" disabled={!newStatus} style={{ opacity: newStatus ? 1 : 0.5 }}>
                          <CheckCircle size={14} /> Update Status
                        </button>
                      </div>

                      {/* Lifecycle History */}
                      <div style={{ background: "var(--white)", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border)", padding: "1.5rem" }}>
                        <h3 style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "0.875rem", marginBottom: "1.25rem" }}>Lifecycle History</h3>
                        <div className="lifecycle-timeline">
                          {selectedGarment.lifecycleHistory?.map((event, i) => (
                            <div key={i} className="lifecycle-event">
                              <div className={`lifecycle-dot ${i === selectedGarment.lifecycleHistory.length - 1 ? "active" : "completed"}`} />
                              <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                                  <span>{LIFECYCLE_ICONS[event.stage] || "📋"}</span>
                                  <strong style={{ fontFamily: "var(--font-ui)", fontSize: "0.875rem" }}>{event.stage}</strong>
                                </div>
                                <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                                  {event.date} · by {event.updatedBy} · {event.notes}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: "4rem 2rem", background: "var(--ivory)", borderRadius: "var(--radius-xl)" }}>
                      <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>👗</div>
                      <p style={{ color: "var(--color-text-muted)" }}>Select a garment from the left to view and update its lifecycle</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* BOOKINGS */}
          {activeTab === "bookings" && (
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>Shop Bookings</h1>
              <div style={{ background: "var(--white)", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border)", padding: "2rem", textAlign: "center" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📅</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", marginBottom: "0.5rem" }}>Booking Management</h3>
                <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>Bookings from customers will appear here once the backend is connected. Demo mode active.</p>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {activeTab === "settings" && (
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>Shop Profile</h1>
              <div style={{ background: "var(--white)", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border)", padding: "2rem", maxWidth: 540 }}>
                <div className="form-group"><label className="label">Shop Name</label><input className="input" type="text" defaultValue={shopName} /></div>
                <div className="form-group"><label className="label">Area</label><input className="input" type="text" placeholder="e.g. College Road" /></div>
                <div className="form-group"><label className="label">Phone</label><input className="input" type="tel" placeholder="Will be verified before publishing" /></div>
                <div className="form-group"><label className="label">Address</label><textarea className="input" rows={3} placeholder="Full address (to be verified)" /></div>
                <button className="btn btn-primary" style={{ marginTop: "0.25rem" }}>Save Changes (Demo)</button>
                <p style={{ fontSize: "0.78125rem", color: "var(--color-text-muted)", marginTop: "0.75rem" }}>Changes require admin verification before going live.</p>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
