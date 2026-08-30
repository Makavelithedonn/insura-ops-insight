import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Check, X } from "lucide-react";
import {
  type AdminSession,
  type WorkflowStep,
  WORKFLOW_STEPS,
  formatCurrency,
  formatDateTime,
  maskNationalId,
  maskPhone,
  relativeTime,
} from "@/lib/admin-data";
import { QuoteStatusBadge, ReviewBadge, SessionStatusBadge, StepBadge } from "./status";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">{children}</dl>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="truncate text-sm font-medium text-foreground">{children}</dd>
    </div>
  );
}

export function SessionModal({
  session,
  open,
  onOpenChange,
  onDecision,
  onUpdateStep,
  onClose,
}: {
  session: AdminSession | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onDecision: (id: string, decision: "accepted" | "rejected") => void;
  onUpdateStep: (id: string, step: WorkflowStep) => void;
  onClose: (id: string) => void;
}) {
  const [reveal, setReveal] = useState(false);

  if (!session) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setReveal(false);
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-h-[90vh] gap-4 overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex flex-wrap items-center gap-3">
            Session {session.sessionId}
            <SessionStatusBadge status={session.status} />
            <ReviewBadge decision={session.reviewDecision} />
          </DialogTitle>
          <DialogDescription>
            Review the submitted information before allowing the customer to continue.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={() => setReveal((r) => !r)}>
            {reveal ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            {reveal ? "Mask identifiers" : "Reveal identifiers"}
          </Button>
        </div>

        <div className="grid gap-4">
          <Section title="Customer">
            <Field label="Customer">{session.customerName}</Field>
            <Field label="National ID">
              {reveal ? session.nationalId : maskNationalId(session.nationalId)}
            </Field>
            <Field label="Phone">{reveal ? session.phone : maskPhone(session.phone)}</Field>
          </Section>

          <Section title="Vehicle">
            <Field label="Make">{session.vehicleMake}</Field>
            <Field label="Model">{session.vehicleModel}</Field>
            <Field label="Model year">{session.modelYear}</Field>
            <Field label="Vehicle details">{session.vehicleDetails}</Field>
          </Section>

          <Section title="Insurance">
            <Field label="Declared value">{formatCurrency(session.declaredValue)}</Field>
            <Field label="Insurance company">{session.insuranceCompany}</Field>
            <Field label="Insurance offer">{session.insuranceOffer}</Field>
            <Field label="Quote / reference number">{session.quoteId}</Field>
            <Field label="Current quote status">
              <QuoteStatusBadge status={session.quoteStatus} />
            </Field>
          </Section>

          <Section title="Workflow">
            <Field label="Current step">
              <StepBadge step={session.currentStep} />
            </Field>
            <Field label="Session status">
              <SessionStatusBadge status={session.status} />
            </Field>
            <Field label="Created at">{formatDateTime(session.createdAt)}</Field>
            <Field label="Last activity">
              {formatDateTime(session.lastActivity)} · {relativeTime(session.lastActivity)}
            </Field>
          </Section>

          {session.reviewNote && (
            <p className="rounded-lg border border-destructive/25 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {session.reviewNote}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <Select
            value={session.currentStep}
            onValueChange={(v) => onUpdateStep(session.sessionId, v as WorkflowStep)}
          >
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Update status" />
            </SelectTrigger>
            <SelectContent>
              {WORKFLOW_STEPS.map((s) => (
                <SelectItem key={s.key} value={s.key}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex-1" />

          <Button variant="ghost" onClick={() => onClose(session.sessionId)}>
            Close session
          </Button>
          <Button
            variant="outline"
            className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDecision(session.sessionId, "rejected")}
          >
            <X className="size-4" /> Reject
          </Button>
          <Button onClick={() => onDecision(session.sessionId, "accepted")}>
            <Check className="size-4" /> Accept &amp; continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
