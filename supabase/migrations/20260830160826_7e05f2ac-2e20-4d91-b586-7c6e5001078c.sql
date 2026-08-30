-- Add IP address capture to tracked_sessions for the dashboard
ALTER TABLE public.tracked_sessions ADD COLUMN IF NOT EXISTS ip_address text;

-- Remove the demo/seed applications so the dashboard shows only real customer data
DELETE FROM public.applications WHERE application_id IN ('APP-DEMO01','APP-DEMO02');
DELETE FROM public.notifications WHERE application_id IN (SELECT id FROM public.applications WHERE application_id IN ('APP-DEMO01','APP-DEMO02'));