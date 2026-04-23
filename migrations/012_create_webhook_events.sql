-- Migration: 012_create_webhook_events
-- Description: Create webhook_events table for idempotent webhook processing

CREATE TABLE webhook_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Event identification
    provider VARCHAR(50) NOT NULL, -- 'metamap', 'twilio', 'africastalking', etc.
    event_id VARCHAR(255) NOT NULL, -- Provider's event ID for idempotency
    event_type VARCHAR(100) NOT NULL,

    -- Payload
    payload JSONB NOT NULL,
    headers JSONB,

    -- Processing status
    processed BOOLEAN NOT NULL DEFAULT FALSE,
    processed_at TIMESTAMPTZ,
    processing_error TEXT,

    -- Related entities
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    incident_id UUID REFERENCES emergency_requests(id) ON DELETE SET NULL,

    -- Timestamps
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Unique constraint for idempotency
    UNIQUE(provider, event_id)
);

-- Indexes
CREATE INDEX idx_webhook_events_provider ON webhook_events(provider);
CREATE INDEX idx_webhook_events_event_type ON webhook_events(event_type);
CREATE INDEX idx_webhook_events_processed ON webhook_events(processed) WHERE processed = FALSE;
CREATE INDEX idx_webhook_events_user ON webhook_events(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_webhook_events_received_at ON webhook_events(received_at DESC);
CREATE INDEX idx_webhook_events_idempotency ON webhook_events(provider, event_id);

-- Comments
COMMENT ON TABLE webhook_events IS 'Stores all incoming webhooks for idempotent processing';
COMMENT ON COLUMN webhook_events.event_id IS 'Provider-specific event ID for deduplication';
COMMENT ON COLUMN webhook_events.processed IS 'Whether this webhook has been processed';
