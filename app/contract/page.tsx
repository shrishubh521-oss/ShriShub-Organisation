import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

export default async function ContractPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  if (!params.order) redirect("/dashboard");

  const { data: order } = await supabase.from("orders").select("id, service_type, requirements, quoted_price, status, contract_accepted").eq("id", params.order).single();
  if (!order) redirect("/dashboard");

  return <div className="container-page py-16"><div className="mx-auto max-w-3xl card p-7"><p className="text-sm text-yellow-300">Digital service contract</p><h1 className="mt-2 text-3xl font-black">{order.service_type}</h1><div className="mt-7 rounded-2xl bg-white/5 p-5"><p className="text-sm font-bold">Scope / requirements</p><p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-300">{order.requirements}</p></div><div className="mt-5 rounded-2xl border border-white/10 p-5 text-sm leading-7 text-slate-300"><p>By accepting the project contract, the customer confirms that the displayed requirements and starting price are understood. Final scope, delivery milestones, revisions, ownership, payment terms, and cancellation terms should be finalized by ShriShubh before production work begins.</p></div><div className="mt-6 flex flex-col gap-3 sm:flex-row"><Link href={`/payment?order=${order.id}`} className="btn-primary">{order.contract_accepted ? "Continue to payment" : "Accept contract & continue"}</Link><Link href="/dashboard" className="btn-secondary">Back to dashboard</Link></div><p className="mt-4 text-xs text-slate-500">Current status: {order.status}. Payment provider connection is configured separately.</p></div></div>;
}
