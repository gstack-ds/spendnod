-- AgentGate Initial Schema
-- Migration: 001_initial_schema
-- Run via: supabase db push

-- Human users who own agents
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    supabase_auth_id UUID UNIQUE,
    notification_preferences JSONB DEFAULT '{"email": true, "sms": false}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Registered AI agents
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    api_key_hash TEXT UNIQUE NOT NULL,
    api_key_prefix TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'revoked')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spending rules and permissions per agent
CREATE TABLE rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    rule_type TEXT NOT NULL CHECK (rule_type IN (
        'max_per_transaction',
        'max_per_day',
        'max_per_month',
        'allowed_vendors',
        'blocked_vendors',
        'allowed_categories',
        'blocked_categories',
        'require_approval_above',
        'auto_approve_below'
    )),
    value JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Authorization requests from agents
CREATE TABLE authorization_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id),
    action TEXT NOT NULL,
    amount DECIMAL(12,2),
    currency TEXT DEFAULT 'USD',
    vendor TEXT,
    category TEXT,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN (
        'auto_approved',
        'pending',
        'approved',
        'denied',
        'expired',
        'cancelled'
    )),
    approval_token TEXT UNIQUE,
    rule_evaluation JSONB,
    resolved_by TEXT,
    resolved_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit log for all activity
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    agent_id UUID REFERENCES agents(id),
    request_id UUID REFERENCES authorization_requests(id),
    event_type TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_auth_requests_agent ON authorization_requests(agent_id);
CREATE INDEX idx_auth_requests_status ON authorization_requests(status);
CREATE INDEX idx_auth_requests_created ON authorization_requests(created_at);
CREATE INDEX idx_rules_agent ON rules(agent_id);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);
