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
    <div className="flex min-h-screen bg-slate-900">
      <aside className="hidden w-72 flex-col border-r-2 border-orange-500/50 bg-slate-800 shadow-xl lg:flex">
        <div className="border-b-2 border-orange-500/50 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg">
              <Shield className="h-7 w-7 text-white font-bold" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-wide text-orange-400">ShriShubh</h1>
              <p className="text-xs font-bold uppercase tracking-widest text-orange-500">
                Admin Panel
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
                className="group flex items-center gap-3 rounded-lg border-2 border-transparent px-4 py-3 text-sm font-bold text-gray-300 transition-all duration-200 hover:border-orange-500 hover:bg-orange-500/10 hover:text-orange-400"
              >
                <Icon className="h-5 w-5 text-orange-500 transition group-hover:text-orange-400" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1">
        <div className="sticky top-0 z-40 border-b-2 border-orange-500/50 bg-slate-800/95 backdrop-blur-xl shadow-lg">
          <div className="container-page flex min-h-20 items-center justify-between gap-4 px-4 py-3">
            <h2 className="text-2xl font-black tracking-tight text-orange-400">Admin Portal</h2>
            <Link
              href="/"
              className="rounded-lg border-2 border-orange-500 bg-orange-500/20 px-4 py-2 text-sm font-bold text-orange-400 transition hover:border-orange-400 hover:bg-orange-500/30"
            >
              ← Back to website
            </Link>
          </div>
        </div>

        <div className="container-page py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
