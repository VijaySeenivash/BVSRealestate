"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home, Phone, MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getGeneralWhatsAppUrl, getPhoneCallUrl } from "@/lib/utils";

export default function PropertiesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Properties Page Database Error]:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4 py-16">
      <div className="max-w-md w-full rounded-3xl bg-white p-8 sm:p-10 border border-slate-200/90 shadow-xl text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-bvsRed-600 ring-8 ring-red-50/50">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-bvsRed-600">
            Database Connection Notice
          </span>
          <h2 className="font-display text-2xl font-black text-navy-950 mt-1">
            Unable to Load Properties
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            We encountered a temporary issue querying the property database. This might happen if network connectivity is interrupted or if database credentials are being updated.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-navy-950 hover:bg-navy-900 text-white py-3.5 px-5 text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <RotateCcw className="h-4 w-4 text-gold-400" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 py-3.5 px-5 text-xs font-bold border border-slate-200 transition-all"
          >
            <Home className="h-4 w-4 text-slate-600" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Direct Contact fallback */}
        <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
          <p className="font-semibold text-navy-950 mb-2">Need immediate property assistance?</p>
          <div className="flex items-center justify-center gap-3">
            <a
              href={getPhoneCallUrl()}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-bvsRed-600 hover:underline"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Call ({siteConfig.phone})</span>
            </a>
            <span className="text-slate-300">•</span>
            <a
              href={getGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:underline"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
