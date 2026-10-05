"use client";

import { FormEvent, Suspense, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { services } from "@/lib/pricing";

function OrderBuilderForm() {
  const params = useSearchParams();
  const router = useRouter();

  const initialService = params.get("service") ?? services[0].title;

  const [service, setService] = useState(initialService);
  const [details, setDetails] = useState("");
  const [timeline, setTimeline] = useState("Standard");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const selected = useMemo(
    () =>
      services.find((item) => item.title === service) ??
      services[0],
    [service]
  );

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const supabase = createClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        setMessage(userError.message);
        setLoading(false);
        return;
      }

      if (!user) {
        const nextUrl = `/order?service=${encodeURIComponent(
          selected.title
        )}`;

        router.push(`/login?next=${encodeURIComponent(nextUrl)}`);
        return;
      }

      const { data, error } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          service_type: selected.title,
          requirements: details.trim(),
          timeline,
          quoted_price: selected.price,
          status: "pending",
        })
        .select("id")
        .single();

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      if (!data?.id) {
        setMessage("The project could not be created. Please try again.");
        setLoading(false);
        return;
      }

      router.push(`/contract?order=${data.id}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="card p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="text-sm font-semibold">
            Service
          </label>

          <select
            className="input mt-2"
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            {services.map((item) => (
              <option key={item.id} value={item.title}>
                {item.title}
              </option>
            ))}
          </select>

          <div className="mt-5 rounded-2xl border border-yellow-300/15 bg-yellow-300/5 p-5">
            <div className="text-sm text-slate-400">
              Starting fixed price
            </div>

            <div className="mt-1 text-3xl font-black">
              ₹{selected.price.toLocaleString("en-IN")}
            </div>

            <div className="mt-2 text-xs text-slate-500">
              Final scope is confirmed before development begins.
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold">
            Preferred timeline
          </label>

          <select
            className="input mt-2"
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
          >
            <option value="Standard">Standard</option>
            <option value="Priority">Priority</option>
            <option value="Flexible">Flexible</option>
          </select>

          <label className="mt-5 block text-sm font-semibold">
            Requirements

            <textarea
              className="input mt-2 min-h-52 resize-y"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Tell us about pages, features, design style, products, login, payment, dashboard, integrations, etc."
              required
              minLength={10}
            />
          </label>
        </div>
      </div>

      {message && (
        <p className="mt-5 rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-sm text-red-200">
          {message}
        </p>
      )}

      <button
        type="submit"
        className="btn-primary mt-6 w-full md:w-auto"
        disabled={loading}
      >
        {loading
          ? "Creating project..."
          : "Continue to contract"}
      </button>
    </form>
  );
}

export default function OrderBuilder() {
  return (
    <Suspense
      fallback={
        <div className="card p-6 text-slate-400">
          Loading project builder...
        </div>
      }
    >
      <OrderBuilderForm />
    </Suspense>
  );
}