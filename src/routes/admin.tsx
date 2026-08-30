import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  RefreshCw,
  Search,
  LogOut,
  ChevronDown,
  Users,
  Activity,
  CheckCircle2,
  Clock,
  MonitorSmartphone,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminSidebar, type AdminView } from "@/components/admin/sidebar";
import { SessionModal } from "@/components/admin/session-modal";
import {
  QuoteStatusBadge,
  ReviewBadge,
  SessionStatusBadge,
  StepBadge,
} from "@/components/admin/status";
import {
  SEED_SESSIONS,
  type AdminSession,
  type WorkflowStep,
  formatCurrency,
  maskNationalId,
  maskPhone,
  nextStep,
  relativeTime,
  stepLabel,
  WORKFLOW_STEPS,
} from "@/lib/admin-data";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Insurance Operations Dashboard | Admin" },
      {
        name: "description",
        content:
          "Operations dashboard for vehicle insurance: monitor live quote sessions, review customer and vehicle information, and approve customers to the next step.",
      },
      { property: "og:title", content: "Insurance Operations Dashboard | Admin" },
      {
        property: "og:description",
        content:
          "Monitor live quote sessions, review customer and vehicle data, and approve or reject submissions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminDashboard,
});

const VIEW_TITLES: Record<AdminView, { title: string; subtitle: string }> = {
  overview: { title: "Overview", subtitle: "Live operations across all quote sessions" },
  quotes: { title: "Live Quotes", subtitle: "Quotes currently moving through the funnel" },
  customers: { title: "Customers", subtitle: "Customers who submitted quote information" },
  vehicles: { title: "Vehicles", subtitle: "Vehicles declared in active quote sessions" },
  offers: { title: "Insurance Offers", subtitle: "Offers selected by customers" },
  sessions: { title: "Sessions", subtitle: "All website sessions, newest first" },
};

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Users;
}) {
  return (
    <div className="card-surface p-4">
      <div className="flex items-start justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold tabular-nums text-foreground">{value}</p>
    </div>
  );
}

