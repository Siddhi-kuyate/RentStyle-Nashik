import React, { createContext, useContext, useReducer, useEffect } from "react";

const AppContext = createContext(null);

const initialState = {
  // Auth
  user: JSON.parse(localStorage.getItem("rns_user") || "null"),
  isLoggedIn: !!localStorage.getItem("rns_user"),

  // Compare list (max 4)
  compareList: JSON.parse(localStorage.getItem("rns_compare") || "[]"),

  // Favorites
  favorites: JSON.parse(localStorage.getItem("rns_favorites") || "[]"),

  // Recently viewed
  recentlyViewed: JSON.parse(localStorage.getItem("rns_recent") || "[]"),

  // Search state
  searchQuery: "",
  searchFilters: {},

  // Notifications (demo)
  notifications: [],

  // Bookings (demo, stored in localStorage)
  bookings: JSON.parse(localStorage.getItem("rns_bookings") || "[]"),
};

function reducer(state, action) {
  switch (action.type) {
    // ── AUTH ────────────────────────────────────────────────
    case "LOGIN": {
      localStorage.setItem("rns_user", JSON.stringify(action.payload));
      return { ...state, user: action.payload, isLoggedIn: true };
    }
    case "LOGOUT": {
      localStorage.removeItem("rns_user");
      return { ...state, user: null, isLoggedIn: false };
    }

    // ── COMPARE ─────────────────────────────────────────────
    case "ADD_TO_COMPARE": {
      if (state.compareList.length >= 4) return state;
      if (state.compareList.find((g) => g.id === action.payload.id)) return state;
      const updated = [...state.compareList, action.payload];
      localStorage.setItem("rns_compare", JSON.stringify(updated));
      return { ...state, compareList: updated };
    }
    case "REMOVE_FROM_COMPARE": {
      const updated = state.compareList.filter((g) => g.id !== action.payload);
      localStorage.setItem("rns_compare", JSON.stringify(updated));
      return { ...state, compareList: updated };
    }
    case "CLEAR_COMPARE": {
      localStorage.removeItem("rns_compare");
      return { ...state, compareList: [] };
    }

    // ── FAVORITES ───────────────────────────────────────────
    case "TOGGLE_FAVORITE": {
      const exists = state.favorites.includes(action.payload);
      const updated = exists
        ? state.favorites.filter((id) => id !== action.payload)
        : [...state.favorites, action.payload];
      localStorage.setItem("rns_favorites", JSON.stringify(updated));
      return { ...state, favorites: updated };
    }

    // ── RECENTLY VIEWED ─────────────────────────────────────
    case "ADD_RECENTLY_VIEWED": {
      const filtered = state.recentlyViewed.filter((id) => id !== action.payload);
      const updated = [action.payload, ...filtered].slice(0, 10);
      localStorage.setItem("rns_recent", JSON.stringify(updated));
      return { ...state, recentlyViewed: updated };
    }

    // ── SEARCH ──────────────────────────────────────────────
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    case "SET_FILTERS":
      return { ...state, searchFilters: action.payload };
    case "CLEAR_FILTERS":
      return { ...state, searchFilters: {}, searchQuery: "" };

    // ── BOOKINGS ────────────────────────────────────────────
    case "ADD_BOOKING": {
      const updated = [...state.bookings, action.payload];
      localStorage.setItem("rns_bookings", JSON.stringify(updated));
      return { ...state, bookings: updated };
    }
    case "UPDATE_BOOKING": {
      const updated = state.bookings.map((b) =>
        b.id === action.payload.id ? { ...b, ...action.payload } : b
      );
      localStorage.setItem("rns_bookings", JSON.stringify(updated));
      return { ...state, bookings: updated };
    }

    // ── NOTIFICATIONS ───────────────────────────────────────
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };
    case "MARK_NOTIFICATIONS_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

// ── Convenience hooks ───────────────────────────────────────
export function useAuth() {
  const { state, dispatch } = useApp();
  const login = (userData) => dispatch({ type: "LOGIN", payload: userData });
  const logout = () => dispatch({ type: "LOGOUT" });
  return { user: state.user, isLoggedIn: state.isLoggedIn, login, logout };
}

export function useCompare() {
  const { state, dispatch } = useApp();
  return {
    compareList: state.compareList,
    addToCompare: (g) => dispatch({ type: "ADD_TO_COMPARE", payload: g }),
    removeFromCompare: (id) => dispatch({ type: "REMOVE_FROM_COMPARE", payload: id }),
    clearCompare: () => dispatch({ type: "CLEAR_COMPARE" }),
    isInCompare: (id) => state.compareList.some((g) => g.id === id),
  };
}

export function useFavorites() {
  const { state, dispatch } = useApp();
  return {
    favorites: state.favorites,
    toggleFavorite: (id) => dispatch({ type: "TOGGLE_FAVORITE", payload: id }),
    isFavorite: (id) => state.favorites.includes(id),
  };
}
