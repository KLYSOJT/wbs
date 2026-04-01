# Fix Supabase featured_videos PGRST204 Error - Progress Tracker

## Plan Steps:
- [x] 1. Analyze files and create detailed plan (complete)
- [ ] 2. User runs SQL in Supabase Dashboard to create table + RLS (user action)
  ```sql
  -- Step 2a: Create table (idempotent)
  CREATE TABLE IF NOT EXISTS featured_videos (
    id bigint PRIMARY KEY,
    title text NOT NULL,
    type text NOT NULL,
    url text,
    fileName text,
    timestamp text NOT NULL,
    created_at timestamptz DEFAULT now()
  );
  
  -- Step 2b: RLS + Policies
  ALTER TABLE featured_videos ENABLE ROW LEVEL SECURITY;
  DROP POLICY IF EXISTS "Public read featured videos" ON featured_videos;
  CREATE POLICY "Public read featured videos" ON featured_videos FOR SELECT USING (true);
  DROP POLICY IF EXISTS "Admin write featured videos" ON featured_videos;
  CREATE POLICY "Admin write featured videos" ON featured_videos FOR ALL USING (true) WITH CHECK (true);
  
  -- Step 2c: Verify columns
  SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'featured_videos';
  ```
- [ ] 3. Test video upload in app (no more 400/PGRST204)
- [x] 4. Cleanup comments in src/js/admin/home.js (complete - outdated comments removed)
- [x] 5. Create/update TODO.md for tracking

## Status
Awaiting user to run SQL in https://rblihflxnquckzmmsxis.supabase.co/ > SQL Editor, then test upload. Reply with results to proceed.

**Next:** After SQL + test success, cleanup code comments and mark complete.

