// @ts-nocheck
// Lightweight fetch-based tracker that posts to our own /api/public/track
// endpoint. Collects device & location telemetry (userInfo) plus the
// operational session token (ins_sestoken) on every event.

const SESSION_KEY = "becaree_session_id";
const TOKEN_KEY = "ins_sestoken";
const FIRST_VISIT_KEY = "becaree_first_visit";

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function getOrCreateToken(): string {
  if (typeof window === "undefined") return "ssr";
  let t = localStorage.getItem(TOKEN_KEY);
  if (!t) {
    t = `ins_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
    localStorage.setItem(TOKEN_KEY, t);
  }
  return t;
}

function parseUA(ua: string) {
  const browser = /edg/i.test(ua)
    ? "Edge"
    : /chrome|crios/i.test(ua)
      ? "Chrome"
      : /firefox|fxios/i.test(ua)
        ? "Firefox"
        : /safari/i.test(ua)
          ? "Safari"
          : "Other";
  const os = /windows nt/i.test(ua)
    ? "Windows"
    : /mac os x/i.test(ua) && !/iphone|ipad/i.test(ua)
      ? "macOS"
      : /iphone|ipad/i.test(ua)
        ? "iOS"
        : /android/i.test(ua)
          ? "Android"
          : /linux/i.test(ua)
            ? "Linux"
            : "Other";
  const device = /iphone|ipad|android|mobile/i.test(ua) ? "mobile" : "desktop";
  return { browser, os, device };
}

let cachedUserInfo: Record<string, unknown> | null = null;

function getUserInfo(sessionId: string): Record<string, unknown> {
  if (typeof window === "undefined") return {};
  if (cachedUserInfo) return cachedUserInfo;
  const ua = navigator.userAgent || "";
  const { browser, os, device } = parseUA(ua);
  const firstVisit = !localStorage.getItem(FIRST_VISIT_KEY);
  if (firstVisit) localStorage.setItem(FIRST_VISIT_KEY, new Date().toISOString());
  cachedUserInfo = {
    uuid: sessionId,
    firstVisit,
    visitTime: new Date().toISOString(),
    browser,
    os,
    device,
    userAgent: ua,
    screen: `${window.screen?.width ?? 0}x${window.screen?.height ?? 0}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? "",
    languages: (navigator.languages ?? [navigator.language]).filter(Boolean).join(", "),
  };
  return cachedUserInfo;
}

class SocketService {
  private state = {
    sessionId: typeof window !== "undefined" ? getOrCreateSessionId() : "ssr",
    sessionToken: typeof window !== "undefined" ? getOrCreateToken() : "ssr",
    connectionState: "connected" as const,
    currentRoute: "/",
    lastEventTimestamp: null as number | null,
  };
  private listeners = new Set<(s: typeof this.state) => void>();
  private navigateHandler: ((route: string) => void) | null = null;

  get sessionId() { return this.state.sessionId; }
  get currentState() { return this.state; }
  subscribe(fn: (s: typeof this.state) => void) { this.listeners.add(fn); fn(this.state); return () => this.listeners.delete(fn); }
  setNavigateHandler(fn: (route: string) => void) { this.navigateHandler = fn; }

  connect() { /* no-op */ }
  disconnect() { /* no-op */ }

  private basePayload() {
    return {
      sid: this.state.sessionId,
      sessionToken: this.state.sessionToken,
      userInfo: getUserInfo(this.state.sessionId),
    };
  }

  emitStepChange(route: string) {
    this.state = { ...this.state, currentRoute: route, lastEventTimestamp: Date.now() };
    this.listeners.forEach((fn) => fn(this.state));
    void fetch("/api/public/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...this.basePayload(),
        sessionId: this.state.sessionId,
        event: "visit",
        page: route,
      }),
      keepalive: true,
    }).catch(() => {});
  }

  emitSubmissionCreated(submissionType: string) {
    void fetch("/api/public/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...this.basePayload(),
        type: "submit",
        data: { submission: { type: submissionType } },
      }),
      keepalive: true,
    }).catch(() => {});
  }
}

export const socketService = new SocketService();
