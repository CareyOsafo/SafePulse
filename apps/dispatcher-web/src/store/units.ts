import { create } from 'zustand';
import { dispatcherApi } from '@/lib/api';

export interface Unit {
  id: string;
  callSign: string;
  unitType: string;
  status: string;
  isOnDuty: boolean;
  phoneNumber: string | null;
  activeAssignments: number;
  currentLocation: {
    latitude: number;
    longitude: number;
  } | null;
  lastLocationAt: string | null;
}

interface UnitsState {
  units: Unit[];
  loading: boolean;
  error: string | null;

  fetchUnits: (status?: string) => Promise<void>;
  updateUnit: (id: string, changes: Partial<Unit>) => void;
}

export const useUnitsStore = create<UnitsState>((set) => ({
  units: [],
  loading: false,
  error: null,

  fetchUnits: async (status?: string) => {
    set({ loading: true, error: null });
    try {
      const units = await dispatcherApi.getUnits(status);
      set({ units, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateUnit: (id, changes) => {
    set((state) => ({
      units: state.units.map((unit) =>
        unit.id === id ? { ...unit, ...changes } : unit,
      ),
    }));
  },
}));
