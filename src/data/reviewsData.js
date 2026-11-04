// ============================================================
// RentStyle Nashik — Product Reviews & Feedback Data System
// Real, culturally contextual dummy reviews for Nashik garment rentals
// + LocalStorage sync for new user-submitted reviews
// ============================================================

export const SEED_REVIEWS = [
  // ── PARTY WEAR & GOWNS ────────────────────────────────────
  {
    id: "rev-1001-1",
    garmentId: "NSK-G-1001",
    category: "party-wear",
    userName: "Snehal Kulkarni",
    userLocation: "College Road, Nashik",
    rating: 5,
    date: "3 days ago",
    title: "Stole the show at my sister's reception!",
    comment:
      "Rented this black sequin gown for an evening reception at Grape County Nashik. The fit was absolutely tailor-made! The fabric felt luxurious and it came freshly dry-cleaned in a premium garment bag. The deposit was refunded to my UPI within 2 hours of dropping it back at the shop.",
    occasion: "Wedding Reception",
    sizeRented: "M",
    fit: "True to Size",
    qualityScore: 5,
    cleaningScore: 5,
    verified: true,
    helpfulCount: 19,
  },
  {
    id: "rev-1001-2",
    garmentId: "NSK-G-1001",
    category: "party-wear",
    userName: "Pooja Deshmukh",
    userLocation: "Gangapur Road, Nashik",
    rating: 5,
    date: "1 week ago",
    title: "Incredible value for money — zero maintenance hassle",
    comment:
      "Buying a gown like this would cost at least ₹12,000 and sit in my closet forever. Getting it for ₹700 on RentStyle is a game changer. The sequin work is immaculate and it photographs like a dream under chandeliers.",
    occasion: "Cocktail Party",
    sizeRented: "S",
    fit: "True to Size",
    qualityScore: 5,
    cleaningScore: 5,
    verified: true,
    helpfulCount: 14,
  },
  {
    id: "rev-1001-3",
    garmentId: "NSK-G-1001",
    category: "party-wear",
    userName: "Rhea Merchant",
    userLocation: "Indira Nagar, Nashik",
    rating: 4,
    date: "2 weeks ago",
    title: "Gorgeous gown, slightly long for 5'2\"",
    comment:
      "The sequin finish is breathtaking. Since I'm 5'2\", I wore 3.5-inch heels and it fell gracefully. The shop owner on College Road was super polite and let me do a trial run before the event day.",
    occasion: "Birthday Gala",
    sizeRented: "M",
    fit: "Runs Large",
    qualityScore: 4,
    cleaningScore: 5,
    verified: true,
    helpfulCount: 8,
  },

  // ── LEHENGAS ──────────────────────────────────────────────
  {
    id: "rev-1004-1",
    garmentId: "NSK-G-1004",
    category: "lehenga",
    userName: "Ananya Patil",
    userLocation: "Gangapur Road, Nashik",
    rating: 5,
    date: "4 days ago",
    title: "Pure royal grandeur! Everyone thought I bought it from Mumbai",
    comment:
      "The crimson silk and heavy zardosi work are out of this world! I wore it for my cousin's Sangeet ceremony. The can-can flare was huge and majestic. Best part was not having to worry about dry cleaning after dancing all night.",
    occasion: "Sangeet Ceremony",
    sizeRented: "M",
    fit: "True to Size",
    qualityScore: 5,
    cleaningScore: 5,
    verified: true,
    helpfulCount: 27,
  },
  {
    id: "rev-1004-2",
    garmentId: "NSK-G-1004",
    category: "lehenga",
    userName: "Divya Sanap",
    userLocation: "Panchavati, Nashik",
    rating: 5,
    date: "2 weeks ago",
    title: "Flawless condition and great security deposit process",
    comment:
      "Rented from Shreeja Collection through RentStyle. They did a quick measurement check during pickup and even provided safety pins and latkans. Booking online in advance saved me so much weekend running around.",
    occasion: "Engagement",
    sizeRented: "L",
    fit: "True to Size",
    qualityScore: 5,
    cleaningScore: 5,
    verified: true,
    helpfulCount: 16,
  },
  {
    id: "rev-1005-1",
    garmentId: "NSK-G-1005",
    category: "lehenga",
    userName: "Mrunal Joshi",
    userLocation: "Canada Corner, Nashik",
    rating: 5,
    date: "1 week ago",
    title: "Dreamy pink floral lehenga for daytime Haldi & Sangeet",
    comment:
      "Super lightweight net with delicate floral embroidery. Easy to move, twirl, and dance in! Cleanliness was 10/10 — smelled fresh like rose water. Highly recommend RentStyle to all brides and bridesmaids in Nashik.",
    occasion: "Haldi & Sangeet",
    sizeRented: "M",
    fit: "True to Size",
    qualityScore: 5,
    cleaningScore: 5,
    verified: true,
    helpfulCount: 22,
  },

  // ── SHERWANI & SUITS ──────────────────────────────────────
  {
    id: "rev-sherwani-1",
    garmentId: "NSK-G-1010",
    category: "sherwani",
    userName: "Aditya Shinde",
    userLocation: "College Road, Nashik",
    rating: 5,
    date: "5 days ago",
    title: "Felt like royalty at my brother's wedding",
    comment:
      "The embroidery on the raw silk was crisp and elegant. The shop included the matching stole and safa. Renting made 100x more sense than dropping ₹35k on a suit I'd wear only once. 10/10 experience.",
    occasion: "Wedding Ceremony",
    sizeRented: "XL",
    fit: "True to Size",
    qualityScore: 5,
    cleaningScore: 5,
    verified: true,
    helpfulCount: 31,
  },
  {
    id: "rev-suit-1",
    garmentId: "NSK-G-1011",
    category: "suits",
    userName: "Kunal Bhalerao",
    userLocation: "Satpur, Nashik",
    rating: 4,
    date: "1 week ago",
    title: "Sharp Italian cut, great fabric feel",
    comment:
      "Needed a charcoal tuxedo for a corporate banquet at Radisson Blu Nashik. Picked it up on Friday, returned Sunday afternoon. Seamless check-in and checkout. The collar was steam-pressed perfectly.",
    occasion: "Corporate Gala",
    sizeRented: "L",
    fit: "True to Size",
    qualityScore: 4,
    cleaningScore: 5,
    verified: true,
    helpfulCount: 11,
  },

  // ── SAREES & BRIDAL ───────────────────────────────────────
  {
    id: "rev-saree-1",
    garmentId: "NSK-G-1008",
    category: "sarees",
    userName: "Radhika Kapse",
    userLocation: "Panchavati, Nashik",
    rating: 5,
    date: "3 days ago",
    title: "Authentic Paithani silk sheen — pure tradition",
    comment:
      "The zari pallu was immaculate. Many guests praised the rich peacock motifs. Rented from Panchavati boutique. The fallback blouse piece fit nicely with minor hook adjustments.",
    occasion: "Ganesh Chaturthi Pooja",
    sizeRented: "Free Size",
    fit: "True to Size",
    qualityScore: 5,
    cleaningScore: 5,
    verified: true,
    helpfulCount: 15,
  },
];

