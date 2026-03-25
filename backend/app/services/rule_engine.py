"""Rule evaluation engine.

Evaluates an authorization request against an agent's active rules and returns
a decision: auto_approved, denied, or pending (needs human review).

Priority order (from CLAUDE.md):
  1. blocked_vendors / blocked_categories  → DENY
  2. auto_approve_below                    → AUTO_APPROVE
  3. require_approval_above                → PENDING
  4. max_per_transaction                   → PENDING if exceeded
  5. max_per_day (aggregate)               → PENDING if would exceed
  6. max_per_month (aggregate)             → PENDING if would exceed
  7. allowed_vendors / allowed_categories  → PENDING if not in whitelist
  8. Default                               → AUTO_APPROVE
"""

# TODO: implement in Phase 1 — rule evaluation logic
