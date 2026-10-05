"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
      setLoading(false);
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function logout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    setUser(null);
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="container-page flex min-h-20 items-center justify-between gap-6">

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center">
          <img
            src="/logo.png"
            alt="ShriShubh"
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Main Navigation */}
        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-700 lg:flex">
          <Link
            href="/services"
            className="transition hover:text-yellow-600"
          >
            Services
          </Link>

          <Link
            href="/pricing"
            className="transition hover:text-yellow-600"
          >
            Pricing
          </Link>

          <Link
            href="/how-it-works"
            className="transition hover:text-yellow-600"
          >
            How it works
          </Link>

          <Link
            href="/about"
            className="transition hover:text-yellow-600"
          >
            About
          </Link>

          <Link
            href="/contact"
            className="transition hover:text-yellow-600"
          >
            Contact
          </Link>
        </nav>

        {/* Authentication */}
        <div className="flex items-center gap-3">

          {loading ? (
            <div className="h-10 w-24 animate-pulse rounded-xl bg-slate-100" />
          ) : user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:block"
              >
                Dashboard
              </Link>

              <Link
                href="/messages"
                className="hidden rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:block"
              >
                Messages
              </Link>

              <button
                onClick={logout}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-sm font-semibold text-slate-700 transition hover:text-yellow-600 sm:block"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-yellow-300 hover:shadow-md"
              >
                Start a project
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}