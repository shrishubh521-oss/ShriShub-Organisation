import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");
  const { data: orders } = await supabase.from("orders").select("id, user_id, service_type, status, quoted_price, created_at").order("created_at", { ascending: false });
  return <div className="container-page py-16"><h1 className="text-4xl font-black">Orders</h1><div className="mt-8 overflow-x-auto card"><table className="w-full min-w-[700px] text-left text-sm"><thead className="border-b border-white/10 bg-white/5"><tr><th className="p-4">Service</th><th className="p-4">Customer ID</th><th className="p-4">Price</th><th className="p-4">Status</th></tr></thead><tbody>{orders?.map((order) => <tr key={order.id} className="border-b border-white/10"><td className="p-4 font-bold">{order.service_type}</td><td className="p-4 text-slate-500">{order.user_id}</td><td className="p-4">₹{Number(order.quoted_price).toLocaleString("en-IN")}</td><td className="p-4">{order.status}</td></tr>)}</tbody></table></div></div>;
}
