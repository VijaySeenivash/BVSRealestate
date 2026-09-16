import React, { Suspense } from "react";
import { Metadata } from "next";
import { getProperties, getAllLocations } from "@/lib/properties";
import { PropertyGrid } from "@/components/properties/PropertyGrid";
import { PropertyFilters } from "@/components/properties/PropertyFilters";
import { PropertyType, PropertyStatus } from "@/config/site";

export const metadata: Metadata = {
  title: "Explore Properties, Lands & Houses in Dindigul",
  description:
    "Browse verified lands, residential layout plots, independent houses, and agricultural farmlands in Dindigul with BVS Real Estate. Direct deals and clear title verification.",
  alternates: {
    canonical: "/properties",
  },
  openGraph: {
    title: "Browse Real Estate Properties in Dindigul | BVS Real Estate",
    description:
      "Explore residential plots, commercial properties, and agricultural lands in Dindigul, Tamil Nadu.",
    url: "/properties",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Properties for Sale in Dindigul | BVS Real Estate",
    description: "Verified lands, plots and independent houses for sale in Dindigul.",
  },
};

interface PropertiesPageProps {
  searchParams: {
    query?: string;
    location?: string;
    property_type?: string;
    status?: string;
    min_price?: string;
    max_price?: string;
    min_area?: string;
    max_area?: string;
    sort_by?: string;
  };
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const locations = await getAllLocations();

  const filterParams = {
    query: searchParams.query,
    location: searchParams.location,
    property_type: searchParams.property_type as PropertyType | "ALL" | undefined,
    status: searchParams.status as PropertyStatus | "ALL" | undefined,
    min_price: searchParams.min_price ? Number(searchParams.min_price) : undefined,
    max_price: searchParams.max_price ? Number(searchParams.max_price) : undefined,
    min_area: searchParams.min_area ? Number(searchParams.min_area) : undefined,
    max_area: searchParams.max_area ? Number(searchParams.max_area) : undefined,
    sort_by: searchParams.sort_by as any,
  };

  const properties = await getProperties(filterParams);

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-bvsRed-600">
            Dindigul Real Estate Listings
          </span>
          <h1 className="mt-1 text-3xl sm:text-4xl font-black text-navy-950">
            Explore Properties
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
            Find lands and properties that match your requirements. Filter by location, budget, type, or availability status.
          </p>
        </div>

        {/* Filter Controls */}
        <Suspense fallback={<div className="h-24 rounded-2xl bg-white animate-pulse mb-8" />}>
          <PropertyFilters locations={locations} />
        </Suspense>

        {/* Results Counter */}
        <div className="mb-6 flex items-center justify-between text-sm text-slate-600">
          <p>
            Showing <span className="font-bold text-navy-950">{properties.length}</span> {properties.length === 1 ? "property" : "properties"}
          </p>
        </div>

        {/* Property Grid (Responsive 3 cols Desktop, 2 cols Tablet, 1 col Mobile) */}
        <PropertyGrid properties={properties} />
      </div>
    </div>
  );
}
