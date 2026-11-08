/**
 * Order API service.
 * Endpoints: POST /api/orders, GET /api/orders/my,
 * GET /api/restaurants/:id/orders, PATCH /api/orders/:id/status
 * Documented in /docs/API_REFERENCE.md § 6.
 */
import api from "@/lib/api";

/**
 * POST /api/orders  (customer only)
 * Body: { restaurantId, paymentMethod, items: [{ menuItemId, quantity }] }
 */
export async function createOrder({ restaurantId, paymentMethod = "cod", items }) {
  const { data } = await api.post("/api/orders", { restaurantId, paymentMethod, items });
  return data; // { order }
}

/**
 * GET /api/orders/my?page=&limit=  (customer only)
 */
export async function getMyOrders(params = {}) {
  const { data } = await api.get("/api/orders/my", { params });
  return data; // { page, limit, total, totalPages, orders[] }
}

/**
 * GET /api/restaurants/:id/orders?page=&limit=&status=  (owner only)
 */
export async function getRestaurantOrders(restaurantId, params = {}) {
  const { data } = await api.get(`/api/restaurants/${restaurantId}/orders`, { params });
  return data; // { page, limit, total, totalPages, orders[] }
}

/**
 * PATCH /api/orders/:id/status  (owner only)
 * Body: { status: "preparing" | "delivered" | "cancelled" }
 */
export async function updateOrderStatus(orderId, status) {
  const { data } = await api.patch(`/api/orders/${orderId}/status`, { status });
  return data; // { order }
}

