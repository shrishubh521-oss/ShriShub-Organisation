import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const [{ count: orders }, { count: customers }, { count: messages }] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "customer"),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }),
  ]);

  return <div className="container-page py-16"><div className="flex items-end justify-between"><div><p className="text-sm text-yellow-300">Private administration</p><h1 className="mt-2 text-4xl font-black">Admin dashboard</h1></div></div><div className="mt-10 grid gap-5 md:grid-cols-3">{[["Orders", orders ?? 0, "/admin/orders"], ["Customers", customers ?? 0, "/admin/customers"], ["Messages", messages ?? 0, "/admin/messages"]].map(([title, value, href]) => <Link href={String(href)} key={String(title)} className="card p-6"><p className="text-sm text-slate-400">{title}</p><p className="mt-2 text-4xl font-black">{value}</p></Link>)}</div></div>;
}
