"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight, Eye, EyeOff, AlertCircle, ShieldCheck, Home, Loader2 } from "lucide-react";
import { Logo } from "@/components/branding/Logo";
import { signInAdmin } from "@/lib/supabase/auth";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if redirected with error or if already logged in
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "unauthorized") {
      setError("Access Denied: That account is not registered in the admin_users authorization table.");
    }

    async function checkExistingSession() {
      if (supabase) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          router.replace("/admin");
        }
      }
    }
    checkExistingSession();
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!isSupabaseConfigured()) {
        // In local demo mode when Supabase credentials aren't set
        setTimeout(() => {
          setLoading(false);
          router.push("/admin");
        }, 500);
        return;
      }

      await signInAdmin(email.trim(), password);
      // Redirect to /admin or custom return URL
      const returnUrl = searchParams.get("redirect") || "/admin";
      router.push(returnUrl);
    } catch (err: any) {
      console.error("[Login Error]:", err);
      setError(err.message || "Invalid email or password. Please verify your credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-7 sm:p-9 border border-slate-200/80 shadow-2xl space-y-6">
      {error && (
        <div className="rounded-2xl bg-red-50 p-4 border border-red-200 flex items-start gap-3 text-xs text-red-800 animate-in fade-in">
          <AlertCircle className="h-4 w-4 text-bvsRed-600 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed font-medium">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Admin Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@bvsrealestate.com"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-navy-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-600/10 transition-all"
              autoComplete="email"
            />
          </div>
        </div>

        {/* Password Field with Show/Hide Toggle */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-11 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-navy-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-600/10 transition-all"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-navy-950 hover:bg-navy-900 active:scale-95 py-3.5 px-5 text-sm font-bold text-white shadow-md transition-all disabled:opacity-50 mt-2"
        >
          <span>{loading ? "Authenticating..." : "Sign In to Admin Panel"}</span>
          <ArrowRight className="h-4 w-4 text-gold-400" />
        </button>
      </form>

      {/* Security & RLS Note */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Supabase Auth & RLS Protected</span>
        </span>

        <Link
          href="/"
          className="inline-flex items-center gap-1 text-slate-600 hover:text-navy-950 font-semibold"
        >
          <Home className="h-3 w-3" />
          <span>Public Site</span>
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-900 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo variant="light" showTagline={false} />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-white">
            Admin Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Sign in to manage lands, properties, and enquiries
          </p>
        </div>

        {/* Login Form wrapped in Suspense boundary for useSearchParams */}
        <Suspense
          fallback={
            <div className="bg-white rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-navy-950" />
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                Loading Secure Portal...
              </p>
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
