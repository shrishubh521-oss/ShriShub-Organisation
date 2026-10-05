"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";

export default function AuthForm({
  mode,
}: {
  mode: "login" | "register";
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const supabase = createClient();

      const result =
        mode === "login"
          ? await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          })
          : await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
              data: {
                full_name: name.trim(),
              },
            },
          });

      if (result.error) {
        setMessage(result.error.message);
        setLoading(false);
        return;
      }

      if (mode === "register" && !result.data.session) {
        setMessage(
          "Account created successfully. Please check your email to confirm your account."
        );
        setLoading(false);
        return;
      }

      const next = searchParams.get("next");

      const destination =
        next && next.startsWith("/")
          ? next
          : "/dashboard";

      router.replace(destination);
      router.refresh();
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="card mx-auto w-full max-w-md p-7"
    >
      <h1 className="text-2xl font-black">
        {mode === "login"
          ? "Welcome back"
          : "Create your ShriShubh account"}
      </h1>

      <p className="mt-2 text-sm text-slate-400">
        {mode === "login"
          ? "Login to manage your projects."
          : "Create an account to start and track projects."}
      </p>

      {mode === "register" && (
        <label className="mt-6 block text-sm font-semibold">
          Full name

          <input
            className="input mt-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
        </label>
      )}

      <label className="mt-5 block text-sm font-semibold">
        Email

        <input
          className="input mt-2"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </label>

      <label className="mt-5 block text-sm font-semibold">
        Password

        <input
          className="input mt-2"
          type="password"
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete={
            mode === "login"
              ? "current-password"
              : "new-password"
          }
        />
      </label>

      {message && (
        <p className="mt-4 rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-3 text-sm text-yellow-200">
          {message}
        </p>
      )}

      <button
        type="submit"
        className="btn-primary mt-6 w-full"
        disabled={loading}
      >
        {loading
          ? "Please wait..."
          : mode === "login"
            ? "Login"
            : "Create account"}
      </button>

      <p className="mt-5 text-center text-sm text-slate-400">
        {mode === "login"
          ? "New here? "
          : "Already have an account? "}

        <Link
          className="font-bold text-yellow-300"
          href={
            mode === "login"
              ? "/register"
              : "/login"
          }
        >
          {mode === "login"
            ? "Register"
            : "Login"}
        </Link>
      </p>
    </form>
  );
}