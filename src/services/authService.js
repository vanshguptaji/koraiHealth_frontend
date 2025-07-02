import api, { API_ENDPOINTS } from '../config/api.js';

// Log the base URL for debugging
console.log('Auth Service initialized');

// Authentication API services
export const authAPI = {
  // Register user
  register: async (userData) => {
    const response = await api.post(API_ENDPOINTS.USER.REGISTER, {
      fullName: userData.name,
      email: userData.email,
      username: userData.email, // Using email as username for simplicity
      password: userData.password,
    });
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post(API_ENDPOINTS.USER.LOGIN, credentials);
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post(API_ENDPOINTS.USER.LOGOUT);
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get(API_ENDPOINTS.USER.CURRENT_USER);
    return response.data;
  },

  // Refresh access token
  refreshToken: async () => {
    const response = await api.post(API_ENDPOINTS.USER.REFRESH_TOKEN);
    return response.data;
  },
};

export default api;
