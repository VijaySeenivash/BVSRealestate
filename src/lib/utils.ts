import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { siteConfig } from "@/config/site";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  if (price >= 10000000) {
    const cr = price / 10000000;
    return `₹${cr % 1 === 0 ? cr : cr.toFixed(2)} Crores`;
  }
  if (price >= 100000) {
    const lk = price / 100000;
    return `₹${lk % 1 === 0 ? lk : lk.toFixed(1)} Lakhs`;
  }
  return `₹${price.toLocaleString("en-IN")}`;
}

export function formatArea(area: number, unit: string = "sq.ft"): string {
  return `${area.toLocaleString("en-IN")} ${unit}`;
}

/**
 * Generates the dynamic WhatsApp inquiry link for a specific property.
 * Strict requirement: "Hi, I'm interested in [Property Name] in [Location]. I would like to know more about this property."
 */
export function getPropertyWhatsAppUrl(propertyName: string, location: string): string {
  const message = `Hi, I'm interested in ${propertyName} in ${location}. I would like to know more about this property.`;
  return `https://wa.me/91${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}

/**
 * General WhatsApp link with polite introduction.
 */
export function getGeneralWhatsAppUrl(): string {
  const message = `Hi BVS Real Estate, I would like to enquire about lands and properties in Dindigul.`;
  return `https://wa.me/91${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}

/**
 * Telephone direct link.
 */
export function getPhoneCallUrl(): string {
  return `tel:${siteConfig.phone}`;
}

/**
 * Resolves the active production base URL dynamically.
 * Priority:
 * 1. NEXT_PUBLIC_SITE_URL (set in Vercel or .env.local)
 * 2. NEXT_PUBLIC_VERCEL_URL / VERCEL_URL (injected by Vercel platform)
 * 3. Fallback placeholder
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    let url = process.env.NEXT_PUBLIC_SITE_URL.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`;
    }
    return url.replace(/\/+$/, "");
  }

  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL.replace(/\/+$/, "")}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/+$/, "")}`;
  }

  return "https://bvsrealestate.com";
}
