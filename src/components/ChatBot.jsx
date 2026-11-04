import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  RotateCcw,
  Key,
  Shield,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  Bot,
  User,
} from "lucide-react";
import {
  getAssistantResponse,
  getGeminiApiKey,
  setCustomGeminiApiKey,
  isGeminiConfigured,
} from "../services/geminiService";

export default function ChatBot() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [customKeyInput, setCustomKeyInput] = useState(getGeminiApiKey() || "");
  const [hasKey, setHasKey] = useState(isGeminiConfigured());

  // Conversation state
  const [messages, setMessages] = useState([
    {
      id: "welcome-1",
      sender: "bot",
      text:
        "Namaste! 🙏 Welcome to **RentStyle Nashik**.\n\n" +
        "I am your **AI Stylist & Concierge**. Ask me anything about:\n" +
        "• How our 3-day rental and try-ons work in Nashik\n" +
        "• Security deposit rules & 100% UPI refund\n" +
        "• Styling recommendations for Sangeet, Haldi, or Weddings\n" +
        "• Partner boutiques on College Road, Gangapur Road & Panchavati\n\n" +
        "How can I style or assist you today?",
      chips: [
        "How does rental work?",
        "What is the security deposit?",
        "Can I try before renting?",
        "Recommend Sangeet outfit",
      ],
      actionButtons: [
        { label: "👗 Browse Garments", path: "/search" },
        { label: "📍 View Nashik Shops", path: "/shops" },
      ],
      source: hasKey ? "gemini_ai" : "offline_json",
      timestamp: "Just now",
    },
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, messages, isTyping]);

  const handleSendMessage = async (textToSend = inputMessage) => {
    const text = textToSend.trim();
    if (!text || isTyping) return;

    setInputMessage("");

    const userMsgId = `usr-${Date.now()}`;
    const newUserMsg = {
      id: userMsgId,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setIsTyping(true);

    try {
      const response = await getAssistantResponse(text, messages);

      const botMsgId = `bot-${Date.now()}`;
      const newBotMsg = {
        id: botMsgId,
        sender: "bot",
        text: response.text,
        chips: response.chips || [],
        actionButtons: response.actionButtons || [],
        source: response.source,
        notice: response.notice,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, newBotMsg]);
    } catch (err) {
      console.error("Chatbot processing error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: "bot",
          text:
            "I encountered a temporary issue. You can browse our standard rental rules or explore our boutique collection directly!",
          chips: ["How does rental work?", "Where are shops in Nashik?"],
          source: "offline_json",
          timestamp: "Just now",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "bot",
        text:
          "Conversation restarted! 👗 Ask me any question about our garments, rental rules, or Nashik partner boutiques.",
        chips: [
          "How does rental work?",
          "What is the security deposit?",
          "Can I try before renting?",
          "Recommend Sangeet outfit",
        ],
        actionButtons: [{ label: "👗 Browse Garments", path: "/search" }],
        source: hasKey ? "gemini_ai" : "offline_json",
        timestamp: "Just now",
      },
    ]);
  };

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    setCustomGeminiApiKey(customKeyInput);
    const configured = isGeminiConfigured();
    setHasKey(configured);
    setShowKeyModal(false);
  };

  // Helper to render basic markdown bold and bullet points cleanly
  const renderFormattedText = (rawText) => {
    if (!rawText) return null;

    const lines = rawText.split("\n");
    return lines.map((line, lineIdx) => {
      // Parse markdown bold: **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={pIdx} style={{ fontWeight: 700, color: "var(--charcoal)" }}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      // Check if bullet point
      const isBullet = line.trim().startsWith("•") || line.trim().startsWith("-") || line.trim().startsWith("* ");
      const isNumbered = /^\d+\.\s/.test(line.trim());

      return (
        <div
          key={lineIdx}
          style={{
            marginBottom: line.trim() === "" ? "0.5rem" : "0.25rem",
            paddingLeft: isBullet || isNumbered ? "0.5rem" : 0,
            lineHeight: 1.55,
          }}
        >
          {formattedParts}
        </div>
      );
    });
  };

  return (
    <>
      {/* ── FLOATING LAUNCHER BUTTON ─────────────────────────── */}
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 99990,
        }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open RentStyle Concierge"
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--burgundy) 0%, var(--wine) 100%)",
            color: "var(--white)",
            border: "2px solid var(--rose-gold)",
            boxShadow: "0 8px 30px rgba(123, 31, 58, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            position: "relative",
            transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            transform: isOpen ? "scale(0.95)" : "scale(1)",
          }}
          className="chatbot-launcher-btn"
        >
          {isOpen ? (
            <X size={26} strokeWidth={2.2} />
          ) : (
            <>
              <Sparkles size={26} color="var(--cream)" />
              {hasUnread && (
                <span
                  style={{
                    position: "absolute",
                    top: "-2px",
                    right: "-2px",
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "#10B981",
                    border: "2px solid var(--white)",
                    animation: "pulse 2s infinite",
                  }}
                />
              )}
            </>
          )}
        </button>
      </div>

      {/* ── CHAT WINDOW DRAWER ──────────────────────────────── */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "96px",
            right: "24px",
            width: "min(400px, calc(100vw - 32px))",
            height: "min(620px, calc(100vh - 120px))",
            backgroundColor: "var(--white)",
            borderRadius: "var(--radius-2xl)",
            boxShadow: "0 20px 60px rgba(44, 44, 44, 0.25), 0 0 0 1px var(--color-border)",
            display: "flex",
            flexDirection: "column",
            zIndex: 99989,
            overflow: "hidden",
            animation: "chatPopup 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, var(--burgundy) 0%, var(--wine) 100%)",
              color: "var(--cream)",
              padding: "1rem 1.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(255,255,255,0.25)",
                  position: "relative",
                }}
              >
                <Sparkles size={18} color="var(--rose-gold)" />
                <span
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: hasKey ? "#10B981" : "#F59E0B",
                    border: "2px solid var(--burgundy)",
                  }}
                  title={hasKey ? "Gemini AI Active" : "Knowledge Base Mode"}
                />
              </div>

              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.0625rem",
                    fontWeight: 700,
                    lineHeight: 1.2,
                    color: "var(--white)",
                  }}
                >
                  RentStyle Concierge
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginTop: "0.15rem" }}>
                  <span
                    style={{
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      background: hasKey ? "rgba(16, 185, 129, 0.25)" : "rgba(245, 158, 11, 0.25)",
                      color: hasKey ? "#A7F3D0" : "#FDE68A",
                      padding: "0.1rem 0.5rem",
                      borderRadius: "var(--radius-full)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    {hasKey ? "🟢 Gemini 1.5 Flash" : "⚡ Knowledge Base"}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
              <button
                onClick={() => setShowKeyModal(true)}
                title="Configure Gemini API Key"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--cream)",
                  cursor: "pointer",
                }}
              >
                <Key size={15} />
              </button>

              <button
                onClick={handleResetChat}
                title="Restart Chat"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--cream)",
                  cursor: "pointer",
                }}
              >
                <RotateCcw size={15} />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                title="Close Chat"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--cream)",
                  cursor: "pointer",
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "1rem",
              background: "var(--color-bg)",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {messages.map((msg) => {
              const isUser = msg.sender === "user";

              return (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isUser ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "88%",
                      padding: "0.875rem 1.125rem",
                      borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      background: isUser
                        ? "linear-gradient(135deg, var(--burgundy) 0%, var(--wine) 100%)"
                        : "var(--white)",
                      color: isUser ? "var(--cream)" : "var(--charcoal)",
                      border: isUser ? "none" : "1px solid var(--color-border-lt)",
                      boxShadow: "var(--shadow-xs)",
                      fontSize: "0.875rem",
                      wordBreak: "break-word",
                    }}
                  >
                    {isUser ? msg.text : renderFormattedText(msg.text)}

                    {/* Notice pill if fallback occurred */}
                    {msg.notice && (
                      <div
                        style={{
                          marginTop: "0.5rem",
                          fontSize: "0.7rem",
                          color: "var(--wine)",
                          background: "var(--blush-light)",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "var(--radius-sm)",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        <AlertCircle size={12} />
                        {msg.notice}
                      </div>
                    )}

                    {/* Embedded Action Navigation Buttons */}
                    {msg.actionButtons && msg.actionButtons.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.375rem",
                          marginTop: "0.75rem",
                          paddingTop: "0.5rem",
                          borderTop: "1px solid var(--color-border-lt)",
                        }}
                      >
                        {msg.actionButtons.map((btn, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              navigate(btn.path);
                              setIsOpen(false);
                            }}
                            style={{
                              background: "var(--blush-light)",
                              color: "var(--color-primary)",
                              border: "1px solid var(--blush)",
                              borderRadius: "var(--radius-full)",
                              padding: "0.35rem 0.75rem",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.25rem",
                            }}
                          >
                            {btn.label} <ChevronRight size={11} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Message Meta & Source */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.6875rem",
                      color: "var(--color-text-muted)",
                      marginTop: "0.25rem",
                      padding: "0 0.375rem",
                    }}
                  >
                    <span>{msg.timestamp}</span>
                    {!isUser && msg.source && (
                      <span>
                        •{" "}
                        {msg.source === "gemini_ai"
                          ? "✨ Gemini AI"
                          : "⚡ Knowledge Base"}
                      </span>
                    )}
                  </div>

                  {/* Suggestion Chips */}
                  {!isUser && msg.chips && msg.chips.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.375rem",
                        marginTop: "0.625rem",
                      }}
                    >
                      {msg.chips.map((chip, cIdx) => (
                        <button
                          key={cIdx}
                          onClick={() => handleSendMessage(chip)}
                          style={{
                            background: "var(--white)",
                            border: "1px solid var(--color-border)",
                            borderRadius: "var(--radius-full)",
                            padding: "0.3rem 0.75rem",
                            fontSize: "0.75rem",
                            color: "var(--color-primary)",
                            fontWeight: 600,
                            cursor: "pointer",
                            boxShadow: "var(--shadow-xs)",
                            transition: "var(--transition-fast)",
                          }}
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div
                  style={{
                    background: "var(--white)",
                    borderRadius: "16px 16px 16px 4px",
                    padding: "0.75rem 1rem",
                    border: "1px solid var(--color-border-lt)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.375rem",
                  }}
                >
                  <span className="dot" style={{ animationDelay: "0ms" }} />
                  <span className="dot" style={{ animationDelay: "180ms" }} />
                  <span className="dot" style={{ animationDelay: "360ms" }} />
                </div>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                  Consulting fashion assistant...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div
            style={{
              padding: "0.75rem 1rem",
              background: "var(--white)",
              borderTop: "1px solid var(--color-border)",
            }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "var(--ivory)",
                borderRadius: "var(--radius-full)",
                padding: "0.25rem 0.35rem 0.25rem 1rem",
                border: "1px solid var(--color-border)",
              }}
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask about deposits, try-ons, outfits..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: "0.875rem",
                  color: "var(--charcoal)",
                  fontFamily: "var(--font-ui)",
                }}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: inputMessage.trim()
                    ? "var(--color-primary)"
                    : "var(--color-border)",
                  color: "var(--white)",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: inputMessage.trim() ? "pointer" : "default",
                  transition: "var(--transition-fast)",
                }}
              >
                <Send size={15} />
              </button>
            </form>

            <div
              style={{
                fontSize: "0.6875rem",
                color: "var(--color-text-muted)",
                textAlign: "center",
                marginTop: "0.4rem",
              }}
            >
              {hasKey ? "⚡ Powered by Gemini AI with Offline Knowledge" : "⚡ Instant Nashik Knowledge Base Mode"}
            </div>
          </div>
        </div>
      )}

      {/* ── GEMINI API KEY CONFIG MODAL ────────────────────────── */}
      {showKeyModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(44, 44, 44, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
            padding: "1rem",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowKeyModal(false);
          }}
        >
          <div
            style={{
              background: "var(--white)",
              borderRadius: "var(--radius-xl)",
              width: "100%",
              maxWidth: 440,
              padding: "1.75rem",
              boxShadow: "var(--shadow-xl)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Key size={18} color="var(--color-primary)" />
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700 }}>
                  Gemini API Key Setting
                </h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)" }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", lineHeight: 1.5, marginBottom: "1rem" }}>
              RentStyle operates seamlessly out-of-the-box using its comprehensive built-in JSON knowledge base. If you have a free Google Gemini API key, you can activate full real-time AI styling!
            </p>

            <div
              style={{
                background: "var(--ivory)",
                borderRadius: "var(--radius-md)",
                padding: "0.75rem 1rem",
                marginBottom: "1.25rem",
                fontSize: "0.75rem",
                color: "var(--charcoal)",
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>Two ways to configure:</div>
              <div>1. In your root <code>.env</code> file: <code>VITE_GEMINI_API_KEY=your_key</code></div>
              <div>2. Or paste your key below directly for instant testing:</div>
            </div>

            <form onSubmit={handleSaveApiKey}>
              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label className="label">Gemini API Key</label>
                <input
                  type="password"
                  className="input"
                  placeholder="AIzaSy..."
                  value={customKeyInput}
                  onChange={(e) => setCustomKeyInput(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => {
                    setCustomKeyInput("");
                    setCustomGeminiApiKey("");
                    setHasKey(false);
                    setShowKeyModal(false);
                  }}
                  className="btn btn-ghost btn-sm"
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  Clear Key
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  style={{ flex: 2, justifyContent: "center" }}
                >
                  Save & Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style>{`
        @keyframes chatPopup {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--color-primary);
          animation: dotPulse 1.4s infinite ease-in-out both;
        }
        @keyframes dotPulse {
          0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
      `}</style>
    </>
  );
}
