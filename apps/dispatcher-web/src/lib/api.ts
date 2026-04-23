import { getAccessToken } from './supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

interface ApiOptions extends RequestInit {
  params?: Record<string, string | string[] | undefined>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const token = await getAccessToken();
    const { params, ...fetchOptions } = options;

    let url = `${this.baseUrl}${endpoint}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach((v) => searchParams.append(key, v));
          } else {
            searchParams.append(key, value);
          }
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...fetchOptions.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `API Error: ${response.status}`);
    }

    return response.json();
  }

  get<T>(endpoint: string, options?: ApiOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, data?: unknown, options?: ApiOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put<T>(endpoint: string, data?: unknown, options?: ApiOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete<T>(endpoint: string, options?: ApiOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiClient(API_URL);

// Dispatcher API methods
export const dispatcherApi = {
  getIncidents: (filters?: {
    status?: string[];
    type?: string[];
    priority?: string[];
    limit?: number;
    offset?: number;
  }) =>
    api.get<{ data: any[]; meta: { total: number } }>('/dispatcher/incidents', {
      params: filters as Record<string, string | string[]>,
    }),

  getIncident: (id: string) => api.get<any>(`/dispatcher/incidents/${id}`),

  acknowledgeIncident: (id: string, data?: { notes?: string; autoDispatch?: boolean }) =>
    api.post(`/dispatcher/incidents/${id}/acknowledge`, data),

  updateIncidentStatus: (id: string, data: { status: string; reason?: string }) =>
    api.post(`/dispatcher/incidents/${id}/status`, data),

  addNotes: (id: string, notes: string) =>
    api.post(`/dispatcher/incidents/${id}/notes`, { notes }),

  assignUnit: (id: string, unitId: string, isPrimary?: boolean) =>
    api.post(`/dispatcher/incidents/${id}/assign`, { unitId, isPrimary }),

  sendMessage: (id: string, data: { recipientPhone: string; message: string; channel: string }) =>
    api.post(`/dispatcher/incidents/${id}/message`, data),

  getTimeline: (id: string) => api.get<any[]>(`/dispatcher/incidents/${id}/timeline`),

  getLocations: (id: string) => api.get<any[]>(`/dispatcher/incidents/${id}/locations`),

  getDeliveries: (id: string) => api.get<any[]>(`/dispatcher/incidents/${id}/deliveries`),

  getUnits: (status?: string) =>
    api.get<any[]>('/dispatcher/units', { params: status ? { status } : undefined }),

  updateUnitStatus: (unitId: string, status: string) =>
    api.post(`/dispatcher/units/${unitId}/status`, { status }),

  getStats: () => api.get<any>('/dispatcher/stats'),
};
