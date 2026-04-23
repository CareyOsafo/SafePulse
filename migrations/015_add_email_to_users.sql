-- Migration: 015_add_email_to_users
-- Description: Add email column to users table and make phone_number nullable
-- Reason: Support email+password authentication for dispatchers/supervisors

-- Add email column
ALTER TABLE users ADD COLUMN email VARCHAR(255) UNIQUE;

-- Make phone_number nullable (email-only users won't have one)
ALTER TABLE users ALTER COLUMN phone_number DROP NOT NULL;

-- Ensure at least one contact method exists
ALTER TABLE users ADD CONSTRAINT users_contact_check
  CHECK (phone_number IS NOT NULL OR email IS NOT NULL);

-- Index for email lookups
CREATE INDEX idx_users_email ON users(email) WHERE email IS NOT NULL;
