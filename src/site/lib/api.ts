import { supabase } from '@/lib/supabase';
import type {
  Application,
  ApplicationStep,
  ApplicationWithSteps,
  SubmissionVersion,
  ReviewAction,
  AppNotification,
  ApplicationHistoryEvent,
  AdminComment,
} from '@/lib/types';
import { APPLICATION_STEPS, getStepByKey } from '@/data/steps';

// ============================================================
// Application API Layer
// This module abstracts all database operations for the
// application workflow. It uses Supabase directly since the
// database IS the API. An external admin dashboard would use
// the same Supabase tables (via the service role key + the
// SECURITY DEFINER functions approve_step, reject_step,
// request_changes_step, unlock_step).
//
// If PUBLIC_API_URL is set in the environment, this layer can
// be switched to use an external REST API instead — see the
// fetchApi() helper at the bottom.
// ============================================================

// ── ID generators ─────────────────────────────────────────────

export function generateApplicationId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'APP-';
  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

export function getOrCreateCustomerId(): string {
  const KEY = 'becaree_customer_id';
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = 'cust-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
    localStorage.setItem(KEY, id);
  }
  return id;
}

export function getStoredApplicationId(): string | null {
  return localStorage.getItem('becaree_application_id');
}

export function storeApplicationId(id: string): void {
  localStorage.setItem('becaree_application_id', id);
}

export function clearStoredApplicationId(): void {
  localStorage.removeItem('becaree_application_id');
}

// ── Application lifecycle ─────────────────────────────────────

export async function createApplication(
  insuranceType?: string
): Promise<ApplicationWithSteps | null> {
  const applicationId = generateApplicationId();
  const customerId = getOrCreateCustomerId();

  // Create the application record
  const { data: app, error: appError } = await supabase
    .from('applications')
    .insert({
      application_id: applicationId,
      customer_id: customerId,
      overall_status: 'draft',
      current_step: 'insurance_quote',
      insurance_type: insuranceType || 'car',
    })
    .select()
    .single();

  if (appError || !app) {
    console.error('[api] createApplication error:', appError);
    return null;
  }

  // Create all step rows — first step unlocked, rest locked
  const stepRows = APPLICATION_STEPS.map((step) => ({
    application_id: app.id,
    step_key: step.key,
    title: step.title,
    step_order: step.order,
    status: step.order === 1 ? 'draft' : 'locked',
    locked: step.order !== 1,
    data: {},
  }));

  const { data: steps, error: stepsError } = await supabase
    .from('application_steps')
    .insert(stepRows)
    .select();

  if (stepsError || !steps) {
    console.error('[api] createApplication steps error:', stepsError);
    return null;
  }

  // Record history
  await supabase.from('application_history').insert({
    application_id: app.id,
    event_type: 'application_created',
    actor: 'customer',
    details: { application_id: applicationId, insurance_type: insuranceType },
  });

  storeApplicationId(applicationId);
  return { application: app, steps };
}

export async function getApplication(
  applicationId: string
): Promise<ApplicationWithSteps | null> {
  const { data: app, error: appError } = await supabase
    .from('applications')
    .select('*')
    .eq('application_id', applicationId)
    .maybeSingle();

  if (appError || !app) {
    console.error('[api] getApplication error:', appError);
    return null;
  }

  const { data: steps, error: stepsError } = await supabase
    .from('application_steps')
    .select('*')
    .eq('application_id', app.id)
    .order('step_order', { ascending: true });

  if (stepsError || !steps) {
    console.error('[api] getApplication steps error:', stepsError);
    return null;
  }

  return { application: app, steps };
}

export async function resumeApplication(): Promise<ApplicationWithSteps | null> {
  const storedId = getStoredApplicationId();
  if (!storedId) return null;
  return getApplication(storedId);
}

// ── Step submission ───────────────────────────────────────────

