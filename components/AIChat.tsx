"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const AI_RESPONSES: Record<string, string> = {
  pricing: `Our pricing is flexible and transparent. We offer:

• Starter: $500-1000 for basic website
• Professional: $1500-3000 for advanced features
• Enterprise: Custom quotes for large projects

Each package includes support and updates. Contact our sales team for a detailed quote.`,
  
  timeline: `Project timelines typically range from:

• Starter: 2-3 weeks
• Professional: 4-6 weeks
• Enterprise: 8+ weeks

Timeline depends on project complexity and your requirements. We'll discuss specifics during the initial consultation.`,
  
  process: `Our development process follows these steps:

1. Discovery & Requirements (Week 1)
2. Design & Mockups (Week 2)
3. Development (Weeks 3-4)
4. Testing & Refinement (Week 5)
5. Launch & Support (Week 6+)

We keep you updated throughout each phase.`,
  
  support: `We provide comprehensive support including:

• Email support within 24 hours
• Bug fixes and maintenance
• Feature updates and enhancements
• Annual hosting and security updates
• Dedicated account manager for enterprise clients

Contact our support team anytime through the Messages section.`,
  
  contact: `Need to reach our team? Here are your options:

• Messages: Use the Messages page to contact our support team
• Email: support@shrishubh.com
• Portal: Access your projects and order status from your dashboard

We respond to all inquiries within 24 hours.`,
  
  default: `I'm here to help! I can answer questions about:

• Pricing and packages
• Project timeline and process
• Our development workflow
• Support and maintenance
• How to contact our team

Try asking about any of these topics, or feel free to ask something else!`,
};

function findBestResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  if (
    lowerMessage.includes("price") ||
    lowerMessage.includes("cost") ||
    lowerMessage.includes("payment")
  ) {
    return AI_RESPONSES.pricing;
  }

  if (
    lowerMessage.includes("how long") ||
    lowerMessage.includes("timeline") ||
    lowerMessage.includes("schedule")
  ) {
    return AI_RESPONSES.timeline;
  }

  if (
    lowerMessage.includes("process") ||
    lowerMessage.includes("how do you") ||
    lowerMessage.includes("workflow")
  ) {
    return AI_RESPONSES.process;
  }

  if (
    lowerMessage.includes("support") ||
    lowerMessage.includes("help") ||
    lowerMessage.includes("maintenance")
  ) {
    return AI_RESPONSES.support;
  }

  if (
    lowerMessage.includes("contact") ||
    lowerMessage.includes("reach") ||
    lowerMessage.includes("email")
  ) {
    return AI_RESPONSES.contact;
  }

  return AI_RESPONSES.default;
}

export default function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: AI_RESPONSES.default,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Simulate a small delay for natural feel
    await new Promise((resolve) => setTimeout(resolve, 500));

    const aiResponse = findBestResponse(input);

    const assistantMessage: ChatMessage = {
      id: `msg-${Date.now()}-ai`,
      role: "assistant",
      content: aiResponse,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setLoading(false);
  }

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-hidden rounded-xl border-2 border-yellow-200 bg-gradient-to-b from-yellow-50 to-white">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs rounded-lg px-4 py-3 ${
                message.role === "user"
                  ? "bg-yellow-300 text-slate-900"
                  : "border border-yellow-200 bg-yellow-50 text-slate-900"
              }`}
            >
              <p className="whitespace-pre-wrap text-sm leading-5">
                {message.content}
              </p>
              <p className="mt-1 text-xs opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="border border-yellow-200 bg-yellow-50 rounded-lg px-4 py-3 flex items-center gap-2 text-slate-900">
              <Loader size={16} className="animate-spin" />
              <span className="text-sm">AI is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="border-t border-yellow-200 p-4"
      >
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about our services..."
            className="input flex-1"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-primary flex items-center gap-2"
          >
            <Send size={16} />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </form>
    </div>
  );
}
