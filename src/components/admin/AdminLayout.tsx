"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  User,
  ChevronRight,
} from "lucide-react";
import { Logo } from "@/components/branding/Logo";
import { signOutAdmin } from "@/lib/supabase/auth";
import { supabase } from "@/lib/supabase/client";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      if (supabase) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setUserEmail(user.email || null);
        }
      }
    }
    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await signOutAdmin();
      router.push("/admin/login");
    } catch (err) {
      console.error("Logout error:", err);
      router.push("/admin/login");
    }
  };

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Properties",
      href: "/admin/properties",
      icon: Building2,
      exact: false,
    },
    {
      label: "Add Property",
      href: "/admin/properties/new",
      icon: PlusCircle,
      exact: true,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <header className="md:hidden bg-navy-950 text-white px-4 py-3 flex items-center justify-between border-b border-navy-850 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="font-display font-black text-bvsRed-500 text-lg">BVS</span>
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Admin Panel
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-navy-900"
          aria-label="Toggle admin menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Sidebar Navigation (Desktop) & Drawer (Mobile) */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-navy-950 text-slate-300 flex flex-col justify-between p-5 border-r border-navy-900 transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Top: Logo & System Title */}
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-navy-900">
            <Logo variant="light" showTagline={false} />
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 px-2 py-2 rounded-xl bg-navy-900/60 border border-navy-800/80 flex items-center gap-2.5 text-xs text-slate-300">
            <div className="h-7 w-7 rounded-lg bg-navy-800 flex items-center justify-center text-gold-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="truncate">
              <span className="block text-[10px] font-bold text-slate-400 uppercase">
                Authorized Admin
              </span>
              <span className="block font-semibold text-white truncate max-w-[140px]">
                {userEmail || "Administrator"}
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="mt-6 space-y-1.5" aria-label="Admin Navigation">
            {navItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-gold-500 text-navy-950 shadow-md shadow-gold-500/20"
                      : "text-slate-300 hover:bg-navy-900 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`h-4 w-4 ${isActive ? "text-navy-950" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 text-navy-950" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions: View Public Website & Logout */}
        <div className="pt-4 border-t border-navy-900 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-navy-900 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <ExternalLink className="h-4 w-4" />
              <span>Public Website</span>
            </div>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Canvas */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
