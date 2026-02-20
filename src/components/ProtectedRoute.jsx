import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthAPI from "../services/authAxiosInstance";

/**
 * ProtectedRoute
 *
 * @param {ReactNode} children
 * @param {string[]} roles - allowed roles for this route
 */
function ProtectedRoute({ children, roles }) {
  const location = useLocation();

  const [authState, setAuthState] = useState({
    loading: true,
    isAuthenticated: false,
    user: null,
  });

  // 🔁 Default landing pages per role
  const ROLE_HOME = {
    STUDENT: "/",
    COUNSELLOR: "/counsellor/dashboard",
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await AuthAPI.get("/auth/isAuthenticated");

        setAuthState({
          loading: false,
          isAuthenticated: true,
          user: res.data.data, // { id, email, fullName, role }
        });
      } catch (err) {
        setAuthState({
          loading: false,
          isAuthenticated: false,
          user: null,
        });
      }
    };

    checkAuth();
  }, []);

  // ⏳ Loading state
  if (authState.loading) {
    return <p>Loading...</p>; // replace with spinner if needed
  }

  // 🔒 Not authenticated → external auth
  if (!authState.isAuthenticated) {
    window.location.href = "https://auth.bytrait.com/";
    return null;
  }

  // 🚫 Authenticated but wrong role → redirect to correct dashboard
  if (roles && !roles.includes(authState.user.role)) {
    const redirectPath = ROLE_HOME[authState.user.role] || "/";
    return <Navigate to={redirectPath} replace />;
  }

  // ✅ Authorized
  return children;
}

export default ProtectedRoute;
