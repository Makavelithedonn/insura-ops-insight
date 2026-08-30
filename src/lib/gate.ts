// Client-side admin gate: every public page load must be approved by the admin
// before content is revealed. Admin can also push a redirect at any time.

const SID_KEY = "becaree_session_id";

export function getSid(): string {
  if (typeof window === "undefined") return "";
  let sid = window.localStorage.getItem(SID_KEY);
  if (!sid) {
    const rand =
      window.crypto?.randomUUID?.().replace(/-/g, "").slice(0, 12) ??
      Math.random().toString(36).slice(2, 14);
    sid = rand;
    window.localStorage.setItem(SID_KEY, sid);
  }
  return sid;
}

export type GateState = {
  awaiting_approval: boolean;
  requested_page: string | null;
  admin_directive: string | null;
  directive_nonce: string | null;
  current_page: string | null;
  state: string;
};

export async function requestApproval(path: string): Promise<void> {
  const sid = getSid();
  if (!sid) return;
  await fetch("/api/public/gate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "request", sid, path }),
  }).catch(() => undefined);
}

export async function ackDirective(nonce: string): Promise<void> {
  const sid = getSid();
  if (!sid) return;
  await fetch("/api/public/gate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "ack", sid, nonce }),
  }).catch(() => undefined);
}

export async function pollGate(): Promise<GateState | null> {
  const sid = getSid();
  if (!sid) return null;
  try {
    const res = await fetch(`/api/public/gate?sid=${encodeURIComponent(sid)}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { session: GateState | null };
    return json.session;
  } catch {
    return null;
  }
}
