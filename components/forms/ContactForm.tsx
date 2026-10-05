"use client";

import { FormEvent, useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });
    const data = await response.json();
    setLoading(false);
    setStatus(data.message ?? "Something went wrong.");
    if (response.ok) event.currentTarget.reset();
  }

  return (
    <form onSubmit={submit} className="card p-6">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-semibold">Name<input name="name" className="input mt-2" required /></label>
        <label className="text-sm font-semibold">Email<input name="email" type="email" className="input mt-2" required /></label>
      </div>
      <label className="mt-5 block text-sm font-semibold">Subject<input name="subject" className="input mt-2" required /></label>
      <label className="mt-5 block text-sm font-semibold">Message<textarea name="message" className="input mt-2 min-h-36 resize-y" required /></label>
      {status && <p className="mt-4 text-sm text-yellow-200">{status}</p>}
      <button className="btn-primary mt-5" disabled={loading}>{loading ? "Sending..." : "Send message"}</button>
    </form>
  );
}
