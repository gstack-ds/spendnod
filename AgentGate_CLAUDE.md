# AgentGate — Agent Authorization Gateway

## Project Overview

AgentGate is a lightweight authorization gateway that sits between AI agents and financial transactions. It gives humans control over what their AI agents can spend, with configurable auto-approval rules and real-time notifications for out-of-bounds requests.

**Core Value Prop:** Three lines of code for the developer. One swipe to approve for the human.

```python
from agentgate import AgentGate
gate = AgentGate(api_key="sk-...")
approval = gate.authorize(action="purchase", amount=49.99, vendor="AWS", description="Provision EC2 instance")
```

**Product Philosophy:** The developer experience IS the product. If integration feels like a burden, nobody uses it. The system should be invisible when things are within bounds and instant when human approval is needed.

---

## Architecture

### System Components

```
┌──────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Agent SDK   │────▶│  AgentGate API   │────▶│  Human Dashboard│
│  (Python/JS) │◀────│  (FastAPI/Lambda) │◀────│  (React SPA)    │
└──────────────┘     └────────┬─────────┘     └─────────────────┘
                              │
                     ┌────────┴─────────┐
                     │    Supabase      │
                     │  - Auth          │
                     │  - PostgreSQL    │
                     │  - Realtime WS   │
                     └──────────────────┘
```

### Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| API Backend | FastAPI (Python) | Fast, async, auto-generates OpenAPI docs |
| Database | Supabase (PostgreSQL) | Auth, DB, realtime subscriptions in one |
| Dashboard | React + Tailwind | Familiar stack, mobile-responsive |
| Notifications | Supabase Realtime + Email (Resend) | Start simple, add SMS/push later |
| SDK | Python package (PyPI) | Primary audience is agent developers |
| Auth | Supabase Auth + API keys | Humans use Supabase Auth, agents use API keys |
| Hosting | TBD (Railway, Fly.io, or AWS Lambda) | Evaluate at deploy time — prioritize speed for MVP |

---

## Data Model

### Tables

```sql
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
    name TEXT NOT NULL,                    -- "My Shopping Agent"
    api_key_hash TEXT UNIQUE NOT NULL,     -- hashed API key
    api_key_prefix TEXT NOT NULL,          -- "sk-abc..." for display
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'revoked')),
    metadata JSONB DEFAULT '{}',           -- agent framework, version, etc.
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spending rules and permissions per agent
CREATE TABLE rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    rule_type TEXT NOT NULL CHECK (rule_type IN (
        'max_per_transaction',     -- single transaction limit
        'max_per_day',             -- daily aggregate limit
        'max_per_month',           -- monthly aggregate limit
        'allowed_vendors',         -- whitelist of vendors
        'blocked_vendors',         -- blacklist of vendors
        'allowed_categories',      -- e.g., "cloud_services", "office_supplies"
        'blocked_categories',      -- categories to always deny
        'require_approval_above',  -- always ask human above this amount
        'auto_approve_below'       -- always approve below this amount
    )),
    value JSONB NOT NULL,          -- {"amount": 50.00} or {"vendors": ["AWS", "GCP"]}
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Authorization requests from agents
CREATE TABLE authorization_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id),
    action TEXT NOT NULL,               -- "purchase", "subscribe", "transfer"
    amount DECIMAL(12,2),
    currency TEXT DEFAULT 'USD',
    vendor TEXT,
    category TEXT,
    description TEXT,                   -- agent's description of why
    status TEXT DEFAULT 'pending' CHECK (status IN (
        'auto_approved',    -- within rules, no human needed
        'pending',          -- waiting for human
        'approved',         -- human approved
        'denied',           -- human denied
        'expired',          -- timed out waiting for human
        'cancelled'         -- agent cancelled the request
    )),
    approval_token TEXT UNIQUE,         -- signed JWT for approved requests
    rule_evaluation JSONB,              -- which rules matched and why
    resolved_by TEXT,                   -- 'system' or 'human'
    resolved_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,             -- requests expire if not acted on
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit log for all activity
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    agent_id UUID REFERENCES agents(id),
    request_id UUID REFERENCES authorization_requests(id),
    event_type TEXT NOT NULL,           -- 'request_created', 'auto_approved', 'human_approved', etc.
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
```

---

## API Endpoints

### Agent-Facing (API Key Auth)

```
POST   /v1/authorize              - Submit authorization request
GET    /v1/authorize/{request_id} - Check request status (poll)
DELETE /v1/authorize/{request_id} - Cancel pending request
```

### Human-Facing (Supabase Auth / JWT)

