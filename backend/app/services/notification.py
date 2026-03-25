"""Notification service.

Dispatches real-time and email notifications to the human owner when an
authorization request requires human review.

Channels:
  - Supabase Realtime (websocket push to dashboard)
  - Email via Resend API
  - SMS via Twilio (Phase 2)
  - Push notifications (Phase 2)
"""

# TODO: implement in Phase 1 — Supabase Realtime + Resend email
