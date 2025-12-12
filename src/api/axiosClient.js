import axios from 'axios';

// Base Axios instance for backend API calls
// - baseURL: taken from Vite env var VITE_API_BASE_URL (e.g. https://api.example.com)
// - timeout: adjust as needed
// - withCredentials: set to true if your backend uses cookies
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 15000,
  withCredentials: false,
});

// Helper to read the Google auth token (ID token or access token)
// Adjust this function to match how/where you actually store the token.
function getGoogleAuthToken() {
  // Example: token stored in localStorage after Google sign‑in
  // e.g. localStorage.setItem('google_id_token', idToken)
  return (
    localStorage.getItem('token') ||
    localStorage.getItem('auth_token') ||
    localStorage.getItem('google_id_token')
  );
}

// Request interceptor: attach Google auth token to every request if available
axiosClient.interceptors.request.use(
  (config) => {
    const token = getGoogleAuthToken();

    if (token) {
      // Common patterns:
      // 1) Bearer token in Authorization header (recommended)
      // 2) Custom header like X-Google-Token if your backend expects it
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: response interceptor for global error handling
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: if backend returns 401, you might want to clear token / redirect to login
    if (error.response && error.response.status === 401) {
      // TODO: handle unauthorized globally (e.g., logout, redirect, show message)
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
