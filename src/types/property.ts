import { PropertyStatus } from "@/config/site";
export type { PropertyStatus };

export type PropertyType = string;

export interface PropertyImage {
  id: string;
  property_id?: string;
  image_url: string;
  display_order: number;
  created_at?: string;
  alt_text?: string;
  is_primary?: boolean;
}

export interface Property {
  id: string;
  title?: string; // Supabase database column
  name: string; // UI property name alias
  slug: string;
  location: string;
  area: number;
  area_unit?: "sq.ft" | "cents" | "acres";
  price: number;
  price_unit: string; // e.g. 'Lakhs', 'Crores'
  price_display?: string; // e.g. '₹18 Lakhs'
  property_type: PropertyType; // e.g. 'LAND', 'PLOT', 'HOUSE', 'APARTMENT', 'COMMERCIAL', etc.
  status: PropertyStatus; // 'AVAILABLE' | 'RESERVED' | 'SOLD'
  description: string;
  highlights: string[];
  maps_url?: string; // Supabase database column
  google_maps_url?: string; // UI alias for maps_url
  road_access?: string;
  approval_info?: string;
  featured?: boolean;
  images: PropertyImage[];
  created_at: string;
  updated_at: string;
}

export interface PropertyFilterParams {
  query?: string;
  location?: string;
  property_type?: string;
  min_price?: number;
  max_price?: number;
  min_area?: number;
  max_area?: number;
  status?: PropertyStatus | "ALL";
  sort_by?: "newest" | "price_asc" | "price_desc" | "area_asc" | "area_desc";
}

export interface DashboardStats {
  total_properties: number;
  available: number;
  reserved: number;
  sold: number;
  total_featured: number;
}
