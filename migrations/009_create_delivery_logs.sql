-- Migration: 009_create_delivery_logs
-- Description: Create delivery_logs table for notification tracking

CREATE TYPE notification_channel AS ENUM ('push', 'whatsapp', 'sms');
CREATE TYPE delivery_status AS ENUM ('pending', 'sent', 'delivered', 'failed', 'retrying');

CREATE TABLE delivery_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Association
    incident_id UUID REFERENCES emergency_requests(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,

    -- Recipient
    recipient_phone VARCHAR(20) NOT NULL,
    recipient_name VARCHAR(255),

    -- Channel and message
    channel notification_channel NOT NULL,
    message_type VARCHAR(50) NOT NULL, -- e.g., 'incident_created', 'status_update', 'guardian_alert'
    message_content TEXT NOT NULL,

    -- Status
    status delivery_status NOT NULL DEFAULT 'pending',

    -- Provider response
    provider_name VARCHAR(50),
    provider_message_id VARCHAR(255),
    provider_response JSONB,
    error_message TEXT,

    -- Retry handling
    attempt_count INTEGER NOT NULL DEFAULT 0,
    max_attempts INTEGER NOT NULL DEFAULT 3,
    next_retry_at TIMESTAMPTZ,

    -- Timestamps
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_delivery_logs_incident ON delivery_logs(incident_id);
CREATE INDEX idx_delivery_logs_user ON delivery_logs(user_id);
CREATE INDEX idx_delivery_logs_status ON delivery_logs(status);
CREATE INDEX idx_delivery_logs_channel ON delivery_logs(channel);
CREATE INDEX idx_delivery_logs_retry ON delivery_logs(status, next_retry_at) WHERE status = 'retrying';
CREATE INDEX idx_delivery_logs_created_at ON delivery_logs(created_at DESC);
CREATE INDEX idx_delivery_logs_recipient ON delivery_logs(recipient_phone);

-- Trigger
CREATE TRIGGER update_delivery_logs_updated_at
    BEFORE UPDATE ON delivery_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE delivery_logs IS 'Tracks all notification delivery attempts';
COMMENT ON COLUMN delivery_logs.message_type IS 'Type of notification (incident_created, status_update, etc.)';
COMMENT ON COLUMN delivery_logs.attempt_count IS 'Number of delivery attempts made';
