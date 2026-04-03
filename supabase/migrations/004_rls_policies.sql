-- Migration: 004_rls_policies.sql
-- Enables RLS on all 8 public tables and adds row-level access policies.
--
-- ARCHITECTURE NOTE:
--   The FastAPI backend connects as the postgres superuser role, which has
--   BYPASSRLS in Supabase. These policies therefore do NOT affect backend
--   functionality. They are purely defensive: they prevent any direct
--   PostgREST access (anon or authenticated JWT) from leaking cross-tenant
--   data if Supabase's REST API is ever hit directly.
--
-- POLICY DESIGN:
--   - anon role: no access to any table (not needed; backend is postgres)
--   - authenticated role: row-scoped to the calling user via auth.uid()
--     Most tables store users.id (internal UUID), not supabase_auth_id,
--     so we resolve ownership via subquery on the users table.
--   - postgres role: bypasses RLS automatically (no policy needed)
--
-- WRITE PERMISSIONS:
--   - users, agents, rules: authenticated user can INSERT/UPDATE/DELETE their own rows
--   - authorization_requests, audit_log, oauth_*: SELECT only for authenticated
--     (backend owns these writes; no external mutation allowed)
--   - oauth_clients: SELECT only for authenticated (admin-managed)

-- ============================================================
-- ENABLE RLS
-- ============================================================

ALTER TABLE public.users                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rules                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authorization_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oauth_tokens          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oauth_auth_codes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oauth_clients         ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- HELPER: reusable expression to resolve the calling user's internal UUID
-- ============================================================
-- Inline as subquery in each policy rather than a function, to avoid
-- security definer complexity and keep the policies self-documenting.


-- ============================================================
-- TABLE: users
-- ============================================================
-- SELECT: only your own row
CREATE POLICY "users_select_own"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (supabase_auth_id = auth.uid());

-- UPDATE: only your own row (no INSERT — user rows are created by the backend
--         after Supabase auth signup; no DELETE — soft-delete via backend)
CREATE POLICY "users_update_own"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (supabase_auth_id = auth.uid())
  WITH CHECK (supabase_auth_id = auth.uid());


-- ============================================================
-- TABLE: agents
-- ============================================================
CREATE POLICY "agents_select_own"
  ON public.agents
  FOR SELECT
  TO authenticated
  USING (
    user_id = (SELECT id FROM public.users WHERE supabase_auth_id = auth.uid())
  );

CREATE POLICY "agents_insert_own"
  ON public.agents
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (SELECT id FROM public.users WHERE supabase_auth_id = auth.uid())
  );

CREATE POLICY "agents_update_own"
  ON public.agents
  FOR UPDATE
  TO authenticated
  USING (
    user_id = (SELECT id FROM public.users WHERE supabase_auth_id = auth.uid())
  )
  WITH CHECK (
    user_id = (SELECT id FROM public.users WHERE supabase_auth_id = auth.uid())
  );

CREATE POLICY "agents_delete_own"
  ON public.agents
  FOR DELETE
  TO authenticated
  USING (
    user_id = (SELECT id FROM public.users WHERE supabase_auth_id = auth.uid())
  );


-- ============================================================
-- TABLE: rules
-- ============================================================
-- Ownership resolved through agents → users
CREATE POLICY "rules_select_own"
  ON public.rules
  FOR SELECT
  TO authenticated
  USING (
    agent_id IN (
      SELECT id FROM public.agents
      WHERE user_id = (SELECT id FROM public.users WHERE supabase_auth_id = auth.uid())
    )
  );

CREATE POLICY "rules_insert_own"
  ON public.rules
  FOR INSERT
  TO authenticated
  WITH CHECK (
    agent_id IN (
      SELECT id FROM public.agents
      WHERE user_id = (SELECT id FROM public.users WHERE supabase_auth_id = auth.uid())
    )
  );

CREATE POLICY "rules_update_own"
  ON public.rules
  FOR UPDATE
  TO authenticated
  USING (
    agent_id IN (
      SELECT id FROM public.agents
      WHERE user_id = (SELECT id FROM public.users WHERE supabase_auth_id = auth.uid())
    )
  )
  WITH CHECK (
    agent_id IN (
      SELECT id FROM public.agents
      WHERE user_id = (SELECT id FROM public.users WHERE supabase_auth_id = auth.uid())
    )
  );

CREATE POLICY "rules_delete_own"
  ON public.rules
  FOR DELETE
  TO authenticated
  USING (
    agent_id IN (
      SELECT id FROM public.agents
      WHERE user_id = (SELECT id FROM public.users WHERE supabase_auth_id = auth.uid())
    )
  );


-- ============================================================
-- TABLE: authorization_requests
-- ============================================================
-- SELECT only — backend (postgres) creates and resolves these.
-- Ownership resolved through agents → users.
-- agent_id is nullable (request can arrive before agent is known),
-- so we allow selecting rows where the agent belongs to the user OR
-- where agent_id IS NULL (backend will clean these up).
CREATE POLICY "authorization_requests_select_own"
  ON public.authorization_requests
  FOR SELECT
  TO authenticated
  USING (
    agent_id IN (
      SELECT id FROM public.agents
      WHERE user_id = (SELECT id FROM public.users WHERE supabase_auth_id = auth.uid())
    )
  );


-- ============================================================
-- TABLE: audit_log
-- ============================================================
-- SELECT only — audit logs must only be written by the backend.
-- user_id here is the internal users.id FK.
CREATE POLICY "audit_log_select_own"
  ON public.audit_log
  FOR SELECT
  TO authenticated
  USING (
    user_id = (SELECT id FROM public.users WHERE supabase_auth_id = auth.uid())
  );


-- ============================================================
-- TABLE: oauth_tokens
-- ============================================================
-- SELECT only — tokens are issued and revoked by the backend.
CREATE POLICY "oauth_tokens_select_own"
  ON public.oauth_tokens
  FOR SELECT
  TO authenticated
  USING (
    user_id = (SELECT id FROM public.users WHERE supabase_auth_id = auth.uid())
  );


-- ============================================================
-- TABLE: oauth_auth_codes
-- ============================================================
-- SELECT only — auth codes are short-lived, backend-managed.
CREATE POLICY "oauth_auth_codes_select_own"
  ON public.oauth_auth_codes
  FOR SELECT
  TO authenticated
  USING (
    user_id = (SELECT id FROM public.users WHERE supabase_auth_id = auth.uid())
  );


-- ============================================================
-- TABLE: oauth_clients
-- ============================================================
-- Public read so any authenticated user can discover registered clients.
-- No writes — client registration is admin-only (postgres).
CREATE POLICY "oauth_clients_select_authenticated"
  ON public.oauth_clients
  FOR SELECT
  TO authenticated
  USING (true);
