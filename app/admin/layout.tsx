import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import {
  BarChart3,
  MessageSquare,
  Package,
  Settings,
  Shield,
  Users,
} from "lucide-react";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/orders", label: "Orders", icon: Package },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-slate-100">
      <aside className="hidden w-72 flex-col border-r border-orange-200/80 bg-gradient-to-b from-white via-orange-50 to-amber-50 shadow-[inset_-1px_0_0_rgba(251,146,60,0.12)] lg:flex">
        <div className="border-b border-orange-200/80 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 shadow-sm">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-wide text-slate-900">ShriShubh</h1>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-700">
                Admin Portal
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700 hover:shadow-sm"
              >
                <Icon className="h-5 w-5 text-orange-500 transition group-hover:text-orange-600" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1">
        <div className="sticky top-0 z-40 border-b border-orange-200/80 bg-white/90 backdrop-blur-xl">
          <div className="container-page flex min-h-20 items-center justify-between gap-4 px-4 py-3">
            <h2 className="text-xl font-black tracking-tight text-slate-900">Admin Portal</h2>
            <Link
              href="/"
              className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-sm font-semibold text-orange-700 transition hover:border-orange-300 hover:bg-orange-100"
            >
              Back to website
            </Link>
          </div>
        </div>

        <div className="container-page py-8">
          <div className="rounded-2xl border border-orange-100 bg-white/80 p-5 shadow-sm shadow-orange-100/50">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
