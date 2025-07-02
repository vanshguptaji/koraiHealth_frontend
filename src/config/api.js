// Backend API configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api/v1';

// Log the API URL for debugging
console.log('API Base URL:', API_BASE_URL);

// API endpoints
export const API_ENDPOINTS = {
  USER: {
    REGISTER: '/users/register',
    LOGIN: '/users/login',
    LOGOUT: '/users/logout',
    CURRENT_USER: '/users/current-user',
    REFRESH_TOKEN: '/users/refresh-token',
  }
};

// Axios configuration
export const axiosConfig = {
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
};
