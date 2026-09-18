"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Home, IndianRupee, Maximize2, Sparkles } from "lucide-react";
import { siteConfig, PropertyType } from "@/config/site";

export function PropertySearch() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<PropertyType | "ALL">("ALL");
  const [location, setLocation] = useState("ALL");
  const [budget, setBudget] = useState("");
  const [area, setArea] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (activeTab !== "ALL") params.set("property_type", activeTab);
    if (location !== "ALL") params.set("location", location);
    if (budget) params.set("max_price", budget);
    if (area) params.set("min_area", area);

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative z-20 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 min-w-0">
      <div className="w-full max-w-full min-w-0 rounded-3xl bg-white p-5 sm:p-8 shadow-2xl border border-slate-200/80 ring-1 ring-slate-900/5 overflow-hidden">
        {/* Category Filter Tabs - Horizontally scrollable on mobile without forcing card blowout */}
        <div className="w-full max-w-full min-w-0 overflow-x-auto pb-3 mb-4 border-b border-slate-100 scrollbar-none flex items-center gap-1.5 -mx-1 px-1">
          <button
            type="button"
            onClick={() => setActiveTab("ALL")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
              activeTab === "ALL"
                ? "bg-navy-950 text-white shadow-sm"
                : "text-slate-600 hover:text-navy-900 hover:bg-slate-100"
            }`}
          >
            All Properties
          </button>
          {siteConfig.propertyTypes.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
                activeTab === t.id
                  ? "bg-navy-950 text-white shadow-sm"
                  : "text-slate-600 hover:text-navy-900 hover:bg-slate-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search Inputs Form */}
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end w-full min-w-0">
          {/* Location */}
          <div className="w-full min-w-0">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-navy-700 flex-shrink-0" />
              <span>Location in Dindigul</span>
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/75 px-3.5 py-3 text-sm font-medium text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none transition-all"
            >
              <option value="ALL">All Dindigul Localities</option>
              {siteConfig.serviceAreas.map((areaItem) => (
                <option key={areaItem} value={areaItem}>
                  {areaItem}
                </option>
              ))}
            </select>
          </div>

          {/* Budget */}
          <div className="w-full min-w-0">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <IndianRupee className="h-3.5 w-3.5 text-navy-700 flex-shrink-0" />
              <span>Max Budget</span>
            </label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/75 px-3.5 py-3 text-sm font-medium text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none transition-all"
            >
              <option value="">Any Budget</option>
              <option value="2000000">Up to ₹20 Lakhs</option>
              <option value="3500000">Up to ₹35 Lakhs</option>
              <option value="5000000">Up to ₹50 Lakhs</option>
              <option value="10000000">Up to ₹1 Crore</option>
              <option value="25000000">Up to ₹2.5 Crores</option>
            </select>
          </div>

          {/* Area */}
          <div className="w-full min-w-0">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Maximize2 className="h-3.5 w-3.5 text-navy-700 flex-shrink-0" />
              <span>Min Area / Extent</span>
            </label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/75 px-3.5 py-3 text-sm font-medium text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none transition-all"
            >
              <option value="">Any Area Extent</option>
              <option value="1200">1,200+ sq.ft</option>
              <option value="2400">2,400+ sq.ft (Approx 5.5 cents)</option>
              <option value="4000">4,000+ sq.ft</option>
              <option value="10000">10,000+ sq.ft / Farmland</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="w-full min-w-0">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-navy-950 hover:bg-navy-900 active:scale-95 px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all focus-visible:ring-2 focus-visible:ring-navy-700"
            >
              <Search className="h-4 w-4 text-gold-400 flex-shrink-0" />
              <span>Search Properties</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
