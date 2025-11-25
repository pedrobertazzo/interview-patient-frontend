import axios from "axios";

// @ts-ignore
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const http = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
  timeout: 10000,
});

http.interceptors.response.use(
  (r) => r,
  (err) => {
    console.error(
      "API Error:",
      err.response?.status,
      err.response?.data || err.message
    );
    return Promise.reject(err);
  }
);
