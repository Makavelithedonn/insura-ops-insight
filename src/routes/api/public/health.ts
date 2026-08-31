import { createFileRoute } from "@tanstack/react-router";
import { makeServiceClient, verifyAdmin } from "@/lib/admin-api.server";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, authorization",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

export const Route = createFileRoute("/api/public/health")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),

      // Read-side health: counts + most recent event. Admin only.
      GET: async ({ request }) => {
        if (!(await verifyAdmin(request))) {
          return new Response("Unauthorized", { status: 401, headers: cors });
        }
        const supabase = makeServiceClient();
        const started = Date.now();

        const since24h = new Date(Date.now() - 24 * 60 * 60_000).toISOString();
        const [total, last24h, latest, awaiting, blocked] = await Promise.all([
          supabase.from("tracked_sessions").select("*", { count: "exact", head: true }),
          supabase
            .from("tracked_sessions")
            .select("*", { count: "exact", head: true })
            .gte("updated_at", since24h),
          supabase
            .from("tracked_sessions")
            .select("session_id,current_page,state,updated_at,created_at")
            .order("updated_at", { ascending: false })
            .limit(1)
            .maybeSingle(),
          supabase
            .from("tracked_sessions")
            .select("*", { count: "exact", head: true })
            .eq("awaiting_approval", true),
          supabase
            .from("tracked_sessions")
            .select("*", { count: "exact", head: true })
            .eq("state", "blocked"),
        ]);

        const firstError =
          total.error ?? last24h.error ?? latest.error ?? awaiting.error ?? blocked.error;
        if (firstError) return json({ ok: false, error: firstError.message }, 500);

        return json({
          ok: true,
          serverTime: new Date().toISOString(),
          readLatencyMs: Date.now() - started,
          counts: {
            total: total.count ?? 0,
            last24h: last24h.count ?? 0,
            awaitingApproval: awaiting.count ?? 0,
            blocked: blocked.count ?? 0,
          },
          lastEvent: latest.data ?? null,
        });
      },

      // Write-side health: insert a probe row, read it back, delete it.
      // Proves the track/gate write path works end to end. Admin only.
      POST: async ({ request }) => {
        if (!(await verifyAdmin(request))) {
          return new Response("Unauthorized", { status: 401, headers: cors });
        }
        const supabase = makeServiceClient();
        const sid = `healthcheck-${Date.now().toString(36)}`;
        const started = Date.now();

        const { error: writeError } = await supabase.from("tracked_sessions").upsert(
          {
            session_id: sid,
            state: "live",
            current_page: "quote_landing",
            submission: {},
          },
          { onConflict: "session_id" },
        );
        if (writeError) return json({ ok: false, stage: "write", error: writeError.message }, 500);
        const writeLatencyMs = Date.now() - started;

        const { data: readBack, error: readError } = await supabase
          .from("tracked_sessions")
          .select("session_id")
          .eq("session_id", sid)
          .maybeSingle();

        await supabase.from("tracked_sessions").delete().eq("session_id", sid);

        if (readError || !readBack) {
          return json(
            { ok: false, stage: "readback", error: readError?.message ?? "row not found" },
            500,
          );
        }
        return json({ ok: true, writeLatencyMs });
      },
    },
  },
});
