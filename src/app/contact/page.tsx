import React from "react";
import { Metadata } from "next";
import {
  Phone,
  MessageCircle,
  MapPin,
  User,
  Clock,
  Mail,
  ExternalLink,
  ShieldCheck,
  Compass,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { getGeneralWhatsAppUrl, getPhoneCallUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact Us | BVS Real Estate Dindigul",
  description:
    "Get in touch with Banumathi B at BVS Real Estate in East Govindapuram, Dindigul for lands, houses, plots, and agricultural properties.",
};

export default function ContactPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-bvsRed-600">
            Direct & Transparent Communication
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-black text-navy-950 tracking-tight mt-1.5">
            Contact BVS Real Estate
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Have questions about a property in Dindigul, want to schedule a physical site inspection, or have land to sell? Reach out directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (7 cols): Direct Contact Information */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-7 sm:p-10 border border-slate-200/90 shadow-md space-y-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gold-600">
                  Business Entity
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-black text-navy-950 mt-1">
                  {siteConfig.businessName}
                </h2>
                <p className="text-xs text-gold-700 font-semibold mt-1">
                  {siteConfig.taglineTamil}
                </p>
              </div>

              {/* Contact Person */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-100 text-navy-900 flex-shrink-0">
                  <User className="h-6 w-6 text-bvsRed-600" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                    Authorized Representative
                  </span>
                  <span className="font-display text-lg font-black text-navy-950">
                    {siteConfig.contactPerson}
                  </span>
                  <span className="text-xs text-slate-500 block">
                    Proprietor / Real Estate Specialist
                  </span>
                </div>
              </div>

              {/* Phone & WhatsApp */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900 flex-shrink-0">
                  <Phone className="h-6 w-6 text-emerald-700" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                    Direct Phone / WhatsApp
                  </span>
                  <a
                    href={getPhoneCallUrl()}
                    className="font-display text-2xl font-black text-navy-950 hover:text-navy-700 block transition-colors"
                  >
                    {siteConfig.phoneFormatted}
                  </a>
                  <span className="text-xs text-slate-500 block font-medium">
                    {siteConfig.workingHours}
                  </span>
                </div>
              </div>

              {/* Physical Office Address */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-100 text-navy-900 flex-shrink-0">
                  <MapPin className="h-6 w-6 text-navy-800" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                    Office Location
                  </span>
                  <address className="not-italic text-sm text-slate-800 leading-relaxed font-semibold">
                    {siteConfig.address.street},<br />
                    {siteConfig.address.landmark},<br />
                    {siteConfig.address.locality},<br />
                    {siteConfig.address.city} - 01, Tamil Nadu, India
                  </address>
                </div>
              </div>

              {/* Official Email Placeholder */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 flex-shrink-0">
                  <Mail className="h-6 w-6 text-slate-500" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                    Official Email
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-600">
                    {siteConfig.email}
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <a
                  href={getPhoneCallUrl()}
                  className="flex items-center justify-center gap-2.5 rounded-2xl bg-navy-950 hover:bg-navy-900 active:scale-95 py-4 px-5 text-sm font-bold text-white shadow-md transition-all min-h-[48px]"
                >
                  <Phone className="h-4 w-4 text-bvsRed-500 animate-pulse" />
                  <span>Call {siteConfig.phone}</span>
                </a>

                <a
                  href={getGeneralWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 py-4 px-5 text-sm font-bold text-white shadow-md transition-all min-h-[48px]"
                >
                  <MessageCircle className="h-4 w-4 fill-white text-transparent" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Map & Local Service Areas */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-7 sm:p-9 border border-slate-200/90 shadow-md space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-bvsRed-600">
                  Location Map
                </span>
                <h3 className="font-display text-2xl font-black text-navy-950 mt-1">
                  East Govindapuram, Dindigul
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Near Aavin Palpannai on Anjugam 2nd Street.
                </p>
              </div>

              {/* Stylized Google Maps Directions Card */}
              <div className="rounded-2xl border border-slate-200 bg-slate-100/90 p-8 text-center flex flex-col items-center justify-center min-h-[260px] space-y-3">
                <div className="h-14 w-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-bvsRed-600">
                  <MapPin className="h-7 w-7" />
                </div>
                <h4 className="font-display text-base font-bold text-navy-950">
                  Near Aavin Palpannai
                </h4>
                <p className="text-xs text-slate-600 max-w-xs leading-relaxed">
                  East Govindapuram, Dindigul - 624001, Tamil Nadu, India.
                </p>

                <a
                  href={siteConfig.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-navy-950 hover:bg-navy-900 text-white px-5 py-3 text-xs font-bold shadow-md transition-all"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* Service Areas */}
              <div className="pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
                  Key Service Areas in Dindigul
                </span>
                <div className="flex flex-wrap gap-2">
                  {siteConfig.serviceAreas.map((area) => (
                    <span
                      key={area}
                      className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 border border-slate-200"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
