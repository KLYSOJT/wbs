-- =====================================================================
-- RECTO MEMORIAL NATIONAL HIGH SCHOOL (RMNHS) WEB-BASED SYSTEM
-- COMPREHENSIVE SUPABASE DATABASE SCHEMA MIGRATION SCRIPT
-- =====================================================================
-- This script sets up the entire PostgreSQL database on Supabase:
-- 1. Custom Security Definer Helper Functions (To avoid RLS recursion)
-- 2. Automatic Auth-to-Profile Sync Trigger
-- 3. Core Tables: profiles, announcements, news, learning_materials, research, orgs, structure
-- 4. 20 parameterized legal/transparency memorandum tables
-- 5. Row-Level Security (RLS) Policies (Public READ, Admin WRITE)
-- =====================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================
-- 🛡️ 1. SECURITY DEFINER HELPER FUNCTION (RLS Recursion Fix)
-- =====================================================================
-- Writing a custom SECURITY DEFINER function forces PostgreSQL to execute
-- role checks using the system role bypass rather than evaluating the profile 
-- table's RLS policies in a loop. This completely avoids the infinite recursion
-- bug (HTTP 500) mentioned in your troubleshooting docs.

CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================================
-- 👤 2. PROFILES TABLE & SIGNUP TRIGGER
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role text DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  updated_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Automatic Profile Synchronization on SignUp
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (new.id, 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================================
-- 📣 3. ANNOUNCEMENTS TABLE
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.announcements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  image_url text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Announcements are readable by anyone" 
  ON public.announcements FOR SELECT USING (true);

CREATE POLICY "Only admins can modify announcements" 
  ON public.announcements FOR ALL USING (public.is_admin(auth.uid()));

-- =====================================================================
-- 📰 4. NEWS / CAMPUS JOURNAL TABLE
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.news (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  image_url text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "News stories are readable by anyone" 
  ON public.news FOR SELECT USING (true);

CREATE POLICY "Only admins can modify news" 
  ON public.news FOR ALL USING (public.is_admin(auth.uid()));

-- =====================================================================
-- 🎬 5. FEATURED VIDEOS TABLE
-- =====================================================================
-- Admin publishes video entries (title, description, embed URL).
-- Public homepage reads from this table to render the video playlist.

CREATE TABLE IF NOT EXISTS public.featured_videos (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title       text NOT NULL,
  description text,
  video_url   text NOT NULL, -- YouTube embed URL or direct video file URL
  created_at  timestamp with time zone DEFAULT now()
);

ALTER TABLE public.featured_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Featured videos are readable by anyone"
  ON public.featured_videos FOR SELECT USING (true);

CREATE POLICY "Only admins can modify featured videos"
  ON public.featured_videos FOR ALL USING (public.is_admin(auth.uid()));


-- =====================================================================
-- 📚 5. LEARNING MATERIALS / CURRICULUM VAULT
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.learning_materials (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  grade text NOT NULL, -- e.g. 'Grade 7', 'Grade 8', etc.
  subject text NOT NULL, -- e.g. 'ENGLISH', 'MATH', 'SCIENCE'
  title text NOT NULL,
  file_url text NOT NULL, -- Storage bucket URL to resource PDF
  quarter text DEFAULT 'Standard Module', -- e.g. 'Quarter 1', 'Quarter 2'
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.learning_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Learning materials are readable by anyone" 
  ON public.learning_materials FOR SELECT USING (true);

CREATE POLICY "Only admins can modify learning materials" 
  ON public.learning_materials FOR ALL USING (public.is_admin(auth.uid()));

-- =====================================================================
-- 🎓 6. SCHOLARLY RESEARCH TABLE
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.research (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  grade text, -- e.g. 'grade-7', 'grade-12'
  department text, -- e.g. 'science', 'mathematics', 'english'
  year integer,
  category text, -- e.g. 'Research', 'Action Research'
  file text, -- Storage PDF file URL
  image text, -- Cover image URL
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.research ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Research articles are readable by anyone" 
  ON public.research FOR SELECT USING (true);

CREATE POLICY "Only admins can modify research" 
  ON public.research FOR ALL USING (public.is_admin(auth.uid()));

-- =====================================================================
-- 🗺️ 7. ORGANIZATIONAL STRUCTURE (DEPARTMENT LEADER CHARTS)
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.organizational_structure (
  department text PRIMARY KEY, -- e.g. 'TLE', 'Math', 'English'
  image text, -- Storage URL to structure flow image
  updated_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.organizational_structure ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org structures are readable by anyone" 
  ON public.organizational_structure FOR SELECT USING (true);

CREATE POLICY "Only admins can modify org structures" 
  ON public.organizational_structure FOR ALL USING (public.is_admin(auth.uid()));

-- =====================================================================
-- 👥 8. RECOGNIZED ORGANIZATIONS TABLE
-- =====================================================================

CREATE TABLE IF NOT EXISTS public."recognized-structure" (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  org_name text NOT NULL,
  date_established date,
  adviser_name text,
  logo_url text,
  chart_url text,
  image_url text,
  pdf_url text,
  pdf_urls text[] DEFAULT '{}'::text[],
  pdf_names text[] DEFAULT '{}'::text[],
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public."recognized-structure" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organizations are readable by anyone" 
  ON public."recognized-structure" FOR SELECT USING (true);

CREATE POLICY "Only admins can modify organizations" 
  ON public."recognized-structure" FOR ALL USING (public.is_admin(auth.uid()));

-- =====================================================================
-- 📜 9. DYNAMIC REUSABLE MEMORANDUMS & FISCAL TRANSPARENCY ARCHIVES
-- =====================================================================
-- The application relies on 20 distinct tables which share the exact 
-- same schema to enable DRY parametrized lookups in Memorandum.jsx.
-- We declare them procedurally using a PL/pgSQL block.

DO $$
DECLARE
  table_name text;
  tables text[] := ARRAY[
    'school_memorandum',
    'division_memorandum',
    'deped_memorandum',
    'deped_order',
    'app',
    'award_of_contracts',
    'bac',
    'bid_bulletin',
    'invitation_to_bid',
    'philgeps',
    'procurement_reports',
    'spta',
    'sslg',
    'bsp',
    'gsp',
    'tr',
    'mooe',
    'red_cross',
    'sef',
    'year_end_report'
  ];
BEGIN
  FOREACH table_name IN ARRAY tables LOOP
    
    -- Create Table
    EXECUTE format('
      CREATE TABLE IF NOT EXISTS public.%I (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        date date NOT NULL,
        title text NOT NULL,
        description text,
        file text, -- Storage bucket file URL
        created_at timestamp with time zone DEFAULT now()
      )
    ', table_name);

    -- Enable RLS
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);

    -- Create RLS Select Policy
    EXECUTE format('
      CREATE POLICY %I ON public.%I FOR SELECT USING (true)
    ', table_name || '_select_policy', table_name);

    -- Create RLS Admin Policies
    EXECUTE format('
      CREATE POLICY %I ON public.%I FOR ALL USING (public.is_admin(auth.uid()))
    ', table_name || '_admin_all_policy', table_name);

  END LOOP;
END $$;

-- =====================================================================
-- 🚀 MIGRATION SETUP DONE!
-- =====================================================================
-- Copy and paste this script directly into the Supabase SQL Editor and
-- click "Run". It will cleanly create all tables, enforce strict RLS,
-- resolve recursion limits, and build user-profile hooks.
