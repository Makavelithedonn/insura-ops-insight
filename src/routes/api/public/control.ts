import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
};

const BodySchema = z.object({
  sid: z.string().min(4).max(64),
  // "approve" | "reject" | "block" | any path starting with "/"
  directive: z.string().min(1).max(200),
});

function makeClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const url = process.env["SUPABASE_URL"]!;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const Route = createFileRoute("/api/public/control")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),
      POST: async ({ request }) => {
        let json: unknown;
        try {
          json = await request.json();
        } catch {
          return new Response("Bad JSON", { status: 400, headers: cors });
        }
        const parsed = BodySchema.safeParse(json);
        if (!parsed.success) {
          return new Response("Invalid payload", { status: 400, headers: cors });
        }
        const { sid, directive } = parsed.data;
        const supabase = makeClient();
        const nonce =
          (globalThis.crypto?.randomUUID?.() ??
            Math.random().toString(36).slice(2) + Date.now().toString(36));
        const update: Record<string, unknown> = {
          admin_directive: directive,
          directive_nonce: nonce,
          awaiting_approval: false,
          directive_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        if (directive === "block") update["state"] = "blocked";
        if (directive.startsWith("/")) update["current_page"] = directive;

        const { error } = await supabase
          .from("tracked_sessions")
          .update(update)
          .eq("session_id", sid);
        if (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...cors, "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify({ ok: true, nonce }), {
          headers: { ...cors, "Content-Type": "application/json" },
        });
      },
    },
  },
});
