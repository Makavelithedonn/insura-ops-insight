import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle, Clock, AlertCircle, Lock, CircleDot,
  ArrowLeft, FileText, MessageSquare, History,
  RefreshCw, Loader2, XCircle,
} from 'lucide-react';
import type {
  ApplicationWithSteps,
  ApplicationHistoryEvent,
  ReviewAction,
  AppNotification,
  StepStatus,
} from '@/lib/types';
import {
  getStoredApplicationId,
  resumeApplication,
  getApplicationHistory,
  getReviewActions,
  getUnreadNotifications,
  markAllNotificationsRead,
} from '@/lib/api';
import { APPLICATION_STEPS } from '@/data/steps';

// ============================================================
// Application Status Page
// Customer-facing view showing the status of each step,
// admin comments, review decisions, and full history.
// ============================================================

function StatusIcon({ status }: { status: StepStatus }) {
  switch (status) {
    case 'approved':
      return <CheckCircle className="h-6 w-6 text-success-600" />;
    case 'submitted':
    case 'under_review':
      return <Clock className="h-6 w-6 text-primary-600" />;
    case 'changes_requested':
      return <AlertCircle className="h-6 w-6 text-warning-600" />;
    case 'rejected':
      return <XCircle className="h-6 w-6 text-error-600" />;
    case 'locked':
      return <Lock className="h-6 w-6 text-dark-300" />;
    default:
      return <CircleDot className="h-6 w-6 text-dark-300" />;
  }
}

