"use client";

import React, { useState } from "react";
import { Phone, MessageCircle, MapPin, User, ShieldCheck, Share2, Check, AlertCircle, CheckCircle2 } from "lucide-react";
import { Property } from "@/types/property";
import { siteConfig } from "@/config/site";
import { getPropertyWhatsAppUrl, getPhoneCallUrl } from "@/lib/utils";

interface PropertyContactActionsProps {
  property: Property;
}

export function PropertyContactActions({ property }: PropertyContactActionsProps) {
  const [copied, setCopied] = useState(false);

  const isSold = property.status === "SOLD";
  const isReserved = property.status === "RESERVED";
  const propertyTitle = property.title || property.name || "Property";

  // Status-sensitive WhatsApp URLs
  let whatsappUrl = getPropertyWhatsAppUrl(propertyTitle, property.location);
  if (isSold) {
    const message = `Hi Banumathi B, I noticed "${propertyTitle}" in ${property.location} is marked as SOLD on BVS Real Estate. Are there any other similar available lands or properties in Dindigul?`;
    whatsappUrl = `https://wa.me/919750176664?text=${encodeURIComponent(message)}`;
  } else if (isReserved) {
    const message = `Hi Banumathi B, I saw that "${propertyTitle}" in ${property.location} is currently RESERVED. Please let me know if it becomes available or if there are similar alternatives.`;
    whatsappUrl = `https://wa.me/919750176664?text=${encodeURIComponent(message)}`;
  }

  const handleShare = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-lg space-y-6">
      {/* Price & Status Header */}
      <div
        className={`rounded-2xl p-5 border flex items-baseline justify-between ${
          isSold
            ? "bg-slate-100/80 border-slate-200"
            : isReserved
            ? "bg-amber-50/70 border-amber-200"
            : "bg-gradient-to-br from-navy-50 to-slate-50 border-navy-100"
        }`}
      >
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            {isSold ? "Registration Price" : "Quoted Offer Price"}
          </span>
          <span className="font-display text-3xl font-black text-navy-950 block mt-0.5">
            {property.price_display}
          </span>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Current Status
          </span>
          <span
            className={`inline-block text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider ${
              property.status === "AVAILABLE"
                ? "bg-emerald-100 text-emerald-800"
                : property.status === "RESERVED"
                ? "bg-amber-100 text-amber-900 border border-amber-300"
                : "bg-slate-300 text-slate-800"
            }`}
          >
            {property.status}
          </span>
        </div>
      </div>

      {/* Status Warning / Context Notice */}
      {isSold && (
        <div className="rounded-2xl bg-slate-100 border border-slate-200 p-4 text-xs text-slate-700 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <AlertCircle className="h-4 w-4 text-slate-600 flex-shrink-0" />
            <span>Property Successfully Sold & Registered</span>
          </div>
          <p className="text-slate-600 leading-relaxed pl-5">
            This listing is retained for public record and market reference. It is no longer available for booking. You can inquire about similar properties in Dindigul below.
          </p>
        </div>
      )}

      {isReserved && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
            <span>Reserved Under Negotiation</span>
          </div>
          <p className="text-amber-800 leading-relaxed pl-5">
            A token advance is under active verification. Contact to receive updates if this property becomes available again.
          </p>
        </div>
      )}

      {/* Main Action Buttons */}
      <div className="space-y-3">
        {/* Direct Call with phone-link */}
        <a
          href={getPhoneCallUrl()}
          className={`flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 px-5 text-sm font-bold shadow-md transition-all min-h-[50px] ${
            isSold
              ? "bg-slate-800 hover:bg-slate-900 text-white"
              : "bg-navy-950 hover:bg-navy-900 text-white active:scale-95"
          }`}
        >
          <Phone className="h-4 w-4 text-bvsRed-500 animate-pulse" />
          <span>{isSold ? "Call for Similar Plots" : `Call Now (${siteConfig.phone})`}</span>
        </a>

        {/* WhatsApp Enquiry with status-specific message */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 py-4 px-5 text-sm font-bold text-white shadow-md transition-all min-h-[50px]"
          title={isSold ? "Ask about similar properties" : `Enquire on WhatsApp about ${propertyTitle}`}
        >
          <MessageCircle className="h-4 w-4 fill-white text-transparent" />
          <span>{isSold ? "WhatsApp For Similar Lands" : isReserved ? "Inquire On Reservation" : "WhatsApp Enquiry"}</span>
        </a>

        {/* Share Link Button */}
        <button
          type="button"
          onClick={handleShare}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 px-4 text-xs font-bold transition-all border border-slate-200"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-emerald-700">Link Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Share2 className="h-3.5 w-3.5 text-slate-500" />
              <span>Share Property</span>
            </>
          )}
        </button>
      </div>

      {/* Verified Contact Details Box */}
      <div className="border-t border-slate-100 pt-5 space-y-3 text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <User className="h-4 w-4 text-navy-800" />
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Authorized Contact:</span>
            <span className="font-bold text-navy-950 text-sm">{siteConfig.contactPerson}</span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 mt-0.5">
            <MapPin className="h-4 w-4 text-bvsRed-600" />
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Office Address:</span>
            <address className="not-italic text-slate-700 font-medium leading-relaxed">
              {siteConfig.address.street}, {siteConfig.address.landmark}, {siteConfig.address.locality}, Dindigul - 01
            </address>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center gap-2.5 text-emerald-900 text-xs font-semibold">
          <ShieldCheck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <span>Direct deal with representative • Zero unverified claims</span>
        </div>
      </div>
    </div>
  );
}
