import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import SiteApp from "@/site/SiteApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "بي كير للتأمين — تأمين المركبات في السعودية" },
      { name: "description", content: "قارن عروض تأمين المركبات من أفضل الشركات في السعودية واحصل على أفضل سعر خلال دقائق." },
      { property: "og:title", content: "بي كير للتأمين" },
      { property: "og:description", content: "قارن عروض تأمين المركبات واحصل على أفضل سعر." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: SitePage,
});

function SitePage() {
  return <ClientOnly fallback={<div className="min-h-screen bg-white" />}><SiteApp /></ClientOnly>;
}
