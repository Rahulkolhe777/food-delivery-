/**
 * Review API service.
 * Endpoints: POST /api/reviews, GET /api/restaurants/:id/reviews
 * Documented in /docs/API_REFERENCE.md § 7.
 */
import api from "@/lib/api";

/**
 * POST /api/reviews  (customer only)
 * Constraints:
 *  - orderId must belong to logged-in customer
 *  - order.status must be "delivered"
 *  - Exactly one review per order
 *
 * @param {{ orderId: string, rating: number, comment?: string }} payload
 */
export async function createReview({ orderId, rating, comment = "" }) {
  const { data } = await api.post("/api/reviews", { orderId, rating, comment });
  return data; // { review }
}

/**
 * GET /api/restaurants/:id/reviews?page=&limit=
 */
export async function getRestaurantReviews(restaurantId, params = {}) {
  const { data } = await api.get(`/api/restaurants/${restaurantId}/reviews`, { params });
  return data; // { page, limit, total, totalPages, reviews[] }
}