// Fallback template reviews for garments that don't have explicit IDs
export const CATEGORY_TEMPLATE_REVIEWS = {
  "party-wear": [
    {
      id: "cat-pw-1",
      userName: "Kareena Wagh",
      userLocation: "College Road, Nashik",
      rating: 5,
      date: "4 days ago",
      title: "Extremely stylish and comfort-focused",
      comment: "Rented this for a celebration party. The silhouette is very flattering and the fabric doesn't itch at all. RentStyle made the booking so effortless!",
      occasion: "Cocktail Party",
      sizeRented: "M",
      fit: "True to Size",
      qualityScore: 5,
      cleaningScore: 5,
      verified: true,
      helpfulCount: 12,
    },
    {
      id: "cat-pw-2",
      userName: "Tanvi Pawar",
      userLocation: "Gangapur Road, Nashik",
      rating: 4,
      date: "1 week ago",
      title: "Clean, pristine and ready-to-wear",
      comment: "Received the outfit in sterile sealed packaging. Looked identical to the catalog photos. Will rent again for upcoming wedding season.",
      occasion: "Engagement",
      sizeRented: "S",
      fit: "True to Size",
      qualityScore: 4,
      cleaningScore: 5,
      verified: true,
      helpfulCount: 7,
    },
  ],
  lehenga: [
    {
      id: "cat-leh-1",
      userName: "Sakshi Tambe",
      userLocation: "Indira Nagar, Nashik",
      rating: 5,
      date: "5 days ago",
      title: "Spectacular flare and heavy artisan embroidery",
      comment: "Wore this to a destination sangeet. The compliments kept coming! The boutique staff in Nashik took great care explaining how to fold and return it safely.",
      occasion: "Sangeet Night",
      sizeRented: "M",
      fit: "True to Size",
      qualityScore: 5,
      cleaningScore: 5,
      verified: true,
      helpfulCount: 18,
    },
    {
      id: "cat-leh-2",
      userName: "Aishwarya Borse",
      userLocation: "College Road, Nashik",
      rating: 5,
      date: "2 weeks ago",
      title: "10/10 Hygiene & Hassle-free return",
      comment: "I was initially skeptical about renting wedding wear, but RentStyle's 7-stage quality check proved me wrong. It felt completely brand new.",
      occasion: "Family Wedding",
      sizeRented: "L",
      fit: "True to Size",
      qualityScore: 5,
      cleaningScore: 5,
      verified: true,
      helpfulCount: 9,
    },
  ],
  "wedding-wear": [
    {
      id: "cat-wed-1",
      userName: "Nikhil Sonawane",
      userLocation: "Canada Corner, Nashik",
      rating: 5,
      date: "6 days ago",
      title: "Imposing royal look without breaking the bank",
      comment: "Saved over ₹30,000 renting this for my best friend's baraat. Top-tier craftsmanship and spotless condition.",
      occasion: "Wedding",
      sizeRented: "XL",
      fit: "True to Size",
      qualityScore: 5,
      cleaningScore: 5,
      verified: true,
      helpfulCount: 14,
    },
  ],
  sherwani: [
    {
      id: "cat-sher-1",
      userName: "Gaurav Jadhav",
      userLocation: "Panchavati, Nashik",
      rating: 5,
      date: "1 week ago",
      title: "Fit was sharp and embroidery was pristine",
      comment: "The button detailing and zari border looked so regal. The shop team even assisted with the turban draping advice.",
      occasion: "Reception",
      sizeRented: "L",
      fit: "True to Size",
      qualityScore: 5,
      cleaningScore: 5,
      verified: true,
      helpfulCount: 13,
    },
  ],
  suits: [
    {
      id: "cat-suit-1",
      userName: "Sumeet Deshmukh",
      userLocation: "Gangapur Road, Nashik",
      rating: 5,
      date: "3 days ago",
      title: "Modern slim fit, premium wool blend",
      comment: "Ideal for evening receptions or formal banquets. Received it crisp, pressed and odor-free.",
      occasion: "Reception",
      sizeRented: "M",
      fit: "True to Size",
      qualityScore: 5,
      cleaningScore: 5,
      verified: true,
      helpfulCount: 8,
    },
  ],
  gowns: [
    {
      id: "cat-gown-1",
      userName: "Natasha Roy",
      userLocation: "College Road, Nashik",
      rating: 5,
      date: "2 days ago",
      title: "Felt like a movie star!",
      comment: "Floor length elegance with the right amount of shimmer. It danced beautifully under the lights. Renting on RentStyle is now my go-to fashion hack.",
      occasion: "Cocktail Party",
      sizeRented: "S",
      fit: "True to Size",
      qualityScore: 5,
      cleaningScore: 5,
      verified: true,
      helpfulCount: 21,
    },
  ],
};

