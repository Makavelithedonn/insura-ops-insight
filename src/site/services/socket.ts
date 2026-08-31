// @ts-nocheck
import { io, Socket } from 'socket.io-client';

/*
 * Centralized Socket.IO Service
 * Manages real-time connection lifecycle, session tracking, and event relay.
 * Does NOT touch any existing UI, auth, or REST logic.
 */

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL as string | undefined;

const SESSION_KEY = 'becaree_session_id';

function getOrCreateSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function getDeviceMetadata() {
  const ua = navigator.userAgent;
  let browser = 'Unknown';
  let os = 'Unknown';
  let device = 'Desktop';

  if (/Edg\//.test(ua)) browser = 'Edge';
  else if (/Chrome\//.test(ua)) browser = 'Chrome';
  else if (/Firefox\//.test(ua)) browser = 'Firefox';
  else if (/Safari\//.test(ua)) browser = 'Safari';

  if (/Windows/.test(ua)) os = 'Windows';
  else if (/Mac OS/.test(ua)) os = 'macOS';
  else if (/Android/.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iPod/.test(ua)) os = 'iOS';
  else if (/Linux/.test(ua)) os = 'Linux';

  if (/Mobi|Android|iPhone/.test(ua)) device = 'Mobile';
  else if (/iPad|Tablet/.test(ua)) device = 'Tablet';

  return { browser, os, device, userAgent: ua };
}

type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error';

interface SocketState {
  sessionId: string;
  connectionState: ConnectionState;
  currentRoute: string;
  lastEventTimestamp: number | null;
}

class SocketService {
  private socket: Socket | null = null;
  private state: SocketState = {
    sessionId: getOrCreateSessionId(),
    connectionState: 'disconnected',
    currentRoute: '/',
    lastEventTimestamp: null,
  };
  private listeners = new Set<(s: SocketState) => void>();
  private navigateHandler: ((route: string) => void) | null = null;

  get sessionId() {
    return this.state.sessionId;
  }

  get currentState() {
    return this.state;
  }

  /** Subscribe to state changes. Returns unsubscribe fn. */
  subscribe(fn: (s: SocketState) => void): () => void {
    this.listeners.add(fn);
    fn(this.state);
    return () => this.listeners.delete(fn);
  }

  /** Register a handler for admin-issued navigation commands. */
  setNavigateHandler(fn: (route: string) => void) {
    this.navigateHandler = fn;
  }

  private setState(patch: Partial<SocketState>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((fn) => fn(this.state));
  }

  private emitState() {
    this.listeners.forEach((fn) => fn(this.state));
  }

  /** Connect to the Socket.IO server. No-op if already connected or URL missing. */
  connect() {
    if (!SOCKET_URL) {
      console.warn('[socket] VITE_SOCKET_URL not set — real-time tracking disabled');
      return;
    }
    if (this.socket?.connected) return;

    this.setState({ connectionState: 'connecting' });
    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    this.socket.on('connect', () => {
      this.setState({ connectionState: 'connected' });
      this.socket?.emit('session:join', {
        sessionId: this.state.sessionId,
        ...getDeviceMetadata(),
      });
    });

    this.socket.on('disconnect', () => {
      this.setState({ connectionState: 'disconnected' });
    });

    this.socket.io.on('reconnect_attempt', () => {
      this.setState({ connectionState: 'reconnecting' });
    });

    this.socket.io.on('reconnect', () => {
      this.setState({ connectionState: 'connected' });
    });

    this.socket.on('connect_error', () => {
      this.setState({ connectionState: 'error' });
    });

    // Receive admin navigation commands
    this.socket.on('admin:navigate', (payload: { route?: string }) => {
      if (payload?.route && this.navigateHandler) {
        this.navigateHandler(payload.route);
      }
    });
  }

  /** Emit a step/route change event. Called by the tracking hook. */
  emitStepChange(route: string) {
    if (!this.socket?.connected) return;
    const timestamp = Date.now();
    this.setState({ currentRoute: route, lastEventTimestamp: timestamp });
    this.socket.emit('session:step_changed', {
      sessionId: this.state.sessionId,
      currentStep: route,
      timestamp,
    });
  }

  /** Emit a submission-created metadata event. Metadata only — no sensitive data. */
  emitSubmissionCreated(submissionType: string) {
    if (!this.socket?.connected) return;
    const timestamp = Date.now();
    this.setState({ lastEventTimestamp: timestamp });
    this.socket.emit('submission:created', {
      sessionId: this.state.sessionId,
      submissionType,
      timestamp,
      status: 'pending',
    });
  }

  /** Gracefully disconnect. */
  disconnect() {
    if (this.socket) {
      this.socket.emit('session:leave', { sessionId: this.state.sessionId });
      this.socket.disconnect();
      this.socket = null;
      this.setState({ connectionState: 'disconnected' });
    }
  }
}

export const socketService = new SocketService();
