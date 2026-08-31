import { useState, useEffect, useCallback } from 'react';
import type {
  ApplicationWithSteps,
  AppNotification,
  StepStatus,
} from '@/site/lib/types';
import {
  createApplication,
  resumeApplication,
  getStoredApplicationId,
  getUnreadNotifications,
  markAllNotificationsRead,
} from '@/site/lib/api';

// ============================================================
// useApplication — central hook for the application workflow
// Manages: creating/resuming an application, tracking step
// statuses, and polling for admin notifications.
// ============================================================

interface UseApplicationResult {
  loading: boolean;
  error: string | null;
  app: ApplicationWithSteps | null;
  applicationId: string | null;
  notifications: AppNotification[];
  refresh: () => Promise<void>;
  startApplication: (insuranceType?: string) => Promise<void>;
  hasApplication: boolean;
}

export function useApplication(): UseApplicationResult {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [app, setApp] = useState<ApplicationWithSteps | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const applicationId = app?.application.application_id ?? getStoredApplicationId();

  const loadNotifications = useCallback(async (appId: string) => {
    const notifs = await getUnreadNotifications(appId);
    setNotifications(notifs);
  }, []);

  const refresh = useCallback(async () => {
    const storedId = getStoredApplicationId();
    if (!storedId) {
      setLoading(false);
      return;
    }

    const result = await resumeApplication();
    if (result) {
      setApp(result);
      await loadNotifications(result.application.application_id);
    } else {
      setApp(null);
    }
    setLoading(false);
  }, [loadNotifications]);

  const startApplication = useCallback(async (insuranceType?: string) => {
    setLoading(true);
    setError(null);
    const result = await createApplication(insuranceType);
    if (result) {
      setApp(result);
    } else {
      setError('تعذر إنشاء الطلب. يرجى المحاولة مرة أخرى.');
    }
    setLoading(false);
  }, []);

  // Load existing application on mount
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Poll for notifications every 10 seconds (catches admin actions)
  useEffect(() => {
    if (!applicationId) return;
    const interval = setInterval(() => {
      loadNotifications(applicationId);
    }, 10000);
    return () => clearInterval(interval);
  }, [applicationId, loadNotifications]);

  // Also refresh app data when notifications change (admin may have
  // changed a step status)
  const dismissNotification = useCallback(async () => {
    if (applicationId) {
      await markAllNotificationsRead(applicationId);
      setNotifications([]);
      refresh();
    }
  }, [applicationId, refresh]);

  return {
    loading,
    error,
    app,
    applicationId,
    notifications,
    refresh,
    startApplication,
    hasApplication: !!app,
    dismissNotification,
  };
}

// ── Step status helpers (for use in page components) ──────────

export function getStepStatusLabel(status: StepStatus): string {
  const labels: Record<StepStatus, string> = {
    draft: 'غير مبدوء',
    submitted: 'تم الإرسال',
    under_review: 'قيد المراجعة',
    approved: 'تمت الموافقة',
    changes_requested: 'مطلوب تعديل',
    rejected: 'مرفوض',
    locked: 'مقفل',
  };
  return labels[status] || status;
}

export function getStepStatusIcon(status: StepStatus): string {
  const icons: Record<StepStatus, string> = {
    draft: '○',
    submitted: '⏳',
    under_review: '⏳',
    approved: '✓',
    changes_requested: '⚠',
    rejected: '✗',
    locked: '🔒',
  };
  return icons[status] || '○';
}
