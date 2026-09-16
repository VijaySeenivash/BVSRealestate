import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Property } from "@/types/property";
import { PropertyGrid } from "@/components/properties/PropertyGrid";

interface FeaturedPropertiesProps {
  properties: Property[];
}

export function FeaturedProperties({ properties }: FeaturedPropertiesProps) {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gold-600 mb-1.5">
              <Sparkles className="h-3.5 w-3.5 text-gold-500 fill-gold-500/20" />
              <span>Handpicked Listings</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-navy-950 tracking-tight">
              Featured Properties in Dindigul
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
              Prime residential plots, independent homes, and strategic investment properties currently open for direct enquiry with verified title documentation.
            </p>
          </div>

          <Link
            href="/properties"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200/90 active:scale-95 px-5 py-3 text-xs font-bold text-navy-950 transition-all border border-slate-200"
          >
            <span>View All Properties</span>
            <ArrowRight className="h-4 w-4 text-gold-600" />
          </Link>
        </div>

        {/* Dynamic Property Grid */}
        <PropertyGrid properties={properties} />
      </div>
    </section>
  );
}
