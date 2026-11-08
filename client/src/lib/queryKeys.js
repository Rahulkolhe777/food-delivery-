/**
 * Centralized TanStack Query key factories.
 * Keeps cache invalidation consistent across the app.
 *
 * Usage:
 *   queryClient.invalidateQueries({ queryKey: queryKeys.restaurants.all() });
 *   queryClient.invalidateQueries({ queryKey: queryKeys.orders.my() });
 */

export const queryKeys = {
  // ── Auth ──────────────────────────────────────────────────────────────
  auth: {
    me: () => ["auth", "me"],
  },

  // ── Restaurants ───────────────────────────────────────────────────────
  restaurants: {
    all: (filters) => ["restaurants", "list", filters ?? {}],
    detail: (id) => ["restaurants", "detail", id],
  },

  // ── Menu ──────────────────────────────────────────────────────────────
  menu: {
    all: (restaurantId, filters) => ["menu", restaurantId, filters ?? {}],
  },

  // ── Orders ────────────────────────────────────────────────────────────
  orders: {
    my: (params) => ["orders", "my", params ?? {}],
    restaurant: (restaurantId, params) => ["orders", "restaurant", restaurantId, params ?? {}],
  },

  // ── Reviews ───────────────────────────────────────────────────────────
  reviews: {
    restaurant: (restaurantId, params) => ["reviews", "restaurant", restaurantId, params ?? {}],
  },

  // ── Owner Analytics ───────────────────────────────────────────────────
  analytics: {
    revenue: (restaurantId, params) => ["analytics", "revenue", restaurantId, params ?? {}],
    topCustomers: (restaurantId) => ["analytics", "top-customers", restaurantId],
    topDishes: (restaurantId) => ["analytics", "top-dishes", restaurantId],
  },
};
