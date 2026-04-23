import { create } from 'zustand';
import { dispatcherApi } from '@/lib/api';

export interface Incident {
  id: string;
  emergencyType: string;
  status: string;
  priority: string;
  callerPhone: string;
  callerName: string | null;
  callerVerified: boolean;
  locationConfidence: string;
  latitude: number | null;
  longitude: number | null;
  landmark: string | null;
  intakeSource: string;
  unitCallSign: string | null;
  unitStatus: string | null;
  escalationLevel: number;
  createdAt: string;
  acknowledgedAt: string | null;
  eventCount: number;
  lastEventAt: string | null;
}

interface IncidentsState {
  incidents: Incident[];
  selectedIncidentId: string | null;
  selectedIncident: any | null;
  filters: {
    status: string[];
    type: string[];
    priority: string[];
  };
  loading: boolean;
  error: string | null;
  total: number;

  fetchIncidents: () => Promise<void>;
  selectIncident: (id: string | null) => Promise<void>;
  updateFilters: (filters: Partial<IncidentsState['filters']>) => void;
  updateIncidentInList: (id: string, changes: Partial<Incident>) => void;
  addIncident: (incident: Incident) => void;
}

export const useIncidentsStore = create<IncidentsState>((set, get) => ({
  incidents: [],
  selectedIncidentId: null,
  selectedIncident: null,
  filters: {
    status: [],
    type: [],
    priority: [],
  },
  loading: false,
  error: null,
  total: 0,

  fetchIncidents: async () => {
    set({ loading: true, error: null });
    try {
      const { filters } = get();
      const response = await dispatcherApi.getIncidents({
        status: filters.status.length > 0 ? filters.status : undefined,
        type: filters.type.length > 0 ? filters.type : undefined,
        priority: filters.priority.length > 0 ? filters.priority : undefined,
        limit: 100,
      });
      set({ incidents: response.data, total: response.meta.total, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  selectIncident: async (id) => {
    if (!id) {
      set({ selectedIncidentId: null, selectedIncident: null });
      return;
    }

    set({ selectedIncidentId: id });
    try {
      const incident = await dispatcherApi.getIncident(id);
      set({ selectedIncident: incident });
    } catch (error) {
      console.error('Failed to fetch incident details:', error);
    }
  },

  updateFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    get().fetchIncidents();
  },

  updateIncidentInList: (id, changes) => {
    set((state) => ({
      incidents: state.incidents.map((inc) =>
        inc.id === id ? { ...inc, ...changes } : inc,
      ),
      selectedIncident:
        state.selectedIncidentId === id
          ? { ...state.selectedIncident, ...changes }
          : state.selectedIncident,
    }));
  },

  addIncident: (incident) => {
    set((state) => ({
      incidents: [incident, ...state.incidents],
      total: state.total + 1,
    }));
  },
}));
