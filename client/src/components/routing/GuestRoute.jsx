/**
 * GuestRoute — redirects already-authenticated users away from auth pages.
 * Owners go to /owner, customers go to /.
 */
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import PageLoader from "@/components/ui/PageLoader";

export default function GuestRoute({ children }) {
  const { user, isInitialising } = useAuth();

  if (isInitialising) {
    return <PageLoader />;
  }

  if (user) {
    const destination = user.role === "owner" ? "/owner" : "/";
    return <Navigate to={destination} replace />;
  }

  return children;
}

