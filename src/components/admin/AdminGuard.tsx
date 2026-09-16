"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { checkIsAdmin } from "@/lib/supabase/auth";
import { ShieldAlert, Loader2 } from "lucide-react";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function verifyAuth() {
      // If Supabase is not configured yet, allow demo navigation with a persistent warning
      if (!isSupabaseConfigured() || !supabase) {
        if (isMounted) {
          setAuthorized(true);
          setLoading(false);
        }
        return;
      }

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          if (isMounted) {
            setAuthorized(false);
            setLoading(false);
            router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
          }
          return;
        }

        // Verify user against admin_users table
        const isAdmin = await checkIsAdmin(session.user.id);
        if (!isAdmin) {
          if (isMounted) {
            setAuthorized(false);
            setLoading(false);
            // Sign out unauthorized user and redirect
            await supabase.auth.signOut();
            router.replace("/admin/login?error=unauthorized");
          }
          return;
        }

        if (isMounted) {
          setAuthorized(true);
          setLoading(false);
        }
      } catch (err) {
        console.error("[AdminGuard] Verification error:", err);
        if (isMounted) {
          setAuthorized(false);
          setLoading(false);
          router.replace("/admin/login");
        }
      }
    }

    verifyAuth();

    // Listen for auth state changes (e.g. user signs out)
    const {
      data: { subscription },
    } = supabase
      ? supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === "SIGNED_OUT" || !session) {
            if (isMounted) {
              setAuthorized(false);
              router.replace("/admin/login");
            }
          }
        })
      : { data: { subscription: { unsubscribe: () => {} } } };

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-gold-400" />
          <p className="text-xs font-bold uppercase tracking-widest text-slate-300">
            Verifying Admin Credentials...
          </p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
