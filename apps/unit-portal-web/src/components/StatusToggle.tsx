'use client';

import { useState } from 'react';
import clsx from 'clsx';

interface StatusToggleProps {
  status: string;
  isOnDuty: boolean;
  onChange: (status: string, isOnDuty: boolean) => void;
}

export function StatusToggle({ status, isOnDuty, onChange }: StatusToggleProps) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    const newIsOnDuty = !isOnDuty;
    const newStatus = newIsOnDuty ? 'available' : 'offline';
    await onChange(newStatus, newIsOnDuty);
    setLoading(false);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!isOnDuty || newStatus === status) return;
    setLoading(true);
    await onChange(newStatus, true);
    setLoading(false);
  };

  return (
    <div className="p-4 bg-ops-surface border-b border-ops-border">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-300">On Duty</span>
        <button
          onClick={handleToggle}
          disabled={loading}
          className={clsx(
            'relative inline-flex items-center w-14 h-8 rounded-full transition-colors duration-200',
            isOnDuty ? 'bg-green-600' : 'bg-gray-600',
            loading && 'opacity-50',
          )}
          role="switch"
          aria-checked={isOnDuty}
        >
          <span
            className={clsx(
              'inline-block w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200',
              isOnDuty ? 'translate-x-7' : 'translate-x-1',
            )}
          />
        </button>
      </div>

      {isOnDuty && (
        <div className="flex gap-2">
          <StatusButton
            label="Available"
            active={status === 'available'}
            color="bg-status-available"
            onClick={() => handleStatusChange('available')}
            disabled={loading}
          />
          <StatusButton
            label="Busy"
            active={status === 'busy'}
            color="bg-status-busy"
            onClick={() => handleStatusChange('busy')}
            disabled={loading}
          />
          <StatusButton
            label="On Break"
            active={status === 'on_break'}
            color="bg-gray-500"
            onClick={() => handleStatusChange('on_break')}
            disabled={loading}
          />
        </div>
      )}
    </div>
  );
}

function StatusButton({
  label,
  active,
  color,
  onClick,
  disabled,
}: {
  label: string;
  active: boolean;
  color: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'flex-1 py-2 text-sm font-medium rounded-lg transition-colors',
        active ? `${color} text-white` : 'bg-ops-surface-raised text-gray-400',
        disabled && 'opacity-50',
      )}
    >
      {label}
    </button>
  );
}
