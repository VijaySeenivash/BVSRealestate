import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  Maximize2,
  Phone,
  MessageCircle,
  ExternalLink,
  ChevronLeft,
  Calendar,
  FileCheck2,
  Truck,
  Building2,
  Compass,
  CheckCircle,
} from "lucide-react";
import { getPropertyBySlug, getProperties } from "@/lib/properties";
import { PropertyGallery } from "@/components/properties/PropertyGallery";
import { StatusBadge } from "@/components/properties/StatusBadge";
import { PropertyContactActions } from "@/components/properties/PropertyContactActions";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { siteConfig } from "@/config/site";
import { formatArea, getPropertyWhatsAppUrl, getPhoneCallUrl } from "@/lib/utils";

interface PropertyDetailPageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 0;
export const dynamicParams = true;

export async function generateStaticParams() {
  const properties = await getProperties();
  return properties.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: PropertyDetailPageProps): Promise<Metadata> {
  const property = await getPropertyBySlug(params.slug);
  if (!property) {
    return {
      title: "Property Not Found | BVS Real Estate",
      description: "The requested property listing could not be found.",
    };
  }

  const titleText = `${property.name} | ${property.property_type} in ${property.location}`;
  const descText = property.description
    ? property.description.slice(0, 160)
    : `${property.name} located in ${property.location}. Price: ${property.price_display}. Contact BVS Real Estate Dindigul.`;

  const ogImages = property.images?.length
    ? property.images.map((img) => ({
        url: img.image_url,
        alt: img.alt_text || property.name,
      }))
    : [];

  return {
    title: titleText,
    description: descText,
    alternates: {
      canonical: `/properties/${property.slug}`,
    },
    openGraph: {
      title: `${property.name} - ${property.price_display} | BVS Real Estate`,
      description: descText,
      url: `/properties/${property.slug}`,
      type: "website",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: `${property.name} - ${property.price_display}`,
      description: descText,
      images: ogImages.length ? [ogImages[0].url] : [],
    },
    keywords: [
      property.name,
      property.location,
      property.property_type,
      "Dindigul Real Estate",
      "BVS Real Estate",
      "Property for sale Dindigul",
    ],
  };
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const property = await getPropertyBySlug(params.slug);

  if (!property) {
    notFound();
  }

  // Related properties
  const allProperties = await getProperties();
  const relatedProperties = allProperties
    .filter((p) => p.id !== property.id)
    .slice(0, 3);

  const whatsappUrl = getPropertyWhatsAppUrl(property.name, property.location);

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12 w-full max-w-full min-w-0 overflow-x-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full min-w-0">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-navy-950 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/properties" className="hover:text-navy-950 transition-colors">
            Properties
          </Link>
          <span>/</span>
          <span className="text-navy-950 font-bold truncate max-w-[160px] sm:max-w-xs">{property.name}</span>
        </nav>

        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-xs font-bold text-navy-950 hover:text-navy-800 bg-white border border-slate-200/90 px-4 py-2.5 rounded-2xl shadow-sm hover:shadow transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to All Listings</span>
          </Link>
        </div>

        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-9 border border-slate-200/80 shadow-sm mb-8 w-full min-w-0">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                <StatusBadge status={property.status} size="md" />
                <span className="rounded-full bg-navy-100 text-navy-950 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wide">
                  {property.property_type}
                </span>
                {property.featured && (
                  <span className="rounded-full bg-gold-100 text-gold-900 border border-gold-300/50 px-3.5 py-1 text-xs font-bold uppercase tracking-wide">
                    Featured Property
                  </span>
                )}
              </div>

              <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-black text-navy-950 tracking-tight break-words">
                {property.name}
              </h1>

              <div className="mt-3 flex items-center gap-2 text-sm text-slate-600 font-medium">
                <MapPin className="h-4 w-4 text-bvsRed-600 flex-shrink-0" />
                <span>{property.location}</span>
              </div>
            </div>

            {/* Price & Fast CTAs */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 border-t lg:border-t-0 border-slate-100 pt-5 lg:pt-0">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block lg:text-right">
                  Quoted Price
                </span>
                <span className="font-display text-3xl sm:text-4xl font-black text-navy-950">
                  {property.price_display}
                </span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <a
                  href={getPhoneCallUrl()}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-navy-950 hover:bg-navy-900 text-white px-5 py-3 text-xs font-bold shadow-sm transition-all"
                >
                  <Phone className="h-3.5 w-3.5 text-bvsRed-500 animate-pulse" />
                  <span>Call Now</span>
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 text-xs font-bold shadow-sm transition-all"
                >
                  <MessageCircle className="h-3.5 w-3.5 fill-white text-transparent" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full min-w-0">
          {/* Main Details (Left 8 cols) */}
          <div className="lg:col-span-8 space-y-8 w-full min-w-0">
            {/* Gallery Section */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-sm">
              <h2 className="text-base font-bold text-navy-950 mb-4 flex items-center justify-between">
                <span>Property Gallery</span>
                <span className="text-xs font-medium text-slate-500">
                  Click any image to view fullscreen
                </span>
              </h2>
              <PropertyGallery images={property.images} propertyName={property.name} />
            </div>

            {/* Specifications Overview */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
              <h2 className="font-display text-xl font-bold text-navy-950 mb-6">Property Overview</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
                    <Maximize2 className="h-4 w-4 text-navy-800" />
                    <span>Total Area</span>
                  </div>
                  <p className="font-display text-base sm:text-lg font-black text-navy-950">
                    {formatArea(property.area, property.area_unit)}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
                    <Building2 className="h-4 w-4 text-navy-800" />
                    <span>Property Type</span>
                  </div>
                  <p className="font-display text-base sm:text-lg font-black text-navy-950">
                    {property.property_type}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
                    <Truck className="h-4 w-4 text-navy-800" />
                    <span>Road Access</span>
                  </div>
                  <p className="font-display text-base sm:text-lg font-black text-navy-950 truncate">
                    {property.road_access || "Direct road access"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
                    <MapPin className="h-4 w-4 text-navy-800" />
                    <span>Dindigul Locality</span>
                  </div>
                  <p className="font-display text-base sm:text-lg font-black text-navy-950 truncate">
                    {property.location.split(",")[0]}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
                    <Calendar className="h-4 w-4 text-navy-800" />
                    <span>Listing Date</span>
                  </div>
                  <p className="font-display text-base sm:text-lg font-black text-navy-950">
                    {new Date(property.created_at).toLocaleDateString("en-IN", {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
                    <FileCheck2 className="h-4 w-4 text-navy-800" />
                    <span>Title Status</span>
                  </div>
                  <p className="font-display text-base sm:text-lg font-black text-emerald-700">
                    Verified
                  </p>
                </div>
              </div>
            </div>

            {/* Description & Detailed Highlights */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold text-navy-950 mb-3">
                  Detailed Description
                </h2>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {property.highlights && property.highlights.length > 0 && (
                <div className="border-t border-slate-100 pt-6">
                  <h3 className="font-display text-base font-bold text-navy-950 mb-3">
                    Property Highlights & Features
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {property.highlights.map((highlight, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100"
                      >
                        <CheckCircle className="h-4 w-4 text-gold-600 mt-0.5 flex-shrink-0" />
                        <span className="font-medium">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Approval / Document Info */}
              {property.approval_info && (
                <div className="border-t border-slate-100 pt-6">
                  <h3 className="font-display text-base font-bold text-navy-950 mb-2 flex items-center gap-2">
                    <FileCheck2 className="h-4 w-4 text-emerald-600" />
                    <span>Approval & Document Information</span>
                  </h3>
                  <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200 p-4 text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
                    {property.approval_info}
                  </div>
                </div>
              )}
            </div>

            {/* Location & Google Maps Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-navy-950">Property Location</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{property.location}</p>
                </div>

                {property.google_maps_url && (
                  <a
                    href={property.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-navy-950 hover:bg-navy-900 text-white px-5 py-2.5 text-xs font-bold transition-all shadow-sm"
                  >
                    <span>View on Google Maps</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-100 text-navy-900 shadow-sm">
                  <MapPin className="h-6 w-6 text-bvsRed-600" />
                </div>
                <h4 className="font-display text-base font-bold text-navy-950">{property.location}</h4>
                <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                  On-site inspections and physical boundary verification are arranged directly with Banumathi B. Contact via Phone or WhatsApp to set up a site visit.
                </p>
                {property.google_maps_url && (
                  <div className="pt-2">
                    <a
                      href={property.google_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-950 hover:underline"
                    >
                      <span>Open navigation in Google Maps app</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sticky Sidebar (Right 4 cols) */}
          <div className="lg:col-span-4 w-full min-w-0">
            <div className="sticky top-24 space-y-6">
              <PropertyContactActions property={property} />

              {/* Direct Transparency Guarantee */}
              <div className="rounded-3xl bg-gold-50/70 border border-gold-200/80 p-6 text-xs text-gold-950">
                <h4 className="font-display font-bold text-navy-950 mb-2 text-sm">Direct Owner Guarantee</h4>
                <p className="leading-relaxed text-slate-700">
                  BVS Real Estate operates with genuine, verified seller listings in Dindigul. All negotiations, document checks, and registration discussions are handled directly with complete transparency.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Properties */}
        {relatedProperties.length > 0 && (
          <div className="mt-20 pt-12 border-t border-slate-200 w-full min-w-0">
            <div className="mb-8 min-w-0">
              <span className="text-xs font-bold uppercase tracking-widest text-bvsRed-600">
                Similar Listings
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-navy-950 mt-1 break-words">
                More Properties in Dindigul
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full min-w-0">
              {relatedProperties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
