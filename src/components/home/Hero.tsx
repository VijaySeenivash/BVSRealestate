import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone, ShieldCheck, MapPin, CheckCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getPhoneCallUrl } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative min-h-[600px] sm:min-h-[640px] lg:min-h-[720px] flex items-center bg-navy-950 overflow-hidden w-full max-w-full">
      {/* High Quality Real-Estate Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85"
          alt="BVS Real Estate lands and properties in Dindigul"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-70 scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Navy Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/80 to-navy-950/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-black/40" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:py-20 sm:px-6 lg:px-8 w-full min-w-0">
        <div className="max-w-3xl min-w-0">
          {/* Tamil Tagline Trust Pill */}
          <div className="inline-flex items-center gap-2 rounded-full bg-navy-900/90 border border-gold-500/50 px-3.5 sm:px-4 py-1.5 sm:py-2 backdrop-blur-md shadow-xl mb-6 max-w-full">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bvsRed-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-bvsRed-600"></span>
            </span>
            <span className="text-[11px] sm:text-sm font-semibold text-gold-300 tracking-wide truncate">
              {siteConfig.taglineTamil}
            </span>
          </div>

          {/* Main Hero Heading */}
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15] break-words">
            {siteConfig.heroHeading}
          </h1>

          {/* Supporting Text */}
          <p className="mt-4 sm:mt-5 text-sm sm:text-xl text-slate-200 font-normal leading-relaxed max-w-2xl">
            {siteConfig.heroSubheading}
          </p>

          {/* Direct Trust Features */}
          <div className="mt-7 flex flex-wrap gap-y-2.5 gap-x-6 text-xs sm:text-sm font-medium text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-gold-400 flex-shrink-0" />
              <span>Direct Owner Negotiations</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-gold-400 flex-shrink-0" />
              <span>Verified Title Checks</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-gold-400 flex-shrink-0" />
              <span>Plots, Houses & Farm Lands</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 sm:mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5 w-full sm:w-auto">
            <Link
              href="/properties"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 hover:from-gold-600 hover:to-gold-600 px-7 py-4 text-sm font-extrabold text-navy-950 shadow-lg hover:shadow-gold-500/20 active:scale-95 transition-all duration-200"
            >
              <span>Explore Properties</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href={getPhoneCallUrl()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 px-6 py-4 text-sm font-bold text-white backdrop-blur-md active:scale-95 transition-all duration-200"
            >
              <Phone className="h-4 w-4 text-bvsRed-500 animate-pulse" />
              <span>Call ({siteConfig.phone})</span>
            </a>
          </div>

          {/* Trust Highlights Bar */}
          <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
            {siteConfig.trustStats.map((stat, i) => (
              <div key={i} className="space-y-0.5">
                <p className="font-display text-xl sm:text-2xl font-black text-gold-400">
                  {stat.value}
                </p>
                <p className="text-[11px] text-slate-300 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
