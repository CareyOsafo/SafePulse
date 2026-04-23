-- Migration: 005_create_emergency_requests
-- Description: Create emergency_requests (incidents) table

CREATE TYPE emergency_type AS ENUM ('medical', 'fire', 'safety', 'security');
CREATE TYPE incident_status AS ENUM ('pending', 'acknowledged', 'dispatched', 'en_route', 'on_scene', 'resolved', 'cancelled', 'closed');
CREATE TYPE incident_priority AS ENUM ('low', 'normal', 'high', 'critical');
CREATE TYPE intake_source AS ENUM ('app', 'ussd', 'web', 'api');
CREATE TYPE location_source AS ENUM ('gps', 'network', 'landmark', 'saved_place', 'manual');
CREATE TYPE location_confidence AS ENUM ('high', 'medium', 'low', 'unknown');

CREATE TABLE emergency_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Caller info
    caller_id UUID REFERENCES users(id) ON DELETE SET NULL,
    caller_phone VARCHAR(20) NOT NULL,
    caller_name VARCHAR(255),
    caller_kyc_status kyc_status NOT NULL DEFAULT 'not_started',
    caller_verified BOOLEAN NOT NULL DEFAULT FALSE,

    -- Emergency details
    emergency_type emergency_type NOT NULL,
    status incident_status NOT NULL DEFAULT 'pending',
    priority incident_priority NOT NULL DEFAULT 'normal',

    -- Source
    intake_source intake_source NOT NULL DEFAULT 'app',

    -- Location
    location_source location_source NOT NULL DEFAULT 'gps',
    location_confidence location_confidence NOT NULL DEFAULT 'unknown',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    accuracy DECIMAL(10, 2),
    landmark TEXT,
    address TEXT,

    -- Tracking
    tracking_token VARCHAR(64) UNIQUE NOT NULL,
    tracking_expires_at TIMESTAMPTZ NOT NULL,

    -- Assignment
    agency_id UUID REFERENCES agencies(id) ON DELETE SET NULL,
    primary_unit_id UUID REFERENCES units(id) ON DELETE SET NULL,

    -- Notes and description
    description TEXT,
    dispatcher_notes TEXT,

    -- Escalation tracking
    escalation_level INTEGER NOT NULL DEFAULT 0,
    last_escalated_at TIMESTAMPTZ,

    -- Idempotency
    idempotency_key VARCHAR(64) UNIQUE,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    acknowledged_at TIMESTAMPTZ,
    dispatched_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_emergency_requests_status ON emergency_requests(status);
CREATE INDEX idx_emergency_requests_type ON emergency_requests(emergency_type);
CREATE INDEX idx_emergency_requests_priority ON emergency_requests(priority);
CREATE INDEX idx_emergency_requests_agency ON emergency_requests(agency_id);
CREATE INDEX idx_emergency_requests_caller ON emergency_requests(caller_id);
CREATE INDEX idx_emergency_requests_caller_phone ON emergency_requests(caller_phone);
CREATE INDEX idx_emergency_requests_tracking_token ON emergency_requests(tracking_token);
CREATE INDEX idx_emergency_requests_created_at ON emergency_requests(created_at DESC);
CREATE INDEX idx_emergency_requests_pending ON emergency_requests(status, created_at) WHERE status = 'pending';
CREATE INDEX idx_emergency_requests_active ON emergency_requests(status) WHERE status NOT IN ('resolved', 'cancelled', 'closed');
CREATE INDEX idx_emergency_requests_location ON emergency_requests(latitude, longitude) WHERE latitude IS NOT NULL;

-- Trigger
CREATE TRIGGER update_emergency_requests_updated_at
    BEFORE UPDATE ON emergency_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE emergency_requests IS 'Main incidents/emergency requests table';
COMMENT ON COLUMN emergency_requests.tracking_token IS 'Public token for tracking page access';
COMMENT ON COLUMN emergency_requests.idempotency_key IS 'Client-provided key to prevent duplicate incidents';
COMMENT ON COLUMN emergency_requests.escalation_level IS 'Number of times this incident has been escalated';
