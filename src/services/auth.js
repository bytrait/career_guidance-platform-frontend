// src/services/auth.js
import AuthAPI from "./authAxiosInstance";

export const logout = async () => {
  try {
    const response = await AuthAPI.post("/auth/logout");
    return response.data;
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};

export const isAuthenticated = async () => {
  try {
    const response = await AuthAPI.get("/auth/isAuthenticated");
    return response.data;
  } catch (error) {
    console.error("Auth check failed:", error);
    throw error;
  }
};
