"use client";

import { FormEvent, useState } from "react";

export default function CustomerMessageForm() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    const response = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, message }),
    });

    const data = await response.json().catch(() => ({ message: "Something went wrong." }));
    setLoading(false);

    if (!response.ok) {
      setStatus(data.message ?? "Unable to send your message right now.");
      return;
    }

    setStatus(data.message ?? "Message sent successfully.");
    setSubject("");
    setMessage("");
    window.location.reload();
  }

  return (
    <form onSubmit={submit} className="card p-6">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-500">
          New message
        </p>
        <h2 className="mt-2 text-2xl font-black text-slate-900">Send a message to the team</h2>
      </div>

      <div className="grid gap-5">
        <label className="text-sm font-semibold text-slate-700">
          Subject
          <input
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className="input mt-2"
            placeholder="Project update request"
            required
          />
        </label>

        <label className="text-sm font-semibold text-slate-700">
          Message
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="input mt-2 min-h-36 resize-y"
            placeholder="Tell us what you need help with..."
            required
          />
        </label>
      </div>

      {status && (
        <p className="mt-4 text-sm text-slate-700">{status}</p>
      )}

      <button type="submit" className="btn-primary mt-5" disabled={loading}>
        {loading ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
