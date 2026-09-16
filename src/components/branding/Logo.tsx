"use client";

import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "light" | "dark";
  className?: string;
  showTagline?: boolean;
}

export function Logo({ variant = "dark", className, showTagline = true }: LogoProps) {
  const isLight = variant === "light";

  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-3 transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-gold-500 rounded-xl p-1",
        className
      )}
      aria-label="BVS Real Estate - Back to Home"
    >
      {/* Visual Architectural Emblem */}
      <div className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-navy-900 via-navy-850 to-navy-950 p-2 shadow-md ring-1 ring-gold-500/40 transition-transform duration-300 group-hover:scale-105">
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          aria-hidden="true"
        >
          {/* House / Roofline Contour */}
          <path
            d="M6 24L24 8L42 24"
            stroke="#DFB018"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Inner Geometric Peak */}
          <path
            d="M16 24L24 16L32 24"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Red Accent Foundation */}
          <path
            d="M12 30H36"
            stroke="#DC2626"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Land Horizon / Ground Base */}
          <path
            d="M8 38H40"
            stroke="#DFB018"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Golden Sun / Prosperity Dot */}
          <circle cx="24" cy="23" r="2.5" fill="#DFB018" />
        </svg>

        {/* Subtle red indicator dot */}
        <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bvsRed-500 opacity-60"></span>
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-bvsRed-600"></span>
        </span>
      </div>

      {/* Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-display text-xl sm:text-2xl font-black tracking-tight text-bvsRed-600">
            BVS
          </span>
          <span
            className={cn(
              "font-display text-base sm:text-lg font-extrabold tracking-wider",
              isLight ? "text-white" : "text-navy-950"
            )}
          >
            REAL ESTATE
          </span>
        </div>

        {showTagline && (
          <span
            className={cn(
              "mt-1 line-clamp-1 text-[10px] sm:text-[11px] font-medium tracking-wide transition-colors",
              isLight ? "text-gold-300" : "text-navy-700"
            )}
          >
            {siteConfig.taglineTamil}
          </span>
        )}
      </div>
    </Link>
  );
}
