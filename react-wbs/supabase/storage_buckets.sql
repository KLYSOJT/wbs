-- =====================================================================
-- RMNHS WEB-BASED SYSTEM
-- SUPABASE STORAGE BUCKETS & RLS POLICIES
-- =====================================================================
-- Run this script in your Supabase SQL Editor AFTER running
-- database_schema.sql. It creates all 10 storage buckets and locks
-- them down so only authenticated admins can upload or delete files,
-- while the public can freely read/download any file.
-- =====================================================================

-- =====================================================================
-- 🪣 STEP 1: CREATE ALL 10 STORAGE BUCKETS
-- =====================================================================
-- All buckets are set to public = true so that getPublicUrl() works
-- correctly for frontend rendering. Access control is enforced at the
-- RLS policy level below, NOT through bucket-level privacy.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  -- PDF Document Buckets
  ('memoranda-files',       'memoranda-files',       true, 20971520,  ARRAY['application/pdf']),
  ('learning-materials',    'learning-materials',    true, 20971520,  ARRAY['application/pdf']),
  ('research-pdfs',         'research-pdfs',         true, 20971520,  ARRAY['application/pdf']),

  -- Image Buckets
  ('research-covers',       'research-covers',       true, 5242880,   ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('org-logos',             'org-logos',             true, 5242880,   ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']),
  ('org-charts',            'org-charts',            true, 10485760,  ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('organizational-charts', 'organizational-charts', true, 10485760,  ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('announcement-images',   'announcement-images',   true, 5242880,   ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('news-images',           'news-images',           true, 5242880,   ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('featured-videos',       'featured-videos',       true, 104857600, ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']),
  ('compliance-reports',    'compliance-reports',    true, 20971520,  ARRAY['application/pdf'])

ON CONFLICT (id) DO NOTHING; -- Safe to re-run: skips already existing buckets

-- =====================================================================
-- 🔓 STEP 2: PUBLIC READ POLICIES (SELECT)
-- =====================================================================
-- Anyone (logged in or not) can view and download files from all buckets.
-- This is required for public pages to render images and open PDFs.

-- PDF Buckets
CREATE POLICY "Public can read memoranda files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'memoranda-files');

CREATE POLICY "Public can read learning materials"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'learning-materials');

CREATE POLICY "Public can read research PDFs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'research-pdfs');

-- Image Buckets
CREATE POLICY "Public can read research covers"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'research-covers');

CREATE POLICY "Public can read org logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'org-logos');

CREATE POLICY "Public can read org charts"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'org-charts');

CREATE POLICY "Public can read organizational charts"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'organizational-charts');

CREATE POLICY "Public can read announcement images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'announcement-images');

CREATE POLICY "Public can read news images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'news-images');

CREATE POLICY "Public can read featured video thumbnails"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'featured-videos');

-- =====================================================================
-- 🔒 STEP 3: ADMIN-ONLY WRITE POLICIES (INSERT / UPDATE / DELETE)
-- =====================================================================
-- Only authenticated users with role = 'admin' in the profiles table
-- can upload, replace, or delete files. We reuse the is_admin()
-- SECURITY DEFINER function from database_schema.sql to avoid
-- any risk of RLS recursion.

-- memoranda-files
CREATE POLICY "Admins can upload memoranda files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'memoranda-files' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update memoranda files"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'memoranda-files' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete memoranda files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'memoranda-files' AND public.is_admin(auth.uid()));

-- learning-materials
CREATE POLICY "Admins can upload learning materials"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'learning-materials' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update learning materials"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'learning-materials' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete learning materials"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'learning-materials' AND public.is_admin(auth.uid()));

-- research-pdfs
CREATE POLICY "Admins can upload research PDFs"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'research-pdfs' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update research PDFs"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'research-pdfs' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete research PDFs"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'research-pdfs' AND public.is_admin(auth.uid()));

-- research-covers
CREATE POLICY "Admins can upload research covers"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'research-covers' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update research covers"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'research-covers' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete research covers"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'research-covers' AND public.is_admin(auth.uid()));

-- org-logos
CREATE POLICY "Admins can upload org logos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'org-logos' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update org logos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'org-logos' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete org logos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'org-logos' AND public.is_admin(auth.uid()));

-- org-charts
CREATE POLICY "Admins can upload org charts"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'org-charts' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update org charts"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'org-charts' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete org charts"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'org-charts' AND public.is_admin(auth.uid()));

-- organizational-charts
CREATE POLICY "Admins can upload organizational charts"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'organizational-charts' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update organizational charts"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'organizational-charts' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete organizational charts"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'organizational-charts' AND public.is_admin(auth.uid()));

-- announcement-images
CREATE POLICY "Admins can upload announcement images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'announcement-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update announcement images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'announcement-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete announcement images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'announcement-images' AND public.is_admin(auth.uid()));

-- news-images
CREATE POLICY "Admins can upload news images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'news-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update news images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'news-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete news images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'news-images' AND public.is_admin(auth.uid()));

-- featured-videos
CREATE POLICY "Admins can upload featured videos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'featured-videos' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update featured videos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'featured-videos' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete featured videos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'featured-videos' AND public.is_admin(auth.uid()));

-- compliance-reports
CREATE POLICY "Public can read compliance reports"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'compliance-reports');

CREATE POLICY "Admins can upload compliance reports"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'compliance-reports' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update compliance reports"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'compliance-reports' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete compliance reports"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'compliance-reports' AND public.is_admin(auth.uid()));

-- =====================================================================
-- ✅ STORAGE SETUP DONE!
-- =====================================================================
-- Summary of what was configured:
--
-- BUCKETS CREATED (11):
--   PDF  → memoranda-files (20 MB limit)
--   PDF  → learning-materials (20 MB limit)
--   PDF  → research-pdfs (20 MB limit)
--   PDF  → compliance-reports (20 MB limit) ← for recognized orgs PDF
--   IMG  → research-covers (5 MB limit)
--   IMG  → org-logos (5 MB limit, includes SVG)
--   IMG  → org-charts (10 MB limit)
--   IMG  → organizational-charts (10 MB limit)
--   IMG  → announcement-images (5 MB limit)
--   IMG  → news-images (5 MB limit)
--   VID  → featured-videos (100 MB limit, mp4/webm/ogg/mov)
--
-- POLICIES PER BUCKET (4 each = 44 total):
--   ✓ Public SELECT  → anyone can read/download
--   ✓ Admin INSERT   → only admins can upload
--   ✓ Admin UPDATE   → only admins can replace
--   ✓ Admin DELETE   → only admins can remove
-- =====================================================================
