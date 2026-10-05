"use client";

import { useState } from "react";
import { Send } from "lucide-react";

interface Message {
  id: string;
  user_id: string;
  subject: string;
  body: string;
  reply: string | null;
  replied_at: string | null;
  created_at: string;
  customerName?: string;
}

export default function MessageThread({
  userId,
  customerName,
  messages,
}: {
  userId: string;
  customerName?: string;
  messages: Message[];
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replies, setReplies] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const latestMessage = messages[0];
  const hasReplied = messages.some((m) => m.reply);

  async function sendReply(messageId: string) {
    const reply = replies[messageId]?.trim();
    if (!reply) return;

    setLoading(true);
    try {
      const response = await fetch("/api/admin/messages/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, reply }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({ message: "Unable to send reply." }));
        throw new Error(data.message || "Unable to send reply.");
      }

      setReplies((prev) => ({ ...prev, [messageId]: "" }));
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Unable to send reply.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card overflow-hidden border-2 border-orange-200/50">
      <div
        className="cursor-pointer bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 hover:from-orange-100 hover:to-amber-100"
        onClick={() => setExpandedId(expandedId === userId ? null : userId)}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-orange-700">{customerName || "Customer"}</p>
            <p className="mt-1 text-slate-600">{latestMessage?.subject}</p>
            <p className="mt-1 text-xs text-slate-500">
              {new Date(latestMessage?.created_at).toLocaleString("en-IN")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {hasReplied ? (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                Replied
              </span>
            ) : (
              <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
                Pending
              </span>
            )}
            <span className="text-2xl text-slate-400">{expandedId === userId ? "▼" : "▶"}</span>
          </div>
        </div>
      </div>

      {expandedId === userId && (
        <div className="space-y-4 border-t-2 border-orange-200/50 px-6 py-4">
          {messages.map((message) => (
            <div key={message.id} className="space-y-3">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">{message.subject}</p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                  {message.body}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  {new Date(message.created_at).toLocaleString("en-IN")}
                </p>
              </div>

              {message.reply && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs font-bold uppercase text-emerald-700">Your reply</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-emerald-900">
                    {message.reply}
                  </p>
                  <p className="mt-2 text-xs text-emerald-600">
                    {message.replied_at ? new Date(message.replied_at).toLocaleString("en-IN") : ""}
                  </p>
                </div>
              )}

              {!message.reply && (
                <div className="space-y-2 rounded-lg border border-orange-200 bg-orange-50 p-4">
                  <p className="text-sm font-semibold text-orange-900">
                    Send a reply to {customerName || "Customer"}
                  </p>
                  <textarea
                    value={replies[message.id] || ""}
                    onChange={(e) =>
                      setReplies((prev) => ({ ...prev, [message.id]: e.target.value }))
                    }
                    className="input min-h-24 resize-y"
                    placeholder="Type your reply here..."
                  />
                  <button
                    onClick={() => sendReply(message.id)}
                    disabled={loading || !replies[message.id]?.trim()}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Send size={16} />
                    {loading ? "Sending..." : "Send Reply"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
