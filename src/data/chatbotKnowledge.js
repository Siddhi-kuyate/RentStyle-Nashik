// ============================================================
// RentStyle Nashik — Comprehensive Chatbot Knowledge Base
// Hardcoded Q&A covering every possible question for offline/fallback mode
// ============================================================

export const KNOWLEDGE_BASE = [
  // ── 1. HOW IT WORKS & RENTAL PROCESS ──────────────────────
  {
    id: "how-it-works",
    category: "How It Works",
    keywords: ["how it works", "how does it work", "rental process", "how to rent", "steps to rent", "process", "booking process"],
    patterns: [/how (does|do) (it|rentstyle|rental) work/i, /how (to|can i) rent/i, /what is the process/i, /guide me/i],
    question: "How does garment rental work on RentStyle?",
    answer:
      "Renting on RentStyle Nashik is effortless in 4 simple steps:\n\n" +
      "1. **Discover**: Browse designer Lehengas, Gowns, Sherwanis, and Suits from top verified boutiques across Nashik (College Road, Gangapur Road, Panchavati, etc.).\n" +
      "2. **Book Your Dates**: Select your size and event date. The standard rental duration is **3 days** (Day 1: Pick-up & trial, Day 2: Event celebration, Day 3: Return).\n" +
      "3. **Pick-up / Trial**: Collect your sanitized, steam-pressed outfit from the partner boutique or arrange local delivery.\n" +
      "4. **Return & Deposit Refund**: Return the outfit on Day 3. No need to dry clean! Once our shop checks the garment, your security deposit is instantly refunded via UPI.",
    chips: ["What is the security deposit?", "Can I try before renting?", "Where are shops located?"],
    actionButtons: [
      { label: "👗 Browse All Garments", path: "/search" },
      { label: "📍 View Partner Shops", path: "/shops" },
    ],
  },
  {
    id: "rental-duration",
    category: "Duration & Extension",
    keywords: ["how many days", "duration", "rental period", "how long", "extra days", "extend", "weekend"],
    patterns: [/how (many days|long) (can|do) (i|we) rent/i, /rental duration/i, /can i extend/i],
    question: "How long is the standard rental period? Can I extend it?",
    answer:
      "The standard rental duration is **3 days (72 hours)**:\n\n" +
      "• **Day 1**: Pick-up or delivery & final fitting.\n" +
      "• **Day 2**: Your grand event!\n" +
      "• **Day 3**: Return handover by 8:00 PM.\n\n" +
      "💡 **Need extra days?** Yes! For destination weddings or multi-day festivities, you can extend your rental for a nominal fee of **₹200 - ₹400 per extra day** (subject to garment availability). Just contact the shop via your dashboard.",
    chips: ["How to return?", "Late return fee?", "What is security deposit?"],
  },
  {
    id: "try-before-renting",
    category: "Fitting & Try-Ons",
    keywords: ["try", "trial", "fitting", "can i try", "size fit", "alteration", "measurements"],
    patterns: [/can i try (before|it|the dress)/i, /is (trial|fitting) available/i, /physical trial/i],
    question: "Can I try on the outfit before renting?",
    answer:
      "**Yes, absolutely!** That is the greatest advantage of RentStyle being hyper-local in Nashik.\n\n" +
      "You can visit the partner boutique (on College Road, Gangapur Road, Canada Corner, or Panchavati) for a physical fitting and trial before or on the day of pick-up. Our boutique stylists will assist with temporary adjustments so the silhouette sits like a bespoke piece.",
    chips: ["Can I make alterations?", "What sizes exist?", "Where are shops?"],
    actionButtons: [{ label: "📍 Find Nearest Boutique", path: "/shops" }],
  },
  {
    id: "alterations-policy",
    category: "Fitting & Try-Ons",
    keywords: ["alter", "alteration", "tighten", "loosen", "stitch", "safety pins", "cut"],
    patterns: [/can i (alter|modify|stitch|adjust)/i, /alteration policy/i],
    question: "Can I alter the garment or adjust the fit?",
    answer:
      "• **Temporary Alterations**: Reversible hand stitches or micro-adjustments using safety pins / hooks are allowed.\n" +
      "• **Permanent Alterations**: Cutting fabric, applying fabric glue, or machine alterations that alter the original seam permanently are **strictly prohibited**.\n" +
      "✨ Most partner boutiques offer complimentary reversible pinning/basting before you leave the store!",
    chips: ["What if it gets damaged?", "How does rental work?"],
  },

  // ── 2. SECURITY DEPOSIT, PAYMENTS & PRICING ──────────────
  {
    id: "security-deposit",
    category: "Pricing & Deposit",
    keywords: ["security deposit", "deposit", "caution money", "why deposit", "how much deposit", "refund deposit"],
    patterns: [/security deposit/i, /how much (is the )?deposit/i, /why (do i pay|a) deposit/i, /when do i get my deposit back/i],
    question: "How does the security deposit work? When do I get it back?",
    answer:
      "**Security Deposit Policy**:\n\n" +
      "• **Why it exists**: It secures high-value designer garments against severe damage or non-return.\n" +
      "• **Deposit Amount**: Typically ranges from **₹800 to ₹3,000** depending on the outfit's retail value (clearly shown on each garment's card).\n" +
      "• **Refund Timeline**: The deposit is **100% refundable** immediately upon returning the garment in standard condition. Refunds are credited instantly to your UPI (GPay/PhonePe/Paytm) or cash within 1–2 hours after quality check.",
    chips: ["What if dress gets stained?", "Payment methods?", "Damage policy"],
  },
  {
    id: "payment-methods",
    category: "Pricing & Deposit",
    keywords: ["payment", "pay", "upi", "gpay", "phonepe", "cash", "credit card", "net banking"],
    patterns: [/payment (methods|options)/i, /how (can i|to) pay/i, /do you accept (upi|cash)/i],
    question: "What payment methods are supported?",
    answer:
      "We support all popular Indian payment modes:\n\n" +
      "• **UPI**: Google Pay, PhonePe, Paytm, BHIM\n" +
      "• **Credit & Debit Cards**: Visa, Mastercard, RuPay\n" +
      "• **Cash on Collection**: Available at partner boutiques in Nashik\n" +
      "• **Net Banking**: All major Indian banks",
    chips: ["What is security deposit?", "How does rental work?"],
  },
  {
    id: "pricing-rates",
    category: "Pricing & Deposit",
    keywords: ["price", "cost", "how much", "charges", "rate", "budget", "cheap", "expensive"],
    patterns: [/how much does it cost/i, /what are the (prices|rates)/i, /rental charges/i],
    question: "What are the rental prices on RentStyle?",
    answer:
      "RentStyle offers designer fashion at 85–95% lower than retail purchase prices:\n\n" +
      "• **Party Wear & Cocktail Dresses**: ₹450 – ₹900\n" +
      "• **Evening & Red Carpet Gowns**: ₹900 – ₹1,800\n" +
      "• **Sangeet & Wedding Lehengas**: ₹1,200 – ₹3,500\n" +
      "• **Men's Sherwanis & Indo-Western**: ₹1,500 – ₹3,200\n" +
      "• **Tuxedos & 3-Piece Suits**: ₹800 – ₹1,600\n" +
      "• **Designer Sarees & Paithani**: ₹600 – ₹1,400\n\n" +
      "All rentals include professional dry cleaning and sanitization!",
    chips: ["Browse Lehengas", "Browse Sherwanis", "What is security deposit?"],
    actionButtons: [{ label: "🔍 Browse by Price", path: "/search" }],
  },

  // ── 3. HYGIENE, STAINS, DAMAGE & CARE ────────────────────
  {
    id: "hygiene-cleaning",
    category: "Hygiene & Care",
    keywords: ["hygiene", "clean", "cleaning", "wash", "washing", "sanitized", "smell", "dry clean", "germs"],
    patterns: [/is it (clean|hygienic|sanitized)/i, /do i (need to|have to) (wash|clean|dry clean)/i, /cleaning process/i],
    question: "Is the garment clean and sanitized? Do I need to wash it before returning?",
    answer:
      "**100% Hospital-Grade Hygiene Guaranteed!**\n\n" +
      "• **7-Stage Lifecycle Inspection**: Every single garment undergoes professional dry cleaning, steam sanitization at 120°C, and quality checks before being handed over to you.\n" +
      "• **Do NOT wash at home**: You do **not** need to wash or dry clean the outfit! Our certified dry-cleaning partners handle all cleaning after return. Just fold and return in the provided garment bag.",
    chips: ["What if I spill food or drink?", "Damage policy", "Security deposit"],
  },
  {
    id: "stains-damage",
    category: "Hygiene & Care",
    keywords: ["stain", "spill", "damage", "tear", "burn", "food spill", "wine", "ruined", "broken"],
    patterns: [/what if (i|it) (spill|stain|damage|tear)/i, /stain policy/i, /damage charges/i],
    question: "What happens if an outfit gets stained or accidentally damaged?",
    answer:
      "We understand that weddings and parties involve food, wine, haldi, and dancing!\n\n" +
      "• **Normal Wear & Tear (Covered)**: Minor food spills, loose sequins, or missing hooks are covered by our standard maintenance. Please do NOT rub harsh detergent on stains at home.\n" +
      "• **Deep Irreversible Damage**: Major cigarette burns, massive fabric tears, or permanent oil paint may incur repair costs deducted from your security deposit at reasonable cost.\n" +
      "• **Honesty First**: Inform the shop staff upon return so our stain-removal specialists can treat it immediately.",
    chips: ["What is security deposit?", "Hygiene policy", "How to return?"],
  },
  {
    id: "loss-theft",
    category: "Hygiene & Care",
    keywords: ["lost", "loss", "stolen", "theft", "missing", "misplaced"],
    patterns: [/what if (i|it) (lost|lose|stolen)/i, /loss policy/i],
    question: "What happens if a garment or accessory is lost?",
    answer:
      "If a garment or vital accessory (e.g. brooch, safa, dupatta) is lost, the renter is responsible for the actual replacement or manufacturer cost. The security deposit will be applied towards the replacement, and any remaining balance settled with the boutique.",
    chips: ["Security deposit", "Contact support"],
  },

  // ── 4. CANCELLATION, RESCHEDULING & LATE RETURNS ──────────
  {
    id: "cancellation-policy",
    category: "Cancellations",
    keywords: ["cancel", "cancellation", "refund", "reschedule", "change date", "postpone"],
    patterns: [/can i (cancel|reschedule|change date)/i, /cancellation policy/i, /refund on cancel/i],
    question: "Can I cancel or reschedule my rental booking?",
    answer:
      "Yes! We offer flexible cancellation and rescheduling terms:\n\n" +
      "• **Free Cancellation**: Up to **48 hours before** your rental date for a 100% full refund.\n" +
      "• **Late Cancellation (Within 48 hours)**: ₹200 handling fee to compensate the boutique for holding the inventory.\n" +
      "• **Free Rescheduling**: If your event date changes, you can reschedule for free subject to outfit availability on the new date.",
    chips: ["How to contact shop?", "Rental duration", "Payment methods"],
  },
  {
    id: "late-return",
    category: "Cancellations",
    keywords: ["late return", "delay", "late fee", "forgot to return", "penalty"],
    patterns: [/what if i return (late|delayed)/i, /late (return|fee|penalty)/i],
    question: "What happens if I return the garment late?",
    answer:
      "To ensure the next customer receives their outfit on time for their event, please return garments by **8:00 PM on Day 3**.\n\n" +
      "If you anticipate a delay, simply contact the boutique in advance. Unnotified late returns are charged at **₹300 per day** deducted from the security deposit.",
    chips: ["Can I extend duration?", "Where are shops?", "Return process"],
  },

  // ── 5. OUTFIT STYLING RECOMMENDATIONS ──────────────────────
  {
    id: "sangeet-recommendation",
    category: "Styling & Occasions",
    keywords: ["sangeet", "dance", "sangeet night", "sangeet outfit", "sangeet dress"],
    patterns: [/what should i wear for sangeet/i, /sangeet (outfit|recommendation|dress)/i],
    question: "What should I wear for a Sangeet ceremony?",
    answer:
      "For Sangeet nights in Nashik, high-movement glamour is key!\n\n" +
      "• **Women**: Choose twirl-friendly designer Lehengas in mirror work, metallic shades, or shimmer sequins (e.g. Pink Floral Lehenga or Crimson Bridal Lehenga). Floor-length sequin gowns are also huge hits.\n" +
      "• **Men**: Modern Indo-Western Sherwanis with asymmetrical cuts, or a sharp velvet bandhgala jacket with slim trousers.",
    chips: ["Browse Lehengas", "Browse Sherwanis", "Haldi recommendations"],
    actionButtons: [
      { label: "💃 Explore Lehengas", path: "/search?category=lehenga" },
      { label: "✨ Explore Party Wear", path: "/search?category=party-wear" },
    ],
  },
  {
    id: "haldi-recommendation",
    category: "Styling & Occasions",
    keywords: ["haldi", "haldi ceremony", "yellow dress", "mehndi", "mehendi"],
    patterns: [/what (to|should i) wear for haldi/i, /haldi (outfit|recommendation|dress|mehndi)/i],
    question: "What should I wear for Haldi & Mehndi ceremonies?",
    answer:
      "For Haldi and Mehndi ceremonies:\n\n" +
      "• **Colors**: Yellow, Mustard, Lime Green, Bright Orange, or Peach.\n" +
      "• **Women**: Lightweight Bandhani georgette lehengas, floral print anarkalis, or draped pre-stitched sarees that allow easy hand/foot mehndi application.\n" +
      "• **Men**: Kurta jacket sets in raw silk or printed cotton-silk blends.\n\n" +
      "💡 Pro Tip: Since haldi stains are yellow, pick cheerful shades that look fabulous in candid sunshine photography!",
    chips: ["Browse Sarees", "Browse Party Wear", "Sangeet outfits"],
    actionButtons: [{ label: "🌸 Browse Sarees", path: "/search?category=sarees" }],
  },
  {
    id: "wedding-recommendation",
    category: "Styling & Occasions",
    keywords: ["wedding", "shaadi", "bride", "groom", "bridal", "marriage", "baraat"],
    patterns: [/what to wear for (wedding|reception|shaadi)/i, /bridal (lehenga|wear)/i, /groom (outfit|sherwani)/i],
    question: "What are your top recommendations for Weddings & Receptions?",
    answer:
      "For the main wedding ceremony and grand evening receptions:\n\n" +
      "• **Brides & Bridesmaids**: Heavy Zardosi Silk Lehengas (Crimson, Wine, Rani Pink), Royal Maroon Velvet Ensembles, or authentic Paithani Sarees with gold zari pallus.\n" +
      "• **Grooms & Best Men**: Royal Raw Silk Sherwanis with embroidered safa/stole, or double-breasted Charcoal & Midnight Blue Italian Tuxedos.\n\n" +
      "Visit our partner boutiques on College Road and Gangapur Road to see the embroidery under true showroom lighting!",
    chips: ["Browse Wedding Wear", "Browse Suits", "Try-on policy"],
    actionButtons: [
      { label: "👰 Bridal Wear", path: "/search?category=bridal-wear" },
      { label: "🤵 Groom Sherwanis", path: "/search?category=sherwani" },
    ],
  },
  {
    id: "cocktail-party",
    category: "Styling & Occasions",
    keywords: ["cocktail", "party", "birthday", "anniversary", "gown", "evening dress"],
    patterns: [/cocktail (dress|outfit|party)/i, /party wear recommendations/i],
    question: "What should I wear for a Cocktail Party or Birthday Gala?",
    answer:
      "Make an unforgettable entrance with:\n\n" +
      "• **Black Sequin Floor-Length Gown**: Dazzles under night lights.\n" +
      "• **Wine Red Sequin Mini Dress**: Chic, modern and flirtatious.\n" +
      "• **Men's Slim Fit 3-Piece Tuxedo**: In navy blue or charcoal grey with satin lapel.\n" +
      "Pair with RentStyle curated jewelry accessories for a complete runway finish!",
    chips: ["Browse Gowns", "Browse Suits", "Pricing"],
    actionButtons: [{ label: "✨ Party Gowns", path: "/search?category=gowns" }],
  },

  // ── 6. NASHIK LOCATIONS & PARTNER SHOPS ────────────────────
  {
    id: "nashik-locations",
    category: "Shops & Locations",
    keywords: ["nashik", "locations", "shops", "boutiques", "where are you", "college road", "gangapur road", "panchavati", "canada corner", "indira nagar"],
    patterns: [/where (are the shops|is rentstyle|are you located)/i, /shops in nashik/i, /boutiques in (college road|gangapur road|panchavati)/i],
    question: "Where are RentStyle partner boutiques located in Nashik?",
    answer:
      "We have verified boutique partners spread conveniently across Nashik:\n\n" +
      "• **College Road**: *Rental Fashion Trends* & *Avatar Rentals* (Specializing in Suits, Gowns, Sherwanis)\n" +
      "• **Gangapur Road**: *Shreeja Collection* & *Glamour Wardrobe* (Bridal Lehengas & Sangeet Wear)\n" +
      "• **Panchavati**: *Sister's Rental Boutique* (Paithani Sarees, Traditional Maharashtrian Wear, Party Wear)\n" +
      "• **Canada Corner & Indira Nagar**: Exclusive wedding accessories & festive collections.\n\n" +
      "You can view complete boutique profiles, contact numbers, and Google Map directions on our Shops page!",
    chips: ["View all shops", "How to try-on?", "Contact shop"],
    actionButtons: [{ label: "📍 Explore Nashik Boutiques", path: "/shops" }],
  },
  {
    id: "delivery-pickup",
    category: "Shops & Locations",
    keywords: ["delivery", "home delivery", "pickup", "pick up", "courier", "shipping"],
    patterns: [/do you (deliver|do home delivery)/i, /pickup or delivery/i, /delivery charges/i],
    question: "Do you offer home delivery in Nashik or is it self-pickup?",
    answer:
      "• **Self-Pickup (Free & Recommended)**: Pick up directly from the boutique to try it on and ensure the fit is 100% perfect.\n" +
      "• **Nashik City Express Delivery**: Available within Nashik city limits (College Rd, Gangapur Rd, Panchavati, Indira Nagar, Cidco, Satpur, Nashik Road) for a flat ₹99 delivery & return collection fee.\n" +
      "Select your preference during checkout or contact the shop directly.",
    chips: ["Where are shops?", "What is security deposit?"],
  },

  // ── 7. SIZING & MEASUREMENTS ──────────────────────────────
  {
    id: "sizes-available",
    category: "Sizing",
    keywords: ["size", "sizes", "plus size", "xs", "small", "medium", "large", "xl", "xxl", "measurements"],
    patterns: [/what sizes (are available|do you have)/i, /plus size/i, /size guide/i],
    question: "What sizes are available? Do you carry plus sizes?",
    answer:
      "We stock sizes ranging from **XS (34) to 3XL (46)** across our catalog!\n\n" +
      "• **Lehengas**: Feature adjustable dori strings and expandable margins to fit waist sizes 28\" to 42\".\n" +
      "• **Sherwanis & Suits**: Chest sizes 36, 38, 40, 42, 44, and 46.\n" +
      "• **Gowns**: Tailored with stretch or inner margin allowances.\n\n" +
      "Filter by your size on the Search page to see garments ready for your measurements.",
    chips: ["Try-on policy", "Can I alter fit?", "Browse garments"],
    actionButtons: [{ label: "🔍 Filter by Size", path: "/search" }],
  },

  // ── 8. BECOMING A SHOP PARTNER ────────────────────────────
  {
    id: "become-partner",
    category: "Partnering",
    keywords: ["partner", "list my shop", "sell", "monetize", "join as shop", "boutique owner", "onboard"],
    patterns: [/how to (partner|list my shop|join as boutique)/i, /partner with rentstyle/i],
    question: "How can boutique owners in Nashik partner with RentStyle?",
    answer:
      "Are you a boutique or rental store owner in Nashik? Partnering with RentStyle gives you:\n\n" +
      "• **Zero Upfront Listing Fee**: Free digital storefront reaching thousands of Nashik shoppers.\n" +
      "• **Shop Owner Dashboard**: Manage garments, track inventory, approve bookings, and monitor cleaning cycles.\n" +
      "• **Higher Asset Utilization**: Turn idle wedding inventory into steady weekly rental revenue!\n\n" +
      "Click 'Partner With Us' in the menu or visit our Partner page to get verified within 24 hours.",
    chips: ["Partner Page", "Contact support"],
    actionButtons: [{ label: "🤝 Become a Partner", path: "/partner" }],
  },

  // ── 9. CONTACT & SUPPORT ──────────────────────────────────
  {
    id: "contact-support",
    category: "Support",
    keywords: ["contact", "support", "phone", "call", "whatsapp", "email", "customer care", "help line"],
    patterns: [/how to (contact|reach|call)/i, /customer (care|support|service)/i, /phone number/i],
    question: "How can I contact RentStyle customer support?",
    answer:
      "We're always here to assist you!\n\n" +
      "• **WhatsApp & Phone**: +91 98230 00000 (Mon–Sat, 10:00 AM – 8:30 PM)\n" +
      "• **Email**: support@rentstyle-nashik.in\n" +
      "• **Nashik HQ**: College Road Commercial Complex, Nashik, Maharashtra\n" +
      "• **Live AI Stylist**: Available right here in this chat 24/7!",
    chips: ["Where are shops?", "How it works"],
  },

  // ── 10. GREETINGS & INTRO ─────────────────────────────────
  {
    id: "greetings",
    category: "Greetings",
    keywords: ["hello", "hi", "hey", "namaste", "good morning", "good evening", "good afternoon", "sup"],
    patterns: [/^(hi|hello|hey|namaste|hola|hie|good (morning|afternoon|evening))/i],
    question: "Hello! How can RentStyle assist you today?",
    answer:
      "Namaste! 🙏 Welcome to **RentStyle Nashik** — your luxury designer wardrobe on rent.\n\n" +
      "I am your **AI Stylist & Concierge**. You can ask me anything about:\n" +
      "• How rental works and duration\n" +
      "• Security deposits and refunds\n" +
      "• Outfit recommendations for Sangeet, Weddings, or Parties\n" +
      "• Boutiques located in College Road, Gangapur Road & Panchavati\n" +
      "• Sizing, fitting, hygiene & care policies\n\n" +
      "What outfit or occasion are you planning for?",
    chips: ["How does rental work?", "Security deposit rules", "Sangeet recommendations", "Nashik boutique locations"],
  },
  {
    id: "thank-you",
    category: "Greetings",
    keywords: ["thanks", "thank you", "dhanyawad", "shukriya", "great", "awesome", "perfect"],
    patterns: [/thank(s| you)?/i, /dhanyawad/i, /shukriya/i],
    question: "Thank you for visiting RentStyle!",
    answer:
      "You're very welcome! ✨ We can't wait to see you shine at your event. If you need any more outfit advice or booking help, feel free to ask anytime. Happy styling!",
    chips: ["Browse All Garments", "View Shops in Nashik"],
  },
  {
    id: "who-are-you",
    category: "About",
    keywords: ["who are you", "what are you", "bot", "ai", "gemini", "about you"],
    patterns: [/who are you/i, /what can you do/i, /are you (an ai|a bot)/i],
    question: "Who is the RentStyle Concierge?",
    answer:
      "I am the **RentStyle Virtual Stylist & Concierge**! 👗✨\n\n" +
      "I help Nashik fashion lovers discover premium designer outfits for rent, calculate deposits, understand try-on and cleaning policies, and locate the best partner boutiques across the city.\n\n" +
      "When enabled, I connect with Google Gemini AI for smart fashion consultation, and I always have our complete Nashik rental rules database available offline!",
    chips: ["How does rental work?", "Security deposit", "Recommend Sangeet outfit"],
  },
];

