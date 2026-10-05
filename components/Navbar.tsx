
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { LogOut, LayoutDashboard, MessageSquare, Shield, MessageCircle } from "lucide-react";

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
      .single();

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
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="container-page flex min-h-20 items-center justify-between gap-6">
        <Link href="/" className="flex shrink-0 items-center">
          <img src="/logo.png" alt="ShriShubh" className="h-12 w-auto object-contain" />
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-700 lg:flex">
          <Link href="/services" className="transition hover:text-yellow-600">Services</Link>
          <Link href="/pricing" className="transition hover:text-yellow-600">Pricing</Link>
          <Link href="/how-it-works" className="transition hover:text-yellow-600">How it works</Link>
          <Link href="/about" className="transition hover:text-yellow-600">About</Link>
          <Link href="/contact" className="transition hover:text-yellow-600">Contact</Link>
        </nav>

        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-10 w-24 animate-pulse rounded-xl bg-slate-100" />
          ) : user ? (
            <>
              {userRole === "admin" && (
                <Link
                  href="/admin"
                  className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-50 sm:flex"
                  title="Admin Portal"
                >
                  <Shield size={16} />
                  Admin
                </Link>
              )}

              <Link
                href="/dashboard"
                className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:flex"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>

              <Link
                href="/messages"
                className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:flex"
              >
                <MessageSquare size={16} />
                Messages
              </Link>

              <Link
                href="/chat"
                className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 sm:flex"
              >
                <MessageCircle size={16} />
                AI Chat
              </Link>

              <button
                onClick={logout}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden text-sm font-semibold text-slate-700 transition hover:text-yellow-600 sm:block">Login</Link>
              <Link href="/register" className="rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-yellow-300 hover:shadow-md">Start a project</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
