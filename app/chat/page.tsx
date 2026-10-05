import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import AIChat from "@/components/AIChat";

export default async function ChatPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="container-page flex h-screen flex-col py-4">
      <div className="mb-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-300">
          Customer portal
        </p>
        <h1 className="text-3xl font-black text-slate-900">AI Support Assistant</h1>
        <p className="mt-1 text-slate-600">
          Get instant help from our AI assistant. Available 24/7.
        </p>
      </div>

      <AIChat />
    </div>
  );
}
