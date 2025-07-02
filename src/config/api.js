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
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor for debugging and adding auth token
api.interceptors.request.use(
  (config) => {
    // Add access token to requests if available
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    console.log('Request headers:', config.headers);
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
    console.log(`Response from ${response.config.url}:`, response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      console.log('Authentication error - redirecting to login');
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
