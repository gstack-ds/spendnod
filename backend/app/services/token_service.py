"""Approval token service.

Generates and verifies signed JWT approval tokens returned to agents after
a request is approved (auto or human). Tokens are short-lived and include
the request ID, agent ID, amount, and vendor for vendor-side verification.
"""

# TODO: implement in Phase 1 — JWT signing with settings.JWT_SECRET
