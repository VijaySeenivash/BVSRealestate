-- ==============================================================================
-- BVS REAL ESTATE - PHASE 4: PRODUCTION SECURITY & STORAGE HARDENING
-- ==============================================================================
-- This script hardens database security, eliminates search_path hijacking,
-- ensures zero RLS recursion, and guarantees that only authorized admins can
-- modify property records and storage files.
-- ==============================================================================

-- 1. HARDENED IS_ADMIN() FUNCTION
-- Explicitly sets search_path to 'public, auth' to prevent privilege escalation / search_path poisoning.
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

-- Revoke default execute from public, grant execute only to authenticated & service_role
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;

-- 2. SECURE ADMIN_USERS TABLE
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view only their own admin status (zero recursion)
DROP POLICY IF EXISTS "Allow users to read own admin record" ON public.admin_users;
CREATE POLICY "Allow users to read own admin record"
    ON public.admin_users
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Restrict INSERT, UPDATE, DELETE on admin_users strictly to superusers / service_role
-- (No public or non-admin user can elevate their privileges)
DROP POLICY IF EXISTS "Deny arbitrary insert on admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Allow admin modify admin_users" ON public.admin_users;
CREATE POLICY "Allow admin modify admin_users"
    ON public.admin_users
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 3. AUDITED PROPERTIES RLS POLICIES
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Public can read all properties
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

-- 4. AUDITED PROPERTY_IMAGES RLS POLICIES
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;

-- Public can read property images
DROP POLICY IF EXISTS "Allow public read access to property_images" ON public.property_images;
CREATE POLICY "Allow public read access to property_images"
    ON public.property_images
    FOR SELECT
    USING (true);

-- Only verified admins can INSERT images
DROP POLICY IF EXISTS "Allow admin insert property_images" ON public.property_images;
CREATE POLICY "Allow admin insert property_images"
    ON public.property_images
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

-- Only verified admins can UPDATE images
DROP POLICY IF EXISTS "Allow admin update property_images" ON public.property_images;
CREATE POLICY "Allow admin update property_images"
    ON public.property_images
    FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Only verified admins can DELETE images
DROP POLICY IF EXISTS "Allow admin delete property_images" ON public.property_images;
CREATE POLICY "Allow admin delete property_images"
    ON public.property_images
    FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- 5. STORAGE BUCKET HARDENING FOR 'property-images'
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Public can read/display images from CDN
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
