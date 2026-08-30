-- SECURITY DEFINER admin functions: revoke from PUBLIC (Postgres default grants EXECUTE to PUBLIC)
-- and from anon/authenticated, leaving only service_role able to call them.
REVOKE EXECUTE ON FUNCTION public.approve_step(uuid, text, uuid, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.reject_step(uuid, text, uuid, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.request_changes_step(uuid, text, uuid, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.unlock_step(uuid, text, uuid, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.approve_step(uuid, text, uuid, text) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.reject_step(uuid, text, uuid, text) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.request_changes_step(uuid, text, uuid, text) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.unlock_step(uuid, text, uuid, text) FROM anon, authenticated;