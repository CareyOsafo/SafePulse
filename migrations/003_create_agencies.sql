-- Migration: 003_create_agencies
-- Description: Create agencies and agency_users tables

-- Create unit type enum
CREATE TYPE unit_type AS ENUM ('ambulance', 'police', 'fire', 'security', 'mixed');

CREATE TABLE agencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    type unit_type NOT NULL,

    -- Contact info
    phone_number VARCHAR(20),
    email VARCHAR(255),

    -- Location/Region
    region VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),

    -- Service area (radius in km)
    service_radius_km INTEGER DEFAULT 50,

    -- Settings
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    accepts_ussd BOOLEAN NOT NULL DEFAULT TRUE,
    auto_dispatch_enabled BOOLEAN NOT NULL DEFAULT TRUE,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Agency users (dispatchers, supervisors)
CREATE TABLE agency_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role app_role NOT NULL CHECK (role IN ('dispatcher', 'supervisor', 'admin')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Each user can only be in an agency once
    UNIQUE(agency_id, user_id)
);

-- Indexes
CREATE INDEX idx_agencies_region ON agencies(region);
CREATE INDEX idx_agencies_type ON agencies(type);
CREATE INDEX idx_agencies_active ON agencies(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_agencies_location ON agencies(latitude, longitude) WHERE latitude IS NOT NULL;

CREATE INDEX idx_agency_users_agency ON agency_users(agency_id);
CREATE INDEX idx_agency_users_user ON agency_users(user_id);
CREATE INDEX idx_agency_users_role ON agency_users(role);

-- Triggers
CREATE TRIGGER update_agencies_updated_at
    BEFORE UPDATE ON agencies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agency_users_updated_at
    BEFORE UPDATE ON agency_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE agencies IS 'Emergency response agencies (ambulance services, police stations, fire stations)';
COMMENT ON TABLE agency_users IS 'Users who work at agencies (dispatchers, supervisors)';
COMMENT ON COLUMN agencies.service_radius_km IS 'Maximum service area radius in kilometers';
