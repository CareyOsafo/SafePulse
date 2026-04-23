'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import clsx from 'clsx';

interface AssignmentDetailProps {
  assignment: any;
  onBack: () => void;
  onStatusUpdate: (status: string) => void;
}

export function AssignmentDetail({
  assignment,
  onBack,
  onStatusUpdate,
}: AssignmentDetailProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const updateStatus = async (status: string) => {
    setLoading(status);
    try {
      await api.post(`/unit/incidents/${assignment.incidentId}/status`, { status });
      onStatusUpdate(status);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
    setLoading(null);
  };

  const requestBackup = async () => {
    setLoading('backup');
    try {
      await api.post(`/unit/incidents/${assignment.incidentId}/need-backup`);
      alert('Backup requested');
    } catch (error) {
      console.error('Failed to request backup:', error);
    }
    setLoading(null);
  };

  const resolveIncident = async () => {
    setLoading('resolve');
    try {
      await api.post(`/unit/incidents/${assignment.incidentId}/resolve`);
      onStatusUpdate('resolved');
      onBack();
    } catch (error) {
      console.error('Failed to resolve:', error);
    }
    setLoading(null);
  };

  const openMaps = () => {
    if (assignment.incident.latitude && assignment.incident.longitude) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${assignment.incident.latitude},${assignment.incident.longitude}`,
        '_blank',
      );
    }
  };

  return (
    <div className="min-h-screen bg-ops-bg safe-top safe-bottom">
      {/* Header */}
      <header className="bg-ops-surface border-b border-ops-border p-4 flex items-center gap-4">
        <button onClick={onBack} className="text-gray-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-lg font-bold text-white">
            {(assignment.incident.emergencyType ?? 'unknown').toUpperCase()} Emergency
          </h1>
          <p className="text-sm text-gray-400">
            Status: {(assignment.incident.status ?? 'pending').replace('_', ' ')}
          </p>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Caller Info */}
        <section className="bg-ops-surface rounded-xl p-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">Caller</h3>
          <p className="text-white font-medium mb-1">
            {assignment.incident.callerName || 'Unknown'}
          </p>
          <a
            href={`tel:${assignment.incident.callerPhone}`}
            className="text-blue-400 text-lg font-mono"
          >
            {assignment.incident.callerPhone}
          </a>
        </section>

        {/* Location */}
        <section className="bg-ops-surface rounded-xl p-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">Location</h3>
          {assignment.incident.landmark && (
            <p className="text-white mb-2">{assignment.incident.landmark}</p>
          )}
          {assignment.incident.latitude && (
            <p className="text-sm text-gray-400 font-mono mb-3">
              {assignment.incident.latitude.toFixed(6)},{' '}
              {assignment.incident.longitude.toFixed(6)}
            </p>
          )}
          <button
            onClick={openMaps}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Open in Maps
          </button>
        </section>

        {/* Status Updates */}
        <section className="bg-ops-surface rounded-xl p-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">
            Update Status
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <StatusButton
              label="En Route"
              onClick={() => updateStatus('en_route')}
              loading={loading === 'en_route'}
              active={assignment.incident.status === 'en_route'}
              color="bg-cyan-600"
            />
            <StatusButton
              label="On Scene"
              onClick={() => updateStatus('on_scene')}
              loading={loading === 'on_scene'}
              active={assignment.incident.status === 'on_scene'}
              color="bg-green-600"
            />
          </div>
        </section>

        {/* Actions */}
        <section className="space-y-2">
          <button
            onClick={requestBackup}
            disabled={loading === 'backup'}
            className="w-full py-3 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-medium rounded-xl"
          >
            {loading === 'backup' ? 'Requesting...' : 'Request Backup'}
          </button>

          <button
            onClick={resolveIncident}
            disabled={loading === 'resolve'}
            className="w-full py-4 bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-bold rounded-xl text-lg"
            onTouchStart={(e) => {
              const timer = setTimeout(() => {
                resolveIncident();
              }, 1000);
              e.currentTarget.dataset.timer = String(timer);
            }}
            onTouchEnd={(e) => {
              const timer = e.currentTarget.dataset.timer;
              if (timer) clearTimeout(Number(timer));
            }}
          >
            {loading === 'resolve' ? 'Resolving...' : 'RESOLVE (Hold)'}
          </button>
        </section>
      </div>
    </div>
  );
}

function StatusButton({
  label,
  onClick,
  loading,
  active,
  color,
}: {
  label: string;
  onClick: () => void;
  loading: boolean;
  active: boolean;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading || active}
      className={clsx(
        'py-3 font-medium rounded-lg transition-colors',
        active
          ? `${color} text-white`
          : 'bg-ops-surface-raised text-gray-300 hover:text-white',
        loading && 'opacity-50',
      )}
    >
      {loading ? '...' : label}
    </button>
  );
}
