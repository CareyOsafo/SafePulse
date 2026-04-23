-- Migration: 008_create_unit_location_pings
-- Description: Create unit_location_pings table for tracking unit locations

CREATE TABLE unit_location_pings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,

    -- Associated incident (optional - for active assignments)
    incident_id UUID REFERENCES emergency_requests(id) ON DELETE SET NULL,
    assignment_id UUID REFERENCES unit_assignments(id) ON DELETE SET NULL,

    -- Location data
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    accuracy DECIMAL(10, 2),
    heading DECIMAL(5, 2),
    speed DECIMAL(10, 2),

    -- Timestamps
    captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_unit_location_pings_unit ON unit_location_pings(unit_id);
CREATE INDEX idx_unit_location_pings_unit_time ON unit_location_pings(unit_id, captured_at DESC);
CREATE INDEX idx_unit_location_pings_incident ON unit_location_pings(incident_id) WHERE incident_id IS NOT NULL;
CREATE INDEX idx_unit_location_pings_captured_at ON unit_location_pings(captured_at DESC);

-- This table will grow large, consider partitioning by date
-- CREATE TABLE unit_location_pings_partitioned (...) PARTITION BY RANGE (captured_at);

-- Comments
COMMENT ON TABLE unit_location_pings IS 'Location history for response units';
COMMENT ON COLUMN unit_location_pings.captured_at IS 'When the location was captured on the device';
