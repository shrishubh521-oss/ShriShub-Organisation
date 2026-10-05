import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

export default async function AdminCustomersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");
  const { data: customers } = await supabase.from("profiles").select("id, full_name, role, created_at").eq("role", "customer").order("created_at", { ascending: false });
  return <div className="container-page py-16"><h1 className="text-4xl font-black">Customers</h1><div className="mt-8 space-y-3">{customers?.map((customer) => <div key={customer.id} className="card flex flex-col justify-between gap-2 p-5 md:flex-row"><div><div className="font-bold">{customer.full_name || "Customer"}</div><div className="text-xs text-slate-500">{customer.id}</div></div><div className="text-sm text-slate-400">{new Date(customer.created_at).toLocaleDateString("en-IN")}</div></div>)}</div></div>;
}
