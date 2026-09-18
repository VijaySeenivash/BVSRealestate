"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, MessageCircle, Menu, X, ArrowRight, MapPin, Clock } from "lucide-react";
import { Logo } from "@/components/branding/Logo";
import { siteConfig } from "@/config/site";
import { getGeneralWhatsAppUrl, getPhoneCallUrl, cn } from "@/lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Top Utility Header (Desktop & Tablet) */}
      <div className="hidden sm:block bg-navy-950 text-slate-300 text-xs border-b border-navy-900/60 py-2">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Office Address & Hours */}
          <div className="flex items-center gap-4 text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3 text-gold-400 flex-shrink-0" />
              <span>Near Aavin Palpannai, East Govindapuram, Dindigul - 01</span>
            </div>
            <span className="text-navy-700">•</span>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock className="h-3 w-3 text-gold-400 flex-shrink-0" />
              <span>{siteConfig.workingHours}</span>
            </div>
          </div>

          {/* Right: Contact Person & Direct Phone */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400">
              Contact: <strong className="text-white font-semibold">{siteConfig.contactPerson}</strong>
            </span>
            <span className="text-navy-700">•</span>
            <a
              href={getPhoneCallUrl()}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-gold-400 hover:text-gold-300 transition-colors"
            >
              <Phone className="h-3 w-3 text-bvsRed-500" />
              <span>{siteConfig.phoneFormatted}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200/80 py-2.5"
            : "bg-white/90 backdrop-blur-sm border-b border-slate-100 py-3.5"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 w-full min-w-0">
          {/* Brand Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5" aria-label="Main Navigation">
            {siteConfig.navLinks.map((link) => {
              const isActive =
                pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200",
                    isActive
                      ? "text-navy-950 bg-navy-50/80 font-bold"
                      : "text-slate-600 hover:text-navy-950 hover:bg-slate-100/80"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-gold-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Direct Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Direct Call Button with phone-link */}
            <a
              href={getPhoneCallUrl()}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-navy-950 bg-slate-100 hover:bg-slate-200/90 active:scale-95 rounded-xl transition-all border border-slate-200 shadow-sm"
              title={`Call ${siteConfig.contactPerson}: ${siteConfig.phone}`}
            >
              <Phone className="h-3.5 w-3.5 text-bvsRed-600 animate-pulse" />
              <span>{siteConfig.phone}</span>
            </a>

            {/* WhatsApp Quick Chat */}
            <a
              href={getGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl shadow-sm hover:shadow transition-all"
              title="Chat with BVS Real Estate on WhatsApp"
            >
              <MessageCircle className="h-3.5 w-3.5 fill-white text-transparent" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2 flex-shrink-0">
            <a
              href={getPhoneCallUrl()}
              className="p-2.5 text-navy-900 bg-slate-100 active:bg-slate-200 rounded-xl"
              aria-label={`Call BVS Real Estate at ${siteConfig.phone}`}
            >
              <Phone className="h-4 w-4 text-bvsRed-600" />
            </a>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 text-slate-700 hover:text-navy-950 rounded-xl hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-gold-500"
              aria-label="Toggle Navigation Menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 shadow-2xl animate-in slide-in-from-top-2 duration-200 w-full max-w-full overflow-hidden">
            <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
              {siteConfig.navLinks.map((link) => {
                const isActive =
                  pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition-colors min-h-[48px]",
                      isActive
                        ? "text-navy-950 bg-navy-50 font-bold border-l-4 border-gold-500"
                        : "text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Contact CTAs */}
            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">
              <a
                href={getPhoneCallUrl()}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-slate-100 text-navy-950 active:bg-slate-200 border border-slate-200 min-h-[48px]"
              >
                <Phone className="h-4 w-4 text-bvsRed-600" />
                <span>Call Now</span>
              </a>

              <a
                href={getGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-emerald-600 text-white shadow-sm active:bg-emerald-700 min-h-[48px]"
              >
                <MessageCircle className="h-4 w-4 fill-white text-transparent" />
                <span>WhatsApp</span>
              </a>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <p className="text-xs text-slate-700 font-semibold">
                {siteConfig.contactPerson} • {siteConfig.address.locality}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {siteConfig.workingHours}
              </p>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
