import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { MOCK_PROPERTIES } from "@/data/mock-properties";
import { Property, PropertyFilterParams, DashboardStats, PropertyImage } from "@/types/property";
import { formatPrice } from "@/lib/utils";

/**
 * Validates whether a string matches a standard UUID format (8-4-4-4-12 hex characters).
 * Protects PostgreSQL UUID columns from invalid input syntax errors.
 */
export function isUuid(value?: string | null): boolean {
  if (!value || typeof value !== "string") return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value.trim());
}

/**
 * Normalizes a raw property row (from Supabase or mock) into our standard Property type.
 */
function normalizeProperty(raw: any): Property {
  // Sort images by display_order
  const rawImages: any[] = raw.property_images || raw.images || [];
  const sortedImages: PropertyImage[] = rawImages
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .map((img, index) => ({
      id: img.id || `img-${index}`,
      property_id: img.property_id || raw.id,
      image_url: img.image_url,
      display_order: img.display_order ?? index,
      alt_text: img.alt_text || raw.title || raw.name,
      is_primary: index === 0,
      created_at: img.created_at,
    }));

  const priceNum = Number(raw.price);
  const titleText = raw.title || raw.name || "Untitled Property";

  return {
    id: raw.id,
    title: titleText,
    name: titleText, // UI compatibility alias
    slug: raw.slug,
    location: raw.location,
    area: Number(raw.area),
    area_unit: raw.area_unit || "sq.ft",
    price: priceNum,
    price_unit: raw.price_unit || "Lakhs",
    price_display: raw.price_display || formatPrice(priceNum),
    property_type: raw.property_type,
    status: raw.status || "AVAILABLE",
    description: raw.description || "",
    highlights: Array.isArray(raw.highlights) ? raw.highlights : [],
    maps_url: raw.maps_url || raw.google_maps_url,
    google_maps_url: raw.maps_url || raw.google_maps_url,
    road_access: raw.road_access,
    approval_info: raw.approval_info,
    featured: raw.featured ?? true,
    images: sortedImages,
    created_at: raw.created_at || new Date().toISOString(),
    updated_at: raw.updated_at || new Date().toISOString(),
  };
}

/**
 * Fetches all properties matching optional filters.
 * Reads directly from Supabase `properties` table when configured;
 * otherwise uses realistic demo fallback for offline development only.
 */
export async function getProperties(params?: PropertyFilterParams): Promise<Property[]> {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      let query = supabase
        .from("properties")
        .select("*, property_images(*)")
        .order("created_at", { ascending: false });

      if (params?.status && params.status !== "ALL") {
        query = query.eq("status", params.status);
      }

      if (params?.property_type && params.property_type !== "ALL") {
        query = query.eq("property_type", params.property_type);
      }

      if (params?.min_price) {
        query = query.gte("price", params.min_price);
      }

      if (params?.max_price) {
        query = query.lte("price", params.max_price);
      }

      if (params?.min_area) {
        query = query.gte("area", params.min_area);
      }

      if (params?.max_area) {
        query = query.lte("area", params.max_area);
      }

      const { data, error } = await query;

      if (error) {
        console.error("[Supabase Query Error]:", error.message);
        throw error;
      }

      let results = (data || []).map(normalizeProperty);

      // Client-side text & location filtering if query provided
      if (params?.query && params.query.trim()) {
        const q = params.query.toLowerCase().trim();
        results = results.filter(
          (p) =>
            (p.title || p.name).toLowerCase().includes(q) ||
            p.location.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.property_type.toLowerCase().includes(q) ||
            p.highlights.some((h) => h.toLowerCase().includes(q))
        );
      }

      if (params?.location && params.location !== "ALL" && params.location.trim()) {
        const loc = params.location.toLowerCase().trim();
        results = results.filter((p) => p.location.toLowerCase().includes(loc));
      }

      // Sort
      if (params?.sort_by) {
        switch (params.sort_by) {
          case "price_asc":
            results.sort((a, b) => a.price - b.price);
            break;
          case "price_desc":
            results.sort((a, b) => b.price - a.price);
            break;
          case "area_asc":
            results.sort((a, b) => a.area - b.area);
            break;
          case "area_desc":
            results.sort((a, b) => b.area - a.area);
            break;
        }
      }

      return results;
    } catch (err) {
      console.warn("[Supabase] Failed to fetch live data:", err);
      // In production (when Supabase is configured), return empty array instead of leaking mock properties
      if (isSupabaseConfigured()) {
        return [];
      }
    }
  }

  // When Supabase is configured, never fall back to mock data
  if (isSupabaseConfigured()) {
    return [];
  }

  // Fallback to MOCK_PROPERTIES strictly for offline development without .env.local
  let results = MOCK_PROPERTIES.map(normalizeProperty);

  if (!params) return results;

  if (params.query && params.query.trim()) {
    const q = params.query.toLowerCase().trim();
    results = results.filter(
      (p) =>
        (p.title || p.name).toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.property_type.toLowerCase().includes(q) ||
        p.highlights.some((h) => h.toLowerCase().includes(q))
    );
  }

  if (params.location && params.location !== "ALL" && params.location.trim()) {
    const loc = params.location.toLowerCase().trim();
    results = results.filter((p) => p.location.toLowerCase().includes(loc));
  }

  if (params.property_type && params.property_type !== "ALL") {
    results = results.filter((p) => p.property_type === params.property_type);
  }

  if (params.status && params.status !== "ALL") {
    results = results.filter((p) => p.status === params.status);
  }

  if (params.min_price) {
    results = results.filter((p) => p.price >= (params.min_price as number));
  }

  if (params.max_price) {
    results = results.filter((p) => p.price <= (params.max_price as number));
  }

  if (params.min_area) {
    results = results.filter((p) => p.area >= (params.min_area as number));
  }

  if (params.max_area) {
    results = results.filter((p) => p.area <= (params.max_area as number));
  }

  if (params.sort_by) {
    switch (params.sort_by) {
      case "price_asc":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        results.sort((a, b) => b.price - a.price);
        break;
      case "area_asc":
        results.sort((a, b) => a.area - b.area);
        break;
      case "area_desc":
        results.sort((a, b) => b.area - a.area);
        break;
      default:
        results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }
  }

  return results;
}

