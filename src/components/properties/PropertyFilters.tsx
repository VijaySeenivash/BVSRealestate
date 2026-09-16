"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, RotateCcw, Search, X, ChevronDown, Check } from "lucide-react";
import { siteConfig, PropertyType, PropertyStatus } from "@/config/site";

interface PropertyFiltersProps {
  locations: string[];
}

export function PropertyFilters({ locations }: PropertyFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isOpenMobile, setIsOpenMobile] = useState(false);

  // Local state initialized from URL query params
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "ALL");
  const [propertyType, setPropertyType] = useState<PropertyType | "ALL">(
    (searchParams.get("property_type") as PropertyType) || "ALL"
  );
  const [status, setStatus] = useState<PropertyStatus | "ALL">(
    (searchParams.get("status") as PropertyStatus) || "ALL"
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort_by") || "newest");

  const applyFilters = (overrides: Record<string, string> = {}) => {
    const params = new URLSearchParams();

    const q = overrides.query !== undefined ? overrides.query : query;
    const loc = overrides.location !== undefined ? overrides.location : location;
    const pt = overrides.propertyType !== undefined ? overrides.propertyType : propertyType;
    const st = overrides.status !== undefined ? overrides.status : status;
    const minP = overrides.minPrice !== undefined ? overrides.minPrice : minPrice;
    const maxP = overrides.maxPrice !== undefined ? overrides.maxPrice : maxPrice;
    const srt = overrides.sortBy !== undefined ? overrides.sortBy : sortBy;

    if (q.trim()) params.set("query", q.trim());
    if (loc && loc !== "ALL") params.set("location", loc);
    if (pt && pt !== "ALL") params.set("property_type", pt);
    if (st && st !== "ALL") params.set("status", st);
    if (minP) params.set("min_price", minP);
    if (maxP) params.set("max_price", maxP);
    if (srt && srt !== "newest") params.set("sort_by", srt);

    router.push(`/properties?${params.toString()}`);
    setIsOpenMobile(false);
  };

  const handleQuickTypeSelect = (typeId: PropertyType | "ALL") => {
    setPropertyType(typeId);
    applyFilters({ propertyType: typeId });
  };

  const handleResetFilters = () => {
    setQuery("");
    setLocation("ALL");
    setPropertyType("ALL");
    setStatus("ALL");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("newest");
    router.push("/properties");
    setIsOpenMobile(false);
  };

  const hasActiveFilters =
    Boolean(query) ||
    location !== "ALL" ||
    propertyType !== "ALL" ||
    status !== "ALL" ||
    Boolean(minPrice) ||
    Boolean(maxPrice) ||
    sortBy !== "newest";

  return (
    <div className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-sm mb-8">
      {/* Category Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-5 border-b border-slate-100 scrollbar-none">
        <button
          type="button"
          onClick={() => handleQuickTypeSelect("ALL")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
            propertyType === "ALL"
              ? "bg-navy-950 text-white shadow-sm"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          All Types
        </button>
        {siteConfig.propertyTypes.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => handleQuickTypeSelect(t.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              propertyType === t.id
                ? "bg-navy-950 text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main Search Input & Trigger Row */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            placeholder="Search keyword (e.g. Palani Road, House, Farmland, 2400 sq.ft)..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 pl-10 pr-10 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-navy-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-600/10 transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                applyFilters({ query: "" });
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              aria-label="Clear search text"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {/* Mobile Filter Toggle */}
          <button
            type="button"
            onClick={() => setIsOpenMobile(!isOpenMobile)}
            className="md:hidden flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 py-3 px-4 text-xs font-bold text-navy-950"
            aria-expanded={isOpenMobile}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filters {hasActiveFilters && "•"}</span>
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${isOpenMobile ? "rotate-180" : ""}`}
            />
          </button>

          {/* Apply / Search CTA */}
          <button
            type="button"
            onClick={() => applyFilters()}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 rounded-2xl bg-navy-950 hover:bg-navy-900 px-6 py-3 text-xs font-bold text-white shadow-md active:scale-95 transition-all"
          >
            <Search className="h-3.5 w-3.5 text-gold-400" />
            <span>Apply</span>
          </button>

          {/* Reset button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 hover:bg-slate-100 p-3 text-xs font-semibold text-slate-600 transition-colors"
              title="Reset all filters"
              aria-label="Reset all filters"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Expanded Multi-Criteria Grid */}
      <div
        className={`mt-5 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${
          isOpenMobile ? "block" : "hidden md:grid"
        }`}
      >
        {/* Location Dropdown */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Dindigul Locality
          </label>
          <select
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              applyFilters({ location: e.target.value });
            }}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/75 px-3 py-2.5 text-xs font-medium text-slate-800 focus:border-navy-600 focus:bg-white focus:outline-none"
          >
            <option value="ALL">All Localities</option>
            {siteConfig.serviceAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        {/* Availability Status */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Availability Status
          </label>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as PropertyStatus | "ALL");
              applyFilters({ status: e.target.value });
            }}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/75 px-3 py-2.5 text-xs font-medium text-slate-800 focus:border-navy-600 focus:bg-white focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">AVAILABLE (Open for enquiry)</option>
            <option value="RESERVED">RESERVED (Under negotiation)</option>
            <option value="SOLD">SOLD (Registered)</option>
          </select>
        </div>

        {/* Maximum Budget */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Max Budget (₹)
          </label>
          <select
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
              applyFilters({ maxPrice: e.target.value });
            }}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/75 px-3 py-2.5 text-xs font-medium text-slate-800 focus:border-navy-600 focus:bg-white focus:outline-none"
          >
            <option value="">Any Budget</option>
            <option value="2000000">Up to ₹20 Lakhs</option>
            <option value="3500000">Up to ₹35 Lakhs</option>
            <option value="5000000">Up to ₹50 Lakhs</option>
            <option value="10000000">Up to ₹1 Crore</option>
            <option value="25000000">Up to ₹2.5 Crores</option>
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Sort Order
          </label>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              applyFilters({ sortBy: e.target.value });
            }}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/75 px-3 py-2.5 text-xs font-medium text-slate-800 focus:border-navy-600 focus:bg-white focus:outline-none"
          >
            <option value="newest">Recently Listed</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="area_desc">Area: Largest First</option>
          </select>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold">Active filters:</span>

          {propertyType !== "ALL" && (
            <span className="inline-flex items-center gap-1 bg-navy-50 text-navy-950 px-2.5 py-1 rounded-full font-bold">
              Type: {propertyType}
              <button
                type="button"
                onClick={() => handleQuickTypeSelect("ALL")}
                className="hover:text-red-600"
                aria-label="Remove property type filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {location !== "ALL" && (
            <span className="inline-flex items-center gap-1 bg-navy-50 text-navy-950 px-2.5 py-1 rounded-full font-bold">
              Locality: {location}
              <button
                type="button"
                onClick={() => {
                  setLocation("ALL");
                  applyFilters({ location: "ALL" });
                }}
                className="hover:text-red-600"
                aria-label="Remove location filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {status !== "ALL" && (
            <span className="inline-flex items-center gap-1 bg-navy-50 text-navy-950 px-2.5 py-1 rounded-full font-bold">
              Status: {status}
              <button
                type="button"
                onClick={() => {
                  setStatus("ALL");
                  applyFilters({ status: "ALL" });
                }}
                className="hover:text-red-600"
                aria-label="Remove status filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {maxPrice && (
            <span className="inline-flex items-center gap-1 bg-navy-50 text-navy-950 px-2.5 py-1 rounded-full font-bold">
              Budget: ≤ ₹{Number(maxPrice) >= 10000000 ? `${Number(maxPrice) / 10000000} Cr` : `${Number(maxPrice) / 100000} L`}
              <button
                type="button"
                onClick={() => {
                  setMaxPrice("");
                  applyFilters({ maxPrice: "" });
                }}
                className="hover:text-red-600"
                aria-label="Remove budget filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs text-bvsRed-600 hover:underline font-bold ml-auto"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
