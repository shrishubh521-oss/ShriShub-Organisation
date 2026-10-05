import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import CustomerMessageForm from "@/components/forms/CustomerMessageForm";

export default async function MessagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: messages } = await supabase
    .from("messages")
    .select("id, subject, body, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="container-page py-16">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-300">
            Customer portal
          </p>
          <h1 className="mt-2 text-4xl font-black text-slate-900">Messages</h1>
        </div>
        <div className="rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1.5 text-sm font-medium text-yellow-700">
          Project communication
        </div>
      </div>

      <CustomerMessageForm />

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-black text-slate-900">Your conversation</h2>

        {messages && messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message) => (
              <article key={message.id} className="card p-6">
                <div className="flex flex-col gap-3 border-b border-slate-200 pb-3 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-lg font-black text-slate-900">{message.subject}</h3>
                  <span className="text-xs font-medium uppercase tracking-[0.15em] text-slate-500">
                    {new Date(message.created_at).toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                  {message.body}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center text-slate-500">
            No messages yet. Send your first message using the form above.
          </div>
        )}
      </section>
    </div>
  );
}
