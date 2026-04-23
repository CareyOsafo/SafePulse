-- Migration: 011_create_ussd_sessions
-- Description: Create ussd_sessions table for USSD state machine

CREATE TYPE ussd_session_state AS ENUM (
    'init',
    'select_type',
    'confirm',
    'select_location',
    'enter_landmark',
    'completed',
    'cancelled'
);

CREATE TABLE ussd_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Session identification
    session_id VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    service_code VARCHAR(20) NOT NULL,

    -- State machine
    state ussd_session_state NOT NULL DEFAULT 'init',

    -- Collected data
    emergency_type emergency_type,
    location_type VARCHAR(50), -- 'home', 'work', 'landmark'
    landmark TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),

    -- Associated data
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    incident_id UUID REFERENCES emergency_requests(id) ON DELETE SET NULL,

    -- Session tracking
    last_input TEXT,
    input_history TEXT[], -- Array of all inputs for debugging

    -- Expiry
    expires_at TIMESTAMPTZ NOT NULL,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_ussd_sessions_session_id ON ussd_sessions(session_id);
CREATE INDEX idx_ussd_sessions_phone ON ussd_sessions(phone_number);
CREATE INDEX idx_ussd_sessions_state ON ussd_sessions(state);
CREATE INDEX idx_ussd_sessions_expires ON ussd_sessions(expires_at) WHERE state NOT IN ('completed', 'cancelled');
CREATE INDEX idx_ussd_sessions_active ON ussd_sessions(phone_number, state) WHERE state NOT IN ('completed', 'cancelled');

-- Trigger
CREATE TRIGGER update_ussd_sessions_updated_at
    BEFORE UPDATE ON ussd_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE ussd_sessions IS 'USSD session state machine for emergency intake';
COMMENT ON COLUMN ussd_sessions.session_id IS 'External session ID from telco aggregator';
COMMENT ON COLUMN ussd_sessions.input_history IS 'All user inputs for debugging/audit';
