import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  Compass,
  MapPin,
  Phone,
  MessageCircle,
  FileCheck2,
  Users,
  Building,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { getGeneralWhatsAppUrl, getPhoneCallUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About Us | BVS Real Estate Dindigul",
  description:
    "BVS Real Estate helps customers explore lands and properties based on their requirements in Dindigul, Tamil Nadu.",
};

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Banner */}
        <div className="bg-navy-950 rounded-3xl p-8 sm:p-16 text-white relative overflow-hidden mb-16 shadow-2xl">
          <div className="absolute -right-16 -bottom-16 h-80 w-80 rounded-full bg-gold-500/15 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
              About BVS Real Estate
            </span>
            <h1 className="mt-2 font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Helping You Find the Right Ground in Dindigul
            </h1>
            <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed">
              BVS Real Estate helps customers explore lands and properties based on their requirements. Grounded in East Govindapuram, Dindigul, we connect buyers and sellers through direct, personal contact and verified property details.
            </p>

            <div className="mt-6 flex items-center gap-2 text-gold-300 font-bold text-sm">
              <span className="h-2 w-2 rounded-full bg-gold-400" />
              <span>{siteConfig.taglineTamil}</span>
            </div>
          </div>
        </div>

        {/* Core Principles */}
        <div className="mb-16">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-bvsRed-600">
              Our Guiding Principles
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-navy-950 mt-1">
              Real Estate with Local Integrity
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Straightforward real estate assistance focused on authenticity, fair communication, and customer peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl bg-white p-8 border border-slate-200/90 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-100 text-navy-900 mb-6">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-navy-950 mb-2.5">
                Location-Focused Expertise
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Specialized in the Dindigul region, including East Govindapuram, Palani Road, Chettinaickenpatti, and connecting highways. We know the approach roads, neighborhoods, and accessibility conditions firsthand.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 border border-slate-200/90 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900 mb-6">
                <FileCheck2 className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-navy-950 mb-2.5">
                Transparent Property Details
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We clearly disclose land extent, approach road width, groundwater status, and verified document categories without exaggerated promises or invented approvals.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 border border-slate-200/90 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-900 mb-6">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-navy-950 mb-2.5">
                Direct Accessibility
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Connect easily via direct phone or WhatsApp with Banumathi B. No middle layers or call centers—you speak directly with the representative handling the property.
              </p>
            </div>
          </div>
        </div>

        {/* Office & Profile Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-md mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-bvsRed-600">
                Direct Guidance & Management
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-navy-950">
                BVS Real Estate — Dindigul
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Managed by <strong className="text-navy-950 font-bold">{siteConfig.contactPerson}</strong>, BVS Real Estate assists individuals, families, and businesses across Dindigul in buying and selling properties across 5 core segments:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {siteConfig.propertyTypes.map((pt) => (
                  <div
                    key={pt.id}
                    className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold text-navy-950"
                  >
                    <Building className="h-4 w-4 text-gold-600 flex-shrink-0" />
                    <span>{pt.label}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <a
                  href={getPhoneCallUrl()}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-navy-950 hover:bg-navy-900 text-white px-6 py-3.5 text-xs font-bold transition-all shadow-md active:scale-95"
                >
                  <Phone className="h-4 w-4 text-bvsRed-500 animate-pulse" />
                  <span>Call {siteConfig.phone}</span>
                </a>
                <a
                  href={getGeneralWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 text-xs font-bold transition-all shadow-md active:scale-95"
                >
                  <MessageCircle className="h-4 w-4 fill-white text-transparent" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Office Address Card */}
            <div className="lg:col-span-5 rounded-3xl bg-navy-950 text-white p-7 sm:p-8 border border-navy-900 space-y-4 shadow-xl">
              <h3 className="font-display text-base font-bold text-gold-400">Office Location</h3>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-bvsRed-500 flex-shrink-0 mt-0.5" />
                <address className="not-italic text-sm text-slate-200 leading-relaxed font-medium">
                  <strong className="text-white block mb-1">{siteConfig.businessName}</strong>
                  {siteConfig.contactPerson}<br />
                  {siteConfig.address.street}<br />
                  {siteConfig.address.landmark}<br />
                  {siteConfig.address.locality}<br />
                  {siteConfig.address.city} - 01<br />
                  Tamil Nadu, India
                </address>
              </div>

              <div className="pt-3 border-t border-navy-900">
                <a
                  href={siteConfig.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-400 hover:text-gold-300 underline"
                >
                  <span>Open in Google Maps</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="rounded-3xl bg-white border border-slate-200/90 p-8 sm:p-10 text-center max-w-2xl mx-auto shadow-sm">
          <ShieldCheck className="h-9 w-9 text-emerald-600 mx-auto mb-3" />
          <h3 className="font-display text-xl font-bold text-navy-950">Ready to explore properties?</h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Browse our current catalog of verified lands and residential sites in Dindigul.
          </p>
          <div className="mt-6">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 rounded-2xl bg-navy-950 hover:bg-navy-900 text-white px-7 py-3.5 text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <span>Explore All Properties</span>
              <ArrowRight className="h-4 w-4 text-gold-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
