/**
 * ProtectedRoute — guards routes that require authentication.
 * Redirects to /login with the original path stored for post-login redirect.
 */
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import PageLoader from "@/components/ui/PageLoader";

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, isInitialising, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isInitialising) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect owners trying to access customer pages and vice versa
    const fallback = user.role === "owner" ? "/owner" : "/";
    return <Navigate to={fallback} replace />;
  }

  return children;
}

