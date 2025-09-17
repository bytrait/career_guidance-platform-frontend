import { useEffect, useState } from "react";
import AuthAPI from "../services/authAxiosInstance"; 

function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await AuthAPI.get("/auth/isAuthenticated");
        setIsAuth(true);
      } catch (err) {
        setIsAuth(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuth === null) {
    return <p>Loading...</p>; // or a spinner
  }

  if (isAuth === false) {
    // redirect to auth-service login page
    window.location.href = "http://127.0.0.1:3000"; 
  }

  return children;
}

export default ProtectedRoute;
