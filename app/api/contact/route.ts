import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase-server";

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(2).max(150),
  message: z.string().min(5).max(5000),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ message: "Please check your form details." }, { status: 400 });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await supabase.from("contact_messages").insert({ ...parsed.data, user_id: user?.id ?? null });
  if (error) return NextResponse.json({ message: "Unable to send your message right now." }, { status: 500 });
  return NextResponse.json({ message: "Message sent successfully. We will get back to you." });
}
