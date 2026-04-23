'use client';

import { useIncidentsStore } from '@/store/incidents';
import { useUnitsStore } from '@/store/units';
import dynamic from 'next/dynamic';

// Single dynamic import — prevents "Map container already initialized" by
// ensuring Leaflet is only loaded once and SSR is fully avoided.
const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-ops-bg">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

const DEFAULT_CENTER: [number, number] = [5.6037, -0.1870];
const DEFAULT_ZOOM = 12;

export function MapPanel() {
  const { selectedIncident, incidents } = useIncidentsStore();
  const { units } = useUnitsStore();

  return (
    <div className="h-full flex flex-col">
      {/* Map Header */}
      <div className="p-3 bg-ops-surface border-b border-ops-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-300">Map View</h3>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            Incidents
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            Units
          </span>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1">
        <LeafletMap
          selectedIncident={selectedIncident}
          incidents={incidents}
          units={units}
          defaultCenter={DEFAULT_CENTER}
          defaultZoom={DEFAULT_ZOOM}
        />
      </div>

      {/* Location info footer */}
      {selectedIncident?.latestLocation && (
        <div className="p-3 bg-ops-surface border-t border-ops-border">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">
              {selectedIncident.latestLocation.latitude.toFixed(6)},{' '}
              {selectedIncident.latestLocation.longitude.toFixed(6)}
            </span>
            <button
              onClick={() => {
                const lat = selectedIncident.latestLocation.latitude;
                const lng = selectedIncident.latestLocation.longitude;
                window.open(
                  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
                  '_blank',
                );
              }}
              className="text-blue-400 hover:text-blue-300"
            >
              Open in Maps
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
