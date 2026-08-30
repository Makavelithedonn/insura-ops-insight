-- Admin review functions must only be callable by the service role (admin backend),
-- never by anon/authenticated. Revoke default EXECUTE and grant only to service_role.
REVOKE EXECUTE ON FUNCTION public.approve_step(uuid, text, uuid, text) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.reject_step(uuid, text, uuid, text) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.request_changes_step(uuid, text, uuid, text) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.unlock_step(uuid, text, uuid, text) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.approve_step(uuid, text, uuid, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.reject_step(uuid, text, uuid, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.request_changes_step(uuid, text, uuid, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.unlock_step(uuid, text, uuid, text) TO service_role;