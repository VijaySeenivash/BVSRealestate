-- ==============================================================================
-- BVS REAL ESTATE - COMPLETE PRODUCTION DATABASE SCHEMA & STORAGE MIGRATION
-- ==============================================================================
-- This script creates the complete, production-ready schema expected by the 
-- deployed BVS Real Estate application:
-- 1. Extensions (uuid-ossp, pgcrypto)
-- 2. public.properties table (exact fields & types matching the Next.js app)
-- 3. public.property_images table (Foreign Key to properties(id) ON DELETE CASCADE)
-- 4. Preserves public.admin_users table (role-based access control)
-- 5. Hardened public.is_admin() function (SECURITY DEFINER with safe search_path)
-- 6. Full Row Level Security (RLS) policies for properties, images, and admin_users
-- 7. Supabase Storage bucket ('property-images') with public read & admin-only write
-- 8. Performance indexes and auto-updating timestamp trigger
--
-- Safe to run in the Supabase SQL Editor: It is idempotent (uses IF NOT EXISTS,
-- DROP POLICY IF EXISTS, and ON CONFLICT). It will NOT erase existing admin users.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. EXTENSIONS
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 2. ADMIN USERS TABLE (PRESERVED)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. HARDENED is_admin() FUNCTION
-- ------------------------------------------------------------------------------
-- Sets search_path = public, auth to eliminate search_path injection risks.
-- Returns TRUE if and only if auth.uid() is in public.admin_users.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid()
    );
END;
$$;

-- Revoke default public execution; grant only to authenticated and service_role
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;

-- ------------------------------------------------------------------------------
-- 4. PROPERTIES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    location TEXT NOT NULL,
    area NUMERIC NOT NULL,
    area_unit TEXT DEFAULT 'sq.ft',
    price NUMERIC NOT NULL,
    price_unit TEXT NOT NULL DEFAULT 'Lakhs',
    property_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'AVAILABLE', -- 'AVAILABLE', 'RESERVED', 'SOLD'
    description TEXT NOT NULL,
    highlights TEXT[] DEFAULT '{}',
    maps_url TEXT,
    road_access TEXT,
    approval_info TEXT,
    featured BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- If the table already existed with a partial column set, ensure newly added columns exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'properties' AND column_name = 'area_unit') THEN
        ALTER TABLE public.properties ADD COLUMN area_unit TEXT DEFAULT 'sq.ft';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'properties' AND column_name = 'road_access') THEN
        ALTER TABLE public.properties ADD COLUMN road_access TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'properties' AND column_name = 'approval_info') THEN
        ALTER TABLE public.properties ADD COLUMN approval_info TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'properties' AND column_name = 'featured') THEN
        ALTER TABLE public.properties ADD COLUMN featured BOOLEAN DEFAULT true;
    END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 5. PROPERTY IMAGES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.property_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. PERFORMANCE INDEXES
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_properties_slug ON public.properties(slug);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_type ON public.properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON public.properties(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON public.property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_property_images_display_order ON public.property_images(display_order ASC);
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);

-- ------------------------------------------------------------------------------
-- 7. UPDATED_AT TRIGGER FUNCTION
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) - ADMIN USERS
-- ------------------------------------------------------------------------------
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow users to read own admin record" ON public.admin_users;
CREATE POLICY "Allow users to read own admin record"
    ON public.admin_users
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow admin modify admin_users" ON public.admin_users;
CREATE POLICY "Allow admin modify admin_users"
    ON public.admin_users
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 9. ROW LEVEL SECURITY (RLS) - PROPERTIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Anyone (public, anonymous, authenticated) can read properties
DROP POLICY IF EXISTS "Allow public read access to properties" ON public.properties;
CREATE POLICY "Allow public read access to properties"
    ON public.properties
    FOR SELECT
    USING (true);

-- Only verified admins can INSERT properties
DROP POLICY IF EXISTS "Allow admin insert properties" ON public.properties;
CREATE POLICY "Allow admin insert properties"
    ON public.properties
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

-- Only verified admins can UPDATE properties
DROP POLICY IF EXISTS "Allow admin update properties" ON public.properties;
CREATE POLICY "Allow admin update properties"
    ON public.properties
    FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Only verified admins can DELETE properties
DROP POLICY IF EXISTS "Allow admin delete properties" ON public.properties;
CREATE POLICY "Allow admin delete properties"
    ON public.properties
    FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 10. ROW LEVEL SECURITY (RLS) - PROPERTY IMAGES
-- ------------------------------------------------------------------------------
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;

-- Anyone (public, anonymous, authenticated) can read property image records
DROP POLICY IF EXISTS "Allow public read access to property_images" ON public.property_images;
CREATE POLICY "Allow public read access to property_images"
    ON public.property_images
    FOR SELECT
    USING (true);

-- Only verified admins can INSERT property image records
DROP POLICY IF EXISTS "Allow admin insert property_images" ON public.property_images;
CREATE POLICY "Allow admin insert property_images"
    ON public.property_images
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

-- Only verified admins can UPDATE property image records
DROP POLICY IF EXISTS "Allow admin update property_images" ON public.property_images;
CREATE POLICY "Allow admin update property_images"
    ON public.property_images
    FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Only verified admins can DELETE property image records
DROP POLICY IF EXISTS "Allow admin delete property_images" ON public.property_images;
CREATE POLICY "Allow admin delete property_images"
    ON public.property_images
    FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 11. SUPABASE STORAGE BUCKET & STORAGE RLS POLICIES
-- ------------------------------------------------------------------------------
-- Create public storage bucket 'property-images' if it doesn't already exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Public can view/download images stored in 'property-images' bucket
DROP POLICY IF EXISTS "Public can view property images" ON storage.objects;
CREATE POLICY "Public can view property images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'property-images');

-- Only verified admins can upload files to 'property-images' bucket
DROP POLICY IF EXISTS "Admin can upload property images" ON storage.objects;
CREATE POLICY "Admin can upload property images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'property-images' 
        AND public.is_admin()
    );

-- Only verified admins can update files in 'property-images' bucket
DROP POLICY IF EXISTS "Admin can update property images" ON storage.objects;
CREATE POLICY "Admin can update property images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'property-images' 
        AND public.is_admin()
    );

-- Only verified admins can delete files from 'property-images' bucket
DROP POLICY IF EXISTS "Admin can delete property images" ON storage.objects;
CREATE POLICY "Admin can delete property images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'property-images' 
        AND public.is_admin()
    );
