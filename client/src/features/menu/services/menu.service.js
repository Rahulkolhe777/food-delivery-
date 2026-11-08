/**
 * Menu API service.
 * Endpoints: GET /api/restaurants/:id/menu, POST /api/restaurants/:id/menu,
 * PATCH /api/restaurants/:id/menu/:itemId, DELETE /api/restaurants/:id/menu/:itemId
 * Documented in /docs/API_REFERENCE.md § 5.
 */
import api from "@/lib/api";

/**
 * GET /api/restaurants/:id/menu?category=&isVeg=
 * @param {string} restaurantId
 * @param {{ category?: string, isVeg?: boolean }} filters
 */
export async function getMenu(restaurantId, filters = {}) {
  const params = {};
  if (filters.category) params.category = filters.category;
  if (filters.isVeg !== undefined) params.isVeg = String(filters.isVeg);
  const { data } = await api.get(`/api/restaurants/${restaurantId}/menu`, { params });
  return data; // { restaurant: { id, name }, count, menuItems[] }
}

/**
 * POST /api/restaurants/:id/menu  (owner only)
 * Body: { name, category, price, isVeg, isAvailable? }
 */
export async function createMenuItem(restaurantId, payload) {
  const { data } = await api.post(`/api/restaurants/${restaurantId}/menu`, payload);
  return data; // { menuItem }
}

/**
 * PATCH /api/restaurants/:id/menu/:itemId  (owner only)
 * Updatable: name, category, price, isVeg, isAvailable
 */
export async function updateMenuItem(restaurantId, itemId, payload) {
  const { data } = await api.patch(`/api/restaurants/${restaurantId}/menu/${itemId}`, payload);
  return data; // { menuItem }
}

/**
 * DELETE /api/restaurants/:id/menu/:itemId  (owner only)
 */
export async function deleteMenuItem(restaurantId, itemId) {
  const { data } = await api.delete(`/api/restaurants/${restaurantId}/menu/${itemId}`);
  return data; // { message: "Menu item deleted" }
}

