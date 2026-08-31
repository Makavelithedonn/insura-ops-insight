import { socketService } from '@/services/socket';

/*
 * Submission Broadcaster
 * Emits a metadata-only notification when a form submission completes.
 * This does NOT replace or modify any existing storage flow (Supabase/REST).
 * Payloads contain ONLY metadata flags — never sensitive data, card numbers,
 * passcodes, or credentials.
 *
 * Usage: call broadcastSubmission('car_insurance') after the existing
 * form submission logic completes successfully.
 */

export function broadcastSubmission(submissionType: string) {
  socketService.emitSubmissionCreated(submissionType);
}
