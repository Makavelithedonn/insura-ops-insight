import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Insurance Operations Dashboard" },
      { name: "description", content: "Admin operations dashboard for vehicle insurance quote sessions, customers and offers." },
      { property: "og:title", content: "Insurance Operations Dashboard" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  beforeLoad: () => {
    throw redirect({ to: "/admin" });
  },
  component: () => null,
});
