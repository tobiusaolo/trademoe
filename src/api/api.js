import axios from 'axios';
import { navigateToSignIn } from '../utils/navigation';

// API Base URL - change this to your production URL when deploying
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://trade-backend-xlra.onrender.com';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to extract error message from API response
export const getErrorMessage = (error) => {
  // Handle non-response errors
  if (!error.response) {
    return typeof error.message === 'string' ? error.message : 'An unexpected error occurred';
  }

  const { data } = error.response;
  
  // If detail is a string, return it directly
  if (typeof data?.detail === 'string') {
    return data.detail;
  }
  
  // If detail is an array (validation errors), format them
  if (Array.isArray(data?.detail)) {
    const messages = data.detail
      .map((err) => {
        if (typeof err === 'string') return err;
        if (err && typeof err === 'object') {
          if (err.msg) {
            const field = Array.isArray(err.loc) ? err.loc.slice(-1)[0] : 'field';
            return `${String(field)}: ${String(err.msg)}`;
          }
          // Try to extract any meaningful message
          if (err.message) return String(err.message);
          if (err.error) return String(err.error);
        }
        return 'Validation error';
      })
      .filter(Boolean); // Remove any undefined/null values
    
    return messages.length > 0 ? messages.join(', ') : 'Validation failed';
  }
  
  // If detail is an object, try to extract message
  if (data?.detail && typeof data.detail === 'object' && !Array.isArray(data.detail)) {
    if (data.detail.message) return String(data.detail.message);
    if (data.detail.msg) return String(data.detail.msg);
    if (data.detail.error) return String(data.detail.error);
  }
  
  // Fallback to status text or default message
  return error.response.statusText || 'An error occurred';
};

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      // Use navigation utility instead of hard redirect to preserve history
      navigateToSignIn();
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH ENDPOINTS ====================

export const authAPI = {
  // Register a new user
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  // Login
  login: async (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await api.post('/api/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    // Store token
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }
    
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  // Update current user
  updateCurrentUser: async (userData) => {
    const response = await api.put('/api/auth/me', userData);
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },
};

// ==================== SERVICES ENDPOINTS ====================

export const servicesAPI = {
  // Get all services
  getServices: async () => {
    const response = await api.get('/api/services');
    return response.data;
  },

  // Get service by ID
  getService: async (serviceId) => {
    const response = await api.get(`/api/services/${serviceId}`);
    return response.data;
  },
};

// ==================== APPLICATIONS ENDPOINTS ====================

export const applicationsAPI = {
  // Create new application
  createApplication: async (applicationData) => {
    const response = await api.post('/api/applications', applicationData);
    return response.data;
  },

  // Get all applications (with optional filters)
  getApplications: async (params = {}) => {
    const response = await api.get('/api/applications', { params });
    return response.data;
  },

  // Get application by ID
  getApplication: async (applicationId) => {
    const response = await api.get(`/api/applications/${applicationId}`);
    return response.data;
  },

  // Update application
  updateApplication: async (applicationId, applicationData) => {
    const response = await api.put(`/api/applications/${applicationId}`, applicationData);
    return response.data;
  },

  // Submit application
  submitApplication: async (applicationId) => {
    const response = await api.post(`/api/applications/${applicationId}/submit`);
    return response.data;
  },

  // Delete application
  deleteApplication: async (applicationId) => {
    const response = await api.delete(`/api/applications/${applicationId}`);
    return response.data;
  },
};

// ==================== DOCUMENTS ENDPOINTS ====================

export const documentsAPI = {
  // Upload document (base64 format)
  uploadDocument: async (applicationId, documentType, file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        try {
          // reader.result contains the base64 string
          const base64Data = reader.result;
          
          const uploadData = {
            application_id: applicationId,
            document_type: documentType,
            file_name: file.name,
            file_data: base64Data, // This will be data:application/pdf;base64,... format
            mime_type: file.type || 'application/pdf',
          };

          const response = await api.post('/api/documents/upload', uploadData);
          resolve(response.data);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
      
      // Read file as base64
      reader.readAsDataURL(file);
    });
  },

  // Get documents for an application
  getApplicationDocuments: async (applicationId) => {
    const response = await api.get(`/api/documents/application/${applicationId}`);
    return response.data;
  },

  // Get document by ID
  getDocument: async (documentId) => {
    const response = await api.get(`/api/documents/${documentId}`);
    return response.data;
  },

  // Delete document
  deleteDocument: async (documentId) => {
    const response = await api.delete(`/api/documents/${documentId}`);
    return response.data;
  },
};

// ==================== NOTIFICATIONS ENDPOINTS ====================

export const notificationsAPI = {
  // Get all notifications
  getNotifications: async (params = {}) => {
    const response = await api.get('/api/notifications', { params });
    return response.data;
  },

  // Get notification by ID
  getNotification: async (notificationId) => {
    const response = await api.get(`/api/notifications/${notificationId}`);
    return response.data;
  },

  // Get unread notification count
  getUnreadCount: async () => {
    const response = await api.get('/api/notifications/count');
    return response.data.unread_count || 0;
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    const response = await api.put(`/api/notifications/${notificationId}/read`);
    return response.data;
  },
};

// Export default api instance for custom requests
export default api;

