import { MetadataRoute } from "next";
import { getProperties } from "@/lib/properties";
import { getSiteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  try {
    const properties = await getProperties();
    const propertyRoutes: MetadataRoute.Sitemap = properties.map((property) => ({
      url: `${baseUrl}/properties/${property.slug}`,
      lastModified: property.updated_at ? new Date(property.updated_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticRoutes, ...propertyRoutes];
  } catch (err) {
    console.error("[Sitemap] Failed to load properties for sitemap:", err);
    return staticRoutes;
  }
}
