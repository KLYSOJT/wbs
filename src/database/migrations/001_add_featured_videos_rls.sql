-- Migration: Add RLS policies to featured_videos table (Fix PGRST204 schema cache)

-- Enable RLS on featured_videos
ALTER TABLE featured_videos ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read featured videos" ON featured_videos 
FOR SELECT USING (true);

-- Admin write access (all operations)
CREATE POLICY "Admin write featured videos" ON featured_videos 
FOR ALL USING (true) WITH CHECK (true);

-- Verify table structure (run this to check)
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'featured_videos';

COMMENT ON TABLE featured_videos IS 'Featured videos for admin dashboard - fixed schema cache issue with RLS';

-- Run this in Supabase Dashboard > SQL Editor to fix storage immediately.
