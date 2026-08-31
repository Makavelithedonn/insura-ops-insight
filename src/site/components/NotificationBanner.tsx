import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Bell, X, AlertCircle, CheckCircle, MessageSquare } from 'lucide-react';
import type { AppNotification } from '@/site/lib/types';
import {
  getStoredApplicationId,
  getUnreadNotifications,
  markAllNotificationsRead,
} from '@/site/lib/api';

// ============================================================
// NotificationBanner — shows admin actions to the customer.
// Polls for unread notifications and displays them as a
// dismissible banner at the top of the page.
// ============================================================

export function NotificationBanner() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [dismissed, setDismissed] = useState(false);

  const loadNotifications = useCallback(async () => {
    const appId = getStoredApplicationId();
    if (!appId) return;
    const notifs = await getUnreadNotifications(appId);
    setNotifications(notifs);
  }, []);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 8000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  const handleDismiss = async () => {
    const appId = getStoredApplicationId();
    if (appId) {
      await markAllNotificationsRead(appId);
    }
    setDismissed(true);
    setNotifications([]);
  };

  if (dismissed || notifications.length === 0) return null;

  const notif = notifications[0];
  const isError =
    notif.type === 'step_rejected' || notif.type === 'changes_requested';

  return (
    <div className="fixed inset-x-0 top-0 z-50 animate-slide-down">
      <div
        className={`mx-auto mt-2 max-w-2xl rounded-2xl p-4 shadow-lg ring-1 ${
          isError
            ? 'bg-warning-50 ring-warning-200'
            : 'bg-success-50 ring-success-200'
        }`}
      >
        <div className="flex items-start gap-3">
          {isError ? (
            <AlertCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-warning-600" />
          ) : (
            <CheckCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-success-600" />
          )}
          <div className="flex-1">
            <p className="font-bold text-dark-900">{notif.title}</p>
            <p className="mt-1 text-sm text-dark-700">{notif.message}</p>
            {notifications.length > 1 && (
              <p className="mt-1 text-xs text-dark-500">
                + {notifications.length - 1} إشعارات أخرى
              </p>
            )}
            <Link
              to="/application-status"
              className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700"
            >
              <MessageSquare className="h-4 w-4" />
              عرض حالة الطلب
            </Link>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 rounded-lg p-1 text-dark-400 hover:bg-dark-100 hover:text-dark-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Compact bell icon with badge — for header/nav usage
export function NotificationBell() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const appId = getStoredApplicationId();
    if (!appId) return;

    const check = async () => {
      const notifs = await getUnreadNotifications(appId);
      setCount(notifs.length);
    };
    check();
    const interval = setInterval(check, 8000);
    return () => clearInterval(interval);
  }, []);

  if (count === 0) return null;

  return (
    <Link
      to="/application-status"
      className="relative inline-flex items-center gap-1 rounded-xl bg-warning-50 px-3 py-1.5 text-sm font-semibold text-warning-700 ring-1 ring-warning-200 transition-all hover:bg-warning-100"
    >
      <Bell className="h-4 w-4" />
      <span>{count}</span>
    </Link>
  );
}
