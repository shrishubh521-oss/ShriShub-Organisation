"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm ShriShubh's AI Assistant. I'm here to help answer your questions about our services, pricing, timeline, and more. How can I help you today?",
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

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: "assistant",
        content: data.message || "I'm sorry, I couldn't process that. Please try again.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again or contact our support team.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
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
