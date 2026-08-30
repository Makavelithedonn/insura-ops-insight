import { cn } from "@/lib/utils";
import type { QuoteStatus, SessionStatus, WorkflowStep } from "@/lib/admin-data";
import { stepLabel } from "@/lib/admin-data";

const tone = {
  success: "bg-success/10 text-success border-success/25",
  warning: "bg-warning/15 text-warning-foreground border-warning/40",
  info: "bg-info/10 text-info border-info/25",
  neutral: "bg-muted text-muted-foreground border-border",
  danger: "bg-destructive/10 text-destructive border-destructive/25",
} as const;

function Pill({
  children,
  variant,
  dot,
}: {
  children: React.ReactNode;
  variant: keyof typeof tone;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tone[variant],
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

const sessionMap: Record<SessionStatus, { label: string; variant: keyof typeof tone }> = {
  active: { label: "Active", variant: "success" },
  pending_review: { label: "Pending review", variant: "warning" },
  completed: { label: "Completed", variant: "info" },
  closed: { label: "Closed", variant: "neutral" },
  rejected: { label: "Rejected", variant: "danger" },
};

export function SessionStatusBadge({ status }: { status: SessionStatus }) {
  const s = sessionMap[status];
  return (
    <Pill variant={s.variant} dot>
      {s.label}
    </Pill>
  );
}

const quoteMap: Record<QuoteStatus, { label: string; variant: keyof typeof tone }> = {
  new: { label: "New", variant: "info" },
  in_progress: { label: "In progress", variant: "warning" },
  pending: { label: "Pending", variant: "warning" },
  completed: { label: "Completed", variant: "success" },
  rejected: { label: "Rejected", variant: "danger" },
};

export function QuoteStatusBadge({ status }: { status: QuoteStatus }) {
  const s = quoteMap[status];
  return <Pill variant={s.variant}>{s.label}</Pill>;
}

export function StepBadge({ step }: { step: WorkflowStep }) {
  return (
    <Pill variant={step === "completed" ? "success" : "neutral"}>{stepLabel(step)}</Pill>
  );
}

export function ReviewBadge({ decision }: { decision: "pending" | "accepted" | "rejected" }) {
  const map = {
    pending: { label: "Awaiting review", variant: "warning" as const },
    accepted: { label: "Accepted", variant: "success" as const },
    rejected: { label: "Rejected", variant: "danger" as const },
  };
  return <Pill variant={map[decision].variant}>{map[decision].label}</Pill>;
}
