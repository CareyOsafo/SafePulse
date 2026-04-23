-- Migration: 013_create_additional_indexes
-- Description: Additional indexes and performance optimizations

-- Composite indexes for common query patterns

-- Active incidents with location for map display
CREATE INDEX idx_emergency_requests_active_with_location ON emergency_requests(agency_id, status, latitude, longitude)
WHERE status NOT IN ('resolved', 'cancelled', 'closed') AND latitude IS NOT NULL;

-- Units available for dispatch
CREATE INDEX idx_units_available_for_dispatch ON units(agency_id, unit_type, status, is_on_duty)
WHERE status = 'available' AND is_on_duty = TRUE;

-- Pending assignments that need monitoring
CREATE INDEX idx_unit_assignments_pending_response ON unit_assignments(unit_id, status, offered_at)
WHERE status = 'offered';

-- Accepted assignments that need en_route monitoring
CREATE INDEX idx_unit_assignments_awaiting_enroute ON unit_assignments(incident_id, status, responded_at)
WHERE status = 'accepted';

-- Recent delivery logs for monitoring
CREATE INDEX idx_delivery_logs_recent_by_incident ON delivery_logs(incident_id, created_at DESC)
WHERE incident_id IS NOT NULL;

-- Full-text search on incidents (if needed)
-- CREATE INDEX idx_emergency_requests_fts ON emergency_requests
-- USING GIN (to_tsvector('english', COALESCE(description, '') || ' ' || COALESCE(landmark, '')));

-- Spatial indexes (if PostGIS is available)
-- CREATE EXTENSION IF NOT EXISTS postgis;
-- CREATE INDEX idx_emergency_requests_geom ON emergency_requests USING GIST (ST_MakePoint(longitude, latitude));
-- CREATE INDEX idx_units_geom ON units USING GIST (ST_MakePoint(current_longitude, current_latitude));

-- Comments
COMMENT ON INDEX idx_emergency_requests_active_with_location IS 'Optimizes map queries for active incidents';
COMMENT ON INDEX idx_units_available_for_dispatch IS 'Optimizes dispatch queries for available units';
