/**
 * In-memory auth store.
 *
 * Access tokens are stored here (NOT in localStorage) to protect against XSS.
 * The refresh token lives in the backend-set httpOnly cookie and is never
 * accessible from JavaScript.
 *
 * User profile IS persisted to sessionStorage so a page refresh doesn't log
 * the user out — a fresh /api/auth/refresh call will re-issue the access token.
 */

// ── In-memory token (survives only the current tab session) ──────────────────
let _accessToken = null;

export function getAccessToken() {
  return _accessToken;
}

export function setAccessToken(token) {
  _accessToken = token;
}

// ── User profile helpers (sessionStorage for cross-refresh persistence) ───────
const USER_KEY = "fh_user";

export function getStoredUser() {
  try {
    const raw = sessionStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function storeUser(user) {
  try {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    // sessionStorage may be unavailable in some environments
  }
}

export function clearSession() {
  _accessToken = null;
  try {
    sessionStorage.removeItem(USER_KEY);
  } catch {
    // noop
  }
}

