"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { LogOut, LayoutDashboard, MessageSquare, Shield } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchUserRole(userId: string) {
    const supabase = createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    return profile?.role ?? null;
  }

  useEffect(() => {
    const supabase = createClient();

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user);
        setUserRole(await fetchUserRole(user.id));
      } else {
        setUser(null);
        setUserRole(null);
      }

      setLoading(false);
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);

      if (nextUser) {
        setUserRole(await fetchUserRole(nextUser.id));
      } else {
        setUserRole(null);
      }

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
    setUserRole(null);
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md">
      <div className="container-page flex min-h-20 items-center justify-between gap-6">
        <Link href="/" className="flex shrink-0 items-center">
          <img src="/logo.png" alt="ShriShubh" className="h-12 w-auto object-contain" />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-200 lg:flex">
          <Link href="/services" className="transition hover:text-yellow-400">Services</Link>
          <Link href="/pricing" className="transition hover:text-yellow-400">Pricing</Link>
          <Link href="/how-it-works" className="transition hover:text-yellow-400">How it works</Link>
          <Link href="/about" className="transition hover:text-yellow-400">About</Link>
          <Link href="/contact" className="transition hover:text-yellow-400">Contact</Link>
        </nav>

        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-10 w-24 animate-pulse rounded-xl bg-slate-800" />
          ) : user ? (
            <>
              {userRole === "admin" && (
                <Link
                  href="/admin"
                  className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-yellow-300 transition hover:bg-yellow-300/10 sm:flex"
                  title="Admin Portal"
                >
                  <Shield size={16} />
                  Admin
                </Link>
              )}

              <Link
                href="/dashboard"
                className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 sm:flex"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>

              <Link
                href="/messages"
                className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 sm:flex"
              >
                <MessageSquare size={16} />
                Messages
              </Link>

              <button
                onClick={logout}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-red-500/50 hover:bg-red-500/10"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden text-sm font-semibold text-slate-200 transition hover:text-yellow-400 sm:block">Login</Link>
              <Link href="/register" className="rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-yellow-300 hover:shadow-md">Start a project</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
