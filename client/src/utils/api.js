import axios from "axios";
import { toast } from "react-toastify";

// Base API URL
const API_URL = "https://linkvault-srvr.vercel.app/api";

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Ensures cookies are sent with every request
});

// 🚫 No need to manually attach Authorization header anymore
// (the backend now reads accessToken from cookies)

// Global error handling
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const errorMessage = error.response?.data?.message || "Unknown error";

    if (status === 401) {
      switch (errorMessage) {
        case "Session not found or already invalidated.":
        case "Session is invalid or expired.":
        case "User no longer exists.":
        case "Unauthorized. Authentication failed.":
        case "Unauthorized. Invalid token.":
        case "Unauthorized. No access token provided.":
          toast.error("Session expired. Please login again.");
              localStorage.removeItem("user")
          window.location.href = "/login";
          return Promise.reject(error);

        case "Unauthorized. Token has expired.":
          if (!originalRequest._retry) {
            originalRequest._retry = true;
            try {
              // 👇 Attempt silent refresh
              await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
              // 👇 Retry original request after successful refresh
              return API(originalRequest);
            } catch (refreshError) {
              toast.error("Session expired. Please login again.");
              localStorage.removeItem("user")
              window.location.href = "/login";
              return Promise.reject(refreshError);
            }
          }
          break;

        default:
          return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
