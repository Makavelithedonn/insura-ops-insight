import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import SiteApp from "@/site/SiteApp";

export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [
      { title: "بي كير للتأمين" },
      { name: "description", content: "قارن عروض تأمين المركبات في السعودية." },
    ],
  }),
  component: SitePage,
});

function SitePage() {
  return <ClientOnly fallback={<div className="min-h-screen bg-white" />}><SiteApp /></ClientOnly>;
}
