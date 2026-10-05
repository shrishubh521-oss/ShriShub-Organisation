import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().min(1).max(4000),
    }),
  ),
});

const SYSTEM_PROMPT = `You are ShriShubh's AI Assistant, a helpful customer support agent. Answer customer questions about pricing, services, timelines, support, and how to contact the team. Keep responses concise, friendly, and professional. Encourage users to contact support through the Messages page for complex issues.`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid request format" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { message: "AI service is not configured. Please contact our support team." },
        { status: 500 },
      );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...parsed.data.messages],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error("OpenAI API error:", error);
      return NextResponse.json({ message: "Unable to process your request. Please try again." }, { status: 500 });
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content || "I couldn't generate a response right now.";

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ message: "An error occurred while processing your request." }, { status: 500 });
  }
}
