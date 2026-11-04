import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  Search, SlidersHorizontal, X, ChevronDown, ChevronUp, Filter,
  Grid, List, ArrowRight, Camera,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GarmentCard from "../components/GarmentCard";
import { GARMENTS, CATEGORIES, NASHIK_AREAS } from "../data/garments";
import { SHOPS } from "../data/shops";
import { useApp } from "../context/AppContext";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Free Size", "2-3Y", "4-5Y", "6-7Y"];
const OCCASIONS = ["Wedding", "Party", "Festival", "Formal", "Engagement", "Sangeet", "Bridal", "Casual"];
const GENDERS = ["Women", "Men", "Girls", "Boys"];

function FilterSection({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="filter-section">
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", background: "none", border: "none", cursor: "pointer",
          padding: "0 0 0.5rem",
        }}
      >
        <span className="filter-title">{title}</span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

function CheckboxOption({ label, checked, onChange }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", padding: "0.25rem 0", fontSize: "0.875rem", color: "var(--color-text)" }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ accentColor: "var(--color-primary)", width: 14, height: 14 }}
      />
      {label}
    </label>
  );
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    gender: "",
    sizes: [],
    occasions: [],
    areas: [],
    availability: "",
    minPrice: 300,
    maxPrice: 5000,
  });
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid");
  const [imageSearch, setImageSearch] = useState(false);

  // Filter & search garments
  const results = useMemo(() => {
    let list = [...GARMENTS];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.category.toLowerCase().replace(/-/g, " ").includes(q) ||
          g.occasion.some((o) => o.toLowerCase().includes(q)) ||
          g.colors.some((c) => c.toLowerCase().includes(q)) ||
          g.material.toLowerCase().includes(q)
      );
    }
    if (filters.category) list = list.filter((g) => g.category === filters.category);
    if (filters.gender) list = list.filter((g) => g.gender === filters.gender);
    if (filters.sizes.length) list = list.filter((g) => g.sizes.some((s) => filters.sizes.includes(s)));
    if (filters.occasions.length) list = list.filter((g) => g.occasion.some((o) => filters.occasions.includes(o)));
    if (filters.availability) list = list.filter((g) => g.availability === filters.availability);
    if (filters.areas.length) {
      list = list.filter((g) => {
        const shop = SHOPS.find((s) => s.id === g.shopId);
        return shop && filters.areas.includes(shop.area);
      });
    }
    list = list.filter((g) => g.rentalPrice >= filters.minPrice && g.rentalPrice <= filters.maxPrice);

    // Sort
    if (sortBy === "price-asc") list.sort((a, b) => a.rentalPrice - b.rentalPrice);
    else if (sortBy === "price-desc") list.sort((a, b) => b.rentalPrice - a.rentalPrice);
    else if (sortBy === "name") list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [query, filters, sortBy]);

  const toggleFilter = (key, value) => {
    setFilters((prev) => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  };

  const activeFilterCount = [
    filters.category, filters.gender, filters.availability,
    ...filters.sizes, ...filters.occasions, ...filters.areas,
    filters.minPrice > 300 ? "min" : "",
    filters.maxPrice < 5000 ? "max" : "",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setFilters({ category: "", gender: "", sizes: [], occasions: [], areas: [], availability: "", minPrice: 300, maxPrice: 5000 });
    setQuery("");
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", paddingTop: "var(--nav-height)" }}>
      <Navbar />

      {/* Search Header */}
      <div style={{ background: "var(--ivory)", borderBottom: "1px solid var(--color-border)", padding: "1.25rem 0" }}>
        <div className="container">
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{
              flex: 1, minWidth: 280,
              display: "flex", alignItems: "center", gap: "0.75rem",
              background: "var(--white)", border: "1.5px solid var(--color-border)",
              borderRadius: "var(--radius-full)", padding: "0.5rem 1rem",
              boxShadow: "var(--shadow-xs)",
            }}>
              <Search size={16} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search dresses, occasions, colours..."
                style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: "0.9375rem", color: "var(--color-text)", fontFamily: "var(--font-body)" }}
              />
              {query && (
                <button onClick={() => setQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", display: "flex" }}>
                  <X size={15} />
                </button>
              )}
            </div>

            <button
              onClick={() => setImageSearch(!imageSearch)}
              className="btn btn-ghost btn-sm"
              style={{ gap: "0.375rem" }}
              title="Image Search (Demo)"
            >
              <Camera size={15} /> Image Search
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input"
              style={{ width: "auto", borderRadius: "var(--radius-full)", fontSize: "0.875rem" }}
            >
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A–Z</option>
            </select>

            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`btn btn-sm ${filtersOpen ? "btn-primary" : "btn-ghost"}`}
              style={{ gap: "0.375rem" }}
            >
              <Filter size={14} />
              Filters
              {activeFilterCount > 0 && (
                <span style={{ background: filtersOpen ? "rgba(255,255,255,0.3)" : "var(--color-primary)", color: "#fff", borderRadius: "99px", padding: "0 5px", fontSize: "0.7rem", fontWeight: 700 }}>
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Image Search Demo Banner */}
          {imageSearch && (
            <div style={{
              marginTop: "1rem",
              background: "var(--blush-light)",
              border: "2px dashed var(--blush)",
              borderRadius: "var(--radius-lg)",
              padding: "1.5rem",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📸</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", marginBottom: "0.375rem" }}>Image Search — Beta Architecture</h3>
              <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", marginBottom: "1rem" }}>
                Upload a clothing image to find similar garments. Full ML functionality coming in production version.
              </p>
              <label style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                padding: "0.625rem 1.375rem",
                background: "var(--color-primary)", color: "#fff",
                borderRadius: "var(--radius-full)", cursor: "pointer",
                fontFamily: "var(--font-ui)", fontSize: "0.875rem", fontWeight: 600,
              }}>
                <Camera size={15} /> Choose Image (Demo)
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={() => alert("Image search UI is ready. ML backend integration to be added in production.")} />
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="container" style={{ paddingTop: "1.5rem", paddingBottom: "3rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: filtersOpen ? "260px 1fr" : "1fr", gap: "1.5rem" }}>

          {/* Filter Sidebar */}
          {filtersOpen && (
            <aside>
              <div className="filter-panel">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <h2 style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "1rem", color: "var(--color-text)" }}>Filters</h2>
                  {activeFilterCount > 0 && (
                    <button onClick={clearFilters} className="btn btn-ghost btn-sm" style={{ fontSize: "0.75rem", gap: "0.25rem" }}>
                      <X size={12} /> Clear All
                    </button>
                  )}
                </div>

                {/* Category */}
                <FilterSection title="Category">
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                    <CheckboxOption
                      label="All Categories"
                      checked={!filters.category}
                      onChange={() => setFilters((f) => ({ ...f, category: "" }))}
                    />
                    {CATEGORIES.map((cat) => (
                      <CheckboxOption
                        key={cat.id}
                        label={`${cat.emoji} ${cat.label}`}
                        checked={filters.category === cat.id}
                        onChange={() => setFilters((f) => ({ ...f, category: f.category === cat.id ? "" : cat.id }))}
                      />
                    ))}
                  </div>
                </FilterSection>

                {/* Gender */}
                <FilterSection title="Gender">
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                    {GENDERS.map((g) => (
                      <CheckboxOption
                        key={g}
                        label={g}
                        checked={filters.gender === g}
                        onChange={() => setFilters((f) => ({ ...f, gender: f.gender === g ? "" : g }))}
                      />
                    ))}
                  </div>
                </FilterSection>

                {/* Price Range */}
                <FilterSection title="Rental Price">
                  <div style={{ padding: "0.5rem 0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.625rem" }}>
                      <span>₹{filters.minPrice}</span>
                      <span>₹{filters.maxPrice}</span>
                    </div>
                    <input
                      type="range" min={300} max={5000} step={100}
                      value={filters.maxPrice}
                      onChange={(e) => setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) }))}
                      style={{ width: "100%", accentColor: "var(--color-primary)" }}
                    />
                  </div>
                </FilterSection>

                {/* Size */}
                <FilterSection title="Size">
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                    {SIZES.map((size) => (
                      <button
                        key={size}
                        onClick={() => toggleFilter("sizes", size)}
                        style={{
                          padding: "0.25rem 0.625rem",
                          borderRadius: "var(--radius-full)",
                          border: `1.5px solid ${filters.sizes.includes(size) ? "var(--color-primary)" : "var(--color-border)"}`,
                          background: filters.sizes.includes(size) ? "var(--blush-light)" : "transparent",
                          color: filters.sizes.includes(size) ? "var(--color-primary)" : "var(--color-text-muted)",
                          fontSize: "0.8125rem", cursor: "pointer",
                          fontFamily: "var(--font-ui)", fontWeight: 500,
                          transition: "var(--transition-fast)",
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </FilterSection>

                {/* Availability */}
                <FilterSection title="Availability">
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                    {[
                      { value: "", label: "All" },
                      { value: "available", label: "✓ Available" },
                      { value: "booked", label: "⏳ Booked" },
                      { value: "rented", label: "🔵 Rented" },
                    ].map((opt) => (
                      <CheckboxOption
                        key={opt.value}
                        label={opt.label}
                        checked={filters.availability === opt.value}
                        onChange={() => setFilters((f) => ({ ...f, availability: opt.value }))}
                      />
                    ))}
                  </div>
                </FilterSection>

                {/* Area */}
                <FilterSection title="Area">
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                    {NASHIK_AREAS.map((area) => (
                      <CheckboxOption
                        key={area}
                        label={area}
                        checked={filters.areas.includes(area)}
                        onChange={() => toggleFilter("areas", area)}
                      />
                    ))}
                  </div>
                </FilterSection>

                {/* Occasion */}
                <FilterSection title="Occasion">
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                    {OCCASIONS.map((occ) => (
                      <button
                        key={occ}
                        onClick={() => toggleFilter("occasions", occ)}
                        style={{
                          padding: "0.2rem 0.6rem",
                          borderRadius: "var(--radius-full)",
                          border: `1.5px solid ${filters.occasions.includes(occ) ? "var(--color-primary)" : "var(--color-border)"}`,
                          background: filters.occasions.includes(occ) ? "var(--blush-light)" : "transparent",
                          color: filters.occasions.includes(occ) ? "var(--color-primary)" : "var(--color-text-muted)",
                          fontSize: "0.78125rem", cursor: "pointer",
                          fontFamily: "var(--font-ui)", fontWeight: 500,
                          transition: "var(--transition-fast)",
                        }}
                      >
                        {occ}
                      </button>
                    ))}
                  </div>
                </FilterSection>
              </div>
            </aside>
          )}

          {/* Results */}
          <main>
            {/* Results Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
              <div>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 600, color: "var(--charcoal)" }}>
                  {query ? `Results for "${query}"` : filters.category ? CATEGORIES.find((c) => c.id === filters.category)?.label || "All Garments" : "All Garments"}
                </h1>
                <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
                  {results.length} garment{results.length !== 1 ? "s" : ""} found
                  {" "}<span style={{ color: "var(--rose-gold)", fontSize: "0.8rem" }}>(Demo data)</span>
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.375rem" }}>
                <button
                  className={`btn btn-sm ${viewMode === "grid" ? "btn-primary" : "btn-ghost"}`}
                  onClick={() => setViewMode("grid")}
                  title="Grid view"
                >
                  <Grid size={14} />
                </button>
                <button
                  className={`btn btn-sm ${viewMode === "list" ? "btn-primary" : "btn-ghost"}`}
                  onClick={() => setViewMode("list")}
                  title="List view"
                >
                  <List size={14} />
                </button>
              </div>
            </div>

            {/* Active Filter Chips */}
            {activeFilterCount > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem" }}>
                {filters.category && (
                  <span style={{ display: "flex", alignItems: "center", gap: "0.375rem", background: "var(--blush-light)", color: "var(--color-primary)", borderRadius: "var(--radius-full)", padding: "0.25rem 0.75rem", fontSize: "0.8125rem", fontWeight: 600 }}>
                    {CATEGORIES.find((c) => c.id === filters.category)?.label}
                    <button onClick={() => setFilters((f) => ({ ...f, category: "" }))} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", color: "inherit" }}><X size={12} /></button>
                  </span>
                )}
                {filters.gender && (
                  <span style={{ display: "flex", alignItems: "center", gap: "0.375rem", background: "var(--blush-light)", color: "var(--color-primary)", borderRadius: "var(--radius-full)", padding: "0.25rem 0.75rem", fontSize: "0.8125rem", fontWeight: 600 }}>
                    {filters.gender}
                    <button onClick={() => setFilters((f) => ({ ...f, gender: "" }))} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", color: "inherit" }}><X size={12} /></button>
                  </span>
                )}
              </div>
            )}

            {/* No Results */}
            {results.length === 0 && (
              <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.375rem", marginBottom: "0.5rem" }}>No garments found</h2>
                <p style={{ color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>Try adjusting your search or filters</p>
                <button onClick={clearFilters} className="btn btn-primary">Clear All Filters</button>
              </div>
            )}

            {/* Grid / List */}
            {results.length > 0 && (
              <div style={{
                display: "grid",
                gap: "1.25rem",
                gridTemplateColumns: viewMode === "grid" ? "repeat(auto-fill, minmax(260px, 1fr))" : "1fr",
              }}>
                {results.map((garment) => (
                  <GarmentCard key={garment.id} garment={garment} compact={viewMode === "list"} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
