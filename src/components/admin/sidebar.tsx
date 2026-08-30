import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Activity,
  Users,
  Car,
  ShieldCheck,
  MonitorSmartphone,
  ShieldHalf,
} from "lucide-react";

export type AdminView =
  | "overview"
  | "quotes"
  | "customers"
  | "vehicles"
  | "offers"
  | "sessions";

const items: { key: AdminView; label: string; icon: typeof Users }[] = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "quotes", label: "Live Quotes", icon: Activity },
  { key: "customers", label: "Customers", icon: Users },
  { key: "vehicles", label: "Vehicles", icon: Car },
  { key: "offers", label: "Insurance Offers", icon: ShieldCheck },
  { key: "sessions", label: "Sessions", icon: MonitorSmartphone },
];

export function AdminSidebar({
  view,
  onChange,
  counts,
}: {
  view: AdminView;
  onChange: (v: AdminView) => void;
  counts: Partial<Record<AdminView, number>>;
}) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
      <div className="flex items-center gap-3 border-b border-border px-5 py-5">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <ShieldHalf className="size-5" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-foreground">Admin Dashboard</p>
          <p className="text-xs text-muted-foreground">Insurance Operations</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => {
          const active = item.key === view;
          const count = counts[item.key];
          return (
            <button
              key={item.key}
              onClick={() => onChange(item.key)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="size-4" />
              <span className="flex-1 text-left">{item.label}</span>
              {count !== undefined && (
                <span
                  className={cn(
                    "rounded-md px-1.5 py-0.5 text-xs font-semibold tabular-nums",
                    active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-border p-4 text-xs text-muted-foreground">
        Personal identifiers are masked by default.
      </div>
    </aside>
  );
}
