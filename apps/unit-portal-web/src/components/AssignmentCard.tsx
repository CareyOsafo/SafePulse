'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';

interface AssignmentCardProps {
  assignment: {
    id: string;
    status: string;
    expiresAt: string;
    incident: {
      emergencyType: string;
      priority: string;
      callerPhone: string;
      callerName: string | null;
      landmark: string | null;
    };
  };
  onAccept: () => void;
  onDecline: (reason: string) => void;
  onSelect: () => void;
}

const EMERGENCY_COLORS: Record<string, string> = {
  medical: 'bg-red-500',
  fire: 'bg-orange-500',
  safety: 'bg-purple-500',
  security: 'bg-blue-500',
};

export function AssignmentCard({
  assignment,
  onAccept,
  onDecline,
  onSelect,
}: AssignmentCardProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    if (assignment.status !== 'offered') return;

    const calculateTimeLeft = () => {
      const expires = new Date(assignment.expiresAt).getTime();
      const now = Date.now();
      return Math.max(0, Math.floor((expires - now) / 1000));
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [assignment.expiresAt, assignment.status]);

  const handleAccept = async () => {
    setLoading('accept');
    await onAccept();
    setLoading(null);
  };

  const handleDecline = async (reason: string) => {
    setLoading('decline');
    await onDecline(reason);
    setShowDeclineModal(false);
    setLoading(null);
  };

  const isOffer = assignment.status === 'offered';
  const isUrgent = timeLeft <= 30 && timeLeft > 0;

  return (
    <>
      <div
        onClick={!isOffer ? onSelect : undefined}
        className={clsx(
          'bg-ops-surface rounded-xl p-4 border',
          isOffer
            ? isUrgent
              ? 'border-red-500 animate-pulse'
              : 'border-yellow-500'
            : 'border-ops-border cursor-pointer',
        )}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className={clsx(
                'px-2 py-1 text-xs font-bold rounded uppercase text-white',
                EMERGENCY_COLORS[assignment.incident.emergencyType],
              )}
            >
              {assignment.incident.emergencyType}
            </span>
            {assignment.incident.priority !== 'normal' && (
              <span className="px-2 py-1 text-xs font-bold rounded bg-red-600 text-white uppercase">
                {assignment.incident.priority}
              </span>
            )}
          </div>

          {isOffer && (
            <div
              className={clsx(
                'text-lg font-mono font-bold',
                isUrgent ? 'text-red-500' : 'text-yellow-500',
              )}
            >
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          )}
        </div>

        <p className="text-white font-medium mb-1">
          {assignment.incident.callerName || 'Unknown Caller'}
        </p>
        <p className="text-sm text-gray-400 mb-3">
          {assignment.incident.landmark || assignment.incident.callerPhone}
        </p>

        {isOffer ? (
          <div className="flex gap-2">
            <button
              onClick={handleAccept}
              disabled={loading === 'accept'}
              className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white font-bold rounded-lg"
            >
              {loading === 'accept' ? '...' : 'ACCEPT'}
            </button>
            <button
              onClick={() => setShowDeclineModal(true)}
              disabled={loading === 'decline'}
              className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg"
            >
              {loading === 'decline' ? '...' : 'DECLINE'}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span
              className={clsx(
                'text-sm font-medium',
                assignment.status === 'accepted' ? 'text-green-400' : 'text-gray-400',
              )}
            >
              {assignment.status.toUpperCase()}
            </span>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </div>

      {/* Decline Modal */}
      {showDeclineModal && (
        <DeclineModal
          onDecline={handleDecline}
          onClose={() => setShowDeclineModal(false)}
          loading={loading === 'decline'}
        />
      )}
    </>
  );
}

function DeclineModal({
  onDecline,
  onClose,
  loading,
}: {
  onDecline: (reason: string) => void;
  onClose: () => void;
  loading: boolean;
}) {
  const reasons = [
    'Too far away',
    'Already on another call',
    'Vehicle issue',
    'End of shift',
    'Other',
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50">
      <div className="bg-ops-surface w-full rounded-t-2xl p-4 safe-bottom">
        <h3 className="text-lg font-bold text-white mb-4">Decline Reason</h3>
        <div className="space-y-2">
          {reasons.map((reason) => (
            <button
              key={reason}
              onClick={() => onDecline(reason)}
              disabled={loading}
              className="w-full py-3 bg-ops-surface-raised hover:bg-ops-border text-white rounded-lg text-left px-4 disabled:opacity-50"
            >
              {reason}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="w-full py-3 mt-4 text-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
