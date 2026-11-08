/**
 * CartContext — manages the in-app shopping cart with sessionStorage persistence.
 *
 * Rules (mirroring backend constraints):
 *  - Cart is always scoped to a single restaurant.
 *  - Adding an item from a different restaurant clears the cart first
 *    (requires user confirmation — handled at the component level via
 *    the `addItem` return value).
 *  - Each item has a maximum quantity of 20 (backend: 1–20).
 *  - Prices come from the menu item data — NOT passed to the API
 *    (backend recomputes totalAmount server-side for security).
 */
import { createContext, useContext, useReducer, useMemo, useEffect } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = 'foodhub_cart_v1';

function getStoredCart() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.items)) {
      return {
        restaurantId: parsed.restaurantId || null,
        restaurantName: parsed.restaurantName || null,
        items: parsed.items,
        pendingItem: null,
      };
    }
  } catch {
    // Ignore JSON parse errors
  }
  return null;
}

const defaultInitialState = {
  restaurantId: null,
  restaurantName: null,
  items: [], // [{ menuItemId, name, price, quantity }]
  pendingItem: null, // set when user adds from a different restaurant
};

// ── Reducer ───────────────────────────────────────────────────────────────────
function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const { restaurantId, restaurantName, item } = action.payload;

      // If adding from a different restaurant, return a flag asking for confirmation
      if (state.restaurantId && state.restaurantId !== restaurantId) {
        return { ...state, pendingItem: action.payload };
      }

      const existing = state.items.find((i) => i.menuItemId === item.menuItemId);
      const updatedItems = existing
        ? state.items.map((i) =>
            i.menuItemId === item.menuItemId
              ? { ...i, quantity: Math.min(i.quantity + item.quantity, 20) }
              : i
          )
        : [...state.items, { ...item, quantity: Math.min(item.quantity, 20) }];

      return {
        ...state,
        restaurantId,
        restaurantName,
        items: updatedItems,
        pendingItem: null,
      };
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter(
        (i) => i.menuItemId !== action.payload.menuItemId
      );
      return {
        ...state,
        items: updatedItems,
        restaurantId: updatedItems.length === 0 ? null : state.restaurantId,
        restaurantName: updatedItems.length === 0 ? null : state.restaurantName,
      };
    }

    case "UPDATE_QUANTITY": {
      const { menuItemId, quantity } = action.payload;
      if (quantity < 1) {
        const updatedItems = state.items.filter((i) => i.menuItemId !== menuItemId);
        return {
          ...state,
          items: updatedItems,
          restaurantId: updatedItems.length === 0 ? null : state.restaurantId,
          restaurantName: updatedItems.length === 0 ? null : state.restaurantName,
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.menuItemId === menuItemId
            ? { ...i, quantity: Math.min(quantity, 20) }
            : i
        ),
      };
    }

    case "CLEAR_CART":
      return defaultInitialState;

    case "CONFIRM_REPLACE": {
      const { restaurantId, restaurantName, item } = state.pendingItem;
      return {
        restaurantId,
        restaurantName,
        items: [{ ...item, quantity: Math.min(item.quantity, 20) }],
        pendingItem: null,
      };
    }

    case "CANCEL_REPLACE":
      return { ...state, pendingItem: null };

    default:
      return state;
  }
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, null, () => {
    return getStoredCart() || defaultInitialState;
  });

  // Sync state to sessionStorage whenever cart changes
  useEffect(() => {
    try {
      if (state.items.length > 0 && state.restaurantId) {
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            restaurantId: state.restaurantId,
            restaurantName: state.restaurantName,
            items: state.items,
          })
        );
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignore quota errors in private browsing
    }
  }, [state.items, state.restaurantId, state.restaurantName]);

  const totalAmount = useMemo(
    () => state.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [state.items]
  );

  const totalItems = useMemo(
    () => state.items.reduce((sum, i) => sum + i.quantity, 0),
    [state.items]
  );

  const value = {
    ...state,
    totalAmount,
    totalItems,
    // Actions
    addItem: (restaurantId, restaurantName, item) =>
      dispatch({ type: "ADD_ITEM", payload: { restaurantId, restaurantName, item } }),
    removeItem: (menuItemId) =>
      dispatch({ type: "REMOVE_ITEM", payload: { menuItemId } }),
    updateQuantity: (menuItemId, quantity) =>
      dispatch({ type: "UPDATE_QUANTITY", payload: { menuItemId, quantity } }),
    clearCart: () => dispatch({ type: "CLEAR_CART" }),
    confirmReplace: () => dispatch({ type: "CONFIRM_REPLACE" }),
    cancelReplace: () => dispatch({ type: "CANCEL_REPLACE" }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