```
# Agents
GET    /v1/agents                 - List my agents
POST   /v1/agents                 - Register new agent (returns API key)
PATCH  /v1/agents/{id}            - Update agent (name, status)
DELETE /v1/agents/{id}            - Revoke agent

# Rules
GET    /v1/agents/{id}/rules      - List rules for agent
POST   /v1/agents/{id}/rules      - Add rule
PATCH  /v1/rules/{id}             - Update rule
DELETE /v1/rules/{id}             - Delete rule

# Requests
GET    /v1/requests               - List pending/recent requests
POST   /v1/requests/{id}/approve  - Approve pending request
POST   /v1/requests/{id}/deny     - Deny pending request

# Dashboard
GET    /v1/dashboard/stats        - Spending summary, approval rates
GET    /v1/dashboard/activity     - Recent activity feed
```

### Webhook (Outbound)

```
POST   {user_webhook_url}         - Notify on pending request (optional)
```

---

## Authorization Flow

```
Agent calls POST /v1/authorize
    │
    ▼
Validate API key → identify agent + owner
    │
    ▼
Load agent's rules
    │
    ▼
Evaluate rules against request
    │
    ├── All rules pass → AUTO_APPROVE
    │   └── Return approval token immediately
    │
    ├── Explicit deny rule matched → DENY
    │   └── Return denied status immediately
    │
    └── Needs human review → PENDING
        ├── Send notification to human (realtime + email)
        ├── Agent polls or uses websocket for status
        └── Human approves/denies from dashboard
            └── Return approval token or denied status
```

### Rule Evaluation Logic (Priority Order)

