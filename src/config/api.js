import axios from 'axios';

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

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout for slower Render.com hosting
});

// Request interceptor for debugging and adding auth token
api.interceptors.request.use(
  (config) => {
    // Add access token to requests if available
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Only log in development and reduce verbosity
    if (import.meta.env.DEV) {
      console.log(`API: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging and error handling
api.interceptors.response.use(
  (response) => {
    // Only log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`API Success: ${response.config.url}`, response.data.message || 'OK');
    }
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data?.message || error.message);
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      console.log('Authentication error - clearing tokens');
      // Clear invalid token
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      
      // You might want to redirect to login page here
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Export the axios instance as default
export default api;
