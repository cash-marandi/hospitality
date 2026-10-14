import Link from "next/link";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/briefing", label: "Briefing" },
  { href: "/admin/arrivals", label: "Arrivals" },
  { href: "/admin/functions", label: "Functions" },
  { href: "/admin/housekeeping", label: "Housekeeping" },
  { href: "/admin/rota", label: "Rota" },
  { href: "/admin/maintenance", label: "Maintenance" },
  { href: "/admin/inbox", label: "Inbox" },
  { href: "/admin/catering", label: "Catering" },
  { href: "/admin/incidents", label: "Incidents" },
  { href: "/admin/dishes", label: "Kitchen" },
  { href: "/admin/blog", label: "Blog" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <nav className="no-print flex flex-wrap gap-2" aria-label="Staff tools">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className="rounded-full border border-forest-800/15 bg-white px-4 py-1.5 text-xs font-semibold text-forest-900 hover:bg-forest-900 hover:text-white"
          >
            {n.label}
          </Link>
        ))}
      </nav>
      <div className="mt-6">{children}</div>
    </div>
  );
}