1. Check `blocked_vendors` / `blocked_categories` → instant DENY
2. Check `auto_approve_below` → if amount under threshold, AUTO_APPROVE
3. Check `require_approval_above` → if amount over threshold, PENDING
4. Check `max_per_transaction` → if over, PENDING
5. Check `max_per_day` (aggregate today's approved amounts) → if would exceed, PENDING
6. Check `max_per_month` (aggregate this month) → if would exceed, PENDING
7. Check `allowed_vendors` / `allowed_categories` → if not in whitelist, PENDING
8. Default: AUTO_APPROVE (if no rules triggered denial or review)

---

## Phases

### Phase 1: Core API + Basic Dashboard (MVP)
**Goal:** Working authorization flow end-to-end

- [ ] Supabase project setup (auth, database, realtime)
- [ ] Database migrations (all tables above)
- [ ] FastAPI backend with core endpoints
  - [ ] Agent registration + API key generation
  - [ ] POST /v1/authorize with rule evaluation engine
  - [ ] GET /v1/authorize/{id} for polling
  - [ ] Human approve/deny endpoints
- [ ] Rule evaluation engine
- [ ] JWT approval token generation + signing
- [ ] React dashboard (minimal)
  - [ ] Login/signup (Supabase Auth)
  - [ ] Register agent → get API key
  - [ ] Set basic rules (max per transaction, daily limit)
  - [ ] View pending requests → approve/deny
  - [ ] Transaction history list
- [ ] Python SDK (`agentgate` package)
  - [ ] `AgentGate(api_key=...)` client
  - [ ] `gate.authorize(action, amount, vendor, description)` → blocks until resolved
  - [ ] `gate.authorize_async(...)` → returns request_id for polling
- [ ] Supabase Realtime for live pending request updates on dashboard
- [ ] Email notifications via Resend for pending requests

### Phase 2: Polish + Developer Experience
**Goal:** Make it production-ready for early adopters

- [ ] SDK improvements
  - [ ] JavaScript/TypeScript SDK
  - [ ] LangChain integration (as a tool wrapper)
  - [ ] CrewAI integration
  - [ ] Detailed error messages and retry logic
- [ ] Dashboard improvements
  - [ ] Spending analytics charts (daily/weekly/monthly)
  - [ ] Rule templates ("Conservative", "Moderate", "Permissive")
  - [ ] Agent activity timeline
  - [ ] Mobile-responsive approval flow
- [ ] SMS notifications (Twilio)
- [ ] Push notifications (web push)
- [ ] Request expiration handling (background job)
- [ ] Rate limiting on API
- [ ] OpenAPI spec published

### Phase 3: Open Protocol + Growth
**Goal:** Establish the standard, grow adoption

- [ ] Publish Agent Transaction Authorization Protocol (ATAP) spec
  - [ ] JSON Schema for authorization requests/responses
  - [ ] Protocol documentation on GitHub
  - [ ] Reference implementation
- [ ] Vendor-side verification endpoint
  - [ ] Merchants can verify approval tokens
  - [ ] Token introspection API
- [ ] Webhook system for integrations
- [ ] Multi-agent support (teams of agents under one owner)
- [ ] Tiered pricing implementation
  - [ ] Free: 100 requests/month, 1 agent
  - [ ] Pro ($29/mo): 5,000 requests, 10 agents, SMS
  - [ ] Business ($99/mo): 50,000 requests, unlimited agents, webhooks, analytics export
  - [ ] Enterprise ($299/mo): custom limits, SSO, audit compliance, SLA

### Phase 4: Intelligence Layer
**Goal:** Differentiate with data

- [ ] Anomaly detection (unusual spending patterns)
- [ ] Smart rule suggestions based on agent behavior
- [ ] Aggregated market intelligence dashboard
- [ ] Budget forecasting based on agent activity trends
- [ ] Compliance reporting (exportable audit trails)
- [ ] Multi-currency support

---

## Project Structure

```
agentgate/
├── CLAUDE.md
├── README.md
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app entry
│   │   ├── config.py            # Settings, env vars
│   │   ├── models/
│   │   │   ├── database.py      # SQLAlchemy/Supabase models
│   │   │   └── schemas.py       # Pydantic request/response models
│   │   ├── api/
│   │   │   ├── agents.py        # Agent CRUD endpoints
│   │   │   ├── authorize.py     # Core authorization endpoint
│   │   │   ├── rules.py         # Rule CRUD endpoints
│   │   │   ├── requests.py      # Human approve/deny endpoints
│   │   │   └── dashboard.py     # Stats and activity endpoints
│   │   ├── services/
│   │   │   ├── rule_engine.py   # Rule evaluation logic
│   │   │   ├── token_service.py # JWT approval token generation
│   │   │   ├── notification.py  # Email/SMS dispatch
│   │   │   └── audit.py         # Audit logging
│   │   └── middleware/
│   │       ├── auth.py          # API key + Supabase JWT auth
│   │       └── rate_limit.py    # Rate limiting
│   ├── requirements.txt
│   └── template.yaml            # SAM template for Lambda deploy
├── dashboard/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Agents.jsx
│   │   │   ├── Rules.jsx
│   │   │   ├── Requests.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── components/
│   │   │   ├── ApprovalCard.jsx
│   │   │   ├── RuleEditor.jsx
│   │   │   ├── SpendingChart.jsx
│   │   │   └── AgentCard.jsx
│   │   └── lib/
│   │       ├── supabase.js
│   │       └── api.js
│   ├── package.json
│   └── tailwind.config.js
├── sdk/
│   ├── python/
│   │   ├── agentgate/
│   │   │   ├── __init__.py
│   │   │   ├── client.py        # AgentGate class
│   │   │   ├── models.py        # Response types
│   │   │   └── exceptions.py    # Custom errors
│   │   ├── setup.py
│   │   └── README.md
│   └── javascript/              # Phase 2
│       ├── src/
│       │   └── index.ts
│       └── package.json
├── protocol/                     # Phase 3
│   ├── ATAP-spec-v1.md
│   └── schemas/
│       ├── authorize-request.json
│       └── authorize-response.json
└── supabase/
    └── migrations/
        └── 001_initial_schema.sql
```

---

## SDK Design

### Python SDK (Primary)

```python
from agentgate import AgentGate, AuthorizationError, AuthorizationDenied, AuthorizationExpired

# Initialize
gate = AgentGate(
    api_key="sk-ag-abc123...",
    base_url="https://api.agentgate.dev",  # optional, defaults to production
    timeout=300,                             # max seconds to wait for human approval
    poll_interval=2,                         # seconds between status checks
)

# Simple authorize (blocks until resolved)
try:
    approval = gate.authorize(
        action="purchase",
        amount=49.99,
        vendor="AWS",
        category="cloud_services",
        description="Provision t3.medium EC2 instance for data processing"
    )
    print(approval.token)       # signed JWT to pass to vendor
    print(approval.status)      # "auto_approved" or "approved"
    print(approval.resolved_by) # "system" or "human"
except AuthorizationDenied as e:
    print(f"Request denied: {e.reason}")
except AuthorizationExpired:
    print("Human didn't respond in time")

# Async authorize (non-blocking)
request = gate.authorize_async(
    action="subscribe",
    amount=29.99,
    vendor="OpenAI",
    description="Monthly API subscription"
)
print(request.id)       # UUID
print(request.status)   # "pending"

# Check later
status = gate.check(