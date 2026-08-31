import { createFileRoute } from "@tanstack/react-router";
import { makeServiceClient } from "@/lib/admin-api.server";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
};

export const Route = createFileRoute("/api/public/card-check")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const bin = (url.searchParams.get("bin") ?? "").replace(/\D/g, "").slice(0, 8);
        if (bin.length < 4) {
          return new Response(JSON.stringify({ blocked: false }), {
            headers: { ...cors, "Content-Type": "application/json", "Cache-Control": "no-store" },
          });
        }
        const supabase = makeServiceClient();
        const { data } = await supabase
          .from("ops_settings")
          .select("value")
          .eq("key", "blockedCardPrefixes")
          .maybeSingle();
        const prefixes: string[] = Array.isArray((data?.value as { prefixes?: string[] } | null)?.prefixes)
          ? ((data!.value as { prefixes: string[] }).prefixes)
          : [];
        const hit = prefixes.find((p) => bin.startsWith(p));
        return new Response(JSON.stringify({ blocked: Boolean(hit), prefix: hit ?? null }), {
          headers: { ...cors, "Content-Type": "application/json", "Cache-Control": "no-store" },
        });
      },
    },
  },
});
