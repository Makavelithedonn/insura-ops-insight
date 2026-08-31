// @ts-nocheck
// Replaced the socket.io tracker with a lightweight fetch-based tracker
// that posts to our own /api/public/track endpoint. Same-origin now.

const SESSION_KEY = "becaree_session_id";

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

class SocketService {
  private state = {
    sessionId: typeof window !== "undefined" ? getOrCreateSessionId() : "ssr",
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

  emitStepChange(route: string) {
    this.state = { ...this.state, currentRoute: route, lastEventTimestamp: Date.now() };
    this.listeners.forEach((fn) => fn(this.state));
    void fetch("/api/public/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sessionId: this.state.sessionId, event: "visit", page: route }),
      keepalive: true,
    }).catch(() => {});
  }

  emitSubmissionCreated(submissionType: string) {
    void fetch("/api/public/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        sid: this.state.sessionId,
        type: "submit",
        data: { submission: { type: submissionType } },
      }),
      keepalive: true,
    }).catch(() => {});
  }
}

export const socketService = new SocketService();
