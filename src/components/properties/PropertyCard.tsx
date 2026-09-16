"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Maximize2, MessageCircle, ArrowUpRight, Camera, CheckCircle2, Lock } from "lucide-react";
import { Property } from "@/types/property";
import { StatusBadge } from "@/components/properties/StatusBadge";
import { getPropertyWhatsAppUrl, formatArea } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const primaryImage =
    property.images.find((img) => img.is_primary)?.image_url ||
    property.images[0]?.image_url ||
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80";

  const isSold = property.status === "SOLD";
  const isReserved = property.status === "RESERVED";

  // Dynamic WhatsApp message adjusted for status
  let whatsappUrl = getPropertyWhatsAppUrl(property.title || property.name || "", property.location);
  if (isSold) {
    const soldMessage = `Hi, I saw the sold property "${property.title || property.name}" in ${property.location}. Do you have similar available properties in Dindigul?`;
    whatsappUrl = `https://wa.me/919750176664?text=${encodeURIComponent(soldMessage)}`;
  } else if (isReserved) {
    const reservedMessage = `Hi, I saw "${property.title || property.name}" in ${property.location} is currently RESERVED. Please let me know if it becomes available or if there are similar properties.`;
    whatsappUrl = `https://wa.me/919750176664?text=${encodeURIComponent(reservedMessage)}`;
  }

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-3xl bg-white border shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${
        isSold
          ? "border-slate-300/80 bg-slate-50/50 opacity-95"
          : isReserved
          ? "border-amber-200/80 hover:border-amber-400"
          : "border-slate-200/90 hover:border-slate-300"
      }`}
    >
      {/* Property Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
        <Image
          src={primaryImage}
          alt={property.title || property.name || "Property photo"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
            isSold ? "grayscale-[35%] opacity-85" : ""
          }`}
        />

        {/* Gradient Overlay for readable badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges: Status & Type */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none z-10">
          <StatusBadge status={property.status} size="sm" />

          <span className="rounded-full bg-navy-950/85 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white tracking-wider uppercase shadow-sm border border-white/10">
            {property.property_type}
          </span>
        </div>

        {/* Sold Overlay Ribbon */}
        {isSold && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 pointer-events-none">
            <span className="font-display text-sm font-black tracking-widest uppercase bg-slate-900/90 text-white px-5 py-2 rounded-full border border-white/20 shadow-lg">
              SOLD & REGISTERED
            </span>
          </div>
        )}

        {/* Photo Count Pill */}
        {property.images.length > 1 && !isSold && (
          <div className="absolute bottom-3 right-3 rounded-md bg-navy-950/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-white flex items-center gap-1.5 pointer-events-none border border-white/10">
            <Camera className="h-3 w-3 text-gold-400" />
            <span>{property.images.length} Photos</span>
          </div>
        )}
      </div>

      {/* Property Details Body */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Price & Area Header */}
        <div className="flex items-baseline justify-between gap-2">
          <p className="font-display text-2xl font-black tracking-tight text-navy-950">
            {property.price_display}
          </p>

          <div className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100/90 px-2.5 py-1 rounded-lg border border-slate-200">
            <Maximize2 className="h-3.5 w-3.5 text-navy-700" />
            <span>{formatArea(property.area, property.area_unit || "sq.ft")}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="mt-2.5 text-base sm:text-lg font-bold text-navy-950 line-clamp-1 group-hover:text-navy-700 transition-colors">
          <Link href={`/properties/${property.slug}`}>
            {property.title || property.name}
          </Link>
        </h3>

        {/* Location */}
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-600 line-clamp-1">
          <MapPin className="h-3.5 w-3.5 text-bvsRed-600 flex-shrink-0" />
          <span className="truncate font-medium">{property.location}</span>
        </div>

        {/* Brief Highlight Bullet */}
        {property.highlights && property.highlights.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600">
            <span
              className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                isSold ? "bg-slate-400" : isReserved ? "bg-amber-500" : "bg-gold-500"
              }`}
            />
            <p className="line-clamp-1 leading-normal font-medium">
              {property.highlights[0]}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2.5">
          {/* View Details */}
          <Link
            href={`/properties/${property.slug}`}
            className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold transition-all shadow-sm focus-visible:ring-2 ${
              isSold
                ? "bg-slate-700 hover:bg-slate-800 text-white"
                : "bg-navy-900 hover:bg-navy-800 text-white"
            }`}
          >
            <span>{isSold ? "View Sold Info" : "View Details"}</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>

          {/* Quick WhatsApp with status sensitivity */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
              isSold
                ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300"
                : isReserved
                ? "bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300"
                : "bg-emerald-50 hover:bg-emerald-100/90 text-emerald-800 border border-emerald-300/80"
            }`}
            title={
              isSold
                ? "Inquire about similar properties"
                : `Enquire about ${property.title || property.name} on WhatsApp`
            }
          >
            <MessageCircle className="h-3.5 w-3.5 text-emerald-600 fill-emerald-600/20" />
            <span>{isSold ? "Find Similar" : isReserved ? "Check Status" : "WhatsApp"}</span>
          </a>
        </div>
      </div>
    </article>
  );
}
