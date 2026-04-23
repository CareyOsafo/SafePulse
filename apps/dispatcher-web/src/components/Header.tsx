'use client';

import { useAuthStore } from '@/store/auth';
import { useIncidentsStore } from '@/store/incidents';
import { dispatcherApi } from '@/lib/api';
import { useEffect, useState } from 'react';

interface HeaderProps {
  socketConnected: boolean;
}

export function Header({ socketConnected }: HeaderProps) {
  const { signOut } = useAuthStore();
  const { total, incidents } = useIncidentsStore();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    dispatcherApi.getStats().then(setStats).catch(console.error);

    // Refresh stats every 30 seconds
    const interval = setInterval(() => {
      dispatcherApi.getStats().then(setStats).catch(console.error);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const pendingCount = incidents.filter((i) => i.status === 'pending').length;
  const activeCount = incidents.filter((i) =>
    ['acknowledged', 'dispatched', 'en_route', 'on_scene'].includes(i.status),
  ).length;

  return (
    <header className="h-14 bg-ops-surface border-b border-ops-border flex items-center justify-between px-4">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SP</span>
          </div>
          <span className="text-white font-semibold">SafePulse</span>
        </div>

        <div className="h-6 w-px bg-ops-border" />

        <div className="flex items-center gap-4">
          <StatBadge
            label="Pending"
            value={stats?.incidents?.pending || pendingCount}
            color="text-status-pending"
            pulse={pendingCount > 0}
          />
          <StatBadge
            label="Active"
            value={stats?.incidents?.active || activeCount}
            color="text-blue-400"
          />
          <StatBadge
            label="Units Available"
            value={stats?.units?.available || 0}
            color="text-green-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Connection status */}
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              socketConnected ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="text-xs text-gray-400">
            {socketConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        <button
          onClick={signOut}
          className="text-gray-400 hover:text-white text-sm"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}

function StatBadge({
  label,
  value,
  color,
  pulse,
}: {
  label: string;
  value: number;
  color: string;
  pulse?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500">{label}</span>
      <span
        className={`font-mono font-bold ${color} ${
          pulse ? 'animate-pulse' : ''
        }`}
      >
        {value}
      </span>
    </div>
  );
}