function AdminDashboard() {
  const [sessions, setSessions] = useState<AdminSession[]>(SEED_SESSIONS);
  const [view, setView] = useState<AdminView>("overview");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activePage, setActivePage] = useState<string | null>(null);

  const stats = useMemo(
    () => ({
      activeSessions: sessions.filter((s) => s.status === "active" || s.status === "pending_review")
        .length,
      newQuotes: sessions.filter((s) => s.quoteStatus === "new").length,
      customers: new Set(sessions.map((s) => s.nationalId)).size,
      completed: sessions.filter((s) => s.quoteStatus === "completed").length,
      pending: sessions.filter((s) => s.quoteStatus === "pending" || s.reviewDecision === "pending")
        .length,
    }),
    [sessions],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = [...sessions].sort(
      (a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime(),
    );
    if (view === "quotes")
      list = list.filter((s) => s.quoteStatus !== "completed" && s.status !== "closed");
    if (view === "offers") list = list.filter((s) => s.currentStep !== "quote_landing");
    if (activePage) list = list.filter((s) => s.currentStep === activePage);
    if (q)
      list = list.filter((s) =>
        [
          s.sessionId,
          s.quoteId,
          s.customerName,
          s.nationalId,
          s.phone.replace(/\s/g, ""),
          s.vehicleMake,
          s.vehicleModel,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    return list;
  }, [sessions, query, view, activePage]);

  const liveUsers = useMemo(
    () => sessions.filter((s) => s.status === "active" || s.status === "pending_review"),
    [sessions],
  );

  const pageCounts = useMemo(
    () =>
      WORKFLOW_STEPS.map((step) => ({
        key: step.key,
        label: step.label,
        count: liveUsers.filter((s) => s.currentStep === step.key).length,
      })),
    [liveUsers],
  );

  const selected = sessions.find((s) => s.sessionId === openId) ?? null;

  const patch = (id: string, changes: Partial<AdminSession>) =>
    setSessions((prev) =>
      prev.map((s) =>
        s.sessionId === id ? { ...s, ...changes, lastActivity: new Date().toISOString() } : s,
      ),
    );

  const handleDecision = (id: string, decision: "accepted" | "rejected") => {
    const session = sessions.find((s) => s.sessionId === id);
    if (!session) return;
    if (decision === "accepted") {
      const step = nextStep(session.currentStep);
      patch(id, {
        reviewDecision: "accepted",
        currentStep: step,
        status: step === "completed" ? "completed" : "active",
        quoteStatus: step === "completed" ? "completed" : "in_progress",
        reviewNote: undefined,
      });
      toast.success(`${session.customerName} approved — moved to next step`);
    } else {
      patch(id, {
        reviewDecision: "rejected",
        status: "rejected",
        quoteStatus: "rejected",
        reviewNote: "Submitted information was rejected by an administrator.",
      });
      toast.error(`${session.customerName} rejected — customer stays on the current step`);
    }
  };

  const handleUpdateStep = (id: string, step: WorkflowStep) => {
    patch(id, {
      currentStep: step,
      status: step === "completed" ? "completed" : "active",
      quoteStatus: step === "completed" ? "completed" : "in_progress",
    });
    toast.success("Workflow step updated");
  };

  const handleClose = (id: string) => {
    patch(id, { status: "closed" });
    setOpenId(null);
    toast("Session closed");
  };

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast.success("Sessions refreshed");
    }, 600);
  };

  const heading = VIEW_TITLES[view];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar
        view={view}
        onChange={setView}
        counts={{
          quotes: sessions.filter((s) => s.quoteStatus !== "completed").length,
          customers: stats.customers,
          vehicles: sessions.length,
          offers: new Set(sessions.map((s) => s.insuranceOffer)).size,
          sessions: stats.activeSessions,
        }}
        pages={pageCounts}
        activePage={activePage}
        onSelectPage={setActivePage}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex flex-wrap items-center gap-3 border-b border-border bg-card px-5 py-3">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by quote ID, phone, national ID..."
              className="h-9 max-w-lg pl-9"
            />
          </div>

          <Button variant="outline" size="sm" onClick={refresh} disabled={refreshing}>
            <RefreshCw className={refreshing ? "size-4 animate-spin" : "size-4"} />
            Refresh
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  JY
                </span>
                <span className="hidden sm:inline">Operations Admin</span>
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>Operations Admin</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setView("sessions")}>
                My sessions
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => toast("Preferences are not configured")}>
                Preferences
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => toast("Signed out")}
          >
            <LogOut className="size-4" />
            Sign out
          </Button>
        </header>

        <main className="flex-1 space-y-6 p-5 lg:p-7">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">{heading.title}</h1>
            <p className="text-sm text-muted-foreground">{heading.subtitle}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard
              label="Total active sessions"
              value={stats.activeSessions}
              icon={MonitorSmartphone}
            />
            <StatCard label="New quotes" value={stats.newQuotes} icon={Activity} />
            <StatCard label="Customers" value={stats.customers} icon={Users} />
            <StatCard label="Completed quotes" value={stats.completed} icon={CheckCircle2} />
            <StatCard label="Pending quotes" value={stats.pending} icon={Clock} />
          </div>

          <section className="card-surface p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold">Active users on site</h2>
                <p className="text-xs text-muted-foreground">
                  {liveUsers.length} user{liveUsers.length === 1 ? "" : "s"} currently in the quote
                  flow
                  {activePage ? ` · filtered by ${stepLabel(activePage as WorkflowStep)}` : ""}
                </p>
              </div>
              {activePage && (
                <Button size="sm" variant="ghost" onClick={() => setActivePage(null)}>
                  Clear page filter
                </Button>
              )}
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {liveUsers
                .filter((s) => !activePage || s.currentStep === activePage)
                .map((s) => (
                  <div key={s.sessionId} className="rounded-xl border border-border p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{s.customerName}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {s.sessionId} · {maskPhone(s.phone)} · {relativeTime(s.lastActivity)}
                        </p>
                      </div>
                      <StepBadge step={s.currentStep} />
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDecision(s.sessionId, "accepted")}
                      >
                        <Check className="size-4" /> Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDecision(s.sessionId, "rejected")}
                      >
                        <X className="size-4" /> Reject
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setOpenId(s.sessionId)}>
                        Open
                      </Button>
                    </div>
                  </div>
                ))}
              {liveUsers.filter((s) => !activePage || s.currentStep === activePage).length === 0 && (
                <p className="text-sm text-muted-foreground">No active users on this page.</p>
              )}
            </div>
          </section>

          <section className="card-surface overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
              <div>
                <h2 className="text-sm font-semibold">Live sessions</h2>
                <p className="text-xs text-muted-foreground">
                  {filtered.length} session{filtered.length === 1 ? "" : "s"} · identifiers masked
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1280px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    {[
                      "Session ID",
                      "Customer",
                      "National ID",
                      "Phone",
                      "Vehicle",
                      "Year",
                      "Declared Value",
                      "Insurance Offer",
                      "Current Step",
                      "Status",
                      "Last Activity",
                      "Action",
                    ].map((h) => (
                      <th key={h} className="whitespace-nowrap px-4 py-2.5 font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr
                      key={s.sessionId}
                      className="border-b border-border last:border-0 hover:bg-muted/40"
                    >
                      <td className="whitespace-nowrap px-4 py-3 font-medium">{s.sessionId}</td>
                      <td className="whitespace-nowrap px-4 py-3">{s.customerName}</td>
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground">
                        {maskNationalId(s.nationalId)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground">
                        {maskPhone(s.phone)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {s.vehicleMake} {s.vehicleModel}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 tabular-nums">{s.modelYear}</td>
                      <td className="whitespace-nowrap px-4 py-3 tabular-nums">
                        {formatCurrency(s.declaredValue)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                        {s.insuranceOffer}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <StepBadge step={s.currentStep} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex items-center gap-2">
                          <SessionStatusBadge status={s.status} />
                          <QuoteStatusBadge status={s.quoteStatus} />
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                        {relativeTime(s.lastActivity)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Button size="sm" variant="outline" onClick={() => setOpenId(s.sessionId)}>
                            Open
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-success hover:bg-success/10 hover:text-success"
                            onClick={() => handleDecision(s.sessionId, "accepted")}
                            aria-label={`Accept ${s.customerName}`}
                          >
                            <Check className="size-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleDecision(s.sessionId, "rejected")}
                            aria-label={`Reject ${s.customerName}`}
                          >
                            <X className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={12} className="px-4 py-10 text-center text-muted-foreground">
                        No sessions match this search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="card-surface p-4">
            <h2 className="text-sm font-semibold">Awaiting document review</h2>
            <p className="text-xs text-muted-foreground">
              Accept to move the customer to the next page, reject to keep them on the current step.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {sessions
                .filter((s) => s.reviewDecision === "pending" && s.status !== "closed")
                .map((s) => (
                  <div key={s.sessionId} className="rounded-xl border border-border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium">{s.customerName}</p>
                      <ReviewBadge decision={s.reviewDecision} />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {s.quoteId} · {s.vehicleMake} {s.vehicleModel} · {s.modelYear}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDecision(s.sessionId, "accepted")}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDecision(s.sessionId, "rejected")}
                      >
                        Reject
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setOpenId(s.sessionId)}>
                        Open
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        </main>
      </div>

      <SessionModal
        session={selected}
        open={openId !== null}
        onOpenChange={(v) => setOpenId(v ? openId : null)}
        onDecision={handleDecision}
        onUpdateStep={handleUpdateStep}
        onClose={handleClose}
      />
    </div>
  );
}
