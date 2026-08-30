
CREATE TABLE public.tracked_sessions (
  session_id text PRIMARY KEY,
  national_id text,
  phone text,
  serial_number text,
  vehicle_make text,
  vehicle_model text,
  model_year int,
  declared_value numeric,
  insurer_company text,
  insurer_offer_sar numeric,
  current_page text NOT NULL DEFAULT 'quote_landing',
  state text NOT NULL DEFAULT 'live',
  submission jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.tracked_sessions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.tracked_sessions TO anon;
GRANT ALL ON public.tracked_sessions TO service_role;

ALTER TABLE public.tracked_sessions ENABLE ROW LEVEL SECURITY;

-- Public site posts events with anon key; the endpoint is what will actually be called.
CREATE POLICY "anon can insert new sessions"
  ON public.tracked_sessions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon can update own session by id"
  ON public.tracked_sessions FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon can read sessions"
  ON public.tracked_sessions FOR SELECT TO anon USING (true);
CREATE POLICY "authenticated full access"
  ON public.tracked_sessions FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.tracked_sessions_touch_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_tracked_sessions_touch
  BEFORE UPDATE ON public.tracked_sessions
  FOR EACH ROW EXECUTE FUNCTION public.tracked_sessions_touch_updated_at();

ALTER PUBLICATION supabase_realtime ADD TABLE public.tracked_sessions;
