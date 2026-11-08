/**
 * Analytics API service.
 * Endpoints: GET /api/restaurants/:id/revenue, GET /api/restaurants/:id/top-customers,
 * and GET /api/analytics/restaurants/:id/top-dishes (501 stub).
 * Documented in /docs/API_REFERENCE.md § 8.
 */
import api from "@/lib/api";

/**
 * GET /api/restaurants/:id/revenue?from=&to=  (owner only)
 */
export async function getRestaurantRevenue(restaurantId, params = {}) {
  const { data } = await api.get(`/api/restaurants/${restaurantId}/revenue`, { params });
  return data; // { message, revenue, from, to, days[{ date, revenue }] }
}

/**
 * GET /api/restaurants/:id/top-customers  (owner only)
 */
export async function getTopCustomers(restaurantId) {
  const { data } = await api.get(`/api/restaurants/${restaurantId}/top-customers`);
  return data; // { message, topCustomers[{ _id, totalRevenue, totalOrder, averageOrderValue, user }] }
}

/**
 * GET /api/analytics/restaurants/:id/top-dishes  (owner only)
 * Backend task 2 stub endpoint
 */
export async function getTopDishes(restaurantId) {
  const { data } = await api.get(`/api/analytics/restaurants/${restaurantId}/top-dishes`);
  return data;
}

