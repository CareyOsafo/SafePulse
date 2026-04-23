'use client';

import { useIncidentsStore, Incident } from '@/store/incidents';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';

const EMERGENCY_COLORS: Record<string, string> = {
  medical: 'bg-emergency-medical',
  fire: 'bg-emergency-fire',
  safety: 'bg-emergency-safety',
  security: 'bg-emergency-security',
};

const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-priority-low',
  normal: 'bg-priority-normal',
  high: 'bg-priority-high',
  critical: 'bg-priority-critical',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-status-pending',
  acknowledged: 'text-status-acknowledged',
  dispatched: 'text-status-dispatched',
  en_route: 'text-status-enroute',
  on_scene: 'text-status-onscene',
  resolved: 'text-status-resolved',
  cancelled: 'text-status-cancelled',
};

const CONFIDENCE_COLORS: Record<string, string> = {
  high: 'text-confidence-high',
  medium: 'text-confidence-medium',
  low: 'text-confidence-low',
  unknown: 'text-confidence-unknown',
};

export function QueuePanel() {
  const {
    incidents,
    selectedIncidentId,
    selectIncident,
    filters,
    updateFilters,
    loading,
  } = useIncidentsStore();

  return (
    <div className="h-full flex flex-col">
      {/* Filters */}
      <div className="p-3 border-b border-ops-border bg-ops-surface">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-gray-300">Incident Queue</h2>
          <span className="text-xs text-gray-500">{incidents.length} incidents</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterChip
            label="Pending"
            active={filters.status.includes('pending')}
            onClick={() =>
              updateFilters({
                status: filters.status.includes('pending')
                  ? filters.status.filter((s) => s !== 'pending')
                  : [...filters.status, 'pending'],
              })
            }
            color="bg-status-pending"
          />
          <FilterChip
            label="Active"
            active={filters.status.some((s) =>
              ['acknowledged', 'dispatched', 'en_route', 'on_scene'].includes(s),
            )}
            onClick={() =>
              updateFilters({
                status: filters.status.some((s) =>
                  ['acknowledged', 'dispatched', 'en_route', 'on_scene'].includes(s),
                )
                  ? []
                  : ['acknowledged', 'dispatched', 'en_route', 'on_scene'],
              })
            }
            color="bg-blue-500"
          />
          <FilterChip
            label="High Priority"
            active={filters.priority.includes('high') || filters.priority.includes('critical')}
            onClick={() =>
              updateFilters({
                priority:
                  filters.priority.includes('high') || filters.priority.includes('critical')
                    ? []
                    : ['high', 'critical'],
              })
            }
            color="bg-priority-high"
          />
        </div>
      </div>

      {/* Incident List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : incidents.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-500">
            No incidents found
          </div>
        ) : (
          <div className="divide-y divide-ops-border">
            {incidents.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                selected={selectedIncidentId === incident.id}
                onClick={() => selectIncident(incident.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  color,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'px-2 py-1 text-xs rounded-md transition-colors',
        active
          ? `${color} text-white`
          : 'bg-ops-surface-raised text-gray-400 hover:text-white',
      )}
    >
      {label}
    </button>
  );
}

function IncidentCard({
  incident,
  selected,
  onClick,
}: {
  incident: Incident;
  selected: boolean;
  onClick: () => void;
}) {
  const timeAgo = formatDistanceToNow(new Date(incident.createdAt), { addSuffix: false });

  return (
    <div
      onClick={onClick}
      className={clsx(
        'incident-card p-3 cursor-pointer border-l-4',
        selected
          ? 'bg-blue-900/30 border-l-blue-500'
          : 'bg-ops-surface hover:bg-ops-surface-raised border-l-transparent',
        EMERGENCY_COLORS[incident.emergencyType]?.replace('bg-', 'border-l-') ||
          'border-l-gray-500',
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {/* Emergency type badge */}
          <span
            className={clsx(
              'px-2 py-0.5 text-xs font-medium rounded uppercase',
              EMERGENCY_COLORS[incident.emergencyType],
            )}
          >
            {incident.emergencyType}
          </span>

          {/* Priority badge */}
          {incident.priority !== 'normal' && (
            <span
              className={clsx(
                'px-1.5 py-0.5 text-xs font-medium rounded',
                PRIORITY_COLORS[incident.priority],
              )}
            >
              {incident.priority.toUpperCase()}
            </span>
          )}
        </div>

        {/* Timer */}
        <span className="timer text-xs text-gray-400">{timeAgo}</span>
      </div>

      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-white font-medium">
          {incident.callerName || incident.callerPhone}
        </span>
        <span
          className={clsx('text-xs font-medium', STATUS_COLORS[incident.status])}
        >
          {incident.status.replace('_', ' ')}
        </span>
      </div>

      <div className="flex items-center gap-3 text-xs text-gray-400">
        {/* Location confidence */}
        <span className={clsx('flex items-center gap-1', CONFIDENCE_COLORS[incident.locationConfidence])}>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          {incident.locationConfidence}
        </span>

        {/* Intake source */}
        <span className="text-gray-500">{incident.intakeSource.toUpperCase()}</span>

        {/* Verified badge */}
        {incident.callerVerified && (
          <span className="text-green-500 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            KYC
          </span>
        )}

        {/* Unit assigned */}
        {incident.unitCallSign && (
          <span className="text-blue-400">{incident.unitCallSign}</span>
        )}
      </div>

      {/* Landmark preview */}
      {incident.landmark && (
        <p className="text-xs text-gray-500 mt-1 truncate">{incident.landmark}</p>
      )}
    </div>
  );
}
