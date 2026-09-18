import React from "react";
import Link from "next/link";
import { ShieldCheck, MapPin, PhoneCall, HelpCircle, ArrowRight, MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getGeneralWhatsAppUrl, getPhoneCallUrl } from "@/lib/utils";

export function TrustSection() {
  const pillars = [
    {
      icon: MapPin,
      title: "Dindigul Location Specialists",
      description:
        "Based in East Govindapuram, Dindigul, we offer deep ground-level insight on surrounding access roads, groundwater availability, and residential expansion.",
    },
    {
      icon: ShieldCheck,
      title: "Transparent Property Details",
      description:
        "Every listing features authentic area measurements, clear road access specs, and verifiable document notes directly checked before publication.",
    },
    {
      icon: PhoneCall,
      title: "Direct Owner Communication",
      description:
        `Connect directly with ${siteConfig.contactPerson} via Phone or WhatsApp for honest discussions, price transparency, and scheduled on-site visits.`,
    },
    {
      icon: HelpCircle,
      title: "Zero Exaggerated Claims",
      description:
        "We never publish artificial reviews, fake awards, or unverified claims. You receive straightforward guidance for your land or home purchase.",
    },
  ];

  return (
    <section className="py-20 sm:py-24 bg-navy-950 text-white relative overflow-hidden w-full max-w-full min-w-0">
      {/* Decorative gradient accents */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-96 w-96 rounded-full bg-bvsRed-600/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full min-w-0">
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16 min-w-0">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
            Why Choose BVS Real Estate
          </span>
          <h2 className="mt-2 font-display text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white break-words">
            Honest, Ground-Level Guidance for Dindigul Properties
          </h2>
          <p className="mt-4 text-sm sm:text-lg text-slate-300 leading-relaxed">
            Purchasing land or property is an important milestone. We ensure every step of your enquiry is handled with clarity, local integrity, and direct accessibility.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full min-w-0">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="group rounded-3xl bg-navy-900/80 border border-navy-800/90 p-6 sm:p-7 backdrop-blur-sm transition-all duration-300 hover:border-gold-500/50 hover:-translate-y-1.5 hover:shadow-xl min-w-0"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-800 text-gold-400 mb-5 ring-1 ring-gold-500/30 group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-2">{pillar.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{pillar.description}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Consultation Banner */}
        <div className="mt-12 sm:mt-16 rounded-3xl bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border border-navy-700/80 p-6 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 shadow-2xl w-full min-w-0">
          <div className="w-full min-w-0 md:w-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-gold-400">
              Personalized Assistance
            </span>
            <h3 className="mt-1.5 font-display text-xl sm:text-3xl font-black text-white break-words">
              Looking for a specific plot, house, or farm land?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Share your preferred locality in Dindigul, budget range, and space requirements directly with Banumathi B.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-3.5 w-full md:w-auto flex-shrink-0">
            <a
              href={getPhoneCallUrl()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white text-navy-950 hover:bg-slate-100 active:scale-95 px-6 sm:px-7 py-3.5 sm:py-4 text-xs font-extrabold shadow-lg transition-all"
            >
              <PhoneCall className="h-4 w-4 text-bvsRed-600" />
              <span>Call Banumathi B</span>
            </a>

            <a
              href={getGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white px-6 sm:px-7 py-3.5 sm:py-4 text-xs font-extrabold shadow-lg transition-all"
            >
              <MessageCircle className="h-4 w-4 fill-white text-transparent" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
