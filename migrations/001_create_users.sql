-- Migration: 001_create_users
-- Description: Create users table with KYC fields and Ghana Card hash

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types
CREATE TYPE kyc_status AS ENUM ('not_started', 'pending', 'verified', 'failed');
CREATE TYPE app_role AS ENUM ('citizen', 'unit', 'dispatcher', 'supervisor', 'admin');

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supabase_uid UUID UNIQUE NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(255),

    -- KYC fields
    kyc_status kyc_status NOT NULL DEFAULT 'not_started',
    kyc_verification_id VARCHAR(255),
    kyc_verified_at TIMESTAMPTZ,
    kyc_failed_reason TEXT,

    -- Ghana Card (stored securely)
    ghana_card_hash VARCHAR(64) UNIQUE, -- HMAC-SHA256 hash
    ghana_card_last4 VARCHAR(4),

    -- Profile
    app_role app_role NOT NULL DEFAULT 'citizen',
    profile_photo_url TEXT,

    -- Saved places
    home_latitude DECIMAL(10, 8),
    home_longitude DECIMAL(11, 8),
    home_address TEXT,
    work_latitude DECIMAL(10, 8),
    work_longitude DECIMAL(11, 8),
    work_address TEXT,

    -- Device info
    device_token TEXT,
    device_platform VARCHAR(20),

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_active_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_users_phone_number ON users(phone_number);
CREATE INDEX idx_users_supabase_uid ON users(supabase_uid);
CREATE INDEX idx_users_kyc_status ON users(kyc_status);
CREATE INDEX idx_users_app_role ON users(app_role);
CREATE INDEX idx_users_ghana_card_hash ON users(ghana_card_hash) WHERE ghana_card_hash IS NOT NULL;

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE users IS 'Main users table for all app users';
COMMENT ON COLUMN users.ghana_card_hash IS 'HMAC-SHA256 hash of Ghana Card number for uniqueness check';
COMMENT ON COLUMN users.ghana_card_last4 IS 'Last 4 digits of Ghana Card for display purposes';
