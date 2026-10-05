import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: messages } = await supabase.from("messages").select("id, subject, body, created_at").eq("user_id", user.id).order("created_at", { ascending: false });
  return <div className="container-page py-16"><h1 className="text-4xl font-black">Messages</h1><p className="mt-2 text-slate-400">Project communication from ShriShubh.</p><div className="mt-10 space-y-4">{messages?.length ? messages.map((message) => <article key={message.id} className="card p-6"><h2 className="font-black">{message.subject}</h2><p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-300">{message.body}</p><p className="mt-4 text-xs text-slate-500">{new Date(message.created_at).toLocaleString("en-IN")}</p></article>) : <div className="card p-7 text-slate-400">No messages yet.</div>}</div></div>;
}
