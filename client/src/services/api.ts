import axios from 'axios';
import type {
  EmergencyRequest,
  EmergencyContact,
  IncidentReport,
  UserProfile,
  AIClassificationResult,
  AIImageAnalysisResult,
  ChatMessage,
} from '../types';

// Centralized Axios instance
// In browser iframe / cloud preview, requests must use '/api' to hit the unified Express backend
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined') {
    // If running in browser and VITE_API_URL points to localhost port 5000 or is empty, use current host's /api
    if (!envUrl || envUrl.includes('localhost:5000') || envUrl.includes('127.0.0.1:5000')) {
      return '/api';
    }
  }
  return envUrl || '/api';
};

const baseURL = getBaseURL();

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('resqnow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors gracefully
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/') {
        localStorage.removeItem('resqnow_token');
        localStorage.removeItem('resqnow_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Endpoints
export const authAPI = {
  async register(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    bloodType?: string;
    allergies?: string;
    emergencyNotes?: string;
  }) {
    const res = await apiClient.post('/auth/register', data);
    return res.data;
  },

  async login(data: { email: string; password: string }) {
    const res = await apiClient.post('/auth/login', data);
    return res.data;
  },

  async getMe() {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },
};

// User Profile Endpoints
export const userAPI = {
  async getProfile() {
    const res = await apiClient.get('/users/profile');
    return res.data;
  },

  async updateProfile(data: Partial<UserProfile>) {
    const res = await apiClient.put('/users/profile', data);
    return res.data;
  },
};

// Emergency SOS Endpoints
export const emergencyAPI = {
  async create(data: {
    type: string;
    description?: string;
    latitude: number;
    longitude: number;
    accuracy?: number;
    address?: string;
  }) {
    const res = await apiClient.post('/emergencies', data);
    return res.data;
  },

  async getAll() {
    const res = await apiClient.get('/emergencies');
    return res.data;
  },

  async getById(id: string) {
    const res = await apiClient.get(`/emergencies/${id}`);
    return res.data;
  },

  async update(id: string, data: { status?: string; description?: string }) {
    const res = await apiClient.patch(`/emergencies/${id}`, data);
    return res.data;
  },
};

// Emergency Contacts Endpoints
export const contactAPI = {
  async getAll() {
    const res = await apiClient.get('/contacts');
    return res.data;
  },

  async create(data: {
    name: string;
    relationship?: string;
    phone: string;
    isPrimary?: boolean;
  }) {
    const res = await apiClient.post('/contacts', data);
    return res.data;
  },

  async update(
    id: string,
    data: {
      name?: string;
      relationship?: string;
      phone?: string;
      isPrimary?: boolean;
    }
  ) {
    const res = await apiClient.put(`/contacts/${id}`, data);
    return res.data;
  },

  async delete(id: string) {
    const res = await apiClient.delete(`/contacts/${id}`);
    return res.data;
  },
};

// Incident Reports Endpoints
export const incidentAPI = {
  async getAll() {
    const res = await apiClient.get('/incidents');
    return res.data;
  },

  async getById(id: string) {
    const res = await apiClient.get(`/incidents/${id}`);
    return res.data;
  },

  async create(data: {
    type: string;
    description: string;
    latitude?: number;
    longitude?: number;
    address?: string;
    imageUrl?: string;
    aiClassification?: any;
  }) {
    const res = await apiClient.post('/incidents', data);
    return res.data;
  },
};

// Google Gemini AI Endpoints
export const aiAPI = {
  async chat(data: { messages: { role: string; content: string }[]; situationContext?: string }) {
    const res = await apiClient.post('/ai/chat', data);
    return res.data as { reply: string; isDemo?: boolean };
  },

  async classify(description: string): Promise<AIClassificationResult> {
    const res = await apiClient.post('/ai/classify', { description });
    return res.data;
  },

  async analyzeImage(imageBase64: string, notes?: string): Promise<AIImageAnalysisResult> {
    const res = await apiClient.post('/ai/analyze-image', {
      imageBase64,
      notes,
    });
    return res.data;
  },
};

export default apiClient;
