// ============================================================
// RentStyle Nashik — Razorpay Standard Checkout Simulation
// High-fidelity UI with On-Demand QR Reveal, Original PhonePe QR Code,
// Laser Scan Effect, Audio-Tactile Chime & Success Receipt
// ============================================================

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Shield,
  Lock,
  CheckCircle,
  CreditCard,
  QrCode,
  Landmark,
  Wallet,
  Clock,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  Check,
  RefreshCw,
} from "lucide-react";

// Web Audio API chime helper for the iconic payment success sound
function playSuccessChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;

    // First tone (E5 ~ 659Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.18, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Second tone (G#5 ~ 830Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(830.61, now + 0.12);
    gain2.gain.setValueAtTime(0.22, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.85);
  } catch (e) {
    // AudioContext blocked or not supported - silently ignore
  }
}

export default function RazorpayModal({
  isOpen,
  onClose,
  garment,
  selectedSize,
  rentalDate,
  shop,
  onPaymentSuccess,
}) {
  const [activeTab, setActiveTab] = useState("upi"); // 'upi', 'card', 'netbanking', 'wallet'
  const [status, setStatus] = useState("idle"); // 'idle', 'processing', 'success'
  const [isQrRevealed, setIsQrRevealed] = useState(false); // Controls QR visibility & timer start
  const [qrTimer, setQrTimer] = useState(599); // 09:59 seconds
  const [paymentId, setPaymentId] = useState("");
  const [orderId, setOrderId] = useState("");

  // Form states
  const [customerPhone, setCustomerPhone] = useState("+91 98230 45678");
  const [customerEmail, setCustomerEmail] = useState("renter@rentstyle.in");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [selectedBank, setSelectedBank] = useState("HDFC");
  const [selectedWallet, setSelectedWallet] = useState("Paytm");
  const [saveCard, setSaveCard] = useState(true);

  const rentalPrice = garment?.rentalPrice || 0;
  const deposit = garment?.deposit || 0;
  const totalAmount = rentalPrice + deposit;

  // Countdown timer for QR (ONLY active when QR is revealed and payment is idle)
  useEffect(() => {
    if (!isOpen || status !== "idle" || !isQrRevealed) return;
    const interval = setInterval(() => {
      setQrTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, status, isQrRevealed]);

  // Reset modal state on open
  useEffect(() => {
    if (isOpen) {
      setStatus("idle");
      setIsQrRevealed(false);
      setQrTimer(599);
      setPaymentId(`pay_${Math.random().toString(36).substring(2, 11).toUpperCase()}`);
      setOrderId(`order_${Math.random().toString(36).substring(2, 9).toUpperCase()}`);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleRevealQr = () => {
    setIsQrRevealed(true);
    setQrTimer(599); // Start fresh 10-minute timer on reveal
  };

  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.replace(/(\d{4})/g, "$1 ").trim();
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2, 4)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  const triggerPaymentProcessing = (methodName = "UPI") => {
    setStatus("processing");
    setTimeout(() => {
      setStatus("success");
      playSuccessChime();

      if (onPaymentSuccess) {
        onPaymentSuccess({
          paymentId,
          orderId,
          method: methodName,
          amount: totalAmount,
          rentalPrice,
          deposit,
          timestamp: new Date().toISOString(),
        });
      }
    }, 1900);
  };

  const POPULAR_BANKS = [
    { id: "HDFC", name: "HDFC Bank", logo: "🏦" },
    { id: "SBI", name: "State Bank of India", logo: "🏛️" },
    { id: "ICICI", name: "ICICI Bank", logo: "💳" },
    { id: "AXIS", name: "Axis Bank", logo: "🏢" },
    { id: "KOTAK", name: "Kotak Mahindra", logo: "💰" },
    { id: "PNB", name: "Punjab National", logo: "🏪" },
  ];

  const POPULAR_WALLETS = [
    { id: "Paytm", name: "Paytm Wallet", icon: "📱" },
    { id: "PhonePe", name: "PhonePe Wallet", icon: "🟣" },
    { id: "MobiKwik", name: "MobiKwik", icon: "⚡" },
    { id: "AmazonPay", name: "Amazon Pay", icon: "📦" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(10, 22, 38, 0.78)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999999,
        padding: "1rem",
        animation: "rzpFadeIn 0.22s ease-out",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && status !== "processing") onClose();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          boxShadow: "0 28px 70px rgba(0, 0, 0, 0.42), 0 0 0 1px rgba(255,255,255,0.08)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          animation: "rzpPopIn 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        {/* ── RAZORPAY LUXURY HEADER ─────────────────────────── */}
        <div
          style={{
            background: "linear-gradient(135deg, #09192E 0%, #11294A 100%)",
            color: "#FFFFFF",
            padding: "1.25rem 1.5rem",
            position: "relative",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Top Brand & Amount Row with Fixed Spacing */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "0.875rem" }}>
            {/* Merchant Identity */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0, flex: 1 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #7B1F3A 0%, #922B3E 100%)",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "1.0625rem",
                  boxShadow: "0 4px 12px rgba(123, 31, 58, 0.4)",
                  border: "1.5px solid rgba(255,255,255,0.25)",
                  flexShrink: 0,
                }}
              >
                RS
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: "1rem", fontWeight: 700, letterSpacing: "-0.01em", display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap" }}>
                  <span>RentStyle Nashik</span>
                  <span
                    style={{
                      fontSize: "0.625rem",
                      background: "rgba(16, 185, 129, 0.25)",
                      color: "#34D399",
                      padding: "0.15rem 0.4rem",
                      borderRadius: "4px",
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                    }}
                  >
                    VERIFIED
                  </span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.72)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {garment?.name} {selectedSize && `• Size: ${selectedSize}`}
                </div>
              </div>
            </div>

            {/* Total Amount & Close Button Container */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexShrink: 0 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>
                  Amount to Pay
                </div>
                <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
                  ₹{totalAmount.toLocaleString()}
                </div>
              </div>

              {/* Dedicated Close Button (Zero overlap) */}
              {status !== "processing" && (
                <button
                  onClick={onClose}
                  aria-label="Close Razorpay checkout"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    border: "none",
                    borderRadius: "50%",
                    width: 30,
                    height: 30,
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.22)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* User Contact Info Bar */}
          <div
            style={{
              background: "rgba(0, 0, 0, 0.28)",
              borderRadius: "8px",
              padding: "0.5rem 0.875rem",
              fontSize: "0.75rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span>{customerPhone}</span>
              <span style={{ color: "rgba(255,255,255,0.3)" }}>•</span>
              <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "180px" }}>{customerEmail}</span>
            </div>
            <span style={{ fontSize: "0.6875rem", color: "#60A5FA", fontWeight: 700, letterSpacing: "0.02em" }}>
              Razorpay Standard
            </span>
          </div>

          {/* Breakdown summary */}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6875rem", color: "rgba(255,255,255,0.65)", marginTop: "0.45rem", padding: "0 0.25rem" }}>
            <span>Rental: ₹{rentalPrice.toLocaleString()}</span>
            <span style={{ color: "#34D399", fontWeight: 600 }}>Security Deposit: ₹{deposit.toLocaleString()} (100% Refundable)</span>
          </div>
        </div>

        {/* ── SCREEN 1: PAYMENT METHOD SELECTOR & DETAIL ─────── */}
        {status === "idle" && (
          <div style={{ display: "flex", minHeight: "410px" }}>
            {/* Sidebar Navigation */}
            <div
              style={{
                width: "145px",
                backgroundColor: "#F8FAFC",
                borderRight: "1px solid #E2E8F0",
                display: "flex",
                flexDirection: "column",
                flexShrink: 0,
              }}
            >
              {[
                { id: "upi", label: "UPI / QR", icon: <QrCode size={16} />, badge: "Popular" },
                { id: "card", label: "Cards", icon: <CreditCard size={16} /> },
                { id: "netbanking", label: "Netbanking", icon: <Landmark size={16} /> },
                { id: "wallet", label: "Wallets", icon: <Wallet size={16} /> },
              ].map((tab) => {
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      padding: "0.95rem 1rem",
                      background: isSelected ? "#FFFFFF" : "transparent",
                      border: "none",
                      borderLeft: `3px solid ${isSelected ? "#0C2340" : "transparent"}`,
                      color: isSelected ? "#0C2340" : "#64748B",
                      fontWeight: isSelected ? 700 : 500,
                      fontSize: "0.8125rem",
                      cursor: "pointer",
                      textAlign: "left",
                      position: "relative",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ color: isSelected ? "#2563EB" : "#94A3B8" }}>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </div>
                    {tab.badge && (
                      <span
                        style={{
                          fontSize: "0.5625rem",
                          background: "#DCFCE7",
                          color: "#166534",
                          padding: "0.1rem 0.35rem",
                          borderRadius: "4px",
                          fontWeight: 700,
                          marginTop: "0.25rem",
                          marginLeft: "1.5rem",
                        }}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              <div style={{ marginTop: "auto", padding: "0.875rem", borderTop: "1px solid #E2E8F0", fontSize: "0.625rem", color: "#94A3B8", textAlign: "center" }}>
                <Lock size={12} style={{ display: "inline", marginRight: "0.25rem", verticalAlign: "-2px" }} />
                256-bit SSL Encrypted
              </div>
            </div>

            {/* Right Tab Content */}
            <div style={{ flex: 1, padding: "1.25rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              {/* TAB 1: UPI & QR CODE */}
              {activeTab === "upi" && (
                <div>
                  {/* QR Header Row */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                    <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#1E293B" }}>
                      UPI QR Code
                    </div>
                    {isQrRevealed && (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", color: "#DC2626", fontWeight: 700 }}>
                        <Clock size={12} />
                        <span>Expires in {formatTimer(qrTimer)}</span>
                      </div>
                    )}
                  </div>

                  {/* ── STATE A: BEFORE CLICKING "SHOW QR CODE" ─────────── */}
                  {!isQrRevealed ? (
                    <div
                      style={{
                        background: "linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)",
                        border: "1.5px dashed #CBD5E1",
                        borderRadius: "14px",
                        padding: "1.75rem 1.25rem",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        marginBottom: "1rem",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                      }}
                    >
                      <div
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: "50%",
                          background: "#FFFFFF",
                          border: "1px solid #E2E8F0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#2563EB",
                          boxShadow: "0 4px 12px rgba(37, 99, 235, 0.12)",
                          marginBottom: "0.875rem",
                        }}
                      >
                        <QrCode size={26} />
                      </div>

                      <h4 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.25rem" }}>
                        Scan & Pay via UPI QR
                      </h4>
                      <p style={{ fontSize: "0.75rem", color: "#64748B", maxWidth: "260px", lineHeight: 1.4, marginBottom: "1.125rem" }}>
                        Click below to generate and display the real-time PhonePe / UPI QR code for <strong>₹{totalAmount.toLocaleString()}</strong>.
                      </p>

                      <button
                        onClick={handleRevealQr}
                        style={{
                          background: "linear-gradient(135deg, #0C2340 0%, #16365C 100%)",
                          color: "#FFFFFF",
                          border: "none",
                          borderRadius: "8px",
                          padding: "0.625rem 1.25rem",
                          fontSize: "0.8125rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          boxShadow: "0 4px 14px rgba(12, 35, 64, 0.3)",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                      >
                        <Eye size={15} />
                        <span>Show QR Code</span>
                      </button>

                      <div style={{ fontSize: "0.65rem", color: "#94A3B8", marginTop: "0.75rem" }}>
                        Supports PhonePe, Google Pay, Paytm, CRED & BHIM
                      </div>
                    </div>
                  ) : (
                    /* ── STATE B: REAL PHONEPE QR CODE REVEALED ─────────── */
                    <div
                      style={{
                        background: "#FFFFFF",
                        border: "1.5px solid #2563EB",
                        borderRadius: "14px",
                        padding: "1rem",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 8px 24px rgba(37, 99, 235, 0.12)",
                        marginBottom: "0.875rem",
                        position: "relative",
                        animation: "rzpSlideDown 0.3s ease-out",
                      }}
                    >
                      {/* Live Laser Scanning Effect Container */}
                      <div
                        style={{
                          position: "relative",
                          width: 170,
                          height: 170,
                          borderRadius: "10px",
                          overflow: "hidden",
                          border: "1px solid #E2E8F0",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                          background: "#000000",
                        }}
                      >
                        {/* Real User Uploaded PhonePe UPI QR Image */}
                        <img
                          src="/upi-qr.png"
                          alt="PhonePe UPI QR Code"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />

                        {/* High-Tech Animated Laser Line */}
                        <div
                          style={{
                            position: "absolute",
                            left: 0,
                            right: 0,
                            height: "2px",
                            background: "linear-gradient(90deg, transparent, #10B981, #34D399, transparent)",
                            boxShadow: "0 0 10px #10B981, 0 0 4px #34D399",
                            animation: "rzpLaserScan 2.4s ease-in-out infinite",
                            pointerEvents: "none",
                          }}
                        />
                      </div>

                      {/* Brand Pill & Scan Hint */}
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.625rem" }}>
                        <span
                          style={{
                            fontSize: "0.6875rem",
                            fontWeight: 700,
                            color: "#0F172A",
                            background: "#F1F5F9",
                            padding: "0.2rem 0.6rem",
                            borderRadius: "999px",
                          }}
                        >
                          🟣 PhonePe UPI QR
                        </span>
                        <span style={{ fontSize: "0.6875rem", color: "#16A34A", fontWeight: 700 }}>
                          • Active & Verified
                        </span>
                      </div>

                      <div style={{ fontSize: "0.6875rem", color: "#64748B", marginTop: "0.25rem", textAlign: "center" }}>
                        Open your PhonePe / GPay app & scan to pay ₹{totalAmount.toLocaleString()}
                      </div>

                      {/* Instant "Simulate QR Scan Payment" button */}
                      <button
                        onClick={() => triggerPaymentProcessing("PhonePe QR")}
                        style={{
                          marginTop: "0.625rem",
                          background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                          color: "#FFFFFF",
                          border: "none",
                          borderRadius: "6px",
                          padding: "0.4rem 0.875rem",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
                        }}
                      >
                        <Check size={13} />
                        <span>Simulate QR Payment (Test)</span>
                      </button>
                    </div>
                  )}

                  {/* Quick UPI App Fast Pay Simulation Buttons */}
                  <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748B", marginBottom: "0.375rem" }}>
                    Or 1-Click Pay with UPI Apps:
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.75rem" }}>
                    {[
                      { name: "Google Pay", color: "#EA4335", icon: "G" },
                      { name: "PhonePe", color: "#5F259F", icon: "Pe" },
                      { name: "Paytm UPI", color: "#00BAF2", icon: "P" },
                      { name: "CRED UPI", color: "#111827", icon: "C" },
                    ].map((app) => (
                      <button
                        key={app.name}
                        onClick={() => triggerPaymentProcessing(app.name)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          padding: "0.45rem 0.625rem",
                          borderRadius: "8px",
                          border: "1px solid #E2E8F0",
                          background: "#FFFFFF",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color: "#334155",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#2563EB")}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
                      >
                        <span
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            background: app.color,
                            color: "#FFFFFF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.625rem",
                            fontWeight: 800,
                          }}
                        >
                          {app.icon}
                        </span>
                        <span>{app.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Manual UPI ID Input */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.6875rem", fontWeight: 600, color: "#64748B", marginBottom: "0.2rem" }}>
                      Or enter UPI ID / VPA
                    </label>
                    <div style={{ display: "flex", gap: "0.375rem" }}>
                      <input
                        type="text"
                        placeholder="e.g. mobile@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        style={{
                          flex: 1,
                          padding: "0.45rem 0.625rem",
                          borderRadius: "6px",
                          border: "1px solid #CBD5E1",
                          fontSize: "0.75rem",
                          outline: "none",
                        }}
                      />
                      <button
                        onClick={() => triggerPaymentProcessing("UPI ID")}
                        style={{
                          background: "#0C2340",
                          color: "#FFFFFF",
                          border: "none",
                          borderRadius: "6px",
                          padding: "0.45rem 0.875rem",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Verify & Pay
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CREDIT / DEBIT CARDS */}
              {activeTab === "card" && (
                <div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.75rem" }}>
                    Card Information
                  </div>

                  <div style={{ marginBottom: "0.75rem" }}>
                    <label style={{ display: "block", fontSize: "0.6875rem", fontWeight: 600, color: "#64748B", marginBottom: "0.25rem" }}>
                      Card Number
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="text"
                        placeholder="4532 •••• •••• 8892"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        style={{
                          width: "100%",
                          padding: "0.5rem 0.625rem",
                          borderRadius: "6px",
                          border: "1px solid #CBD5E1",
                          fontSize: "0.8125rem",
                          fontFamily: "monospace",
                          outline: "none",
                        }}
                      />
                      <span style={{ position: "absolute", right: "0.625rem", top: "50%", transform: "translateY(-50%)", fontSize: "0.6875rem", color: "#2563EB", fontWeight: 700 }}>
                        VISA / MC
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem", marginBottom: "0.75rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.6875rem", fontWeight: 600, color: "#64748B", marginBottom: "0.25rem" }}>
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        style={{
                          width: "100%",
                          padding: "0.5rem 0.625rem",
                          borderRadius: "6px",
                          border: "1px solid #CBD5E1",
                          fontSize: "0.8125rem",
                          fontFamily: "monospace",
                          outline: "none",
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.6875rem", fontWeight: 600, color: "#64748B", marginBottom: "0.25rem" }}>
                        CVV
                      </label>
                      <input
                        type="password"
                        placeholder="•••"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                        style={{
                          width: "100%",
                          padding: "0.5rem 0.625rem",
                          borderRadius: "6px",
                          border: "1px solid #CBD5E1",
                          fontSize: "0.8125rem",
                          fontFamily: "monospace",
                          outline: "none",
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "0.75rem" }}>
                    <label style={{ display: "block", fontSize: "0.6875rem", fontWeight: 600, color: "#64748B", marginBottom: "0.25rem" }}>
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Radhika Sharma"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.5rem 0.625rem",
                        borderRadius: "6px",
                        border: "1px solid #CBD5E1",
                        fontSize: "0.8125rem",
                        outline: "none",
                      }}
                    />
                  </div>

                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.6875rem", color: "#64748B", cursor: "pointer" }}>
                    <input type="checkbox" checked={saveCard} onChange={(e) => setSaveCard(e.target.checked)} />
                    Securely save card as per RBI guidelines
                  </label>
                </div>
              )}

              {/* TAB 3: NETBANKING */}
              {activeTab === "netbanking" && (
                <div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.75rem" }}>
                    Select Your Bank
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "1rem" }}>
                    {POPULAR_BANKS.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => setSelectedBank(b.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          padding: "0.625rem",
                          borderRadius: "8px",
                          border: `1.5px solid ${selectedBank === b.id ? "#2563EB" : "#E2E8F0"}`,
                          background: selectedBank === b.id ? "#EFF6FF" : "#FFFFFF",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color: selectedBank === b.id ? "#1D4ED8" : "#334155",
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        <span>{b.logo}</span>
                        <span>{b.name}</span>
                      </button>
                    ))}
                  </div>

                  <label style={{ display: "block", fontSize: "0.6875rem", fontWeight: 600, color: "#64748B", marginBottom: "0.25rem" }}>
                    Or select all Indian Banks
                  </label>
                  <select
                    style={{
                      width: "100%",
                      padding: "0.5rem 0.625rem",
                      borderRadius: "6px",
                      border: "1px solid #CBD5E1",
                      fontSize: "0.75rem",
                      background: "#FFFFFF",
                    }}
                  >
                    <option>Bank of Baroda</option>
                    <option>Canara Bank</option>
                    <option>Union Bank of India</option>
                    <option>IndusInd Bank</option>
                    <option>IDFC FIRST Bank</option>
                  </select>
                </div>
              )}

              {/* TAB 4: WALLETS */}
              {activeTab === "wallet" && (
                <div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.75rem" }}>
                    Select Wallet
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {POPULAR_WALLETS.map((w) => (
                      <button
                        key={w.id}
                        onClick={() => setSelectedWallet(w.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "0.75rem 1rem",
                          borderRadius: "8px",
                          border: `1.5px solid ${selectedWallet === w.id ? "#2563EB" : "#E2E8F0"}`,
                          background: selectedWallet === w.id ? "#EFF6FF" : "#FFFFFF",
                          fontSize: "0.8125rem",
                          fontWeight: 600,
                          color: selectedWallet === w.id ? "#1D4ED8" : "#334155",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span>{w.icon}</span>
                          <span>{w.name}</span>
                        </div>
                        {selectedWallet === w.id && <Check size={16} color="#2563EB" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Pay Button (for non-QR tabs or overall action) */}
              {activeTab !== "upi" && (
                <div style={{ marginTop: "1rem" }}>
                  <button
                    onClick={() => triggerPaymentProcessing(activeTab.toUpperCase())}
                    style={{
                      width: "100%",
                      background: "linear-gradient(135deg, #0C2340 0%, #16365C 100%)",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "8px",
                      padding: "0.8125rem",
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      boxShadow: "0 4px 12px rgba(12, 35, 64, 0.25)",
                      transition: "transform 0.1s ease",
                    }}
                  >
                    <span>Pay ₹{totalAmount.toLocaleString()}</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SCREEN 2: PROCESSING SCREEN ─────────────────────── */}
        {status === "processing" && (
          <div
            style={{
              padding: "3.5rem 2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              minHeight: "410px",
            }}
          >
            {/* Razorpay blue pulsing spinner */}
            <div style={{ position: "relative", width: 70, height: 70, marginBottom: "1.5rem" }}>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  border: "4px solid #E2E8F0",
                  borderTopColor: "#0C2340",
                  borderRightColor: "#2563EB",
                  animation: "rzpSpin 0.8s linear infinite",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#0C2340",
                }}
              >
                <Lock size={20} />
              </div>
            </div>

            <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.5rem" }}>
              Processing Payment with Bank...
            </h3>
            <p style={{ fontSize: "0.8125rem", color: "#64748B", maxWidth: "320px", lineHeight: 1.5, marginBottom: "1.5rem" }}>
              Authorizing transaction of <strong>₹{totalAmount.toLocaleString()}</strong>. Please do not close this window or press Back.
            </p>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.375rem",
                fontSize: "0.6875rem",
                color: "#166534",
                background: "#DCFCE7",
                padding: "0.25rem 0.625rem",
                borderRadius: "999px",
                fontWeight: 600,
              }}
            >
              <Shield size={12} /> 256-Bit Bank-Grade Handshake
            </div>
          </div>
        )}

        {/* ── SCREEN 3: PAYMENT SUCCESS RECEIPT ────────────────── */}
        {status === "success" && (
          <div
            style={{
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              animation: "rzpSuccessPop 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Animated Checkmark Circle */}
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "#10B981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                boxShadow: "0 8px 24px rgba(16, 185, 129, 0.35)",
                marginBottom: "1rem",
                animation: "rzpCheckBounce 0.5s ease-out",
              }}
            >
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h3 style={{ fontSize: "1.375rem", fontWeight: 800, color: "#0F172A", marginBottom: "0.25rem" }}>
              Payment Successful!
            </h3>
            <p style={{ fontSize: "0.8125rem", color: "#64748B", marginBottom: "1.25rem" }}>
              Your rental booking has been confirmed with RentStyle Nashik.
            </p>

            {/* Receipt Summary Card */}
            <div
              style={{
                width: "100%",
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: "10px",
                padding: "1rem",
                marginBottom: "1.25rem",
                fontSize: "0.75rem",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ color: "#64748B" }}>Payment ID</span>
                <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#0F172A" }}>{paymentId}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ color: "#64748B" }}>Order ID</span>
                <span style={{ fontFamily: "monospace", fontWeight: 600, color: "#0F172A" }}>{orderId}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ color: "#64748B" }}>Total Paid</span>
                <span style={{ fontWeight: 800, color: "#0C2340", fontSize: "0.875rem" }}>₹{totalAmount.toLocaleString()}</span>
              </div>
              <div style={{ borderTop: "1px dashed #CBD5E1", paddingTop: "0.5rem", marginTop: "0.5rem", display: "flex", justifyContent: "space-between", color: "#64748B" }}>
                <span>Rental: ₹{rentalPrice} • Size: {selectedSize}</span>
                <span style={{ color: "#166534", fontWeight: 600 }}>Deposit: ₹{deposit} (Refundable)</span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "0.625rem", width: "100%" }}>
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #E2E8F0",
                  background: "#FFFFFF",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "#334155",
                  cursor: "pointer",
                }}
              >
                Done
              </button>
              <button
                onClick={onClose}
                style={{
                  flex: 2,
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "none",
                  background: "#0C2340",
                  color: "#FFFFFF",
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.375rem",
                }}
              >
                <span>View in Dashboard</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ── RAZORPAY TRUST FOOTER ───────────────────────────── */}
        <div
          style={{
            background: "#F1F5F9",
            borderTop: "1px solid #E2E8F0",
            padding: "0.625rem 1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.6875rem",
            color: "#64748B",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
            <Shield size={13} color="#0C2340" />
            <span>Secured by <strong>Razorpay</strong></span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span>PCI-DSS Compliant</span>
            <span>•</span>
            <span>RBI Authorized</span>
          </div>
        </div>
      </div>

      {/* Embedded Animations */}
      <style>{`
        @keyframes rzpFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes rzpPopIn {
          from { opacity: 0; transform: scale(0.94) translateY(12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes rzpSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes rzpSlideDown {
          from { opacity: 0; transform: translateY(-10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes rzpLaserScan {
          0% { top: 0%; opacity: 0.8; }
          50% { top: 96%; opacity: 1; }
          100% { top: 0%; opacity: 0.8; }
        }
        @keyframes rzpSuccessPop {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes rzpCheckBounce {
          0% { transform: scale(0); }
          60% { transform: scale(1.18); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
