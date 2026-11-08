/**
 * Centralized Axios instance.
 *
 * In development, we use relative URL (empty baseURL) so all /api requests are
 * transparently forwarded by Vite's development proxy to the backend.
 * This completely avoids cross-origin CORS blocks and ensures the browser
 * treats httpOnly cookies (like refreshToken) on path /api/auth as same-origin.
 */

import axios from "axios";
import { getAccessToken, setAccessToken, clearSession } from "@/store/authStore";

const BASE_URL = import.meta.env.DEV ? "" : (import.meta.env.VITE_API_URL || "");

// ── Primary API client ───────────────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // required for httpOnly refreshToken cookie
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request Interceptor ──────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Refresh Lock ─────────────────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
}

// ── Response Interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isExpiredToken =
      error.response?.status === 401 &&
      error.response?.data?.message === "Access token expired";

    if (isExpiredToken && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue requests that arrive during refresh
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // POST /api/auth/refresh — browser sends the httpOnly cookie automatically
        const { data } = await api.post("/api/auth/refresh");
        const newToken = data.accessToken;
        setAccessToken(newToken);

        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearSession();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
