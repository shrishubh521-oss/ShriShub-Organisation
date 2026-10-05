import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");
  const { data: orders } = await supabase.from("orders").select("id, user_id, service_type, status, quoted_price, created_at").order("created_at", { ascending: false });
  return (
    <div className="py-8">
      <h1 className="mb-2 text-5xl font-black text-orange-400">Orders</h1>
      <p className="mb-8 text-lg font-semibold text-orange-300">Manage all customer orders</p>
      <div className="mt-8 overflow-x-auto rounded-xl border-2 border-orange-500/50 bg-slate-800/80 shadow-xl">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-b-2 border-orange-500/50 bg-orange-500/20">
            <tr>
              <th className="p-4 text-orange-300 font-bold">Service</th>
              <th className="p-4 text-orange-300 font-bold">Customer ID</th>
              <th className="p-4 text-orange-300 font-bold">Price</th>
              <th className="p-4 text-orange-300 font-bold">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr key={order.id} className="border-b border-orange-500/20 transition hover:bg-orange-500/10">
                <td className="p-4 font-bold text-orange-200">{order.service_type}</td>
                <td className="p-4 font-mono text-orange-300">{order.user_id}</td>
                <td className="p-4 font-bold text-orange-400">₹{Number(order.quoted_price).toLocaleString("en-IN")}</td>
                <td className="p-4">
                  <span className="inline-block rounded-full border border-orange-500 bg-orange-500/30 px-3 py-1 text-sm font-bold text-orange-300">
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
