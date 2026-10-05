import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");
  const { data: messages } = await supabase.from("contact_messages").select("id, name, email, subject, message, created_at").order("created_at", { ascending: false });
  return (
    <div className="py-8">
      <h1 className="mb-2 text-5xl font-black text-orange-400">Contact Messages</h1>
      <p className="mb-8 text-lg font-semibold text-orange-300">All messages from website visitors</p>
      <div className="mt-8 space-y-4">
        {messages?.map((message) => (
          <article
            key={message.id}
            className="rounded-xl border-2 border-orange-500/50 bg-slate-800/80 p-6 shadow-lg transition hover:border-orange-400 hover:bg-slate-700/80"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h2 className="text-lg font-black text-orange-300">{message.subject}</h2>
              <span className="rounded bg-orange-500/10 px-3 py-1 text-xs font-mono text-orange-400/70">
                {new Date(message.created_at).toLocaleString("en-IN")}
              </span>
            </div>
            <p className="mt-3 text-sm font-semibold text-orange-200">
              {message.name} · <span className="text-orange-300">{message.email}</span>
            </p>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-orange-100">
              {message.message}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