function statusLabel(status: StepStatus): string {
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

function statusColor(status: StepStatus): string {
  switch (status) {
    case 'approved': return 'text-success-700 bg-success-50';
    case 'submitted':
    case 'under_review': return 'text-primary-700 bg-primary-50';
    case 'changes_requested': return 'text-warning-700 bg-warning-50';
    case 'rejected': return 'text-error-700 bg-error-50';
    case 'locked': return 'text-dark-400 bg-dark-50';
    default: return 'text-dark-500 bg-dark-50';
  }
}

export default function ApplicationStatus() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [app, setApp] = useState<ApplicationWithSteps | null>(null);
  const [history, setHistory] = useState<ApplicationHistoryEvent[]>([]);
  const [reviewActions, setReviewActions] = useState<ReviewAction[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeTab, setActiveTab] = useState<'steps' | 'history' | 'messages'>('steps');

  const load = useCallback(async () => {
    setLoading(true);
    const storedId = getStoredApplicationId();
    if (!storedId) {
      setLoading(false);
      return;
    }

    const appData = await resumeApplication();
    if (!appData) {
      setLoading(false);
      return;
    }
    setApp(appData);

    const [hist, reviews, notifs] = await Promise.all([
      getApplicationHistory(storedId),
      getReviewActions(storedId),
      getUnreadNotifications(storedId),
    ]);
    setHistory(hist);
    setReviewActions(reviews);
    setNotifications(notifs);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDismissNotifications = async () => {
    const storedId = getStoredApplicationId();
    if (storedId) {
      await markAllNotificationsRead(storedId);
      setNotifications([]);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-16 md:pt-20">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary-600" />
          <p className="mt-4 text-dark-500">جاري تحميل حالة الطلب...</p>
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-16 md:pt-20">
        <div className="container-x">
          <div className="mx-auto max-w-md rounded-3xl bg-white p-8 text-center shadow-xl ring-1 ring-dark-200/60">
            <FileText className="mx-auto h-16 w-16 text-dark-300" />
            <h1 className="mt-4 text-2xl font-bold text-dark-900">لا يوجد طلب نشط</h1>
            <p className="mt-2 text-sm text-dark-500">
              لم يتم العثور على طلب نشط. يمكنك بدء طلب جديد من خلال اختيار نوع التأمين.
            </p>
            <Link to="/" className="btn-primary mt-6 w-full">
              العودة للرئيسية
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { application, steps } = app;
  const completedSteps = steps.filter((s) => s.status === 'approved').length;
  const totalSteps = steps.length;
  const progressPercent = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-16 md:pt-20 py-12">
      <div className="container-x">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="animate-scale-in rounded-3xl bg-white p-6 shadow-xl ring-1 ring-dark-200/60 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-dark-900">حالة الطلب</h1>
                <p className="mt-1 text-sm text-dark-500">
                  رقم الطلب: <span className="font-bold text-primary-600" dir="ltr">{application.application_id}</span>
                </p>
              </div>
              <button
                onClick={load}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-dark-50 px-4 py-2 text-sm font-semibold text-dark-700 transition-all hover:bg-dark-100"
              >
                <RefreshCw className="h-4 w-4" />
                تحديث
              </button>
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-dark-500">
                <span>التقدم</span>
                <span className="font-bold text-primary-600">{progressPercent}%</span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-dark-100">
                <div
                  className="h-full rounded-full bg-gradient-to-l from-primary-500 to-primary-700 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-dark-400">
                {completedSteps} من {totalSteps} خطوات مكتملة
              </p>
            </div>

            {/* Notifications */}
            {notifications.length > 0 && (
              <div className="mt-6 space-y-2">
                {notifications.map((notif) => {
                  const isError = notif.type === 'step_rejected' || notif.type === 'changes_requested';
                  return (
                    <div
                      key={notif.id}
                      className={`flex items-start gap-3 rounded-xl p-4 ${
                        isError ? 'bg-warning-50 ring-1 ring-warning-200' : 'bg-success-50 ring-1 ring-success-200'
                      }`}
                    >
                      {isError ? (
                        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-warning-600" />
                      ) : (
                        <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-success-600" />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-dark-900">{notif.title}</p>
                        <p className="mt-1 text-sm text-dark-700">{notif.message}</p>
                      </div>
                    </div>
                  );
                })}
                <button
                  onClick={handleDismissNotifications}
                  className="text-xs font-medium text-dark-400 hover:text-dark-600"
                >
                  تعليم كمقروء
                </button>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="mt-6 flex gap-2 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-dark-200/60">
            <button
              onClick={() => setActiveTab('steps')}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                activeTab === 'steps' ? 'bg-primary-600 text-white' : 'text-dark-600 hover:bg-dark-50'
              }`}
            >
              الخطوات
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                activeTab === 'history' ? 'bg-primary-600 text-white' : 'text-dark-600 hover:bg-dark-50'
              }`}
            >
              <History className="ml-1 inline h-4 w-4" />
              السجل
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                activeTab === 'messages' ? 'bg-primary-600 text-white' : 'text-dark-600 hover:bg-dark-50'
              }`}
            >
              <MessageSquare className="ml-1 inline h-4 w-4" />
              الرسائل
              {reviewActions.length > 0 && (
                <span className="mr-1 rounded-full bg-primary-100 px-1.5 text-xs text-primary-700">
                  {reviewActions.length}
                </span>
              )}
            </button>
          </div>

          {/* Tab content */}
          <div className="mt-4">
            {activeTab === 'steps' && (
              <div className="space-y-3">
                {steps.map((step) => {
                  const stepDef = APPLICATION_STEPS.find((s) => s.key === step.step_key);
                  const canNavigate = !step.locked && step.status !== 'approved';
                  return (
                    <div
                      key={step.id}
                      className="animate-slide-up rounded-2xl bg-white p-5 shadow-sm ring-1 ring-dark-200/60"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <StatusIcon status={step.status} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-dark-900">{step.title}</h3>
                            <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${statusColor(step.status)}`}>
                              {statusLabel(step.status)}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-dark-500">
                            {stepDef?.description}
                          </p>

                          {/* Admin comment for changes_requested / rejected */}
                          {(step.status === 'changes_requested' || step.status === 'rejected') &&
                            reviewActions
                              .filter((r) => r.step_key === step.step_key)
                              .slice(0, 1)
                              .map((action) => (
                                <div
                                  key={action.id}
                                  className={`mt-3 rounded-xl p-3 text-sm ${
                                    step.status === 'rejected'
                                      ? 'bg-error-50 text-error-700'
                                      : 'bg-warning-50 text-warning-700'
                                  }`}
                                >
                                  <p className="font-semibold">رسالة من المراجع:</p>
                                  <p className="mt-1">{action.comment || 'يرجى مراجعة البيانات وإعادة الإرسال.'}</p>
                                </div>
                              ))}

                          {/* Action button */}
                          {canNavigate && (
                            <button
                              onClick={() => navigate(stepDef?.route || '/')}
                              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
                            >
                              {step.status === 'changes_requested' ? 'تعديل البيانات' : 'استكمال'}
                              <ArrowLeft className="h-4 w-4" />
                            </button>
                          )}

                          {step.status === 'approved' && step.reviewed_at && (
                            <p className="mt-2 text-xs text-dark-400">
                              تمت المراجعة في {new Date(step.reviewed_at).toLocaleDateString('ar-SA')}
                            </p>
                          )}

                          {step.status === 'submitted' || step.status === 'under_review' ? (
                            <p className="mt-2 text-xs text-primary-500">
                              في انتظار مراجعة الإدارة
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-dark-200/60">
                {history.length === 0 ? (
                  <p className="text-center text-sm text-dark-400">لا يوجد سجل</p>
                ) : (
                  <div className="space-y-4">
                    {history.map((event) => {
                      const labels: Record<string, string> = {
                        application_created: 'إنشاء الطلب',
                        step_submitted: 'إرسال خطوة',
                        step_resubmitted: 'إعادة إرسال خطوة',
                        step_approved: 'الموافقة على خطوة',
                        step_rejected: 'رفض خطوة',
                        step_changes_requested: 'طلب تعديل خطوة',
                        step_unlocked: 'فتح خطوة',
                        application_completed: 'إكمال الطلب',
                      };
                      return (
                        <div key={event.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="h-3 w-3 rounded-full bg-primary-500" />
                            {event !== history[history.length - 1] && (
                              <div className="h-full w-0.5 flex-1 bg-dark-100" />
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <p className="font-semibold text-dark-900">
                              {labels[event.event_type] || event.event_type}
                            </p>
                            {event.step_key && (
                              <p className="text-sm text-dark-500">
                                {APPLICATION_STEPS.find((s) => s.key === event.step_key)?.title || event.step_key}
                              </p>
                            )}
                            <p className="mt-1 text-xs text-dark-400">
                              {new Date(event.created_at).toLocaleString('ar-SA')}
                              {' — '}
                              {event.actor === 'admin' ? 'الإدارة' : event.actor === 'system' ? 'النظام' : 'العميل'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="space-y-3">
                {reviewActions.length === 0 ? (
                  <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-dark-200/60">
                    <MessageSquare className="mx-auto h-12 w-12 text-dark-300" />
                    <p className="mt-3 text-sm text-dark-400">لا توجد رسائل من الإدارة</p>
                  </div>
                ) : (
                  reviewActions.map((action) => {
                    const stepDef = APPLICATION_STEPS.find((s) => s.key === action.step_key);
                    const actionLabels: Record<string, string> = {
                      approve: 'موافقة',
                      reject: 'رفض',
                      request_changes: 'طلب تعديل',
                      unlock: 'فتح',
                    };
                    const actionColors: Record<string, string> = {
                      approve: 'bg-success-50 text-success-700',
                      reject: 'bg-error-50 text-error-700',
                      request_changes: 'bg-warning-50 text-warning-700',
                      unlock: 'bg-primary-50 text-primary-700',
                    };
                    return (
                      <div
                        key={action.id}
                        className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-dark-200/60"
                      >
                        <div className="flex items-center justify-between">
                          <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${actionColors[action.action]}`}>
                            {actionLabels[action.action]}
                          </span>
                          <span className="text-xs text-dark-400">
                            {new Date(action.created_at).toLocaleString('ar-SA')}
                          </span>
                        </div>
                        <p className="mt-2 text-sm font-semibold text-dark-700">
                          {stepDef?.title || action.step_key}
                        </p>
                        {action.comment && (
                          <p className="mt-2 rounded-xl bg-dark-50 p-3 text-sm text-dark-700">
                            {action.comment}
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Bottom actions */}
          <div className="mt-6 flex gap-3">
            <Link to="/" className="btn-secondary flex-1">
              <ArrowLeft className="h-5 w-5" />
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
