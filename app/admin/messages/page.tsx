import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");
  const { data: messages } = await supabase.from("contact_messages").select("id, name, email, subject, message, created_at").order("created_at", { ascending: false });
  return <div className="container-page py-16"><h1 className="text-4xl font-black">Contact messages</h1><div className="mt-8 space-y-4">{messages?.map((message) => <article key={message.id} className="card p-6"><div className="flex flex-wrap justify-between gap-2"><h2 className="font-black">{message.subject}</h2><span className="text-xs text-slate-500">{new Date(message.created_at).toLocaleString("en-IN")}</span></div><p className="mt-2 text-sm text-yellow-200">{message.name} · {message.email}</p><p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-300">{message.message}</p></article>)}</div></div>;
}
