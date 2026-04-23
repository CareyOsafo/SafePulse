import { getAccessToken } from './supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

interface QueuedRequest {
  id: string;
  endpoint: string;
  method: string;
  body?: string;
  timestamp: number;
}

const QUEUE_KEY = 'safepulse_request_queue';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retry = true,
  ): Promise<T> {
    const token = await getAccessToken();

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `API Error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      // If network error and should queue, save for later
      if ((error as Error).message?.includes('Network') && retry) {
        await this.queueRequest(endpoint, options);
      }
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Offline queue management
  private async queueRequest(endpoint: string, options: RequestInit) {
    const queue = await this.getQueue();
    queue.push({
      id: Date.now().toString(),
      endpoint,
      method: options.method || 'GET',
      body: options.body as string | undefined,
      timestamp: Date.now(),
    });
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  }

  async getQueue(): Promise<QueuedRequest[]> {
    const data = await AsyncStorage.getItem(QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  }

  async flushQueue(): Promise<void> {
    const queue = await this.getQueue();
    const remaining: QueuedRequest[] = [];

    for (const req of queue) {
      try {
        await this.request(
          req.endpoint,
          { method: req.method, body: req.body },
          false,
        );
      } catch {
        remaining.push(req);
      }
    }

    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
  }
}

export const api = new ApiClient(API_URL);

// API methods
export const citizenApi = {
  // Profile
  getProfile: () => api.get<any>('/users/me'),
  updateProfile: (data: { fullName?: string }) => api.post('/users/me', data),
  updateDeviceToken: (token: string, platform: string) =>
    api.post('/users/me/device-token', { token, platform }),
  savePlaceHome: (data: { latitude: number; longitude: number; address?: string }) =>
    api.post('/users/me/saved-places/home', data),
  savePlaceWork: (data: { latitude: number; longitude: number; address?: string }) =>
    api.post('/users/me/saved-places/work', data),

  // KYC
  startKyc: (ghanaCardNumber: string) => api.post('/kyc/start', { ghanaCardNumber }),
  getKycStatus: () => api.get<any>('/kyc/status'),
  retryKyc: (ghanaCardNumber: string) => api.post('/kyc/retry', { ghanaCardNumber }),

  // Incidents
  createIncident: (data: {
    emergencyType: string;
    location: {
      coordinates: { latitude: number; longitude: number; accuracy?: number };
      source: string;
      landmark?: string;
    };
    priority?: string;
  }) => api.post<any>('/incidents', data),
  updateLocation: (
    incidentId: string,
    data: { coordinates: { latitude: number; longitude: number; accuracy?: number } },
  ) => api.post(`/incidents/${incidentId}/location`, data),
  cancelIncident: (incidentId: string) => api.post(`/incidents/${incidentId}/cancel`),
  markSafe: (incidentId: string) => api.post(`/incidents/${incidentId}/mark-safe`),
  getIncident: (incidentId: string) => api.get<any>(`/incidents/${incidentId}`),
  getIncidents: () => api.get<any[]>('/incidents'),

  // Contacts
  getContacts: () => api.get<any[]>('/contacts'),
  createContact: (data: {
    name: string;
    phoneNumber: string;
    relationship?: string;
    isPrimary?: boolean;
  }) => api.post('/contacts', data),
  deleteContact: (id: string) => api.delete(`/contacts/${id}`),
  setPrimaryContact: (id: string) => api.post(`/contacts/${id}/set-primary`),
};
