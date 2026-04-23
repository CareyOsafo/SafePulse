'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';

interface TrackingInfo {
  incidentId: string;
  emergencyType: string;
  status: string;
  priority: string;
  createdAt: string;
  acknowledgedAt: string | null;
  dispatchedAt: string | null;
  resolvedAt: string | null;
  respondingUnit: {
    callSign: string;
    type: string;
  } | null;
  location: {
    latitude: number;
    longitude: number;
    accuracy: number | null;
    updatedAt: string;
  } | null;
  timeline: {
    event: string;
    timestamp: string;
  }[];
}

const STATUS_STEPS = [
  { key: 'created', label: 'Alert Sent' },
  { key: 'acknowledged', label: 'Received' },
  { key: 'dispatched', label: 'Dispatched' },
  { key: 'en_route', label: 'En Route' },
  { key: 'on_scene', label: 'Arrived' },
  { key: 'resolved', label: 'Resolved' },
];

const STATUS_INDEX: Record<string, number> = {
  pending: 0,
  acknowledged: 1,
  dispatched: 2,
  en_route: 3,
  on_scene: 4,
  resolved: 5,
};

export default function TrackingPage({ params }: { params: { token: string } }) {
  const [info, setInfo] = useState<TrackingInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
        const res = await fetch(`${API_URL}/t/${params.token}`);

        if (!res.ok) {
          if (res.status === 404) {
            setError('Invalid or expired tracking link');
          } else {
            setError('Failed to load tracking information');
          }
          return;
        }

        const data = await res.json();
        setInfo(data);
      } catch (err) {
        setError('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();

    // Poll for updates every 10 seconds
    const interval = setInterval(fetchInfo, 10000);
    return () => clearInterval(interval);
  }, [params.token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Tracking Unavailable</h1>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!info) return null;

  const currentStep = STATUS_INDEX[info.status] ?? 0;
  const isResolved = info.status === 'resolved';
  const isCancelled = info.status === 'cancelled';

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SP</span>
            </div>
            <span className="text-white font-semibold">SafePulse</span>
          </div>
          <span className="text-xs text-gray-400">
            {params.token.substring(0, 8).toUpperCase()}
          </span>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-4">
        {/* Status Card */}
        <div className="bg-slate-800 rounded-xl p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              info.emergencyType === 'medical' ? 'bg-red-500/20 text-red-400' :
              info.emergencyType === 'fire' ? 'bg-orange-500/20 text-orange-400' :
              info.emergencyType === 'safety' ? 'bg-purple-500/20 text-purple-400' :
              'bg-blue-500/20 text-blue-400'
            }`}>
              {info.emergencyType.toUpperCase()}
            </span>
            <span className={`text-sm font-medium ${
              isResolved ? 'text-green-400' :
              isCancelled ? 'text-red-400' :
              'text-yellow-400'
            }`}>
              {info.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          {/* Progress Steps */}
          {!isCancelled && (
            <div className="relative">
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-700" />
              <div
                className="absolute top-4 left-4 h-0.5 bg-blue-500 transition-all duration-500"
                style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
              />

              <div className="relative flex justify-between">
                {STATUS_STEPS.map((step, index) => (
                  <div key={step.key} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                      index <= currentStep
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-700 text-gray-500'
                    }`}>
                      {index < currentStep ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-xs">{index + 1}</span>
                      )}
                    </div>
                    <span className={`text-xs mt-2 ${
                      index <= currentStep ? 'text-white' : 'text-gray-500'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isCancelled && (
            <div className="text-center py-4">
              <p className="text-red-400">This emergency was cancelled</p>
            </div>
          )}
        </div>

        {/* Responding Unit */}
        {info.respondingUnit && (
          <div className="bg-slate-800 rounded-xl p-4 mb-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">
              Responding Unit
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">{info.respondingUnit.callSign}</p>
                <p className="text-sm text-gray-400">{info.respondingUnit.type}</p>
              </div>
            </div>
          </div>
        )}

        {/* Location */}
        {info.location && (
          <div className="bg-slate-800 rounded-xl p-4 mb-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">
              Your Location
            </h3>
            <p className="text-white font-mono text-sm mb-2">
              {info.location.latitude.toFixed(6)}, {info.location.longitude.toFixed(6)}
            </p>
            {info.location.accuracy && (
              <p className="text-xs text-gray-400">
                Accuracy: ~{Math.round(info.location.accuracy)}m
              </p>
            )}
          </div>
        )}

        {/* Timeline */}
        {info.timeline.length > 0 && (
          <div className="bg-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">
              Timeline
            </h3>
            <div className="space-y-3">
              {info.timeline.map((event, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  <div>
                    <p className="text-white text-sm">
                      {event.event.replace('_', ' ')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(event.timestamp), 'HH:mm:ss')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Last updated: {format(new Date(), 'HH:mm:ss')}
        </p>
      </main>
    </div>
  );
}
