import React from "react";
import Link from "next/link";
import { Property } from "@/types/property";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { SearchX, RotateCcw } from "lucide-react";

interface PropertyGridProps {
  properties: Property[];
  emptyMessage?: string;
}

export function PropertyGrid({
  properties,
  emptyMessage = "No properties found matching your criteria. Try adjusting your filters or search keywords.",
}: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white/60 p-12 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <SearchX className="h-8 w-8 text-navy-800" />
        </div>
        <h3 className="font-display mt-4 text-lg font-bold text-navy-950">
          No Properties Found
        </h3>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          {emptyMessage}
        </p>
        <div className="mt-6">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 rounded-xl bg-navy-950 hover:bg-navy-900 text-white px-5 py-2.5 text-xs font-bold transition-all shadow-sm"
          >
            <RotateCcw className="h-3.5 w-3.5 text-gold-400" />
            <span>Reset All Filters</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
