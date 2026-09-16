-- ==============================================================================
-- BVS REAL ESTATE - PHASE 3: ADMIN AUTHENTICATION & AUTHORIZATION SCHEMA
-- ==============================================================================
-- This script configures:
-- 1. admin_users table for strict role-based access control
-- 2. is_admin() security definer function
-- 3. Row Level Security policies for INSERT, UPDATE, DELETE on properties & images
-- 4. Supabase Storage bucket 'property-images' with admin write policies
-- ==============================================================================

-- 1. ADMIN USERS TABLE
-- Tracks which authenticated Supabase users have administrator privileges.
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on admin_users table
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to check their own admin status
CREATE POLICY "Allow users to read own admin record"
    ON public.admin_users
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- 2. IS_ADMIN() HELPER FUNCTION
-- Returns TRUE if the current logged-in user exists in admin_users table
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. RLS POLICIES FOR PROPERTIES TABLE
-- Ensure public read remains active
DROP POLICY IF EXISTS "Allow public read access to properties" ON public.properties;
CREATE POLICY "Allow public read access to properties"
    ON public.properties
    FOR SELECT
    USING (true);

-- Admins can INSERT properties
DROP POLICY IF EXISTS "Allow admin insert properties" ON public.properties;
CREATE POLICY "Allow admin insert properties"
    ON public.properties
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

-- Admins can UPDATE properties
DROP POLICY IF EXISTS "Allow admin update properties" ON public.properties;
CREATE POLICY "Allow admin update properties"
    ON public.properties
    FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Admins can DELETE properties
DROP POLICY IF EXISTS "Allow admin delete properties" ON public.properties;
CREATE POLICY "Allow admin delete properties"
    ON public.properties
    FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- 4. RLS POLICIES FOR PROPERTY IMAGES TABLE
DROP POLICY IF EXISTS "Allow public read access to property_images" ON public.property_images;
CREATE POLICY "Allow public read access to property_images"
    ON public.property_images
    FOR SELECT
    USING (true);

-- Admins can INSERT images
DROP POLICY IF EXISTS "Allow admin insert property_images" ON public.property_images;
CREATE POLICY "Allow admin insert property_images"
    ON public.property_images
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

-- Admins can UPDATE images
DROP POLICY IF EXISTS "Allow admin update property_images" ON public.property_images;
CREATE POLICY "Allow admin update property_images"
    ON public.property_images
    FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Admins can DELETE images
DROP POLICY IF EXISTS "Allow admin delete property_images" ON public.property_images;
CREATE POLICY "Allow admin delete property_images"
    ON public.property_images
    FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- 5. SUPABASE STORAGE BUCKET FOR PROPERTY IMAGES
-- Create public storage bucket if it doesn't already exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public can view/download property images
DROP POLICY IF EXISTS "Public can view property images" ON storage.objects;
CREATE POLICY "Public can view property images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'property-images');

-- Admins can upload property images
DROP POLICY IF EXISTS "Admin can upload property images" ON storage.objects;
CREATE POLICY "Admin can upload property images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'property-images' AND public.is_admin());

-- Admins can update/replace property images
DROP POLICY IF EXISTS "Admin can update property images" ON storage.objects;
CREATE POLICY "Admin can update property images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'property-images' AND public.is_admin());

-- Admins can delete property images
DROP POLICY IF EXISTS "Admin can delete property images" ON storage.objects;
CREATE POLICY "Admin can delete property images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'property-images' AND public.is_admin());

-- ==============================================================================
-- HOW TO CREATE YOUR FIRST ADMIN USER:
-- ==============================================================================
-- 1. In Supabase Dashboard -> Authentication -> Users, click "Add User" -> "Create User"
--    Enter an admin email and secure password (e.g. admin@bvsrealestate.com).
-- 2. Copy the generated "User UID" (e.g. '3f84c1a2-xxxx-xxxx-xxxx-xxxxxxxxxxxx').
-- 3. Run the following command in SQL Editor (replace with your copied user_id and email):
--
--    INSERT INTO public.admin_users (user_id, email, role)
--    VALUES ('<PASTE_USER_UID_HERE>', 'admin@bvsrealestate.com', 'admin');
-- ==============================================================================
