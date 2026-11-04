import React, { useState, useMemo } from "react";
import {
  Star,
  CheckCircle,
  ThumbsUp,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Filter,
  X,
  Plus,
  ChevronDown,
  Award,
} from "lucide-react";
import {
  getGarmentReviews,
  saveGarmentReview,
  calculateReviewStats,
  voteHelpful,
  hasVotedHelpful,
} from "../data/reviewsData";

export default function ProductReviews({ garment }) {
  const [reviews, setReviews] = useState(() =>
    getGarmentReviews(garment.id, garment.category)
  );
  const [selectedRatingFilter, setSelectedRatingFilter] = useState("all");
  const [selectedOccasionFilter, setSelectedOccasionFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [showModal, setShowModal] = useState(false);
  const [helpfulVotes, setHelpfulVotes] = useState({});
  const [toastMessage, setToastMessage] = useState("");

  // New review form state
  const [formRating, setFormRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [formName, setFormName] = useState("");
  const [formArea, setFormArea] = useState("College Road, Nashik");
  const [formOccasion, setFormOccasion] = useState("Wedding Reception");
  const [formSize, setFormSize] = useState(garment.sizes?.[0] || "M");
  const [formFit, setFormFit] = useState("True to Size");
  const [formTitle, setFormTitle] = useState("");
  const [formComment, setFormComment] = useState("");

  const stats = useMemo(() => calculateReviewStats(reviews), [reviews]);

  // Extract unique occasions for filter pills
  const availableOccasions = useMemo(() => {
    const list = Array.from(new Set(reviews.map((r) => r.occasion).filter(Boolean)));
    return ["all", ...list];
  }, [reviews]);

  // Filtered and sorted reviews
  const filteredReviews = useMemo(() => {
    return reviews
      .filter((r) => {
        if (selectedRatingFilter !== "all" && Math.round(r.rating) !== Number(selectedRatingFilter)) {
          return false;
        }
        if (selectedOccasionFilter !== "all" && r.occasion !== selectedOccasionFilter) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "highest") return b.rating - a.rating;
        if (sortBy === "lowest") return a.rating - b.rating;
        if (sortBy === "helpful") return (b.helpfulCount || 0) - (a.helpfulCount || 0);
        // default recent
        return 0;
      });
  }, [reviews, selectedRatingFilter, selectedOccasionFilter, sortBy]);

  const handleHelpfulClick = (reviewId) => {
    if (helpfulVotes[reviewId] || hasVotedHelpful(reviewId)) return;
    const res = voteHelpful(reviewId);
    if (res.success) {
      setHelpfulVotes((prev) => ({ ...prev, [reviewId]: true }));
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r
        )
      );
      showToast("Thank you for your feedback!");
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!formName.trim() || !formTitle.trim() || !formComment.trim()) {
      alert("Please fill in all required review fields.");
      return;
    }

    const newRev = saveGarmentReview({
      garmentId: garment.id,
      category: garment.category,
      userName: formName.trim(),
      userLocation: formArea,
      rating: formRating,
      title: formTitle.trim(),
      comment: formComment.trim(),
      occasion: formOccasion,
      sizeRented: formSize,
      fit: formFit,
    });

    if (newRev) {
      setReviews((prev) => [newRev, ...prev]);
      setShowModal(false);
      setFormTitle("");
      setFormComment("");
      showToast("✨ Review submitted! Thank you for sharing your experience.");
    }
  };

  const RATING_LABELS = {
    1: "Needs Improvement",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Exceptional & Pristine",
  };

  return (
    <section id="customer-reviews" style={{ marginTop: "4rem", scrollMarginTop: "90px" }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "var(--charcoal)",
            color: "var(--cream)",
            padding: "0.875rem 1.75rem",
            borderRadius: "var(--radius-full)",
            boxShadow: "var(--shadow-xl)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontWeight: 500,
            fontSize: "0.9375rem",
            animation: "slideUp 0.3s ease",
            border: "1px solid var(--rose-gold)",
          }}
        >
          <Sparkles size={16} color="var(--rose-gold)" />
          {toastMessage}
        </div>
      )}

      {/* Section Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "1.75rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "var(--color-primary)",
              fontWeight: 700,
              fontSize: "0.8125rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "0.25rem",
            }}
          >
            <ShieldCheck size={16} />
            Verified Customer Feedback
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              color: "var(--charcoal)",
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            RentStyle Customer Reviews
          </h2>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9375rem" }}>
            Real reviews from Nashik clients who rented this outfit for weddings, parties & galas.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.5rem",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <Plus size={16} /> Write a Review
        </button>
      </div>

      {/* Score Overview Card */}
      <div
        style={{
          background: "var(--white)",
          borderRadius: "var(--radius-xl)",
          padding: "2rem",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-sm)",
          display: "grid",
          gridTemplateColumns: "1.2fr 1.8fr 1.3fr",
          gap: "2.5rem",
          marginBottom: "2.5rem",
        }}
        className="review-summary-grid"
      >
        {/* Left: Big Score */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            borderRight: "1px solid var(--color-border-lt)",
            paddingRight: "1.5rem",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "3.75rem",
              fontWeight: 700,
              color: "var(--color-primary)",
              lineHeight: 1,
              marginBottom: "0.5rem",
            }}
          >
            {stats.averageRating}
          </div>
          <div style={{ display: "flex", gap: "0.25rem", color: "#F59E0B", marginBottom: "0.5rem" }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={20}
                fill={s <= Math.round(stats.averageRating) ? "#F59E0B" : "none"}
                stroke="#F59E0B"
              />
            ))}
          </div>
          <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--charcoal)" }}>
            Based on {stats.totalCount} verified rentals
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              fontSize: "0.8125rem",
              color: "var(--status-available)",
              fontWeight: 600,
              marginTop: "0.5rem",
              background: "#DCFCE7",
              padding: "0.25rem 0.75rem",
              borderRadius: "var(--radius-full)",
            }}
          >
            <CheckCircle size={13} /> {stats.recommendPct}% recommend renting this
          </div>
        </div>

        {/* Center: Rating Breakdown Bars */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "0.625rem" }}>
          {[5, 4, 3, 2, 1].map((stars) => {
            const pct = stats.breakdownPct[stars] || 0;
            const count = stats.breakdown[stars] || 0;
            const isSelected = selectedRatingFilter === String(stars);

            return (
              <div
                key={stars}
                onClick={() =>
                  setSelectedRatingFilter(isSelected ? "all" : String(stars))
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  cursor: "pointer",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "var(--radius-sm)",
                  background: isSelected ? "var(--blush-light)" : "transparent",
                  transition: "var(--transition-fast)",
                }}
                title={`Filter by ${stars} stars`}
              >
                <span
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    width: "42px",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    color: isSelected ? "var(--color-primary)" : "var(--charcoal)",
                  }}
                >
                  {stars} <Star size={12} fill="#F59E0B" stroke="#F59E0B" />
                </span>

                <div
                  style={{
                    flex: 1,
                    height: "8px",
                    background: "var(--ivory)",
                    borderRadius: "var(--radius-full)",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${pct}%`,
                      background: isSelected ? "var(--color-primary)" : "var(--wine)",
                      borderRadius: "var(--radius-full)",
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>

                <span
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: "0.75rem",
                    color: "var(--color-text-muted)",
                    width: "36px",
                    textAlign: "right",
                  }}
                >
                  {count}
                </span>
              </div>
            );
          })}
        </div>

        {/* Right: Fit & Quality Indicators */}
        <div
          style={{
            borderLeft: "1px solid var(--color-border-lt)",
            paddingLeft: "1.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "1.25rem",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.8125rem",
                fontWeight: 600,
                marginBottom: "0.375rem",
              }}
            >
              <span>Fit Assessment</span>
              <span style={{ color: "var(--color-primary)" }}>{stats.fitStats.trueToSize}% True to size</span>
            </div>
            <div
              style={{
                display: "flex",
                height: "6px",
                borderRadius: "var(--radius-full)",
                overflow: "hidden",
                gap: "2px",
              }}
            >
              <div
                style={{
                  width: `${stats.fitStats.runsSmall}%`,
                  background: "var(--rose-gold)",
                  title: "Runs small",
                }}
              />
              <div
                style={{
                  width: `${stats.fitStats.trueToSize}%`,
                  background: "var(--status-available)",
                  title: "True to size",
                }}
              />
              <div
                style={{
                  width: `${stats.fitStats.runsLarge}%`,
                  background: "var(--warm-beige)",
                  title: "Runs large",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.6875rem",
                color: "var(--color-text-muted)",
                marginTop: "0.25rem",
              }}
            >
              <span>Runs Small ({stats.fitStats.runsSmall}%)</span>
              <span>True to Size</span>
              <span>Runs Large ({stats.fitStats.runsLarge}%)</span>
            </div>
          </div>

          <div
            style={{
              background: "var(--ivory)",
              borderRadius: "var(--radius-md)",
              padding: "0.875rem 1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "var(--blush)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-primary)",
              }}
            >
              <Award size={18} />
            </div>
            <div>
              <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--charcoal)" }}>
                Professional Dry Cleaning
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                100% steam sanitized & certified hygienic before every rental
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.75rem",
          flexWrap: "wrap",
          gap: "1rem",
          background: "var(--white)",
          padding: "1rem 1.5rem",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--color-border)",
        }}
      >
        {/* Occasion / Star Filter Chips */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              fontSize: "0.8125rem",
              fontWeight: 700,
              color: "var(--color-text-muted)",
              marginRight: "0.25rem",
            }}
          >
            <Filter size={14} /> Filter:
          </span>

          <button
            onClick={() => setSelectedRatingFilter("all")}
            className={`btn btn-sm ${selectedRatingFilter === "all" ? "btn-primary" : "btn-ghost"}`}
            style={{ borderRadius: "var(--radius-full)", fontSize: "0.75rem" }}
          >
            All Ratings
          </button>
          {[5, 4, 3].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedRatingFilter(String(s))}
              className={`btn btn-sm ${selectedRatingFilter === String(s) ? "btn-primary" : "btn-ghost"}`}
              style={{ borderRadius: "var(--radius-full)", fontSize: "0.75rem" }}
            >
              {s} Stars
            </button>
          ))}

          {/* Occasion selector if multiple */}
          {availableOccasions.length > 2 && (
            <select
              value={selectedOccasionFilter}
              onChange={(e) => setSelectedOccasionFilter(e.target.value)}
              style={{
                padding: "0.35rem 0.75rem",
                borderRadius: "var(--radius-full)",
                border: "1px solid var(--color-border)",
                fontSize: "0.75rem",
                background: "var(--white)",
                color: "var(--charcoal)",
                fontWeight: 600,
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="all">All Occasions</option>
              {availableOccasions.filter((o) => o !== "all").map((occ) => (
                <option key={occ} value={occ}>
                  {occ}
                </option>
              ))}
            </select>
          )}

          {(selectedRatingFilter !== "all" || selectedOccasionFilter !== "all") && (
            <button
              onClick={() => {
                setSelectedRatingFilter("all");
                setSelectedOccasionFilter("all");
              }}
              style={{
                fontSize: "0.75rem",
                color: "var(--color-primary)",
                fontWeight: 600,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.25rem 0.5rem",
              }}
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "0.45rem 1rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border)",
              fontSize: "0.8125rem",
              background: "var(--white)",
              color: "var(--charcoal)",
              fontWeight: 600,
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rating</option>
            <option value="helpful">Most Helpful</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {filteredReviews.length === 0 ? (
          <div
            style={{
              background: "var(--white)",
              borderRadius: "var(--radius-lg)",
              padding: "3rem",
              textAlign: "center",
              border: "1px dashed var(--color-border)",
            }}
          >
            <MessageSquare size={32} style={{ color: "var(--rose-gold)", marginBottom: "0.75rem" }} />
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", marginBottom: "0.5rem" }}>
              No reviews match your selected filters
            </h3>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", marginBottom: "1rem" }}>
              Try adjusting your filter criteria or be the first to write a review with this rating!
            </p>
            <button
              onClick={() => {
                setSelectedRatingFilter("all");
                setSelectedOccasionFilter("all");
              }}
              className="btn btn-secondary btn-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredReviews.map((rev) => {
            const hasVoted = helpfulVotes[rev.id] || hasVotedHelpful(rev.id);
            const initials = rev.userName
              ? rev.userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : "RS";

            return (
              <article
                key={rev.id}
                style={{
                  background: "var(--white)",
                  borderRadius: "var(--radius-lg)",
                  padding: "1.75rem",
                  border: "1px solid var(--color-border-lt)",
                  boxShadow: "var(--shadow-xs)",
                  transition: "var(--transition-fast)",
                }}
              >
                {/* Review Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "1rem",
                    flexWrap: "wrap",
                    gap: "0.75rem",
                  }}
                >
                  {/* User Profile */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, var(--burgundy) 0%, var(--wine) 100%)",
                        color: "var(--cream)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "0.9375rem",
                        letterSpacing: "0.05em",
                        boxShadow: "0 2px 8px rgba(123, 31, 58, 0.2)",
                        flexShrink: 0,
                      }}
                    >
                      {initials}
                    </div>

                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <h4
                          style={{
                            fontFamily: "var(--font-ui)",
                            fontSize: "0.9375rem",
                            fontWeight: 700,
                            color: "var(--charcoal)",
                          }}
                        >
                          {rev.userName}
                        </h4>
                        {rev.verified && (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.25rem",
                              fontSize: "0.6875rem",
                              fontWeight: 700,
                              color: "var(--status-available)",
                              background: "#DCFCE7",
                              padding: "0.15rem 0.5rem",
                              borderRadius: "var(--radius-full)",
                            }}
                          >
                            <ShieldCheck size={11} /> Verified Renter
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.1rem" }}>
                        {rev.userLocation} • {rev.date}
                      </div>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                    <div style={{ display: "flex", gap: "0.15rem", color: "#F59E0B" }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={15}
                          fill={s <= Math.round(rev.rating) ? "#F59E0B" : "none"}
                          stroke="#F59E0B"
                        />
                      ))}
                    </div>
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        color: "var(--color-text-muted)",
                        fontWeight: 600,
                        marginTop: "0.2rem",
                      }}
                    >
                      {RATING_LABELS[Math.round(rev.rating)] || "Verified Experience"}
                    </span>
                  </div>
                </div>

                {/* Rental Details Meta Chips */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                    marginBottom: "1rem",
                  }}
                >
                  {rev.occasion && (
                    <span
                      style={{
                        background: "var(--blush-light)",
                        color: "var(--color-primary)",
                        padding: "0.2rem 0.625rem",
                        borderRadius: "var(--radius-full)",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      ✨ {rev.occasion}
                    </span>
                  )}
                  {rev.sizeRented && (
                    <span
                      style={{
                        background: "var(--ivory)",
                        color: "var(--charcoal)",
                        border: "1px solid var(--color-border-lt)",
                        padding: "0.2rem 0.625rem",
                        borderRadius: "var(--radius-full)",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      Size: {rev.sizeRented}
                    </span>
                  )}
                  {rev.fit && (
                    <span
                      style={{
                        background: "var(--ivory)",
                        color: "var(--charcoal)",
                        border: "1px solid var(--color-border-lt)",
                        padding: "0.2rem 0.625rem",
                        borderRadius: "var(--radius-full)",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      Fit: {rev.fit}
                    </span>
                  )}
                </div>

                {/* Review Body */}
                <h5
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "var(--charcoal)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {rev.title}
                </h5>
                <p
                  style={{
                    fontSize: "0.9375rem",
                    lineHeight: 1.65,
                    color: "var(--charcoal-lt)",
                    marginBottom: "1.25rem",
                  }}
                >
                  {rev.comment}
                </p>

                {/* Helpful Action Footer */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderTop: "1px solid var(--color-border-lt)",
                    paddingTop: "0.875rem",
                  }}
                >
                  <span style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
                    Was this review helpful?
                  </span>
                  <button
                    onClick={() => handleHelpfulClick(rev.id)}
                    disabled={hasVoted}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      background: hasVoted ? "var(--blush-light)" : "var(--ivory)",
                      color: hasVoted ? "var(--color-primary)" : "var(--charcoal)",
                      border: `1px solid ${hasVoted ? "var(--color-primary)" : "var(--color-border)"}`,
                      padding: "0.35rem 0.75rem",
                      borderRadius: "var(--radius-full)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      cursor: hasVoted ? "default" : "pointer",
                      transition: "var(--transition-fast)",
                    }}
                  >
                    <ThumbsUp size={13} fill={hasVoted ? "var(--color-primary)" : "none"} />
                    Helpful ({rev.helpfulCount || 0})
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Write a Review Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(44, 44, 44, 0.65)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
            padding: "1rem",
            animation: "fadeIn 0.2s ease",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div
            style={{
              background: "var(--white)",
              borderRadius: "var(--radius-2xl)",
              width: "100%",
              maxWidth: 580,
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "var(--shadow-xl)",
              border: "1px solid var(--color-border)",
              animation: "scaleIn 0.25s ease",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1.5rem 2rem",
                borderBottom: "1px solid var(--color-border-lt)",
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "var(--charcoal)",
                  }}
                >
                  Write a Verified Review
                </h3>
                <p style={{ color: "var(--color-text-muted)", fontSize: "0.8125rem", marginTop: "0.15rem" }}>
                  Outfit: <strong>{garment.name}</strong>
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "var(--ivory)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-text-muted)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleReviewSubmit} style={{ padding: "2rem" }}>
              {/* Star Rating Selector */}
              <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
                <label className="label" style={{ marginBottom: "0.5rem" }}>
                  Overall Rating *
                </label>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "0.5rem",
                    marginBottom: "0.375rem",
                  }}
                >
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setFormRating(s)}
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "0.25rem",
                        transition: "transform 0.15s ease",
                        transform: (hoverRating || formRating) >= s ? "scale(1.15)" : "scale(1)",
                      }}
                    >
                      <Star
                        size={28}
                        fill={(hoverRating || formRating) >= s ? "#F59E0B" : "none"}
                        stroke="#F59E0B"
                        strokeWidth={1.8}
                      />
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-primary)" }}>
                  {RATING_LABELS[hoverRating || formRating]}
                </div>
              </div>

              {/* Personal Details */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Your Name *</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. Radhika Sharma"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Your Area in Nashik *</label>
                  <select
                    className="input"
                    value={formArea}
                    onChange={(e) => setFormArea(e.target.value)}
                  >
                    <option value="College Road, Nashik">College Road, Nashik</option>
                    <option value="Gangapur Road, Nashik">Gangapur Road, Nashik</option>
                    <option value="Panchavati, Nashik">Panchavati, Nashik</option>
                    <option value="Canada Corner, Nashik">Canada Corner, Nashik</option>
                    <option value="Indira Nagar, Nashik">Indira Nagar, Nashik</option>
                    <option value="Nashik Road, Nashik">Nashik Road, Nashik</option>
                    <option value="Satpur, Nashik">Satpur, Nashik</option>
                    <option value="Cidco, Nashik">Cidco, Nashik</option>
                  </select>
                </div>
              </div>

              {/* Occasion & Sizing */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Occasion Worn</label>
                  <select
                    className="input"
                    value={formOccasion}
                    onChange={(e) => setFormOccasion(e.target.value)}
                  >
                    <option value="Wedding Reception">Wedding Reception</option>
                    <option value="Sangeet Ceremony">Sangeet Ceremony</option>
                    <option value="Cocktail Party">Cocktail Party</option>
                    <option value="Engagement">Engagement</option>
                    <option value="Haldi Ceremony">Haldi Ceremony</option>
                    <option value="Corporate Gala">Corporate Gala</option>
                    <option value="Festival / Diwali">Festival / Diwali</option>
                    <option value="Family Function">Family Function</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Size Rented</label>
                  <select
                    className="input"
                    value={formSize}
                    onChange={(e) => setFormSize(e.target.value)}
                  >
                    {garment.sizes?.map((sz) => (
                      <option key={sz} value={sz}>
                        Size {sz}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Fit Feedback */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label className="label">How was the fit?</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
                  {["Runs Small", "True to Size", "Runs Large"].map((fitOption) => (
                    <button
                      type="button"
                      key={fitOption}
                      onClick={() => setFormFit(fitOption)}
                      style={{
                        padding: "0.5rem 0.25rem",
                        borderRadius: "var(--radius-md)",
                        border: `1.5px solid ${formFit === fitOption ? "var(--color-primary)" : "var(--color-border)"}`,
                        background: formFit === fitOption ? "var(--blush-light)" : "var(--white)",
                        color: formFit === fitOption ? "var(--color-primary)" : "var(--charcoal)",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        cursor: "pointer",
                      }}
                    >
                      {fitOption}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="form-group">
                <label className="label">Review Headline *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Gorgeous embroidery, fit like a glove!"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  required
                />
              </div>

              {/* Detailed Comment */}
              <div className="form-group">
                <label className="label">Detailed Feedback *</label>
                <textarea
                  className="input"
                  rows={4}
                  placeholder="Tell other Nashik renters about fabric feel, cleanliness, compliments received, and return experience..."
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  required
                />
              </div>

              {/* Submit Buttons */}
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-ghost"
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 2, justifyContent: "center" }}
                >
                  Submit Verified Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Responsive styling */}
      <style>{`
        @media (max-width: 900px) {
          .review-summary-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .review-summary-grid > div {
            border: none !important;
            padding: 0 !important;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translate(-50%, 20px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>
    </section>
  );
}
