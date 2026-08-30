-- Remove public/anon access from legacy application tables and restrict to admins

DROP POLICY IF EXISTS "anon_insert_admin_comments" ON public.admin_comments;
DROP POLICY IF EXISTS "anon_select_admin_comments" ON public.admin_comments;
DROP POLICY IF EXISTS "anon_update_admin_comments" ON public.admin_comments;

DROP POLICY IF EXISTS "anon_insert_app_history" ON public.application_history;
DROP POLICY IF EXISTS "anon_select_app_history" ON public.application_history;

DROP POLICY IF EXISTS "anon_insert_app_steps" ON public.application_steps;
DROP POLICY IF EXISTS "anon_select_app_steps" ON public.application_steps;
DROP POLICY IF EXISTS "anon_update_app_steps" ON public.application_steps;

DROP POLICY IF EXISTS "anon_insert_applications" ON public.applications;
DROP POLICY IF EXISTS "anon_select_applications" ON public.applications;
DROP POLICY IF EXISTS "anon_update_applications" ON public.applications;

DROP POLICY IF EXISTS "anon_insert_notifications" ON public.notifications;
DROP POLICY IF EXISTS "anon_select_notifications" ON public.notifications;
DROP POLICY IF EXISTS "anon_update_notifications" ON public.notifications;

DROP POLICY IF EXISTS "anon_insert_review_actions" ON public.review_actions;
DROP POLICY IF EXISTS "anon_select_review_actions" ON public.review_actions;

DROP POLICY IF EXISTS "anon_insert_sub_versions" ON public.submission_versions;
DROP POLICY IF EXISTS "anon_select_sub_versions" ON public.submission_versions;

REVOKE ALL ON public.admin_comments FROM anon, authenticated;
REVOKE ALL ON public.application_history FROM anon, authenticated;
REVOKE ALL ON public.application_steps FROM anon, authenticated;
REVOKE ALL ON public.applications FROM anon, authenticated;
REVOKE ALL ON public.notifications FROM anon, authenticated;
REVOKE ALL ON public.review_actions FROM anon, authenticated;
REVOKE ALL ON public.submission_versions FROM anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_comments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.application_history TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.application_steps TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.applications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.review_actions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.submission_versions TO authenticated;

GRANT ALL ON public.admin_comments TO service_role;
GRANT ALL ON public.application_history TO service_role;
GRANT ALL ON public.application_steps TO service_role;
GRANT ALL ON public.applications TO service_role;
GRANT ALL ON public.notifications TO service_role;
GRANT ALL ON public.review_actions TO service_role;
GRANT ALL ON public.submission_versions TO service_role;

CREATE POLICY "admins manage admin_comments" ON public.admin_comments
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins manage application_history" ON public.application_history
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins manage application_steps" ON public.application_steps
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins manage applications" ON public.applications
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins manage notifications" ON public.notifications
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins manage review_actions" ON public.review_actions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins manage submission_versions" ON public.submission_versions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));