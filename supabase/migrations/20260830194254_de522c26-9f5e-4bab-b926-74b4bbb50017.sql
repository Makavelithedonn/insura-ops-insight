REVOKE EXECUTE ON FUNCTION public.approve_step(uuid, text, uuid, text) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.reject_step(uuid, text, uuid, text) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.request_changes_step(uuid, text, uuid, text) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.unlock_step(uuid, text, uuid, text) FROM anon, authenticated;