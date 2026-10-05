import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase-server";

const schema = z.object({
  subject: z.string().trim().min(2).max(150),
  message: z.string().trim().min(5).max(5000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Please provide a valid subject and message." },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { message: "Please sign in before sending a message." },
        { status: 401 },
      );
    }

    const { error } = await supabase.from("messages").insert({
      user_id: user.id,
      subject: parsed.data.subject,
      body: parsed.data.message,
    });

    if (error) {
      return NextResponse.json(
        { message: "Unable to send your message right now." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Your message has been sent successfully.",
    });
  } catch {
    return NextResponse.json(
      { message: "Unable to send your message right now." },
      { status: 500 },
    );
  }
}
