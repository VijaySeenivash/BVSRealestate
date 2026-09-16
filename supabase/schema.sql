-- ==============================================================================
-- BVS REAL ESTATE - SUPABASE DATABASE SCHEMA (PHASE 2)
-- ==============================================================================
-- This script creates the core relational tables for properties and property images,
-- sets up indexing for fast querying, and enables Row Level Security (RLS).
-- Execute this script in your Supabase Project's SQL Editor (supabase.com -> SQL Editor).
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROPERTIES TABLE
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    location TEXT NOT NULL,
    area NUMERIC NOT NULL,
    price NUMERIC NOT NULL,
    price_unit TEXT NOT NULL DEFAULT 'Lakhs',
    property_type TEXT NOT NULL, -- e.g. LAND, RESIDENTIAL PLOT, HOUSE, AGRICULTURAL LAND, COMMERCIAL PROPERTY
    status TEXT NOT NULL DEFAULT 'AVAILABLE', -- AVAILABLE, RESERVED, SOLD
    description TEXT NOT NULL,
    highlights TEXT[] DEFAULT '{}',
    maps_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. PROPERTY IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.property_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_properties_slug ON public.properties(slug);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_type ON public.properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON public.properties(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON public.property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_property_images_display_order ON public.property_images(display_order ASC);

-- 5. AUTO-UPDATE UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_properties_updated_at ON public.properties;
CREATE TRIGGER set_properties_updated_at
    BEFORE UPDATE ON public.properties
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 6. ROW LEVEL SECURITY (RLS)
-- Protects database from unauthorized modifications while allowing public visitors to read properties.
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;

-- Allow anyone (public/anonymous) to view properties
CREATE POLICY "Allow public read access to properties"
    ON public.properties
    FOR SELECT
    USING (true);

-- Allow anyone (public/anonymous) to view property images
CREATE POLICY "Allow public read access to property_images"
    ON public.property_images
    FOR SELECT
    USING (true);

-- Note: In Phase 3 (Admin Dashboard), write policies (INSERT, UPDATE, DELETE)
-- will be granted exclusively to authenticated administrative users.
