import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

export default async function AdminSettingsPage() {
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
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
          Admin settings
        </p>
        <h1 className="mt-2 text-4xl font-black text-slate-900">Platform settings</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-6">
          <h2 className="text-xl font-black text-slate-900">General</h2>
          <ul className="mt-5 space-y-4 text-sm text-slate-600">
            <li className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3">
              <span>Brand name</span>
              <span className="font-semibold text-slate-900">ShriShubh</span>
            </li>
            <li className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3">
              <span>Website status</span>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                Live
              </span>
            </li>
            <li className="flex items-center justify-between gap-4">
              <span>Support email</span>
              <span className="font-semibold text-slate-900">support@shrishubh.com</span>
            </li>
          </ul>
        </section>

        <section className="card p-6">
          <h2 className="text-xl font-black text-slate-900">Operational</h2>
          <div className="mt-5 space-y-4 text-sm text-slate-600">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Response time</p>
              <p className="mt-1">Target: within 24 hours for new customer inquiries.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Messaging</p>
              <p className="mt-1">Customers can send and view messages from their portal.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Status</p>
              <p className="mt-1">All core portal functions are available and active.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
