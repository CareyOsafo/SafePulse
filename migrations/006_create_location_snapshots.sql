-- Migration: 006_create_location_snapshots
-- Description: Create location_snapshots table for incident location history

CREATE TABLE location_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID NOT NULL REFERENCES emergency_requests(id) ON DELETE CASCADE,

    -- Location data
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    accuracy DECIMAL(10, 2),
    altitude DECIMAL(10, 2),
    heading DECIMAL(5, 2),
    speed DECIMAL(10, 2),

    -- Source info
    source location_source NOT NULL DEFAULT 'gps',
    confidence location_confidence NOT NULL DEFAULT 'unknown',

    -- Timestamps
    captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_location_snapshots_incident ON location_snapshots(incident_id);
CREATE INDEX idx_location_snapshots_incident_time ON location_snapshots(incident_id, captured_at DESC);
CREATE INDEX idx_location_snapshots_captured_at ON location_snapshots(captured_at DESC);

-- Partitioning hint (for future scaling)
-- This table could be partitioned by captured_at for better query performance

-- Comments
COMMENT ON TABLE location_snapshots IS 'Location history for emergency incidents';
COMMENT ON COLUMN location_snapshots.captured_at IS 'When the location was captured on the device';
COMMENT ON COLUMN location_snapshots.confidence IS 'Confidence level based on accuracy and source';