const STORAGE_KEY = "rns_product_reviews";
const HELPFUL_STORAGE_KEY = "rns_helpful_reviews";

// Helper to fetch custom user reviews from localStorage
export function getStoredReviews() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("Could not load stored reviews", e);
    return [];
  }
}

// Get reviews for a specific garment (combining seed + category fallbacks + stored user reviews)
export function getGarmentReviews(garmentId, category = "party-wear") {
  const stored = getStoredReviews().filter((r) => r.garmentId === garmentId);
  const explicitSeeds = SEED_REVIEWS.filter((r) => r.garmentId === garmentId);

  // If we already have explicit seeds or stored reviews, return them
  if (stored.length > 0 || explicitSeeds.length > 0) {
    return [...stored, ...explicitSeeds];
  }

  // Otherwise, fallback to category templates plus generic seeds to ensure EVERY garment has rich social proof
  const categoryFallback = (CATEGORY_TEMPLATE_REVIEWS[category] || CATEGORY_TEMPLATE_REVIEWS["party-wear"]).map(
    (item, idx) => ({
      ...item,
      id: `${garmentId}-cat-${idx}`,
      garmentId,
    })
  );

  return [...stored, ...categoryFallback];
}

// Add a new review to localStorage
export function saveGarmentReview(reviewData) {
  try {
    const existing = getStoredReviews();
    const newReview = {
      id: `usr-rev-${Date.now()}`,
      date: "Just now",
      verified: true,
      helpfulCount: 0,
      qualityScore: 5,
      cleaningScore: 5,
      ...reviewData,
    };
    const updated = [newReview, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newReview;
  } catch (e) {
    console.error("Error saving review to localStorage", e);
    return null;
  }
}

// Track helpful votes
export function voteHelpful(reviewId) {
  try {
    const helpfulList = JSON.parse(localStorage.getItem(HELPFUL_STORAGE_KEY) || "[]");
    if (helpfulList.includes(reviewId)) {
      return { success: false, alreadyVoted: true };
    }
    helpfulList.push(reviewId);
    localStorage.setItem(HELPFUL_STORAGE_KEY, JSON.stringify(helpfulList));
    return { success: true, alreadyVoted: false };
  } catch (e) {
    return { success: false, error: e };
  }
}

export function hasVotedHelpful(reviewId) {
  try {
    const helpfulList = JSON.parse(localStorage.getItem(HELPFUL_STORAGE_KEY) || "[]");
    return helpfulList.includes(reviewId);
  } catch (e) {
    return false;
  }
}

// Compute comprehensive rating metrics
export function calculateReviewStats(reviews = []) {
  if (!reviews.length) {
    return {
      averageRating: 4.9,
      totalCount: 0,
      breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      breakdownPct: { 5: 90, 4: 10, 3: 0, 2: 0, 1: 0 },
      fitStats: { trueToSize: 94, runsSmall: 4, runsLarge: 2 },
      recommendPct: 98,
      qualityScore: 4.9,
      cleanlinessScore: 5.0,
    };
  }

  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sum = 0;
  let trueToSizeCount = 0;
  let runsSmallCount = 0;
  let runsLargeCount = 0;

  reviews.forEach((r) => {
    const rInt = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
    breakdown[rInt] = (breakdown[rInt] || 0) + 1;
    sum += Number(r.rating || 5);

    const fit = (r.fit || "True to Size").toLowerCase();
    if (fit.includes("small")) runsSmallCount++;
    else if (fit.includes("large")) runsLargeCount++;
    else trueToSizeCount++;
  });

  const total = reviews.length;
  const avg = (sum / total).toFixed(1);

  const breakdownPct = {
    5: Math.round((breakdown[5] / total) * 100),
    4: Math.round((breakdown[4] / total) * 100),
    3: Math.round((breakdown[3] / total) * 100),
    2: Math.round((breakdown[2] / total) * 100),
    1: Math.round((breakdown[1] / total) * 100),
  };

  const trueToSizePct = Math.round((trueToSizeCount / total) * 100);
  const runsSmallPct = Math.round((runsSmallCount / total) * 100);
  const runsLargePct = Math.max(0, 100 - trueToSizePct - runsSmallPct);

  return {
    averageRating: parseFloat(avg),
    totalCount: total,
    breakdown,
    breakdownPct,
    fitStats: {
      trueToSize: trueToSizePct || 92,
      runsSmall: runsSmallPct || 5,
      runsLarge: runsLargePct || 3,
    },
    recommendPct: Math.min(100, Math.round(((breakdown[5] + breakdown[4]) / total) * 100) || 96),
    qualityScore: 4.9,
    cleanlinessScore: 5.0,
  };
}
