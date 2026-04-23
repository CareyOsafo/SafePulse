'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const incidentIcon = L.divIcon({
  className: 'custom-marker',
  html: `
    <div class="relative">
      <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
        <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-50"></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const unitIcon = L.divIcon({
  className: 'custom-marker',
  html: `
    <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
      <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7h4a1 1 0 011 1v6.05A2.5 2.5 0 0115.95 16H15a1 1 0 01-1-1V7z" />
      </svg>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const smallIncidentIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div class="w-4 h-4 bg-orange-500 rounded-full opacity-70"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export interface MapIncident {
  id: string;
  emergencyType: string;
  callerPhone?: string;
  status: string;
  latitude?: number;
  longitude?: number;
  latestLocation?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
}

export interface MapUnit {
  id: string;
  callSign: string;
  unitType: string;
  status: string;
  isOnDuty: boolean;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
}

interface LeafletMapProps {
  selectedIncident: MapIncident | null;
  incidents: MapIncident[];
  units: MapUnit[];
  defaultCenter: [number, number];
  defaultZoom: number;
}

export default function LeafletMap({
  selectedIncident,
  incidents,
  units,
  defaultCenter,
  defaultZoom,
}: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current) return;

    const map = L.map(containerRef.current).setView(defaultCenter, defaultZoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const layers = L.layerGroup().addTo(map);

    mapRef.current = map;
    layerRef.current = layers;

    // Invalidate map size when the container is resized (e.g. drag-to-resize panels)
    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  // Update markers whenever data changes
  useEffect(() => {
    const map = mapRef.current;
    const layers = layerRef.current;
    if (!map || !layers) return;

    layers.clearLayers();

    // Selected incident marker + accuracy circle
    if (selectedIncident?.latestLocation) {
      const { latitude, longitude, accuracy } = selectedIncident.latestLocation;

      L.marker([latitude, longitude], { icon: incidentIcon })
        .bindPopup(
          `<div class="text-sm">
            <p class="font-semibold">${selectedIncident.emergencyType.toUpperCase()}</p>
            <p>${selectedIncident.callerPhone || ''}</p>
          </div>`,
        )
        .addTo(layers);

      if (accuracy) {
        L.circle([latitude, longitude], {
          radius: accuracy,
          color: '#ef4444',
          fillColor: '#ef4444',
          fillOpacity: 0.1,
          weight: 1,
        }).addTo(layers);
      }

      map.setView([latitude, longitude], 15);
    } else if (selectedIncident?.latitude && selectedIncident?.longitude) {
      map.setView([selectedIncident.latitude, selectedIncident.longitude], 15);
    }

    // Other active incidents
    incidents
      .filter(
        (inc) =>
          inc.id !== selectedIncident?.id &&
          inc.latitude &&
          inc.longitude &&
          !['resolved', 'cancelled', 'closed'].includes(inc.status),
      )
      .forEach((inc) => {
        L.marker([inc.latitude!, inc.longitude!], { icon: smallIncidentIcon })
          .bindPopup(
            `<div class="text-sm">
              <p class="font-semibold">${inc.emergencyType}</p>
              <p class="text-gray-600">${inc.status}</p>
            </div>`,
          )
          .addTo(layers);
      });

    // Unit markers
    units
      .filter((unit) => unit.currentLocation && unit.isOnDuty)
      .forEach((unit) => {
        const statusClass = unit.status === 'available' ? 'text-green-600' : 'text-orange-600';
        L.marker([unit.currentLocation!.latitude, unit.currentLocation!.longitude], {
          icon: unitIcon,
        })
          .bindPopup(
            `<div class="text-sm">
              <p class="font-semibold">${unit.callSign}</p>
              <p class="text-gray-600">${unit.unitType}</p>
              <p class="${statusClass}">${unit.status}</p>
            </div>`,
          )
          .addTo(layers);
      });
  }, [selectedIncident, incidents, units]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      style={{ background: '#0a0e14' }}
    />
  );
}
