"use client";

import React from "react";
import { Phone, MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getGeneralWhatsAppUrl, getPhoneCallUrl } from "@/lib/utils";

export function FloatingContact() {
  return (
    <aside
      aria-label="Quick mobile contact actions"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 px-4 py-3 sm:hidden shadow-2xl"
    >
      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
        <a
          href={getPhoneCallUrl()}
          className="flex items-center justify-center gap-2 rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 py-3 px-3 text-xs font-black text-navy-950 border border-slate-300/80 shadow-sm min-h-[48px]"
          aria-label={`Call Banumathi B at ${siteConfig.phone}`}
        >
          <Phone className="h-4 w-4 text-bvsRed-600 animate-pulse" />
          <span>Call Now</span>
        </a>

        <a
          href={getGeneralWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 py-3 px-3 text-xs font-black text-white shadow-md min-h-[48px]"
          aria-label="Chat with BVS Real Estate on WhatsApp"
        >
          <MessageCircle className="h-4 w-4 fill-white text-transparent" />
          <span>WhatsApp</span>
        </a>
      </div>
    </aside>
  );
}
