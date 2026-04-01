-- Migration: Add fileName column to featured_videos table
-- This fixes the PGRST204 error about missing 'fileName' column

-- Check if column exists and add if missing
ALTER TABLE featured_videos
ADD COLUMN IF NOT EXISTS fileName text;

-- Verify the column was added
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'featured_videos' 
-- ORDER BY ordinal_position;
