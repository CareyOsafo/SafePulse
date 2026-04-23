-- Migration: 002_create_emergency_contacts
-- Description: Create emergency contacts table for trusted contacts

CREATE TABLE emergency_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    relationship VARCHAR(100),
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    notify_on_emergency BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Each user can have a contact with the same phone only once
    UNIQUE(user_id, phone_number)
);

-- Indexes
CREATE INDEX idx_emergency_contacts_user_id ON emergency_contacts(user_id);
CREATE INDEX idx_emergency_contacts_phone ON emergency_contacts(phone_number);
CREATE INDEX idx_emergency_contacts_primary ON emergency_contacts(user_id, is_primary) WHERE is_primary = TRUE;

-- Updated_at trigger
CREATE TRIGGER update_emergency_contacts_updated_at
    BEFORE UPDATE ON emergency_contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Ensure only one primary contact per user
CREATE OR REPLACE FUNCTION ensure_single_primary_contact()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_primary = TRUE THEN
        UPDATE emergency_contacts
        SET is_primary = FALSE
        WHERE user_id = NEW.user_id
        AND id != NEW.id
        AND is_primary = TRUE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_single_primary_contact_trigger
    BEFORE INSERT OR UPDATE OF is_primary ON emergency_contacts
    FOR EACH ROW
    WHEN (NEW.is_primary = TRUE)
    EXECUTE FUNCTION ensure_single_primary_contact();

-- Comments
COMMENT ON TABLE emergency_contacts IS 'Trusted emergency contacts for users';
COMMENT ON COLUMN emergency_contacts.is_primary IS 'Primary contact receives priority notifications';
