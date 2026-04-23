-- Migration: 010_create_incident_events
-- Description: Create incident_events table for audit trail

CREATE TYPE incident_event_type AS ENUM (
    'created',
    'acknowledged',
    'status_changed',
    'location_updated',
    'unit_assigned',
    'unit_accepted',
    'unit_declined',
    'unit_en_route',
    'unit_on_scene',
    'backup_requested',
    'escalated',
    'note_added',
    'message_sent',
    'resolved',
    'cancelled',
    'marked_safe',
    'cant_locate'
);

CREATE TABLE incident_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID NOT NULL REFERENCES emergency_requests(id) ON DELETE CASCADE,

    -- Event type
    event_type incident_event_type NOT NULL,

    -- Actor (who performed the action)
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    actor_role app_role,
    actor_unit_id UUID REFERENCES units(id) ON DELETE SET NULL,

    -- Event metadata (flexible JSON for event-specific data)
    metadata JSONB NOT NULL DEFAULT '{}',

    -- Human-readable description
    description TEXT,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_incident_events_incident ON incident_events(incident_id);
CREATE INDEX idx_incident_events_incident_time ON incident_events(incident_id, created_at DESC);
CREATE INDEX idx_incident_events_type ON incident_events(event_type);
CREATE INDEX idx_incident_events_actor ON incident_events(actor_id) WHERE actor_id IS NOT NULL;
CREATE INDEX idx_incident_events_created_at ON incident_events(created_at DESC);
CREATE INDEX idx_incident_events_metadata ON incident_events USING GIN (metadata);

-- Comments
COMMENT ON TABLE incident_events IS 'Audit trail for all incident-related events';
COMMENT ON COLUMN incident_events.metadata IS 'Event-specific data in JSON format';
COMMENT ON COLUMN incident_events.actor_id IS 'User who performed the action (null for system events)';
