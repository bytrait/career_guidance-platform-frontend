// src/utils/authAxiosInstance.js
import axios from "axios";

const AuthAPI = axios.create({
  baseURL: import.meta.env.VITE_AUTH_BASE_URL, // http://127.0.0.1:3000/api/v2
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export default AuthAPI;
