import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import MessageThread from "@/components/admin/MessageThread";

export default async function AdminMessagesPage() {
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

  const { data: messages } = await supabase
    .from("messages")
    .select("id, user_id, subject, body, reply, replied_at, created_at")
    .order("created_at", { ascending: false });

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in(
      "id",
      (messages ?? []).map((message) => message.user_id),
    );

  const customerNames = Object.fromEntries(
    (profiles ?? []).map((item) => [item.id, item.full_name || "Customer"]),
  );

  const groupedMessages = (messages ?? []).reduce(
    (acc, msg) => {
      const userId = msg.user_id;
      if (!acc[userId]) acc[userId] = [];
      acc[userId].push({
        ...msg,
        customerName: customerNames[msg.user_id] || "Customer",
      });
      return acc;
    },
    {} as Record<string, any[]>,
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
          Admin Panel
        </p>
        <h1 className="mt-2 text-4xl font-black text-slate-900">Customer Messages</h1>
        <p className="mt-2 text-slate-600">Manage customer inquiries and send replies</p>
      </div>

      {Object.keys(groupedMessages).length === 0 ? (
        <div className="card p-8 text-center text-slate-500">
          No customer messages yet.
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedMessages).map(([userId, userMessages]) => (
            <MessageThread
              key={userId}
              userId={userId}
              customerName={userMessages[0]?.customerName ?? "Customer"}
              messages={userMessages}
            />
          ))}
        </div>
      )}
    </div>
  );
}
