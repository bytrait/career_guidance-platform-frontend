import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // like http://localhost:4000/api
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;
