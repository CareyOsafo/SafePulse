-- Migration: 007_create_unit_assignments
-- Description: Create unit_assignments table for dispatch tracking

CREATE TYPE assignment_status AS ENUM ('offered', 'accepted', 'declined', 'expired', 'cancelled', 'completed');

CREATE TABLE unit_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID NOT NULL REFERENCES emergency_requests(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,

    -- Assignment status
    status assignment_status NOT NULL DEFAULT 'offered',
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,

    -- Offer tracking
    offered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    responded_at TIMESTAMPTZ,

    -- Response details
    decline_reason TEXT,

    -- Dispatcher who made the assignment
    assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_unit_assignments_incident ON unit_assignments(incident_id);
CREATE INDEX idx_unit_assignments_unit ON unit_assignments(unit_id);
CREATE INDEX idx_unit_assignments_status ON unit_assignments(status);
CREATE INDEX idx_unit_assignments_offered ON unit_assignments(status, expires_at) WHERE status = 'offered';
CREATE INDEX idx_unit_assignments_active ON unit_assignments(unit_id, status) WHERE status IN ('offered', 'accepted');
CREATE INDEX idx_unit_assignments_primary ON unit_assignments(incident_id, is_primary) WHERE is_primary = TRUE;

-- Trigger
CREATE TRIGGER update_unit_assignments_updated_at
    BEFORE UPDATE ON unit_assignments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Ensure only one primary assignment per incident at a time
CREATE OR REPLACE FUNCTION ensure_single_primary_assignment()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_primary = TRUE AND NEW.status = 'accepted' THEN
        UPDATE unit_assignments
        SET is_primary = FALSE
        WHERE incident_id = NEW.incident_id
        AND id != NEW.id
        AND is_primary = TRUE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_single_primary_assignment_trigger
    BEFORE INSERT OR UPDATE ON unit_assignments
    FOR EACH ROW
    WHEN (NEW.is_primary = TRUE)
    EXECUTE FUNCTION ensure_single_primary_assignment();

-- Comments
COMMENT ON TABLE unit_assignments IS 'Tracks unit assignments/offers for incidents';
COMMENT ON COLUMN unit_assignments.expires_at IS 'When the offer automatically expires if not responded to';
COMMENT ON COLUMN unit_assignments.is_primary IS 'Primary responder for the incident';
