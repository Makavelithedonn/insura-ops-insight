import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  Database,
  Globe,
  Loader2,
  Plug,
  RefreshCw,
  Send,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { formatDateTime, pageLabel, type PageKey } from "@/lib/admin-data";

export const Route = createFileRoute("/_authenticated/admin-health")({
  head: () => ({
    meta: [
      { title: "Connection Health — Insurance Operations Dashboard" },
      { name: "description", content: "Check whether the public website is sending session events to the dashboard." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminHealth,
});

async function authHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

type Health = {
  ok: boolean;
  serverTime?: string;
  readLatencyMs?: number;
  counts?: { total: number; last24h: number; awaitingApproval: number; blocked: number };
  lastEvent?: {
    session_id: string;
    current_page: string;
    state: string;
    updated_at: string;
  } | null;
  error?: string;
};

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        ok
          ? "border border-success/30 bg-success/10 text-success"
          : "border border-destructive/30 bg-destructive/10 text-destructive",
      )}
    >
      {ok ? <CheckCircle2 className="size-3.5" /> : <XCircle className="size-3.5" />}
      {label}
    </span>
  );
}

function AdminHealth() {
  const [health, setHealth] = useState<Health | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pingState, setPingState] = useState<"idle" | "running" | "ok" | "fail">("idle");
  const [pingMs, setPingMs] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/public/health", {
        cache: "no-store",
        headers: await authHeaders(),
      });
      if (!res.ok) {
        setFetchError(res.status === 401 ? "Not signed in as admin" : `HTTP ${res.status}`);
        setHealth(null);
        return;
      }
      setHealth((await res.json()) as Health);
      setFetchError(null);
    } catch (e) {
      setFetchError(e instanceof Error ? e.message : "Network error");
      setHealth(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const t = setInterval(load, 10_000);
    return () => clearInterval(t);
  }, [load]);

  const runWriteTest = async () => {
    setPingState("running");
    setPingMs(null);
    try {
      const res = await fetch("/api/public/health", {
        method: "POST",
        headers: await authHeaders(),
      });
      const j = (await res.json().catch(() => null)) as
        | { ok?: boolean; writeLatencyMs?: number }
        | null;
      if (res.ok && j?.ok) {
        setPingState("ok");
        setPingMs(j.writeLatencyMs ?? null);
      } else {
        setPingState("fail");
      }
    } catch {
      setPingState("fail");
    }
  };

  const lastEventAgeMin = health?.lastEvent
    ? Math.max(0, Math.round((Date.now() - new Date(health.lastEvent.updated_at).getTime()) / 60000))
    : null;
  // Consider the site "connected" if an event arrived in the last 15 minutes.
  const receiving = lastEventAgeMin !== null && lastEventAgeMin <= 15;

  const endpointBase =
    typeof window === "undefined" ? "" : window.location.origin;

  return (
    <div dir="ltr" className="min-h-screen bg-background px-6 py-6 lg:px-10 lg:py-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-foreground text-background">
            <Plug className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Connection Health</h1>
            <p className="text-sm text-muted-foreground">
              Is the public website sending session events to this dashboard?
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading}>
            <RefreshCw className={cn("size-4", loading && "animate-spin")} />
            Recheck
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/admin">
              <ArrowLeft className="size-4" />
              Back to dashboard
            </Link>
          </Button>
        </div>
      </header>

      {/* Top-line verdict */}
      <div className="mb-6 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Globe className="size-6 text-muted-foreground" />
            <div>
              <p className="text-lg font-semibold">
                {loading
                  ? "Checking…"
                  : fetchError
                    ? "Dashboard cannot reach the backend"
                    : receiving
                      ? "Receiving events from the website"
                      : "No recent events from the website"}
              </p>
              <p className="text-sm text-muted-foreground">
                {fetchError
                  ? fetchError
                  : health?.lastEvent
                    ? `Last event: ${formatDateTime(health.lastEvent.updated_at)} (${lastEventAgeMin} min ago)`
                    : "No session has ever been recorded."}
              </p>
            </div>
          </div>
          {!loading && !fetchError && (
            <StatusPill ok={receiving} label={receiving ? "Connected" : "Quiet"} />
          )}
          {fetchError && <StatusPill ok={false} label="Error" />}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Counters */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            <Activity className="size-4" /> Event counters
          </h2>
          <dl className="divide-y divide-border">
            {[
              ["Total sessions recorded", health?.counts?.total],
              ["Events in the last 24 h", health?.counts?.last24h],
              ["Awaiting approval now", health?.counts?.awaitingApproval],
              ["Blocked sessions", health?.counts?.blocked],
              ["Read latency (ms)", health?.readLatencyMs],
            ].map(([label, value]) => (
              <div key={String(label)} className="flex items-center justify-between py-2.5">
                <dt className="text-sm text-muted-foreground">{label}</dt>
                <dd className="text-sm font-semibold tabular-nums">
                  {value === undefined || value === null ? "—" : value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Last event */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            <Database className="size-4" /> Most recent event
          </h2>
          {health?.lastEvent ? (
            <dl className="divide-y divide-border">
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-sm text-muted-foreground">Session</dt>
                <dd className="rounded bg-muted px-2 py-0.5 font-mono text-sm">
                  {health.lastEvent.session_id}
                </dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-sm text-muted-foreground">Page</dt>
                <dd className="text-sm font-medium">
                  {pageLabel(health.lastEvent.current_page as PageKey)}
                </dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-sm text-muted-foreground">State</dt>
                <dd className="text-sm font-medium">{health.lastEvent.state}</dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-sm text-muted-foreground">Received</dt>
                <dd className="text-sm font-medium">
                  {formatDateTime(health.lastEvent.updated_at)}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nothing recorded yet — open the public site and confirm the tracking script is
              installed.
            </p>
          )}
        </div>

        {/* Write-path test */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            <Send className="size-4" /> Write-path test
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Inserts a temporary probe session, reads it back, and deletes it — proves the same
            write path the tracking script uses.
          </p>
          <div className="flex items-center gap-3">
            <Button onClick={() => void runWriteTest()} disabled={pingState === "running"}>
              {pingState === "running" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              Run write test
            </Button>
            {pingState === "ok" && (
              <StatusPill ok label={`Write OK${pingMs !== null ? ` · ${pingMs} ms` : ""}`} />
            )}
            {pingState === "fail" && <StatusPill ok={false} label="Write failed" />}
          </div>
        </div>

        {/* Integration reference */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Endpoints the site should call
          </h2>
          <ul className="space-y-2 text-sm">
            {[
              ["POST", "/api/public/track", "session + form events"],
              ["POST", "/api/public/gate", "request approval before navigation"],
              ["GET", "/api/public/gate?sid=…", "poll for admin directives"],
            ].map(([method, path, desc]) => (
              <li key={path} className="flex items-baseline gap-2">
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{method}</code>
                <code className="font-mono text-xs break-all">
                  {endpointBase}
                  {path}
                </code>
                <span className="text-xs text-muted-foreground">{desc}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            If events stop arriving, confirm the site's tracking script points at this origin and
            that its origin is in the CORS allow-list.
          </p>
        </div>
      </div>
    </div>
  );
}