// ── Smart Offline Matching Algorithm ────────────────────────
export function matchOfflineQuery(rawQuery) {
  if (!rawQuery || typeof rawQuery !== "string") return null;

  const query = rawQuery.trim().toLowerCase();
  if (!query) return null;

  // 1. Check exact pattern matches
  for (const entry of KNOWLEDGE_BASE) {
    if (entry.patterns && entry.patterns.some((rgx) => rgx.test(query))) {
      return { entry, score: 100, source: "pattern" };
    }
  }

  // 2. Score by token and keyword overlaps
  const queryTokens = query
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);

  let bestEntry = null;
  let highestScore = 0;

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0;

    // Check exact keyword phrase presence
    for (const kw of entry.keywords) {
      const kwLower = kw.toLowerCase();
      if (query.includes(kwLower)) {
        score += 30;
      }
    }

    // Check individual token presence in keywords or question
    const entryText = (entry.keywords.join(" ") + " " + entry.question).toLowerCase();
    for (const token of queryTokens) {
      if (entryText.includes(token)) {
        score += 10;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestEntry = entry;
    }
  }

  // Threshold check
  if (bestEntry && highestScore >= 15) {
    return { entry: bestEntry, score: highestScore, source: "keyword" };
  }

  // 3. Fallback generic guidance if query couldn't be matched
  return {
    entry: {
      id: "fallback-general",
      category: "Help",
      question: "Need help finding information on RentStyle?",
      answer:
        "I didn't quite catch that specific inquiry, but here are the most common things Nashik renters ask about:\n\n" +
        "• **Rental Flow**: 3-day standard booking with try-on available at partner boutiques.\n" +
        "• **Security Deposit**: 100% refundable upon return via UPI within 1–2 hours.\n" +
        "• **Cleanliness**: All garments are professionally dry cleaned and steam sanitized.\n" +
        "• **Locations**: Boutiques in College Road, Gangapur Road, Canada Corner & Panchavati.\n\n" +
        "Try asking: *'How does deposit work?'*, *'Can I try before renting?'*, or *'Recommend an outfit for Sangeet'*!",
      chips: ["How does rental work?", "Security deposit rules", "Where are shops in Nashik?", "Can I try before renting?"],
      actionButtons: [
        { label: "👗 Browse All Garments", path: "/search" },
        { label: "📍 View Partner Shops", path: "/shops" },
      ],
    },
    score: 0,
    source: "fallback",
  };
}
