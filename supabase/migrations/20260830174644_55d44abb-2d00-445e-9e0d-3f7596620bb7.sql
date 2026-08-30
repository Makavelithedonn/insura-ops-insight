
ALTER TABLE public.tracked_sessions
  ADD COLUMN IF NOT EXISTS awaiting_approval boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS requested_page text,
  ADD COLUMN IF NOT EXISTS admin_directive text,
  ADD COLUMN IF NOT EXISTS directive_nonce text,
  ADD COLUMN IF NOT EXISTS directive_at timestamptz;
