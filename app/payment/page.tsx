import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

export default async function PaymentPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  if (!params.order) redirect("/dashboard");
  const { data: order } = await supabase.from("orders").select("id, service_type, quoted_price, contract_accepted, status").eq("id", params.order).single();
  if (!order) redirect("/dashboard");

  return <div className="container-page py-16"><div className="mx-auto max-w-xl card p-7"><p className="text-sm text-yellow-300">Checkout</p><h1 className="mt-2 text-3xl font-black">Payment for {order.service_type}</h1><div className="mt-7 flex items-end justify-between border-b border-white/10 pb-5"><span className="text-slate-400">Quoted amount</span><strong className="text-3xl">₹{Number(order.quoted_price).toLocaleString("en-IN")}</strong></div><div className="mt-6 rounded-2xl bg-white/5 p-5 text-sm leading-6 text-slate-400">This screen is payment-provider ready. Connect Razorpay, Stripe, or another provider using server-side keys and a webhook before accepting real payments.</div><Link href="/dashboard" className="btn-secondary mt-6 w-full">Return to dashboard</Link></div></div>;
}
