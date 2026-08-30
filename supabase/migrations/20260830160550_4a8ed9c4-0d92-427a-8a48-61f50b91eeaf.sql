-- Application Workflow System — ported from becarev3, adapted for Lovable Cloud (GRANTs added)
-- 7 tables + 4 SECURITY DEFINER functions (approve_step, reject_step, request_changes_step, unlock_step)

-- ============================================================
-- 1. applications
-- ============================================================
CREATE TABLE IF NOT EXISTS public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id text UNIQUE NOT NULL,
  customer_id text NOT NULL,
  overall_status text NOT NULL DEFAULT 'draft'
    CHECK (overall_status IN ('draft','submitted','under_review','approved','rejected','completed')),
  current_step text,
  insurance_type text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_activity_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_applications_customer_id ON public.applications(customer_id);
CREATE INDEX IF NOT EXISTS idx_applications_application_id ON public.applications(application_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.applications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.applications TO authenticated;
GRANT ALL ON public.applications TO service_role;

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_applications" ON public.applications;
CREATE POLICY "anon_select_applications" ON public.applications FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_applications" ON public.applications;
CREATE POLICY "anon_insert_applications" ON public.applications FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_applications" ON public.applications;
CREATE POLICY "anon_update_applications" ON public.applications FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- 2. application_steps
-- ============================================================
CREATE TABLE IF NOT EXISTS public.application_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  step_key text NOT NULL,
  title text NOT NULL,
  step_order int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','submitted','under_review','approved','changes_requested','rejected','locked')),
  data jsonb DEFAULT '{}'::jsonb,
  locked boolean NOT NULL DEFAULT false,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(application_id, step_key)
);

CREATE INDEX IF NOT EXISTS idx_app_steps_application_id ON public.application_steps(application_id);
CREATE INDEX IF NOT EXISTS idx_app_steps_step_key ON public.application_steps(step_key);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.application_steps TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.application_steps TO authenticated;
GRANT ALL ON public.application_steps TO service_role;

