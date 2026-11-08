/**
 * AuthContext — application-wide authentication state.
 *
 * Responsibilities:
 *  - Stores and exposes the current user profile.
 *  - Calls /api/auth/refresh on initial mount so a page refresh
 *    doesn't log the user out (the httpOnly cookie is still valid).
 *  - Exposes login / logout helpers that update the in-memory token
 *    and session-stored user profile.
 */
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  setAccessToken,
  clearSession,
  getStoredUser,
  storeUser,
} from "@/store/authStore";
import { refreshToken } from "@/services/auth.service";
import { logout as logoutApi } from "@/services/auth.service";

// ── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  // "checking" = initial refresh is in flight (prevents flicker)
  const [isInitialising, setIsInitialising] = useState(true);

  // On mount, attempt a silent token refresh so the user stays logged in
  // after a hard page reload (the httpOnly cookie is still alive).
  useEffect(() => {
    let mounted = true;

    async function silentRefresh() {
      try {
        const { accessToken } = await refreshToken();
        setAccessToken(accessToken);
        // User profile is already in sessionStorage — no extra /me call needed.
      } catch {
        // Cookie is absent / expired → treat as logged-out
        clearSession();
        if (mounted) setUser(null);
      } finally {
        if (mounted) setIsInitialising(false);
      }
    }

    silentRefresh();
    return () => {
      mounted = false;
    };
  }, []);

  // Called after successful login or register
  const handleAuthSuccess = useCallback(({ user: profile, accessToken }) => {
    setAccessToken(accessToken);
    storeUser(profile);
    setUser(profile);
  }, []);

  // Called on logout
  const handleLogout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // Even if the API call fails, clear client-side state
    } finally {
      clearSession();
      setUser(null);
    }
  }, []);

  const value = {
    user,
    isInitialising,
    isAuthenticated: !!user,
    isOwner: user?.role === "owner",
    isCustomer: user?.role === "customer",
    handleAuthSuccess,
    handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}

