-- Migration: 014_seed_data
-- Description: Seed initial data for development/testing
-- Note: All UUIDs use valid v4 format (version=4, variant=[89ab]) for class-validator compatibility

-- Insert sample agencies
INSERT INTO agencies (id, name, code, type, region, district, phone_number, latitude, longitude, service_radius_km) VALUES
    ('a1000000-0000-4000-a000-000000000001', 'Ghana National Ambulance Service - Accra Central', 'GNAS-ACC-001', 'ambulance', 'Greater Accra', 'Accra Metropolitan', '+233302123456', 5.5560, -0.1969, 30),
    ('a1000000-0000-4000-a000-000000000002', 'Ghana Police Service - Airport Division', 'GPS-AIR-001', 'police', 'Greater Accra', 'La-Dadekotopon', '+233302789012', 5.6052, -0.1668, 25),
    ('a1000000-0000-4000-a000-000000000003', 'Ghana National Fire Service - Accra', 'GNFS-ACC-001', 'fire', 'Greater Accra', 'Accra Metropolitan', '+233302345678', 5.5500, -0.2050, 35),
    ('a1000000-0000-4000-a000-000000000004', 'SafePulse Security Response', 'SPX-SEC-001', 'security', 'Greater Accra', 'Accra Metropolitan', '+233302901234', 5.5700, -0.1800, 20),
    ('a1000000-0000-4000-a000-000000000005', 'Multi-Response Unit Tema', 'MRU-TEM-001', 'mixed', 'Greater Accra', 'Tema Metropolitan', '+233303567890', 5.6698, -0.0166, 40);

-- Insert sample users (dispatchers and supervisors)
-- Note: These would normally be created via Supabase Auth with email+password
-- The supabase_uid values are placeholders in valid UUID format; real UIDs are linked on first login via email matching
INSERT INTO users (id, supabase_uid, phone_number, email, full_name, app_role, kyc_status) VALUES
    ('b1000000-0000-4000-a000-000000000001', '00000000-0000-4000-a000-000000000001', '+233201000001', 'kwame@safepulse.gov.gh', 'Kwame Dispatcher', 'dispatcher', 'verified'),
    ('b1000000-0000-4000-a000-000000000002', '00000000-0000-4000-a000-000000000002', '+233201000002', 'ama@safepulse.gov.gh', 'Ama Supervisor', 'supervisor', 'verified'),
    ('b1000000-0000-4000-a000-000000000003', '00000000-0000-4000-a000-000000000003', '+233201000003', 'kofi@safepulse.gov.gh', 'Kofi Unit Officer', 'unit', 'verified'),
    ('b1000000-0000-4000-a000-000000000004', '00000000-0000-4000-a000-000000000004', '+233201000004', 'abena@safepulse.gov.gh', 'Abena Admin', 'admin', 'verified');

-- Link users to agencies
INSERT INTO agency_users (agency_id, user_id, role) VALUES
    ('a1000000-0000-4000-a000-000000000001', 'b1000000-0000-4000-a000-000000000001', 'dispatcher'),
    ('a1000000-0000-4000-a000-000000000001', 'b1000000-0000-4000-a000-000000000002', 'supervisor'),
    ('a1000000-0000-4000-a000-000000000002', 'b1000000-0000-4000-a000-000000000001', 'dispatcher');

-- Insert sample units
INSERT INTO units (id, agency_id, call_sign, unit_type, status, is_on_duty, phone_number, current_latitude, current_longitude, assigned_user_id, has_medical_equipment) VALUES
    ('c0100000-0000-4000-a000-000000000001', 'a1000000-0000-4000-a000-000000000001', 'AMB-001', 'ambulance', 'available', true, '+233241000001', 5.5560, -0.1969, 'b1000000-0000-4000-a000-000000000003', true),
    ('c0100000-0000-4000-a000-000000000002', 'a1000000-0000-4000-a000-000000000001', 'AMB-002', 'ambulance', 'available', true, '+233241000002', 5.5800, -0.2100, null, true),
    ('c0100000-0000-4000-a000-000000000003', 'a1000000-0000-4000-a000-000000000001', 'AMB-003', 'ambulance', 'offline', false, '+233241000003', 5.5400, -0.1800, null, true),
    ('c0100000-0000-4000-a000-000000000004', 'a1000000-0000-4000-a000-000000000002', 'POL-101', 'police', 'available', true, '+233242000001', 5.6052, -0.1668, null, false),
    ('c0100000-0000-4000-a000-000000000005', 'a1000000-0000-4000-a000-000000000002', 'POL-102', 'police', 'busy', true, '+233242000002', 5.6200, -0.1500, null, false),
    ('c0100000-0000-4000-a000-000000000006', 'a1000000-0000-4000-a000-000000000003', 'FIRE-01', 'fire', 'available', true, '+233243000001', 5.5500, -0.2050, null, false),
    ('c0100000-0000-4000-a000-000000000007', 'a1000000-0000-4000-a000-000000000004', 'SEC-A1', 'security', 'available', true, '+233244000001', 5.5700, -0.1800, null, false),
    ('c0100000-0000-4000-a000-000000000008', 'a1000000-0000-4000-a000-000000000005', 'MRU-01', 'mixed', 'available', true, '+233245000001', 5.6698, -0.0166, null, true);

-- Note: Citizen users and incidents should be created through the actual application flow
-- This seed data provides enough to test the dispatcher dashboard and unit portal

-- Comments
COMMENT ON TABLE agencies IS 'Seeded with sample agencies for Greater Accra region';
