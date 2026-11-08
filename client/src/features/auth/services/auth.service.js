/**
 * Auth API service.
 * All endpoints are documented in /docs/API_REFERENCE.md § 3.
 */
import api from "@/lib/api";

/** POST /api/auth/register */
export async function register({ name, email, password, role = "customer", city }) {
  const { data } = await api.post("/api/auth/register", { name, email, password, role, city });
  return data; // { message, user, accessToken }
}

/** POST /api/auth/login */
export async function login({ email, password }) {
  const { data } = await api.post("/api/auth/login", { email, password });
  return data; // { message, user, accessToken }
}

/** POST /api/auth/refresh — browser auto-sends the httpOnly cookie */
export async function refreshToken() {
  const { data } = await api.post("/api/auth/refresh");
  return data; // { accessToken }
}

/** POST /api/auth/logout */
export async function logout() {
  const { data } = await api.post("/api/auth/logout");
  return data;
}

/** GET /api/auth/me */
export async function getMe() {
  const { data } = await api.get("/api/auth/me");
  return data; // { user }
}

