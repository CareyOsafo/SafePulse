'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { useIncidentsStore } from '@/store/incidents';
import { useUnitsStore } from '@/store/units';
import { connectSocket, subscribeToEvent, joinRoom } from '@/lib/socket';
import { QueuePanel } from '@/components/QueuePanel';
import { IncidentPanel } from '@/components/IncidentPanel';
import { MapPanel } from '@/components/MapPanel';
import { Header } from '@/components/Header';
import { ResizeHandle } from '@/components/ResizeHandle';

export default function DispatcherPage() {
  const router = useRouter();
  const { session, loading: authLoading } = useAuthStore();
  const { fetchIncidents, addIncident, updateIncidentInList, selectedIncidentId } = useIncidentsStore();
  const { fetchUnits, updateUnit } = useUnitsStore();
  const [socketConnected, setSocketConnected] = useState(false);
  const [queueWidth, setQueueWidth] = useState(384);
  const [mapWidth, setMapWidth] = useState(500);

  const handleQueueResize = useCallback((delta: number) => {
    setQueueWidth((w) => Math.min(Math.max(w + delta, 250), 600));
  }, []);

  const handleMapResize = useCallback((delta: number) => {
    setMapWidth((w) => Math.min(Math.max(w - delta, 300), 800));
  }, []);

  useEffect(() => {
    if (!authLoading && !session) {
      router.replace('/login');
    }
  }, [session, authLoading, router]);

  useEffect(() => {
    if (session) {
      // Fetch initial data
      fetchIncidents();
      fetchUnits();

      // Connect to WebSocket
      connectSocket()
        .then((socket) => {
          setSocketConnected(true);

          // Join agency room (would need actual agencyId from user profile)
          // joinRoom('agency:...');

          // Subscribe to events
          subscribeToEvent('incident:created', (data: any) => {
            addIncident(data.incident);
          });

          subscribeToEvent('incident:updated', (data: any) => {
            updateIncidentInList(data.incidentId, data.changes);
          });

          subscribeToEvent('incident:acknowledged', (data: any) => {
            updateIncidentInList(data.incidentId, { status: 'acknowledged' });
          });

          subscribeToEvent('unit:status_changed', (data: any) => {
            updateUnit(data.unitId, { status: data.status });
          });

          subscribeToEvent('assignment:accepted', (data: any) => {
            updateIncidentInList(data.incidentId, { status: 'dispatched' });
          });

          subscribeToEvent('escalation:alert', (data: any) => {
            // Show notification for escalation
            console.log('Escalation alert:', data);
          });
        })
        .catch((err) => {
          console.error('Socket connection failed:', err);
        });
    }
  }, [session]);

  if (authLoading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ops-bg">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-ops-bg overflow-hidden">
      <Header socketConnected={socketConnected} />

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Queue Panel */}
        <div style={{ width: queueWidth }} className="flex-shrink-0 overflow-hidden">
          <QueuePanel />
        </div>

        <ResizeHandle direction="horizontal" onResize={handleQueueResize} />

        {/* Center: Incident Details */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <IncidentPanel />
        </div>

        <ResizeHandle direction="horizontal" onResize={handleMapResize} />

        {/* Right: Map Panel */}
        <div style={{ width: mapWidth }} className="flex-shrink-0 overflow-hidden">
          <MapPanel />
        </div>
      </div>
    </div>
  );
}
