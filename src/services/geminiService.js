// ============================================================
// RentStyle Nashik — AI Assistant Service (Gemini + Local JSON Fallback)
// Handles Google Gemini API calls with graceful fallback to offline knowledge base
// ============================================================

import { matchOfflineQuery } from "../data/chatbotKnowledge";

const LOCAL_STORAGE_KEY = "rns_gemini_api_key";

// Retrieve active API key (from .env or localStorage user override)
export function getGeminiApiKey() {
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && envKey.trim().length > 5) {
    return envKey.trim();
  }
  try {
    const customKey = localStorage.getItem(LOCAL_STORAGE_KEY);
    return customKey ? customKey.trim() : "";
  } catch (e) {
    return "";
  }
}

export function setCustomGeminiApiKey(key) {
  try {
    if (!key) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEY, key.trim());
    }
  } catch (e) {
    console.error("Failed to store custom API key", e);
  }
}

export function isGeminiConfigured() {
  const key = getGeminiApiKey();
  return Boolean(key && key.length > 5);
}

const SYSTEM_INSTRUCTION = `
You are the luxury AI Fashion Stylist & Concierge for "RentStyle Nashik" (Nashik, Maharashtra, India).
RentStyle is a premier hyper-local ethnic and designer garment rental platform connecting shoppers with curated boutiques across Nashik (College Road, Gangapur Road, Panchavati, Canada Corner, Indira Nagar).

PLATFORM POLICIES & KNOWLEDGE:
1. RENTAL DURATION: Standard 3-day (72 hours) rental period. Day 1: Try-on & collection; Day 2: Event celebration; Day 3: Return. Extensions available for ₹200-₹400/day.
2. SECURITY DEPOSIT: 100% refundable upon return after quick inspection. Credited immediately to UPI (GPay/PhonePe) or cash within 1-2 hours.
3. HYGIENE & CARE: 7-stage quality lifecycle. Every outfit is professionally dry-cleaned, steam-sanitized at 120°C, and inspected before handover. Customers do NOT need to wash outfits.
4. TRY-ON IN NASHIK: Customers can visit partner boutiques on College Road, Gangapur Road, etc., for trial and temporary basting/pinning.
5. STAINS & DAMAGE: Minor food stains and normal wear are covered. Deep cigarette burns or irreversible fabric tears may incur repair cost deducted from deposit.
6. PRICING: ₹450 - ₹900 (Party Wear), ₹900 - ₹1800 (Gowns), ₹1200 - ₹3500 (Lehengas), ₹1500 - ₹3200 (Sherwanis), ₹800 - ₹1600 (Suits), ₹600 - ₹1400 (Sarees).
7. CATEGORIES: Lehengas, Sherwanis, Suits & Tuxedos, Evening & Cocktail Gowns, Sarees, Party Wear, Bridal Wear, Accessories.
8. TONE: Warm, welcoming, respectful (Namaste!), fashion-forward, polite, and practical. Support English, Hindi, and Marathi naturally if user asks in those languages. Keep answers clear and formatted with bullet points where appropriate.
`;

/**
 * Send user message to Gemini or fall back to offline JSON knowledge base
 */
export async function getAssistantResponse(userMessage, chatHistory = []) {
  const apiKey = getGeminiApiKey();

  // If no Gemini API key is configured, instantly use offline JSON
  if (!apiKey) {
    const offlineResult = matchOfflineQuery(userMessage);
    return {
      text: offlineResult.entry.answer,
      chips: offlineResult.entry.chips || [],
      actionButtons: offlineResult.entry.actionButtons || [],
      source: "offline_json",
      matchedCategory: offlineResult.entry.category,
    };
  }

  // If API key is present, attempt Gemini 1.5 Flash call
  try {
    const contents = [];

    // System context in first turn or instruction
    contents.push({
      role: "user",
      parts: [
        {
          text: `[SYSTEM INSTRUCTION FOR RENTSTYLE NASHIK CONCIERGE]:\n${SYSTEM_INSTRUCTION}\n\nPlease acknowledge your role briefly.`,
        },
      ],
    });
    contents.push({
      role: "model",
      parts: [
        {
          text: "Namaste! I am your RentStyle Nashik AI Fashion Stylist & Concierge. Ready to help with outfits, styling, rental rules, and Nashik boutiques!",
        },
      ],
    });

    // Append recent chat history (last 6 turns for context)
    const recentHistory = chatHistory.slice(-6);
    recentHistory.forEach((msg) => {
      contents.push({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      });
    });

    // Append current user message
    contents.push({
      role: "user",
      parts: [{ text: userMessage }],
    });

    // Try Gemini 1.5 Flash endpoint
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 650,
          topP: 0.9,
        },
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.warn("Gemini API returned error status:", res.status, errData);
      throw new Error(errData?.error?.message || `API error ${res.status}`);
    }

    const data = await res.json();
    const candidateText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!candidateText) {
      throw new Error("No response generated by Gemini model");
    }

    // Dynamic follow-up chips based on conversation
    const chips = generateDynamicChips(userMessage, candidateText);

    return {
      text: candidateText,
      chips,
      source: "gemini_ai",
      actionButtons: generateActionButtons(userMessage),
    };
  } catch (error) {
    console.warn("Gemini API call failed, gracefully falling back to offline knowledge base:", error);

    // Fallback to offline knowledge base
    const offlineResult = matchOfflineQuery(userMessage);
    return {
      text: offlineResult.entry.answer,
      chips: offlineResult.entry.chips || [],
      actionButtons: offlineResult.entry.actionButtons || [],
      source: "fallback",
      errorDetails: error.message,
      notice: "⚡ Gemini API quota or network issue; served instantly from RentStyle Knowledge Base.",
    };
  }
}

// Generate smart follow-up suggestions
function generateDynamicChips(query, reply) {
  const q = query.toLowerCase();
  if (q.includes("sangeet") || q.includes("lehenga")) {
    return ["What is the security deposit?", "Can I try before renting?", "Where are shops on Gangapur Rd?"];
  }
  if (q.includes("deposit") || q.includes("money") || q.includes("price")) {
    return ["How does return work?", "What if dress gets stained?", "Browse party wear"];
  }
  if (q.includes("wedding") || q.includes("sherwani") || q.includes("suit")) {
    return ["How long is rental?", "Can I alter fit?", "View Nashik shops"];
  }
  return ["How does rental work?", "Security deposit rules", "Where are shops in Nashik?"];
}

function generateActionButtons(query) {
  const q = query.toLowerCase();
  if (q.includes("lehenga") || q.includes("sangeet") || q.includes("haldi")) {
    return [{ label: "💃 Browse Lehengas", path: "/search?category=lehenga" }];
  }
  if (q.includes("sherwani") || q.includes("groom") || q.includes("men")) {
    return [{ label: "🤵 Browse Sherwanis", path: "/search?category=sherwani" }];
  }
  if (q.includes("shop") || q.includes("boutique") || q.includes("where") || q.includes("location")) {
    return [{ label: "📍 View Nashik Boutiques", path: "/shops" }];
  }
  return [{ label: "👗 Explore All Outfits", path: "/search" }];
}