/**
 * Fetches properties strictly for the Admin Dashboard.
 * Reads directly from Supabase and NEVER falls back to mock properties,
 * ensuring no mock IDs (such as prop-1) ever appear in administrative operations.
 */
export async function getAdminProperties(): Promise<Property[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("properties")
      .select("*, property_images(*)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Supabase getAdminProperties Error]:", error.message);
      return [];
    }

    return (data || []).map(normalizeProperty);
  } catch (err) {
    console.error("[Supabase getAdminProperties Exception]:", err);
    return [];
  }
}

/**
 * Fetches a single property by slug with all its associated images.
 */
export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*, property_images(*)")
        .eq("slug", slug)
        .maybeSingle();

      if (error) {
        console.error("[Supabase getPropertyBySlug Error]:", error.message);
        return null;
      } else if (data) {
        return normalizeProperty(data);
      }
      return null;
    } catch (err) {
      console.warn("[Supabase] Failed to fetch property by slug:", err);
      return null;
    }
  }

  // Fallback strictly for offline local development
  if (isSupabaseConfigured()) {
    return null;
  }

  const found = MOCK_PROPERTIES.find((p) => p.slug === slug);
  return found ? normalizeProperty(found) : null;
}

/**
 * Fetches a single property by ID with all its associated images.
 * Validates UUID format before querying Supabase to prevent PostgreSQL syntax errors.
 */
export async function getPropertyById(id: string): Promise<Property | null> {
  const supabase = getSupabaseClient();

  // If id is not a valid UUID format, avoid querying PostgreSQL UUID column
  if (!isUuid(id)) {
    if (isSupabaseConfigured()) {
      return null;
    }
    const found = MOCK_PROPERTIES.find((p) => p.id === id);
    return found ? normalizeProperty(found) : null;
  }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*, property_images(*)")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("[Supabase getPropertyById Error]:", error.message);
        return null;
      } else if (data) {
        return normalizeProperty(data);
      }
      return null;
    } catch (err) {
      console.warn("[Supabase] Failed to fetch property by id:", err);
      return null;
    }
  }

  if (isSupabaseConfigured()) {
    return null;
  }

  const found = MOCK_PROPERTIES.find((p) => p.id === id);
  return found ? normalizeProperty(found) : null;
}

/**
 * Fetches featured properties for Homepage.
 */
export async function getFeaturedProperties(): Promise<Property[]> {
  const all = await getProperties();
  return all.filter((p) => p.featured || p.status === "AVAILABLE").slice(0, 4);
}

/**
 * Fetches recent properties.
 */
export async function getRecentProperties(limit: number = 4): Promise<Property[]> {
  const all = await getProperties();
  return all.slice(0, limit);
}

/**
 * Fetches dashboard stats dynamically from database.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const all = isSupabaseConfigured() ? await getAdminProperties() : await getProperties();
  return {
    total_properties: all.length,
    available: all.filter((p) => p.status === "AVAILABLE").length,
    reserved: all.filter((p) => p.status === "RESERVED").length,
    sold: all.filter((p) => p.status === "SOLD").length,
    total_featured: all.filter((p) => p.featured).length,
  };
}

/**
 * Retrieves all unique locality names for filter dropdowns.
 */
export async function getAllLocations(): Promise<string[]> {
  const properties = await getProperties();
  const set = new Set<string>();
  properties.forEach((p) => {
    const mainLoc = p.location.split(",")[0].trim();
    if (mainLoc) set.add(mainLoc);
  });
  return Array.from(set);
}

/**
 * Checks connection status and reports if data is being served from live Supabase vs Demo fallback.
 */
export async function getDatabaseConnectionStatus(): Promise<{
  connected: boolean;
  source: "supabase" | "demo";
  message: string;
}> {
  if (!isSupabaseConfigured()) {
    return {
      connected: false,
      source: "demo",
      message: "Supabase environment variables not set in .env.local. Running in local Demo mode.",
    };
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      connected: false,
      source: "demo",
      message: "Failed to initialize Supabase client. Running in Demo mode.",
    };
  }

  try {
    const { count, error } = await supabase
      .from("properties")
      .select("*", { count: "exact", head: true });

    if (error) {
      return {
        connected: false,
        source: "demo",
        message: `Supabase returned an error (${error.message}). Running in Demo mode.`,
      };
    }

    return {
      connected: true,
      source: "supabase",
      message: `Successfully connected to live Supabase database (${count ?? 0} properties).`,
    };
  } catch (err: any) {
    return {
      connected: false,
      source: "demo",
      message: `Connection error: ${err.message || err}. Running in Demo mode.`,
    };
  }
}
