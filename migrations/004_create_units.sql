-- Migration: 004_create_units
-- Description: Create units table for emergency response units

CREATE TYPE unit_status AS ENUM ('available', 'busy', 'offline', 'on_break');

CREATE TABLE units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,

    -- Unit identification
    call_sign VARCHAR(50) NOT NULL,
    unit_type unit_type NOT NULL,

    -- Status
    status unit_status NOT NULL DEFAULT 'offline',
    is_on_duty BOOLEAN NOT NULL DEFAULT FALSE,

    -- Contact
    phone_number VARCHAR(20),

    -- Current location
    current_latitude DECIMAL(10, 8),
    current_longitude DECIMAL(11, 8),
    current_accuracy DECIMAL(10, 2),
    last_location_at TIMESTAMPTZ,

    -- Assigned user (optional - for units tied to specific responders)
    assigned_user_id UUID REFERENCES users(id) ON DELETE SET NULL,

    -- Capabilities
    has_medical_equipment BOOLEAN DEFAULT FALSE,
    has_fire_equipment BOOLEAN DEFAULT FALSE,
    capacity INTEGER DEFAULT 2,

    -- Metadata
    vehicle_registration VARCHAR(50),
    notes TEXT,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Call sign unique within agency
    UNIQUE(agency_id, call_sign)
);

-- Indexes
CREATE INDEX idx_units_agency ON units(agency_id);
CREATE INDEX idx_units_status ON units(status);
CREATE INDEX idx_units_type ON units(unit_type);
CREATE INDEX idx_units_on_duty ON units(is_on_duty) WHERE is_on_duty = TRUE;
CREATE INDEX idx_units_available ON units(status, is_on_duty) WHERE status = 'available' AND is_on_duty = TRUE;
CREATE INDEX idx_units_location ON units(current_latitude, current_longitude) WHERE current_latitude IS NOT NULL;
CREATE INDEX idx_units_assigned_user ON units(assigned_user_id) WHERE assigned_user_id IS NOT NULL;

-- Trigger
CREATE TRIGGER update_units_updated_at
    BEFORE UPDATE ON units
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE units IS 'Emergency response units (vehicles/teams)';
COMMENT ON COLUMN units.call_sign IS 'Unit identifier used in radio communications';
COMMENT ON COLUMN units.is_on_duty IS 'Whether the unit is currently on shift';
