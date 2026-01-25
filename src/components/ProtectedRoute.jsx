import { useEffect, useState } from "react";
import AuthAPI from "../services/authAxiosInstance";

/**
 * ProtectedRoute
 *
 * @param {ReactNode} children
 * @param {string[]} roles - optional allowed roles
 */
function ProtectedRoute({ children, roles }) {
  const [authState, setAuthState] = useState({
    loading: true,
    isAuthenticated: false,
    user: null,
  });

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

  // ⏳ Loading
  if (authState.loading) {
    return <p>Loading...</p>; // replace with spinner if needed
  }

  // 🔒 Not authenticated
  if (!authState.isAuthenticated) {
    window.location.href = "https://auth.bytrait.com/";
    return null;
  }

  // 🚫 Role not allowed
  if (roles && !roles.includes(authState.user.role)) {
    return (
      <div className="p-6 text-center text-red-600">
        You are not authorized to access this page.
      </div>
    );
  }

  // ✅ Allowed
  return children;
}

export default ProtectedRoute;
