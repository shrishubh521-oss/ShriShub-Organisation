import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

export default async function AdminCustomersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");
  const { data: customers } = await supabase.from("profiles").select("id, full_name, role, created_at").eq("role", "customer").order("created_at", { ascending: false });
  return (
    <div className="py-8">
      <h1 className="mb-2 text-5xl font-black text-orange-400">Customers</h1>
      <p className="mb-8 text-lg font-semibold text-orange-300">View and manage all registered customers</p>
      <div className="mt-8 space-y-4">
        {customers?.map((customer) => (
          <div
            key={customer.id}
            className="flex flex-col justify-between gap-4 rounded-xl border-2 border-orange-500/50 bg-slate-800/80 p-6 shadow-lg transition hover:border-orange-400 hover:bg-slate-700/80 md:flex-row"
          >
            <div>
              <div className="text-lg font-bold text-orange-300">{customer.full_name || "Customer"}</div>
              <div className="mt-1 font-mono text-sm text-orange-400/70">{customer.id}</div>
            </div>
            <div className="text-sm font-semibold text-orange-300">
              {new Date(customer.created_at).toLocaleDateString("en-IN")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
