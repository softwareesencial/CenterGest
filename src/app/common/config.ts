import axios, { type AxiosInstance } from "axios";

// Define the API base URL to match your Postman environment variable

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Create an axios instance for public endpoints (no auth)
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json", // Add this header to match Postman
  },
});

// Optional: Add request interceptor to log requests (helpful for debugging)
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  } 
  
);

export default apiClient;
