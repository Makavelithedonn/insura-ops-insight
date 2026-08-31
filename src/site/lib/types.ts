// @ts-nocheck
// ============================================================
// Application Workflow — Type Definitions
// These models map 1:1 to the Supabase tables and define the
// contract between this website and the external admin dashboard.
// ============================================================

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'completed';

export type StepStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'changes_requested'
  | 'rejected'
  | 'locked';

export type ReviewActionType =
  | 'approve'
  | 'reject'
  | 'request_changes'
  | 'unlock';

export type NotificationType =
  | 'step_approved'
  | 'changes_requested'
  | 'step_rejected'
  | 'step_unlocked'
  | 'application_completed'
  | 'step_submitted';

// ── Database row types ────────────────────────────────────────

export interface Application {
  id: string;
  application_id: string;       // human-readable: APP-XXXXXX
  customer_id: string;          // per-browser identifier (localStorage)
  overall_status: ApplicationStatus;
  current_step: string | null;  // step_key
  insurance_type: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  last_activity_at: string;
}

export interface ApplicationStep {
  id: string;
  application_id: string;
  step_key: string;
  title: string;
  step_order: number;
  status: StepStatus;
  data: Record<string, unknown>;
  locked: boolean;
  submitted_at: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubmissionVersion {
  id: string;
  application_id: string;
  step_id: string;
  step_key: string;
  version_number: number;
  data: Record<string, unknown>;
  submitted_at: string;
}

export interface ReviewAction {
  id: string;
  application_id: string;
  step_id: string;
  step_key: string;
  admin_id: string | null;
  action: ReviewActionType;
  comment: string | null;
  created_at: string;
}

export interface AdminComment {
  id: string;
  application_id: string;
  step_id: string;
  step_key: string;
  admin_id: string | null;
  comment: string;
  is_read: boolean;
  created_at: string;
}

export interface ApplicationHistoryEvent {
  id: string;
  application_id: string;
  event_type: string;
  step_key: string | null;
  details: Record<string, unknown>;
  actor: 'customer' | 'admin' | 'system';
  created_at: string;
}

export interface AppNotification {
  id: string;
  application_id: string;
  step_key: string | null;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// ── Step definition (client-side config) ──────────────────────

export interface StepDefinition {
  key: string;
  title: string;          // Arabic display title
  order: number;
  route: string;          // website route for this step
  description: string;    // Arabic short description
}

// ── API response wrappers ─────────────────────────────────────

export interface ApplicationWithSteps {
  application: Application;
  steps: ApplicationStep[];
}

export interface ApplicationFull extends ApplicationWithSteps {
  history: ApplicationHistoryEvent[];
  reviewActions: ReviewAction[];
  notifications: AppNotification[];
}
