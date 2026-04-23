'use client';

import { useIncidentsStore } from '@/store/incidents';
import { useUnitsStore } from '@/store/units';
import { dispatcherApi } from '@/lib/api';
import { formatDistanceToNow, format } from 'date-fns';
import { useState, useEffect } from 'react';
import clsx from 'clsx';

export function IncidentPanel() {
  const { selectedIncident, selectedIncidentId, updateIncidentInList } = useIncidentsStore();
  const { units, fetchUnits } = useUnitsStore();
  const [activeTab, setActiveTab] = useState<'details' | 'timeline' | 'deliveries'>('details');
  const [timeline, setTimeline] = useState<any[]>([]);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (selectedIncidentId) {
      dispatcherApi.getTimeline(selectedIncidentId).then(setTimeline).catch(console.error);
      dispatcherApi.getDeliveries(selectedIncidentId).then(setDeliveries).catch(console.error);
    }
  }, [selectedIncidentId]);

  if (!selectedIncident) {
    return (
      <div className="h-full flex items-center justify-center bg-ops-surface">
        <div className="text-center text-gray-500">
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
          <p>Select an incident to view details</p>
        </div>
      </div>
    );
  }

  const handleAcknowledge = async () => {
    setActionLoading('acknowledge');
    try {
      await dispatcherApi.acknowledgeIncident(selectedIncident.id, { autoDispatch: true });
      updateIncidentInList(selectedIncident.id, { status: 'acknowledged' });
    } catch (error) {
      console.error('Failed to acknowledge:', error);
    }
    setActionLoading(null);
  };

  const handleAddNotes = async () => {
    if (!notes.trim()) return;
    setActionLoading('notes');
    try {
      await dispatcherApi.addNotes(selectedIncident.id, notes);
      setNotes('');
      // Refresh timeline
      const newTimeline = await dispatcherApi.getTimeline(selectedIncident.id);
      setTimeline(newTimeline);
    } catch (error) {
      console.error('Failed to add notes:', error);
    }
    setActionLoading(null);
  };

  const handleAssignUnit = async (unitId: string) => {
    setActionLoading('assign');
    try {
      await dispatcherApi.assignUnit(selectedIncident.id, unitId, true);
      setShowAssignModal(false);
      updateIncidentInList(selectedIncident.id, { status: 'dispatched' });
    } catch (error) {
      console.error('Failed to assign unit:', error);
    }
    setActionLoading(null);
  };

  return (
    <div className="h-full flex flex-col bg-ops-surface">
      {/* Header */}
      <div className="p-4 border-b border-ops-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span
              className={clsx(
                'px-2 py-1 text-sm font-medium rounded uppercase',
                `bg-emergency-${selectedIncident.emergencyType}`,
              )}
            >
              {selectedIncident.emergencyType}
            </span>
            <span
              className={clsx(
                'px-2 py-1 text-sm font-medium rounded',
                `text-status-${selectedIncident.status}`,
                'bg-ops-surface-raised',
              )}
            >
              {selectedIncident.status.replace('_', ' ')}
            </span>
            {selectedIncident.priority !== 'normal' && (
              <span
                className={clsx(
                  'px-2 py-1 text-sm font-medium rounded',
                  `bg-priority-${selectedIncident.priority}`,
                )}
              >
                {selectedIncident.priority.toUpperCase()}
              </span>
            )}
          </div>
          <span className="text-sm text-gray-400">
            {format(new Date(selectedIncident.createdAt), 'HH:mm:ss')}
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {selectedIncident.status === 'pending' && (
            <ActionButton
              onClick={handleAcknowledge}
              loading={actionLoading === 'acknowledge'}
              color="bg-blue-600 hover:bg-blue-700"
            >
              Acknowledge
            </ActionButton>
          )}

          <ActionButton
            onClick={() => {
              fetchUnits();
              setShowAssignModal(true);
            }}
            color="bg-purple-600 hover:bg-purple-700"
          >
            Assign Unit
          </ActionButton>

          <ActionButton
            onClick={() => window.open(`tel:${selectedIncident.callerPhone}`)}
            color="bg-green-600 hover:bg-green-700"
          >
            Call Caller
          </ActionButton>

          {selectedIncident.emergencyContacts?.length > 0 && (
            <ActionButton
              onClick={() =>
                window.open(`tel:${selectedIncident.emergencyContacts[0].phoneNumber}`)
              }
              color="bg-teal-600 hover:bg-teal-700"
            >
              Call Guardian
            </ActionButton>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-ops-border">
        {(['details', 'timeline', 'deliveries'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              'flex-1 py-2 text-sm font-medium transition-colors',
              activeTab === tab
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white',
            )}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === 'timeline' && timeline.length > 0 && (
              <span className="ml-1 text-xs text-gray-500">({timeline.length})</span>
            )}
            {tab === 'deliveries' && deliveries.length > 0 && (
              <span className="ml-1 text-xs text-gray-500">({deliveries.length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'details' && (
          <DetailsTab incident={selectedIncident} />
        )}
        {activeTab === 'timeline' && (
          <TimelineTab timeline={timeline} />
        )}
        {activeTab === 'deliveries' && (
          <DeliveriesTab deliveries={deliveries} />
        )}
      </div>

      {/* Notes input */}
      <div className="p-3 border-t border-ops-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add dispatcher notes..."
            className="flex-1 px-3 py-2 bg-ops-surface-raised border border-ops-border rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            onKeyDown={(e) => e.key === 'Enter' && handleAddNotes()}
          />
          <button
            onClick={handleAddNotes}
            disabled={!notes.trim() || actionLoading === 'notes'}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white text-sm rounded"
          >
            {actionLoading === 'notes' ? '...' : 'Add'}
          </button>
        </div>
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <AssignModal
          units={units}
          onAssign={handleAssignUnit}
          onClose={() => setShowAssignModal(false)}
          loading={actionLoading === 'assign'}
        />
      )}
    </div>
  );
}

function ActionButton({
  onClick,
  loading,
  color,
  children,
}: {
  onClick: () => void;
  loading?: boolean;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={clsx(
        'px-3 py-1.5 text-sm font-medium rounded text-white transition-colors',
        color,
        loading && 'opacity-50 cursor-not-allowed',
      )}
    >
      {loading ? '...' : children}
    </button>
  );
}

function DetailsTab({ incident }: { incident: any }) {
  return (
    <div className="space-y-4">
      {/* Caller Info */}
      <section>
        <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Caller</h3>
        <div className="bg-ops-surface-raised rounded p-3 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Name</span>
            <span className="text-white">{incident.callerName || 'Unknown'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Phone</span>
            <span className="text-white font-mono">{incident.callerPhone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">KYC Status</span>
            <span
              className={clsx(
                incident.callerVerified ? 'text-green-400' : 'text-yellow-400',
              )}
            >
              {incident.callerKyc || 'Unknown'}
            </span>
          </div>
        </div>
      </section>

      {/* Location */}
      <section>
        <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Location</h3>
        <div className="bg-ops-surface-raised rounded p-3 space-y-2">
          {incident.latestLocation && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-400">Coordinates</span>
                <span className="text-white font-mono text-sm">
                  {incident.latestLocation.latitude.toFixed(6)},{' '}
                  {incident.latestLocation.longitude.toFixed(6)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Accuracy</span>
                <span className="text-white">
                  {incident.latestLocation.accuracy
                    ? `${incident.latestLocation.accuracy.toFixed(0)}m`
                    : 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Confidence</span>
                <span
                  className={clsx(
                    `text-confidence-${incident.latestLocation.confidence}`,
                  )}
                >
                  {incident.latestLocation.confidence}
                </span>
              </div>
            </>
          )}
          {incident.landmark && (
            <div>
              <span className="text-gray-400">Landmark</span>
              <p className="text-white mt-1">{incident.landmark}</p>
            </div>
          )}
        </div>
      </section>

      {/* Emergency Contacts */}
      {incident.emergencyContacts?.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">
            Emergency Contacts
          </h3>
          <div className="bg-ops-surface-raised rounded divide-y divide-ops-border">
            {incident.emergencyContacts.map((contact: any) => (
              <div
                key={contact.id}
                className="p-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-white">
                    {contact.name}
                    {contact.isPrimary && (
                      <span className="ml-2 text-xs text-blue-400">Primary</span>
                    )}
                  </p>
                  <p className="text-sm text-gray-400">{contact.relationship}</p>
                </div>
                <a
                  href={`tel:${contact.phoneNumber}`}
                  className="text-green-400 hover:text-green-300"
                >
                  {contact.phoneNumber}
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Assignments */}
      {incident.assignments?.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">
            Assigned Units
          </h3>
          <div className="bg-ops-surface-raised rounded divide-y divide-ops-border">
            {incident.assignments.map((assignment: any) => (
              <div
                key={assignment.id}
                className="p-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-white font-medium">{assignment.callSign}</p>
                  <p className="text-sm text-gray-400">{assignment.unitType}</p>
                </div>
                <span
                  className={clsx(
                    'text-sm',
                    assignment.status === 'accepted'
                      ? 'text-green-400'
                      : assignment.status === 'declined'
                      ? 'text-red-400'
                      : 'text-yellow-400',
                  )}
                >
                  {assignment.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Notes */}
      {incident.notes && (
        <section>
          <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">
            Dispatcher Notes
          </h3>
          <div className="bg-ops-surface-raised rounded p-3">
            <p className="text-gray-300 whitespace-pre-wrap text-sm">
              {incident.notes}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

function TimelineTab({ timeline }: { timeline: any[] }) {
  if (timeline.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">No events recorded</div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-ops-border" />

      <div className="space-y-4">
        {timeline.map((event) => (
          <div key={event.id} className="relative pl-8">
            <div className="absolute left-1.5 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-ops-surface" />
            <div className="bg-ops-surface-raised rounded p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-white">
                  {event.eventType.replace('_', ' ')}
                </span>
                <span className="text-xs text-gray-500">
                  {format(new Date(event.createdAt), 'HH:mm:ss')}
                </span>
              </div>
              <p className="text-sm text-gray-400">
                {event.actorName || 'System'}
              </p>
              {event.description && (
                <p className="text-sm text-gray-300 mt-1">{event.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeliveriesTab({ deliveries }: { deliveries: any[] }) {
  if (deliveries.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">No delivery logs</div>
    );
  }

  const statusColors: Record<string, string> = {
    delivered: 'text-green-400',
    sent: 'text-blue-400',
    pending: 'text-yellow-400',
    failed: 'text-red-400',
    retrying: 'text-orange-400',
  };

  return (
    <div className="space-y-2">
      {deliveries.map((log) => (
        <div
          key={log.id}
          className="bg-ops-surface-raised rounded p-3 flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-ops-border text-gray-300">
                {log.channel.toUpperCase()}
              </span>
              <span className="text-sm text-white">{log.recipientPhone}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">{log.messageType}</p>
          </div>
          <div className="text-right">
            <span className={clsx('text-sm font-medium', statusColors[log.status])}>
              {log.status}
            </span>
            <p className="text-xs text-gray-500">
              Attempts: {log.attemptCount}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function AssignModal({
  units,
  onAssign,
  onClose,
  loading,
}: {
  units: any[];
  onAssign: (unitId: string) => void;
  onClose: () => void;
  loading: boolean;
}) {
  const availableUnits = units.filter((u) => u.status === 'available' && u.isOnDuty);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-ops-surface border border-ops-border rounded-lg w-full max-w-md p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Assign Unit</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {availableUnits.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No available units</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {availableUnits.map((unit) => (
              <button
                key={unit.id}
                onClick={() => onAssign(unit.id)}
                disabled={loading}
                className="w-full p-3 bg-ops-surface-raised hover:bg-ops-border rounded flex items-center justify-between transition-colors disabled:opacity-50"
              >
                <div>
                  <p className="text-white font-medium">{unit.callSign}</p>
                  <p className="text-sm text-gray-400">{unit.unitType}</p>
                </div>
                <span className="text-green-400 text-sm">Available</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
