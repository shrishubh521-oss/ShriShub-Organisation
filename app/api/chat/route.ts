import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    }),
  ),
});

const SYSTEM_PROMPT = `You are ShriShubh's AI Assistant, a helpful customer support agent. You answer questions about:
- Pricing and packages
- Project timelines and development process
- Support and maintenance services
- How to contact our team
- General information about our services

You are professional, friendly, and concise. Always encourage users to contact our support team through the Messages page for complex issues.

Context about ShriShubh:
- We build custom websites and web applications
- Pricing ranges from $500-1000 (Starter), $1500-3000 (Professional), and custom enterprise quotes
- Typical timelines: 2-3 weeks (Starter), 4-6 weeks (Professional), 8+ weeks (Enterprise)
- We provide 24/7 support and maintenance
- Our support team responds within 24 hours`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid request format" },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("OPENAI_API_KEY not configured");
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
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          ...parsed.data.messages,
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API error:", error);
      return NextResponse.json(
        { message: "Unable to process your request. Please try again." },
        { status: 500 },
      );
    }

    const data = await response.json();
    const message = data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { message: "An error occurred while processing your request." },
      { status: 500 },
    );
  }
}
