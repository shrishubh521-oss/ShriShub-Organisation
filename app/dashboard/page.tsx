import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: orders } = await supabase.from("orders").select("id, service_type, status, quoted_price, created_at").order("created_at", { ascending: false });

  return <div className="container-page py-16"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-sm text-yellow-300">Customer dashboard</p><h1 className="mt-2 text-4xl font-black">Welcome back</h1><p className="mt-2 text-slate-400">{user.email}</p></div><Link href="/order" className="btn-primary">New project</Link></div><div className="mt-10 grid gap-5 md:grid-cols-2">{orders?.length ? orders.map((order) => <Link key={order.id} href={`/contract?order=${order.id}`} className="card p-6 hover:border-yellow-300/30"><div className="flex items-center justify-between gap-4"><h2 className="font-black">{order.service_type}</h2><span className="rounded-full bg-white/5 px-3 py-1 text-xs text-yellow-200">{order.status}</span></div><p className="mt-4 text-2xl font-black">₹{Number(order.quoted_price).toLocaleString("en-IN")}</p><p className="mt-2 text-xs text-slate-500">Created {new Date(order.created_at).toLocaleDateString("en-IN")}</p></Link>) : <div className="card p-8 text-slate-400">No projects yet. Start your first project to see it here.</div>}</div></div>;
}