ALTER TABLE public.application_steps ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_app_steps" ON public.application_steps;
CREATE POLICY "anon_select_app_steps" ON public.application_steps FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_app_steps" ON public.application_steps;
CREATE POLICY "anon_insert_app_steps" ON public.application_steps FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_app_steps" ON public.application_steps;
CREATE POLICY "anon_update_app_steps" ON public.application_steps FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- 3. submission_versions
-- ============================================================
CREATE TABLE IF NOT EXISTS public.submission_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  step_id uuid NOT NULL REFERENCES public.application_steps(id) ON DELETE CASCADE,
  step_key text NOT NULL,
  version_number int NOT NULL DEFAULT 1,
  data jsonb DEFAULT '{}'::jsonb,
  submitted_at timestamptz DEFAULT now(),
  UNIQUE(step_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_sub_versions_step_id ON public.submission_versions(step_id);
CREATE INDEX IF NOT EXISTS idx_sub_versions_app_id ON public.submission_versions(application_id);

GRANT SELECT, INSERT ON public.submission_versions TO anon;
GRANT SELECT, INSERT ON public.submission_versions TO authenticated;
GRANT ALL ON public.submission_versions TO service_role;

ALTER TABLE public.submission_versions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_sub_versions" ON public.submission_versions;
CREATE POLICY "anon_select_sub_versions" ON public.submission_versions FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_sub_versions" ON public.submission_versions;
CREATE POLICY "anon_insert_sub_versions" ON public.submission_versions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- ============================================================
-- 4. review_actions
-- ============================================================
CREATE TABLE IF NOT EXISTS public.review_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  step_id uuid NOT NULL REFERENCES public.application_steps(id) ON DELETE CASCADE,
  step_key text NOT NULL,
  admin_id uuid,
  action text NOT NULL CHECK (action IN ('approve','reject','request_changes','unlock')),
  comment text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_review_actions_app_id ON public.review_actions(application_id);
CREATE INDEX IF NOT EXISTS idx_review_actions_step_id ON public.review_actions(step_id);

GRANT SELECT ON public.review_actions TO anon;
GRANT SELECT ON public.review_actions TO authenticated;
GRANT ALL ON public.review_actions TO service_role;

ALTER TABLE public.review_actions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_review_actions" ON public.review_actions;
CREATE POLICY "anon_select_review_actions" ON public.review_actions FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_review_actions" ON public.review_actions;
CREATE POLICY "anon_insert_review_actions" ON public.review_actions FOR INSERT
  TO service_role WITH CHECK (true);

-- ============================================================
-- 5. admin_comments
-- ============================================================
CREATE TABLE IF NOT EXISTS public.admin_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  step_id uuid NOT NULL REFERENCES public.application_steps(id) ON DELETE CASCADE,
  step_key text NOT NULL,
  admin_id uuid,
  comment text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_comments_app_id ON public.admin_comments(application_id);
CREATE INDEX IF NOT EXISTS idx_admin_comments_step_id ON public.admin_comments(step_id);

GRANT SELECT, INSERT, UPDATE ON public.admin_comments TO anon;
GRANT SELECT, INSERT, UPDATE ON public.admin_comments TO authenticated;
GRANT ALL ON public.admin_comments TO service_role;

ALTER TABLE public.admin_comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_admin_comments" ON public.admin_comments;
CREATE POLICY "anon_select_admin_comments" ON public.admin_comments FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_admin_comments" ON public.admin_comments;
CREATE POLICY "anon_insert_admin_comments" ON public.admin_comments FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_admin_comments" ON public.admin_comments;
CREATE POLICY "anon_update_admin_comments" ON public.admin_comments FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- 6. application_history
-- ============================================================
CREATE TABLE IF NOT EXISTS public.application_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  step_key text,
  details jsonb DEFAULT '{}'::jsonb,
  actor text DEFAULT 'customer',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_app_history_app_id ON public.application_history(application_id);
CREATE INDEX IF NOT EXISTS idx_app_history_event_type ON public.application_history(event_type);

GRANT SELECT, INSERT ON public.application_history TO anon;
GRANT SELECT, INSERT ON public.application_history TO authenticated;
GRANT ALL ON public.application_history TO service_role;

ALTER TABLE public.application_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_app_history" ON public.application_history;
CREATE POLICY "anon_select_app_history" ON public.application_history FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_app_history" ON public.application_history;
CREATE POLICY "anon_insert_app_history" ON public.application_history FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- ============================================================
-- 7. notifications
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  step_key text,
  type text NOT NULL CHECK (type IN ('step_approved','changes_requested','step_rejected','step_unlocked','application_completed','step_submitted')),
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_app_id ON public.notifications(application_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

GRANT SELECT, INSERT, UPDATE ON public.notifications TO anon;
GRANT SELECT, INSERT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_notifications" ON public.notifications;
CREATE POLICY "anon_select_notifications" ON public.notifications FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_notifications" ON public.notifications;
CREATE POLICY "anon_insert_notifications" ON public.notifications FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_notifications" ON public.notifications;
CREATE POLICY "anon_update_notifications" ON public.notifications FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- SECURITY DEFINER FUNCTIONS (called by admin backend with service role)
-- ============================================================

CREATE OR REPLACE FUNCTION public.approve_step(
  p_application_id uuid,
  p_step_key text,
  p_admin_id uuid DEFAULT NULL,
  p_comment text DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_step_id uuid;
  v_next_step_key text;
  v_next_step_id uuid;
  v_step_title text;
BEGIN
  SELECT id, title INTO v_step_id, v_step_title
  FROM public.application_steps
  WHERE application_id = p_application_id AND step_key = p_step_key;
  IF v_step_id IS NULL THEN
    RAISE EXCEPTION 'Step not found: %', p_step_key;
  END IF;
  UPDATE public.application_steps
  SET status = 'approved', reviewed_at = now(), reviewed_by = p_admin_id,
      updated_at = now(), locked = true
  WHERE id = v_step_id;
  SELECT step_key, id INTO v_next_step_key, v_next_step_id
  FROM public.application_steps
  WHERE application_id = p_application_id
    AND step_order > (SELECT step_order FROM public.application_steps WHERE id = v_step_id)
  ORDER BY step_order ASC LIMIT 1;
  IF v_next_step_id IS NOT NULL THEN
    UPDATE public.application_steps
    SET status = 'draft', locked = false, updated_at = now()
    WHERE id = v_next_step_id;
    UPDATE public.applications
    SET current_step = v_next_step_key, updated_at = now(), last_activity_at = now()
    WHERE id = p_application_id;
  ELSE
    UPDATE public.applications
    SET overall_status = 'completed', current_step = NULL,
        updated_at = now(), last_activity_at = now()
    WHERE id = p_application_id;
  END IF;
  INSERT INTO public.review_actions (application_id, step_id, step_key, admin_id, action, comment)
  VALUES (p_application_id, v_step_id, p_step_key, p_admin_id, 'approve', p_comment);
  INSERT INTO public.application_history (application_id, event_type, step_key, actor, details)
  VALUES (p_application_id, 'step_approved', p_step_key, 'admin',
          jsonb_build_object('comment', p_comment, 'step_title', v_step_title));
  INSERT INTO public.notifications (application_id, step_key, type, title, message)
  VALUES (p_application_id, p_step_key, 'step_approved',
          'تمت الموافقة على الخطوة',
          COALESCE(p_comment, 'تمت الموافقة على "' || v_step_title || '" بنجاح.'));
END $$;

CREATE OR REPLACE FUNCTION public.reject_step(
  p_application_id uuid,
  p_step_key text,
  p_admin_id uuid DEFAULT NULL,
  p_comment text DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_step_id uuid;
  v_step_title text;
BEGIN
  SELECT id, title INTO v_step_id, v_step_title
  FROM public.application_steps
  WHERE application_id = p_application_id AND step_key = p_step_key;
  IF v_step_id IS NULL THEN
    RAISE EXCEPTION 'Step not found: %', p_step_key;
  END IF;
  UPDATE public.application_steps
  SET status = 'rejected', reviewed_at = now(), reviewed_by = p_admin_id,
      updated_at = now(), locked = false
  WHERE id = v_step_id;
  UPDATE public.applications
  SET overall_status = 'rejected', updated_at = now(), last_activity_at = now()
  WHERE id = p_application_id;
  INSERT INTO public.review_actions (application_id, step_id, step_key, admin_id, action, comment)
  VALUES (p_application_id, v_step_id, p_step_key, p_admin_id, 'reject', p_comment);
  INSERT INTO public.application_history (application_id, event_type, step_key, actor, details)
  VALUES (p_application_id, 'step_rejected', p_step_key, 'admin',
          jsonb_build_object('comment', p_comment, 'step_title', v_step_title));
  INSERT INTO public.notifications (application_id, step_key, type, title, message)
  VALUES (p_application_id, p_step_key, 'step_rejected',
          'تم رفض الخطوة',
          COALESCE(p_comment, 'تم رفض "' || v_step_title || '". يرجى مراجعة البيانات وإعادة الإرسال.'));
END $$;

CREATE OR REPLACE FUNCTION public.request_changes_step(
  p_application_id uuid,
  p_step_key text,
  p_admin_id uuid DEFAULT NULL,
  p_comment text DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_step_id uuid;
  v_step_title text;
BEGIN
  SELECT id, title INTO v_step_id, v_step_title
  FROM public.application_steps
  WHERE application_id = p_application_id AND step_key = p_step_key;
  IF v_step_id IS NULL THEN
    RAISE EXCEPTION 'Step not found: %', p_step_key;
  END IF;
  UPDATE public.application_steps
  SET status = 'changes_requested', reviewed_at = now(), reviewed_by = p_admin_id,
      updated_at = now(), locked = false
  WHERE id = v_step_id;
  UPDATE public.application_steps
  SET status = 'locked', locked = true, updated_at = now()
  WHERE application_id = p_application_id
    AND step_order > (SELECT step_order FROM public.application_steps WHERE id = v_step_id);
  UPDATE public.applications
  SET overall_status = 'under_review', current_step = p_step_key,
      updated_at = now(), last_activity_at = now()
  WHERE id = p_application_id;
  INSERT INTO public.review_actions (application_id, step_id, step_key, admin_id, action, comment)
  VALUES (p_application_id, v_step_id, p_step_key, p_admin_id, 'request_changes', p_comment);
  INSERT INTO public.application_history (application_id, event_type, step_key, actor, details)
  VALUES (p_application_id, 'step_changes_requested', p_step_key, 'admin',
          jsonb_build_object('comment', p_comment, 'step_title', v_step_title));
  INSERT INTO public.notifications (application_id, step_key, type, title, message)
  VALUES (p_application_id, p_step_key, 'changes_requested',
          'مطلوب تعديل البيانات',
          COALESCE(p_comment, 'يرجى تصحيح البيانات في "' || v_step_title || '" وإعادة الإرسال.'));
END $$;

CREATE OR REPLACE FUNCTION public.unlock_step(
  p_application_id uuid,
  p_step_key text,
  p_admin_id uuid DEFAULT NULL,
  p_comment text DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_step_id uuid;
  v_step_title text;
BEGIN
  SELECT id, title INTO v_step_id, v_step_title
  FROM public.application_steps
  WHERE application_id = p_application_id AND step_key = p_step_key;
  IF v_step_id IS NULL THEN
    RAISE EXCEPTION 'Step not found: %', p_step_key;
  END IF;
  UPDATE public.application_steps
  SET status = 'draft', locked = false, updated_at = now()
  WHERE id = v_step_id;
  UPDATE public.applications
  SET current_step = p_step_key, updated_at = now(), last_activity_at = now()
  WHERE id = p_application_id;
  INSERT INTO public.review_actions (application_id, step_id, step_key, admin_id, action, comment)
  VALUES (p_application_id, v_step_id, p_step_key, p_admin_id, 'unlock', p_comment);
  INSERT INTO public.application_history (application_id, event_type, step_key, actor, details)
  VALUES (p_application_id, 'step_unlocked', p_step_key, 'admin',
          jsonb_build_object('comment', p_comment, 'step_title', v_step_title));
  INSERT INTO public.notifications (application_id, step_key, type, title, message)
  VALUES (p_application_id, p_step_key, 'step_unlocked',
          'تم فتح الخطوة',
          COALESCE(p_comment, 'تم فتح "' || v_step_title || '" للتعديل.'));
END $$;

-- ============================================================
-- Seed: demo applications for the dashboard
-- ============================================================
INSERT INTO public.applications (application_id, customer_id, overall_status, current_step, insurance_type, metadata, created_at, updated_at, last_activity_at)
SELECT 'APP-DEMO01', 'cust-demo01', 'under_review', 'customer_info', 'car',
       '{"vehicle":"تويوتا كامري 2021","declaredValue":75000,"offer":"التعاونية - شامل 1450 ر.س"}'::jsonb,
       now() - interval '12 min', now() - interval '3 min', now() - interval '3 min'
WHERE NOT EXISTS (SELECT 1 FROM public.applications WHERE application_id = 'APP-DEMO01');

INSERT INTO public.applications (application_id, customer_id, overall_status, current_step, insurance_type, metadata, created_at, updated_at, last_activity_at)
SELECT 'APP-DEMO02', 'cust-demo02', 'submitted', 'payment', 'car',
       '{"vehicle":"هيونداي سوناتا 2020","declaredValue":62000,"offer":"الراجحي تكافل - ضد الغير 980 ر.س"}'::jsonb,
       now() - interval '40 min', now() - interval '20 min', now() - interval '20 min'
WHERE NOT EXISTS (SELECT 1 FROM public.applications WHERE application_id = 'APP-DEMO02');

INSERT INTO public.application_steps (application_id, step_key, title, step_order, status, data, locked, submitted_at, created_at, updated_at)
SELECT a.id, 'insurance_quote', 'عرض التأمين', 1, 'approved',
       '{"vehicle":"تويوتا كامري 2021","declaredValue":75000,"offer":"التعاونية - شامل 1450 ر.س"}'::jsonb,
       true, now() - interval '11 min', now() - interval '12 min', now() - interval '10 min'
FROM public.applications a WHERE a.application_id = 'APP-DEMO01' AND NOT EXISTS (SELECT 1 FROM public.application_steps s WHERE s.application_id = a.id AND s.step_key = 'insurance_quote');

INSERT INTO public.application_steps (application_id, step_key, title, step_order, status, data, locked, submitted_at, created_at, updated_at)
SELECT a.id, 'customer_info', 'بيانات مقدم الطلب', 2, 'submitted',
       '{"nationalId":"1023456789","phone":"0551234567","fullName":"عبدالله العتيبي","city":"الرياض"}'::jsonb,
       false, now() - interval '3 min', now() - interval '10 min', now() - interval '3 min'
FROM public.applications a WHERE a.application_id = 'APP-DEMO01' AND NOT EXISTS (SELECT 1 FROM public.application_steps s WHERE s.application_id = a.id AND s.step_key = 'customer_info');

INSERT INTO public.application_steps (application_id, step_key, title, step_order, status, data, locked, created_at, updated_at)
SELECT a.id, 'phone_verification', 'تأكيد رقم الهاتف', 3, 'locked', '{}'::jsonb, true, now() - interval '10 min', now() - interval '10 min'
FROM public.applications a WHERE a.application_id = 'APP-DEMO01' AND NOT EXISTS (SELECT 1 FROM public.application_steps s WHERE s.application_id = a.id AND s.step_key = 'phone_verification');

INSERT INTO public.application_steps (application_id, step_key, title, step_order, status, data, locked, created_at, updated_at)
SELECT a.id, 'payment', 'الدفع', 4, 'locked', '{}'::jsonb, true, now() - interval '10 min', now() - interval '10 min'
FROM public.applications a WHERE a.application_id = 'APP-DEMO01' AND NOT EXISTS (SELECT 1 FROM public.application_steps s WHERE s.application_id = a.id AND s.step_key = 'payment');

INSERT INTO public.application_steps (application_id, step_key, title, step_order, status, data, locked, created_at, updated_at)
SELECT a.id, 'confirmation', 'تأكيد الطلب', 5, 'locked', '{}'::jsonb, true, now() - interval '10 min', now() - interval '10 min'
FROM public.applications a WHERE a.application_id = 'APP-DEMO01' AND NOT EXISTS (SELECT 1 FROM public.application_steps s WHERE s.application_id = a.id AND s.step_key = 'confirmation');

INSERT INTO public.notifications (application_id, step_key, type, title, message, is_read, created_at)
SELECT a.id, 'insurance_quote', 'step_approved', 'تمت الموافقة على الخطوة', 'تمت الموافقة على "عرض التأمين" بنجاح.', false, now() - interval '10 min'
FROM public.applications a WHERE a.application_id = 'APP-DEMO01' AND NOT EXISTS (SELECT 1 FROM public.notifications n WHERE n.application_id = a.id);

-- Demo02 steps: quote approved, customer_info approved, phone_verification submitted, payment draft
INSERT INTO public.application_steps (application_id, step_key, title, step_order, status, data, locked, submitted_at, created_at, updated_at)
SELECT a.id, 'insurance_quote', 'عرض التأمين', 1, 'approved',
       '{"vehicle":"هيونداي سوناتا 2020","declaredValue":62000,"offer":"الراجحي تكافل - ضد الغير 980 ر.س"}'::jsonb,
       true, now() - interval '38 min', now() - interval '40 min', now() - interval '38 min'
FROM public.applications a WHERE a.application_id = 'APP-DEMO02' AND NOT EXISTS (SELECT 1 FROM public.application_steps s WHERE s.application_id = a.id AND s.step_key = 'insurance_quote');

INSERT INTO public.application_steps (application_id, step_key, title, step_order, status, data, locked, submitted_at, created_at, updated_at)
SELECT a.id, 'customer_info', 'بيانات مقدم الطلب', 2, 'approved',
       '{"nationalId":"1078901234","phone":"0539876543","fullName":"سارة الزهراني","city":"جدة"}'::jsonb,
       true, now() - interval '36 min', now() - interval '38 min', now() - interval '35 min'
FROM public.applications a WHERE a.application_id = 'APP-DEMO02' AND NOT EXISTS (SELECT 1 FROM public.application_steps s WHERE s.application_id = a.id AND s.step_key = 'customer_info');

INSERT INTO public.application_steps (application_id, step_key, title, step_order, status, data, locked, submitted_at, created_at, updated_at)
SELECT a.id, 'phone_verification', 'تأكيد رقم الهاتف', 3, 'approved',
       '{"phone":"0539876543","otpVerified":true}'::jsonb,
       true, now() - interval '34 min', now() - interval '36 min', now() - interval '33 min'
FROM public.applications a WHERE a.application_id = 'APP-DEMO02' AND NOT EXISTS (SELECT 1 FROM public.application_steps s WHERE s.application_id = a.id AND s.step_key = 'phone_verification');

INSERT INTO public.application_steps (application_id, step_key, title, step_order, status, data, locked, created_at, updated_at)
SELECT a.id, 'payment', 'الدفع', 4, 'draft', '{}'::jsonb, false, now() - interval '33 min', now() - interval '33 min'
FROM public.applications a WHERE a.application_id = 'APP-DEMO02' AND NOT EXISTS (SELECT 1 FROM public.application_steps s WHERE s.application_id = a.id AND s.step_key = 'payment');

INSERT INTO public.application_steps (application_id, step_key, title, step_order, status, data, locked, created_at, updated_at)
SELECT a.id, 'confirmation', 'تأكيد الطلب', 5, 'locked', '{}'::jsonb, true, now() - interval '33 min', now() - interval '33 min'
FROM public.applications a WHERE a.application_id = 'APP-DEMO02' AND NOT EXISTS (SELECT 1 FROM public.application_steps s WHERE s.application_id = a.id AND s.step_key = 'confirmation');
