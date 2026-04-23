'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';
import { connectSocket, subscribeToEvent } from '@/lib/socket';
import { AssignmentCard } from '@/components/AssignmentCard';
import { StatusToggle } from '@/components/StatusToggle';
import { AssignmentDetail } from '@/components/AssignmentDetail';
import { ResizeHandle } from '@/components/ResizeHandle';
import clsx from 'clsx';

interface Unit {
  id: string;
  callSign: string;
  unitType: string;
  status: string;
  isOnDuty: boolean;
  agencyName: string;
}

interface Assignment {
  id: string;
  incidentId: string;
  status: string;
  offeredAt: string;
  expiresAt: string;
  incident: {
    emergencyType: string;
    status: string;
    priority: string;
    callerPhone: string;
    callerName: string | null;
    latitude: number | null;
    longitude: number | null;
    landmark: string | null;
    createdAt: string;
  };
}

export default function UnitPortal() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState<Unit | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [statusHeight, setStatusHeight] = useState(120);

  const handleStatusResize = useCallback((delta: number) => {
    setStatusHeight((h) => Math.min(Math.max(h + delta, 80), 300));
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (!session) return;

    fetchUnit();
    fetchAssignments();

    let cleanup: (() => void) | undefined;
    setupSocket().then((unsub) => {
      cleanup = unsub;
    });

    return () => {
      cleanup?.();
    };
  }, [session]);

  const fetchUnit = async () => {
    try {
      const data = await api.get<Unit>('/unit/me');
      setUnit(data);
    } catch (error) {
      console.error('Failed to fetch unit:', error);
    }
  };

  const fetchAssignments = async () => {
    try {
      const data = await api.get<Assignment[]>('/unit/me/assignments?active=true');
      setAssignments(data);
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
    }
  };

  const setupSocket = async (): Promise<(() => void) | undefined> => {
    try {
      await connectSocket();
      setSocketConnected(true);

      const unsubOffer = subscribeToEvent<any>('assignment:offered', (data) => {
        const newAssignment: Assignment = {
          id: data.assignmentId,
          incidentId: data.incident.id,
          status: 'offered',
          offeredAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 90000).toISOString(),
          incident: {
            emergencyType: data.incident.emergencyType ?? 'unknown',
            status: data.incident.status ?? 'pending',
            priority: data.incident.priority ?? 'normal',
            callerPhone: data.incident.callerPhone ?? '',
            callerName: data.incident.callerName ?? null,
            latitude: data.incident.latitude ?? null,
            longitude: data.incident.longitude ?? null,
            landmark: data.incident.landmark ?? null,
            createdAt: data.incident.createdAt ?? new Date().toISOString(),
          },
        };
        setAssignments((prev) => {
          if (prev.some((a) => a.id === newAssignment.id)) return prev;
          return [newAssignment, ...prev];
        });

        if ('vibrate' in navigator) {
          navigator.vibrate([200, 100, 200]);
        }
      });

      const unsubCancel = subscribeToEvent<any>('assignment:cancelled', (data) => {
        setAssignments((prev) =>
          prev.filter((a) => a.id !== data.assignmentId),
        );
      });

      return () => {
        unsubOffer();
        unsubCancel();
      };
    } catch (error) {
      console.error('Socket connection failed:', error);
    }
  };

  const handleStatusChange = async (status: string, isOnDuty: boolean) => {
    try {
      await api.post('/unit/me/status', { status, isOnDuty });
      setUnit((prev) => (prev ? { ...prev, status, isOnDuty } : null));
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleAccept = async (assignmentId: string) => {
    try {
      await api.post(`/unit/assignments/${assignmentId}/accept`);
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === assignmentId ? { ...a, status: 'accepted' } : a,
        ),
      );
    } catch (error) {
      console.error('Failed to accept:', error);
    }
  };

  const handleDecline = async (assignmentId: string, reason: string) => {
    try {
      await api.post(`/unit/assignments/${assignmentId}/decline`, { reason });
      setAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
    } catch (error) {
      console.error('Failed to decline:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ops-bg">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <LoginScreen />;
  }

  if (selectedAssignment) {
    return (
      <AssignmentDetail
        assignment={selectedAssignment}
        onBack={() => setSelectedAssignment(null)}
        onStatusUpdate={(status) => {
          setAssignments((prev) =>
            prev.map((a) =>
              a.id === selectedAssignment.id
                ? { ...a, incident: { ...a.incident, status } }
                : a,
            ),
          );
        }}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col bg-ops-bg safe-top safe-bottom">
      {/* Header */}
      <header className="bg-ops-surface border-b border-ops-border p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white">
              {unit?.callSign || 'Loading...'}
            </h1>
            <p className="text-sm text-gray-400">{unit?.agencyName}</p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={clsx(
                'w-2 h-2 rounded-full',
                socketConnected ? 'bg-green-500' : 'bg-red-500',
              )}
            />
            <span
              className={clsx(
                'px-2 py-1 text-xs font-medium rounded',
                unit?.status === 'available'
                  ? 'bg-status-available text-white'
                  : unit?.status === 'busy'
                  ? 'bg-status-busy text-white'
                  : 'bg-status-offline text-white',
              )}
            >
              {unit?.status?.toUpperCase()}
            </span>
          </div>
        </div>
      </header>

      {/* Resizable content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Status Toggle */}
        {unit && (
          <div style={{ height: statusHeight }} className="flex-shrink-0 overflow-auto">
            <StatusToggle
              status={unit.status}
              isOnDuty={unit.isOnDuty}
              onChange={handleStatusChange}
            />
          </div>
        )}

        {unit && <ResizeHandle direction="vertical" onResize={handleStatusResize} />}

        {/* Assignments */}
        <div className="flex-1 min-h-0 overflow-auto p-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase mb-3">
            Active Assignments
          </h2>

          {assignments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg
                className="w-16 h-16 mx-auto mb-4 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p>No active assignments</p>
              <p className="text-sm mt-1">You'll be notified of new calls</p>
            </div>
          ) : (
            <div className="space-y-3">
              {assignments.map((assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  onAccept={() => handleAccept(assignment.id)}
                  onDecline={(reason) => handleDecline(assignment.id, reason)}
                  onSelect={() => setSelectedAssignment(assignment)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Nav */}
      <nav className="flex-shrink-0 bg-ops-surface border-t border-ops-border safe-bottom">
        <div className="flex">
          <NavButton active icon="home" label="Home" />
          <NavButton icon="history" label="History" onClick={() => {}} />
          <NavButton icon="profile" label="Profile" onClick={() => supabase.auth.signOut()} />
        </div>
      </nav>
    </div>
  );
}

function NavButton({
  active,
  icon,
  label,
  onClick,
}: {
  active?: boolean;
  icon: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex-1 py-3 flex flex-col items-center gap-1',
        active ? 'text-blue-400' : 'text-gray-400',
      )}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {icon === 'home' && (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        )}
        {icon === 'history' && (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        )}
        {icon === 'profile' && (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        )}
      </svg>
      <span className="text-xs">{label}</span>
    </button>
  );
}

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ops-bg p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">SP</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Unit Portal</h1>
          <p className="text-gray-400">Sign in to continue</p>
        </div>

        <div className="bg-ops-surface rounded-xl p-6">
          <form onSubmit={handleLogin}>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="officer@agency.gov.gh"
              autoComplete="email"
              className="w-full px-4 py-3 mb-4 bg-ops-surface-raised rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Password
            </label>
            <div className="relative mb-4">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full px-4 py-3 bg-ops-surface-raised rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 text-sm select-none"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium rounded-lg"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Authorized unit personnel only
        </p>
      </div>
    </div>
  );
}
