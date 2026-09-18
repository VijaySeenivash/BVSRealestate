import React from "react";
import { Hero } from "@/components/home/Hero";
import { PropertySearch } from "@/components/home/PropertySearch";
import { PropertyCategories } from "@/components/home/PropertyCategories";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { TrustSection } from "@/components/home/TrustSection";
import { getFeaturedProperties } from "@/lib/properties";

export const revalidate = 60; // Dynamic ISR cache

export default async function HomePage() {
  const featuredProperties = await getFeaturedProperties();

  return (
    <div className="flex flex-col min-h-screen w-full min-w-0 max-w-full overflow-x-hidden">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Overlapping Quick Property Search */}
      <PropertySearch />

      {/* 3. Featured Properties (Dynamic Cards) */}
      <FeaturedProperties properties={featuredProperties} />

      {/* 4. Property Categories */}
      <PropertyCategories />

      {/* 5. Trust & Transparency Section */}
      <TrustSection />
    </div>
  );
}
