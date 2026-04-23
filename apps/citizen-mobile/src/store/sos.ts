import { create } from 'zustand';
import * as Location from 'expo-location';
import { citizenApi } from '../lib/api';

interface SosState {
  isActive: boolean;
  incidentId: string | null;
  incidentStatus: string | null;
  trackingToken: string | null;
  locationWatcher: Location.LocationSubscription | null;

  startSos: (emergencyType: string) => Promise<{ incidentId: string; trackingToken: string }>;
  cancelSos: () => Promise<void>;
  markSafe: () => Promise<void>;
  updateStatus: (status: string) => void;
  startLocationTracking: () => Promise<void>;
  stopLocationTracking: () => void;
}

export const useSosStore = create<SosState>((set, get) => ({
  isActive: false,
  incidentId: null,
  incidentStatus: null,
  trackingToken: null,
  locationWatcher: null,

  startSos: async (emergencyType: string) => {
    // Get current location
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Location permission required');
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    // Create incident
    const result = await citizenApi.createIncident({
      emergencyType,
      location: {
        coordinates: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy || undefined,
        },
        source: 'gps',
      },
    });

    set({
      isActive: true,
      incidentId: result.id,
      incidentStatus: result.status,
      trackingToken: result.trackingToken,
    });

    // Start location tracking
    get().startLocationTracking();

    return { incidentId: result.id, trackingToken: result.trackingToken };
  },

  cancelSos: async () => {
    const { incidentId } = get();
    if (incidentId) {
      await citizenApi.cancelIncident(incidentId);
    }
    get().stopLocationTracking();
    set({
      isActive: false,
      incidentId: null,
      incidentStatus: null,
      trackingToken: null,
    });
  },

  markSafe: async () => {
    const { incidentId } = get();
    if (incidentId) {
      await citizenApi.markSafe(incidentId);
    }
    get().stopLocationTracking();
    set({
      isActive: false,
      incidentId: null,
      incidentStatus: 'resolved',
      trackingToken: null,
    });
  },

  updateStatus: (status: string) => {
    set({ incidentStatus: status });
  },

  startLocationTracking: async () => {
    const { incidentId } = get();
    if (!incidentId) return;

    // Request background permission
    const { status } = await Location.requestBackgroundPermissionsAsync();

    const watcher = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 15000, // Every 15 seconds
        distanceInterval: 10, // Or every 10 meters
      },
      async (location) => {
        const currentIncidentId = get().incidentId;
        if (currentIncidentId) {
          try {
            await citizenApi.updateLocation(currentIncidentId, {
              coordinates: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                accuracy: location.coords.accuracy || undefined,
              },
            });
          } catch (error) {
            console.error('Failed to update location:', error);
          }
        }
      },
    );

    set({ locationWatcher: watcher });
  },

  stopLocationTracking: () => {
    const { locationWatcher } = get();
    if (locationWatcher) {
      locationWatcher.remove();
      set({ locationWatcher: null });
    }
  },
}));
