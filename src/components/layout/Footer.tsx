import React from "react";
import Link from "next/link";
import { Phone, MessageCircle, MapPin, Compass, ShieldCheck, Clock, ArrowRight } from "lucide-react";
import { Logo } from "@/components/branding/Logo";
import { siteConfig } from "@/config/site";
import { getGeneralWhatsAppUrl, getPhoneCallUrl } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-navy-900">
      {/* Top Banner / Trust Bar */}
      <div className="border-b border-navy-900/80 bg-navy-900/40 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-800 text-gold-400 ring-1 ring-gold-500/20">
                <Compass className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-display text-sm font-bold text-white">Local Dindigul Presence</h4>
                <p className="text-xs text-slate-400 mt-0.5">East Govindapuram, Palani Road & bypass sites</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-800 text-gold-400 ring-1 ring-gold-500/20">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-display text-sm font-bold text-white">Direct & Transparent</h4>
                <p className="text-xs text-slate-400 mt-0.5">Verified titles with direct owner negotiation</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-800 text-gold-400 ring-1 ring-gold-500/20">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-display text-sm font-bold text-white">Direct Access</h4>
                <p className="text-xs text-slate-400 mt-0.5">{siteConfig.workingHours}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Brand & Identity */}
          <div className="space-y-4">
            <Logo variant="light" showTagline={false} />
            <p className="text-xs sm:text-sm text-gold-300 font-semibold leading-relaxed">
              {siteConfig.taglineTamil}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              BVS Real Estate helps customers explore lands, houses, commercial sites, and agricultural properties in and around Dindigul with authentic local guidance.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={getPhoneCallUrl()}
                className="inline-flex items-center gap-2 rounded-xl bg-navy-900 hover:bg-navy-850 px-4 py-2.5 text-xs font-bold text-white transition-all border border-navy-700/80 shadow-sm"
              >
                <Phone className="h-3.5 w-3.5 text-bvsRed-500" />
                <span>Call Us</span>
              </a>
              <a
                href={getGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white transition-all shadow-sm"
              >
                <MessageCircle className="h-3.5 w-3.5 fill-white text-transparent" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-widest text-gold-400">
              Quick Navigation
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {siteConfig.navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/admin"
                  className="text-xs text-slate-400 hover:text-slate-300 transition-colors pt-2 inline-block"
                >
                  Admin Portal Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Property Types */}
          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-widest text-gold-400">
              Property Categories
            </h3>
            <ul className="mt-5 space-y-2.5 text-sm text-slate-300">
              {siteConfig.propertyTypes.map((type) => (
                <li key={type.id}>
                  <Link
                    href={`/properties?property_type=${encodeURIComponent(type.id)}`}
                    className="hover:text-white transition-colors"
                  >
                    {type.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Office Info */}
          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-widest text-gold-400">
              Office & Contact
            </h3>
            <div className="mt-5 space-y-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Representative:</span>
                <span className="text-sm font-bold text-white">{siteConfig.contactPerson}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Phone / WhatsApp:</span>
                <a
                  href={getPhoneCallUrl()}
                  className="text-base font-black text-gold-400 hover:underline block mt-0.5"
                >
                  {siteConfig.phoneFormatted}
                </a>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-bvsRed-500 mt-0.5 flex-shrink-0" />
                <address className="not-italic text-slate-300 leading-relaxed font-medium">
                  {siteConfig.address.street},<br />
                  {siteConfig.address.landmark},<br />
                  {siteConfig.address.locality},<br />
                  {siteConfig.address.city} - 01, Tamil Nadu
                </address>
              </div>

              <div>
                <a
                  href={siteConfig.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 underline underline-offset-4"
                >
                  <span>Open in Google Maps</span>
                  <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 border-t border-navy-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} {siteConfig.businessName}. All rights reserved.
          </p>
          <p className="text-slate-400">
            Dindigul, Tamil Nadu, India • Managed by Banumathi B
          </p>
        </div>
      </div>
    </footer>
  );
}