export async function submitStep(
  applicationId: string,
  stepKey: string,
  data: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  const { data: app, error: appError } = await supabase
    .from('applications')
    .select('id')
    .eq('application_id', applicationId)
    .maybeSingle();

  if (appError || !app) {
    return { success: false, error: 'لم يتم العثور على الطلب' };
  }

  // Get current step to determine version number
  const { data: step } = await supabase
    .from('application_steps')
    .select('id, status')
    .eq('application_id', app.id)
    .eq('step_key', stepKey)
    .maybeSingle();

  if (!step) {
    return { success: false, error: 'لم يتم العثور على الخطوة' };
  }

  // Check if this is a resubmission (step was in changes_requested or rejected)
  const isResubmission =
    step.status === 'changes_requested' || step.status === 'rejected';

  // Update step status to submitted
  const { error: updateError } = await supabase
    .from('application_steps')
    .update({
      status: 'submitted',
      data: data,
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', step.id);

  if (updateError) {
    return { success: false, error: 'فشل حفظ البيانات' };
  }

  // Get the next version number
  const { data: versions } = await supabase
    .from('submission_versions')
    .select('version_number')
    .eq('step_id', step.id)
    .order('version_number', { ascending: false })
    .limit(1);

  const nextVersion = (versions && versions.length > 0 ? versions[0].version_number : 0) + 1;

  // Create submission version snapshot
  await supabase.from('submission_versions').insert({
    application_id: app.id,
    step_id: step.id,
    step_key: stepKey,
    version_number: nextVersion,
    data: data,
  });

  // Update application status
  await supabase
    .from('applications')
    .update({
      overall_status: 'under_review',
      last_activity_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', app.id);

  // Record history
  await supabase.from('application_history').insert({
    application_id: app.id,
    event_type: isResubmission ? 'step_resubmitted' : 'step_submitted',
    step_key: stepKey,
    actor: 'customer',
    details: { version: nextVersion },
  });

  // Create notification for admin
  await supabase.from('notifications').insert({
    application_id: app.id,
    step_key: stepKey,
    type: 'step_submitted',
    title: 'تم إرسال الخطوة',
    message: `تم إرسال "${getStepByKey(stepKey)?.title || stepKey}" للمراجعة.`,
  });

  return { success: true };
}

// ── Step status helpers ───────────────────────────────────────

export async function getStepStatus(
  applicationId: string,
  stepKey: string
): Promise<ApplicationStep | null> {
  const { data: app } = await supabase
    .from('applications')
    .select('id')
    .eq('application_id', applicationId)
    .maybeSingle();

  if (!app) return null;

  const { data: step } = await supabase
    .from('application_steps')
    .select('*')
    .eq('application_id', app.id)
    .eq('step_key', stepKey)
    .maybeSingle();

  return step;
}

export function canEditStep(step: ApplicationStep | null): boolean {
  if (!step) return false;
  if (step.locked) return false;
  return (
    step.status === 'draft' ||
    step.status === 'changes_requested' ||
    step.status === 'rejected'
  );
}

export function isStepAccessible(
  steps: ApplicationStep[],
  stepKey: string
): boolean {
  const step = steps.find((s) => s.step_key === stepKey);
  if (!step) return false;
  if (!step.locked) return true;
  return false;
}

// ── Notifications ─────────────────────────────────────────────

export async function getUnreadNotifications(
  applicationId: string
): Promise<AppNotification[]> {
  const { data: app } = await supabase
    .from('applications')
    .select('id')
    .eq('application_id', applicationId)
    .maybeSingle();

  if (!app) return [];

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('application_id', app.id)
    .eq('is_read', false)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data;
}

export async function markNotificationRead(id: string): Promise<void> {
  await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id);
}

export async function markAllNotificationsRead(
  applicationId: string
): Promise<void> {
  const { data: app } = await supabase
    .from('applications')
    .select('id')
    .eq('application_id', applicationId)
    .maybeSingle();

  if (!app) return;

  await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('application_id', app.id);
}

// ── Admin comments ────────────────────────────────────────────

export async function getAdminComments(
  applicationId: string,
  stepKey?: string
): Promise<AdminComment[]> {
  const { data: app } = await supabase
    .from('applications')
    .select('id')
    .eq('application_id', applicationId)
    .maybeSingle();

  if (!app) return [];

  let query = supabase
    .from('admin_comments')
    .select('*')
    .eq('application_id', app.id)
    .order('created_at', { ascending: false });

  if (stepKey) {
    query = query.eq('step_key', stepKey);
  }

  const { data, error } = await query;
  if (error || !data) return [];
  return data;
}

// ── Review actions ────────────────────────────────────────────

export async function getReviewActions(
  applicationId: string
): Promise<ReviewAction[]> {
  const { data: app } = await supabase
    .from('applications')
    .select('id')
    .eq('application_id', applicationId)
    .maybeSingle();

  if (!app) return [];

  const { data, error } = await supabase
    .from('review_actions')
    .select('*')
    .eq('application_id', app.id)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data;
}

// ── History ───────────────────────────────────────────────────

export async function getApplicationHistory(
  applicationId: string
): Promise<ApplicationHistoryEvent[]> {
  const { data: app } = await supabase
    .from('applications')
    .select('id')
    .eq('application_id', applicationId)
    .maybeSingle();

  if (!app) return [];

  const { data, error } = await supabase
    .from('application_history')
    .select('*')
    .eq('application_id', app.id)
    .order('created_at', { ascending: true });

  if (error || !data) return [];
  return data;
}

// ── Submission versions ───────────────────────────────────────

export async function getSubmissionVersions(
  applicationId: string,
  stepKey: string
): Promise<SubmissionVersion[]> {
  const { data: app } = await supabase
    .from('applications')
    .select('id')
    .eq('application_id', applicationId)
    .maybeSingle();

  if (!app) return [];

  const { data: step } = await supabase
    .from('application_steps')
    .select('id')
    .eq('application_id', app.id)
    .eq('step_key', stepKey)
    .maybeSingle();

  if (!step) return [];

  const { data, error } = await supabase
    .from('submission_versions')
    .select('*')
    .eq('step_id', step.id)
    .order('version_number', { ascending: true });

  if (error || !data) return [];
  return data;
}

// ── Update application current step ───────────────────────────

export async function updateCurrentStep(
  applicationId: string,
  stepKey: string
): Promise<void> {
  const { data: app } = await supabase
    .from('applications')
    .select('id')
    .eq('application_id', applicationId)
    .maybeSingle();

  if (!app) return;

  await supabase
    .from('applications')
    .update({
      current_step: stepKey,
      last_activity_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', app.id);
}
