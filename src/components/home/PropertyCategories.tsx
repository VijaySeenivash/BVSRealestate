import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { siteConfig } from "@/config/site";

const CATEGORY_IMAGES: Record<string, string> = {
  LAND: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
  HOUSE: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
  "RESIDENTIAL PLOT": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  "AGRICULTURAL LAND": "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
  "COMMERCIAL PROPERTY": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
};

export function PropertyCategories() {
  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-bvsRed-600">
              Browse by Category
            </span>
            <h2 className="mt-1.5 font-display text-3xl sm:text-4xl font-black text-navy-950">
              Explore Property Types
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-xl">
              From approved residential house plots to fertile coconut farmlands and highway commercial plots, choose your preferred category.
            </p>
          </div>

          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-navy-950 hover:text-navy-700 transition-colors"
          >
            <span>View All Listings</span>
            <ChevronRight className="h-4 w-4 text-gold-600" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {siteConfig.propertyTypes.map((cat) => {
            const imageUrl = CATEGORY_IMAGES[cat.id] || CATEGORY_IMAGES["LAND"];
            return (
              <Link
                key={cat.id}
                href={`/properties?property_type=${encodeURIComponent(cat.id)}`}
                className="group relative flex flex-col justify-end overflow-hidden rounded-2xl h-84 sm:h-80 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ring-1 ring-slate-900/5 focus-visible:ring-2 focus-visible:ring-gold-500"
              >
                {/* Background Image with smooth zoom */}
                <Image
                  src={imageUrl}
                  alt={cat.label}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/50 to-transparent opacity-90 transition-opacity group-hover:opacity-95" />

                {/* Subtle top gold line indicator on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gold-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                {/* Content */}
                <div className="relative z-10 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gold-400">
                      Explore
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white transition-all duration-300 group-hover:bg-gold-500 group-hover:text-navy-950">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>

                  <h3 className="font-display text-lg font-black text-white leading-snug group-hover:text-gold-200 transition-colors">
                    {cat.label}
                  </h3>

                  <p className="mt-1 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
