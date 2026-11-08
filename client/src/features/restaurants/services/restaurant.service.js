/**
 * Restaurant API service.
 * Endpoints: GET /api/restaurants, GET /api/restaurants/:id,
 * POST /api/restaurants, PATCH /api/restaurants/:id, DELETE /api/restaurants/:id
 * Documented in /docs/API_REFERENCE.md § 4 & 5.
 */
import api from "@/lib/api";

/**
 * GET /api/restaurants?page=&limit=&city=
 * @param {{ page?: number, limit?: number, city?: string }} params
 */
export async function getRestaurants(params = {}) {
  const { data } = await api.get("/api/restaurants", { params });
  return data; // { page, limit, total, totalPages, restaurants[] }
}

/**
 * GET /api/restaurants/:id
 * Populates owner: { _id, name }
 */
export async function getRestaurantById(id) {
  const { data } = await api.get(`/api/restaurants/${id}`);
  return data; // { restaurant }
}

/**
 * POST /api/restaurants  (owner only)
 * Body: { name, city, area, cuisines[], lng, lat, isOpen? }
 */
export async function createRestaurant(payload) {
  const { data } = await api.post("/api/restaurants", payload);
  return data; // { restaurant }
}

/**
 * PATCH /api/restaurants/:id  (owner, own restaurant only)
 * Updatable: name, city, area, cuisines, isOpen, lng, lat
 */
export async function updateRestaurant(id, payload) {
  const { data } = await api.patch(`/api/restaurants/${id}`, payload);
  return data; // { restaurant }
}

/**
 * DELETE /api/restaurants/:id  (owner, own restaurant only)
 * Cascades: deletes all menu items.
 */
export async function deleteRestaurant(id) {
  const { data } = await api.delete(`/api/restaurants/${id}`);
  return data; // { message: "Restaurant deleted" }
}

