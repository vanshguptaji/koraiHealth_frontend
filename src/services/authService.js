import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS, axiosConfig } from '../config/api.js';

// Create axios instance with configuration
const apiClient = axios.create(axiosConfig);

// Log the base URL for debugging
console.log('Auth Service initialized with base URL:', API_BASE_URL);

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Making API request to:', config.baseURL + config.url);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => {
    console.log('API response received:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.error('API error:', error.response?.status, error.response?.data || error.message);
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        console.log('Attempting token refresh...');
        const refreshResponse = await apiClient.post(API_ENDPOINTS.USER.REFRESH_TOKEN);
        const { accessToken } = refreshResponse.data.data;
        
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        console.log('Token refreshed successfully');
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Authentication API services
export const authAPI = {
  // Register user
  register: async (userData) => {
    const response = await apiClient.post(API_ENDPOINTS.USER.REGISTER, {
      fullName: userData.name,
      email: userData.email,
      username: userData.email, // Using email as username for simplicity
      password: userData.password,
    });
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await apiClient.post(API_ENDPOINTS.USER.LOGIN, credentials);
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await apiClient.post(API_ENDPOINTS.USER.LOGOUT);
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await apiClient.get(API_ENDPOINTS.USER.CURRENT_USER);
    return response.data;
  },

  // Refresh access token
  refreshToken: async () => {
    const response = await apiClient.post(API_ENDPOINTS.USER.REFRESH_TOKEN);
    return response.data;
  },
};

export default apiClient;
