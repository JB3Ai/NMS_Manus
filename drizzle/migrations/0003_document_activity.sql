-- Migration: Add document_activity table
-- This migration creates the document_activity table to track document viewing and downloading activities
-- without requiring PIN authentication

-- Create the document_activity table
CREATE TABLE IF NOT EXISTS document_activity (
    id SERIAL PRIMARY KEY,
    documentId VARCHAR(100) NOT NULL,
    userId VARCHAR(64) NOT NULL,
    eventType VARCHAR(20) NOT NULL CHECK (eventType IN ('opened', 'viewed', 'downloaded', 'read', 'unread')),
    occurredAt TIMESTAMP NOT NULL DEFAULT NOW(),
    userAgent TEXT,
    ipHash VARCHAR(64),
    metadata JSONB
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_document_activity_user_document ON document_activity(userId, documentId);
CREATE INDEX IF NOT EXISTS idx_document_activity_document_event ON document_activity(documentId, eventType);
CREATE INDEX IF NOT EXISTS idx_document_activity_occurred_at ON document_activity(occurredAt);

-- Add comment for table description
COMMENT ON TABLE document_activity IS 'Tracks document viewing and downloading activities for reviewers';