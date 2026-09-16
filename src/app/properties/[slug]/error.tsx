"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, ArrowLeft, Phone, MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getGeneralWhatsAppUrl, getPhoneCallUrl } from "@/lib/utils";

export default function PropertyDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Property Detail Error]:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4 py-16">
      <div className="max-w-md w-full rounded-3xl bg-white p-8 sm:p-10 border border-slate-200/90 shadow-xl text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-8 ring-amber-50/50">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Property Loading Notice
          </span>
          <h2 className="font-display text-2xl font-black text-navy-950 mt-1">
            Unable to Load Property Details
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            The requested property could not be loaded from the database right now. It might have been updated or moved.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-navy-950 hover:bg-navy-900 text-white py-3.5 px-5 text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <RotateCcw className="h-4 w-4 text-gold-400" />
            <span>Retry Loading</span>
          </button>

          <Link
            href="/properties"
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 py-3.5 px-5 text-xs font-bold border border-slate-200 transition-all"
          >
            <ArrowLeft className="h-4 w-4 text-slate-600" />
            <span>Browse All Properties</span>
          </Link>
        </div>

        <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
          <p className="font-semibold text-navy-950 mb-2">Speak directly with Banumathi B:</p>
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
