import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase-server";

const schema = z.object({
  messageId: z.string().uuid(),
  reply: z.string().trim().min(5).max(5000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "Please provide a valid reply." }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ message: "Only admins can send replies." }, { status: 403 });
    }

    const { error } = await supabase
      .from("messages")
      .update({
        reply: parsed.data.reply,
        replied_at: new Date().toISOString(),
      })
      .eq("id", parsed.data.messageId);

    if (error) {
      return NextResponse.json({ message: "Unable to send reply." }, { status: 500 });
    }

    return NextResponse.json({ message: "Reply sent successfully." });
  } catch {
    return NextResponse.json({ message: "Unable to send reply." }, { status: 500 });
  }
}
