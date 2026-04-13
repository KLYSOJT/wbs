-- announcement
CREATE TABLE announcement (
  id bigint PRIMARY KEY,
  image text,
  announcement_posts text NOT NULL,
  timestamp text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- RLS policies for announcement table
ALTER TABLE announcement ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read announcements" ON announcement FOR SELECT USING (true);
CREATE POLICY "Admin write announcements" ON announcement FOR ALL USING (true) WITH CHECK (true);

-- news
CREATE TABLE news (
  id bigint PRIMARY KEY,
  image text,
  news_posts text NOT NULL,
  timestamp text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- RLS policies for news table (Fixes 42501 error)
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read news" ON news FOR SELECT USING (true);
CREATE POLICY "Admin write news" ON news FOR ALL USING (true) WITH CHECK (true);

-- featured_videos
CREATE TABLE featured_videos (
  id bigint PRIMARY KEY,
  title text NOT NULL,
  type text NOT NULL,
  url text,
  fileName text,
  timestamp text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- RLS policies for featured_videos table
ALTER TABLE featured_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read featured videos" ON featured_videos FOR SELECT USING (true);
CREATE POLICY "Admin write featured videos" ON featured_videos FOR ALL USING (true) WITH CHECK (true);

-- school_memorandum
CREATE TABLE school_memorandum (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  date date NOT NULL,
  description text,
  file text,
  created_at timestamptz DEFAULT now()
);

-- RLS policies for school_memorandum table
ALTER TABLE school_memorandum ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read school_memorandum" ON school_memorandum FOR SELECT USING (true);
CREATE POLICY "Admin write school_memorandum" ON school_memorandum FOR ALL USING (true) WITH CHECK (true);

-- division_memorandum
CREATE TABLE division_memorandum (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  date date NOT NULL,
  description text,
  file text,
  created_at timestamptz DEFAULT now()
);

-- RLS policies for division_memorandum table
ALTER TABLE division_memorandum ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read division_memorandum" ON division_memorandum FOR SELECT USING (true);
CREATE POLICY "Admin write division_memorandum" ON division_memorandum FOR ALL USING (true) WITH CHECK (true);

-- deped_order
CREATE TABLE deped_order (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  date date NOT NULL,
  description text,
  file text,
  created_at timestamptz DEFAULT now()
);

-- RLS policies for deped_order table
ALTER TABLE deped_order ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read deped_order" ON deped_order FOR SELECT USING (true);
CREATE POLICY "Admin write deped_order" ON deped_order FOR ALL USING (true) WITH CHECK (true);

-- deped_memo
CREATE TABLE deped_memorandum (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  date date NOT NULL,
  description text,
  file text,
  created_at timestamptz DEFAULT now()
);

-- RLS policies for deped_memorandum table
ALTER TABLE deped_memorandum ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read deped_memorandum" ON deped_memorandum FOR SELECT USING (true);
CREATE POLICY "Admin write deped_memorandum" ON deped_memorandum FOR ALL USING (true) WITH CHECK (true);

-- spta
CREATE TABLE spta (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  date date NOT NULL,
  description text,
  file text,
  created_at timestamptz DEFAULT now()
);

-- RLS policies for spta table
ALTER TABLE spta ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read spta" ON spta FOR SELECT USING (true);
CREATE POLICY "Admin write spta" ON spta FOR ALL USING (true) WITH CHECK (true);

-- sslg
CREATE TABLE sslg (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  date date NOT NULL,
  description text,
  file text,
  created_at timestamptz DEFAULT now()
);

-- RLS policies for sslg table
ALTER TABLE sslg ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read sslg" ON sslg FOR SELECT USING (true);
CREATE POLICY "Admin write sslg" ON sslg FOR ALL USING (true) WITH CHECK (true);

-- bsp
CREATE TABLE bsp (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  date date NOT NULL,
  description text,
  file text,
  created_at timestamptz DEFAULT now()
);

-- RLS policies for bsp table
ALTER TABLE bsp ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read bsp" ON bsp FOR SELECT USING (true);
CREATE POLICY "Admin write bsp" ON bsp FOR ALL USING (true) WITH CHECK (true);

-- gsp
CREATE TABLE gsp (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  date date NOT NULL,
  description text,
  file text,
  created_at timestamptz DEFAULT now()
);

-- RLS policies for gsp table
ALTER TABLE gsp ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read gsp" ON gsp FOR SELECT USING (true);
CREATE POLICY "Admin write gsp" ON gsp FOR ALL USING (true) WITH CHECK (true);

-- tr
CREATE TABLE tr (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  date date NOT NULL,
  description text,
  file text,
  created_at timestamptz DEFAULT now()
);

-- RLS policies for tr table
ALTER TABLE tr ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read tr" ON tr FOR SELECT USING (true);
CREATE POLICY "Admin write tr" ON tr FOR ALL USING (true) WITH CHECK (true);

-- mooe
CREATE TABLE mooe (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  date date NOT NULL,
  description text,
  file text,
  created_at timestamptz DEFAULT now()
);

-- RLS policies for mooe table
ALTER TABLE mooe ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read mooe" ON mooe FOR SELECT USING (true);
CREATE POLICY "Admin write mooe" ON mooe FOR ALL USING (true) WITH CHECK (true);

-- redcross
CREATE TABLE redcross (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  date date NOT NULL,
  description text,
  file text,
  created_at timestamptz DEFAULT now()
);

-- RLS policies for redcross table
ALTER TABLE redcross ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read redcross" ON redcross FOR SELECT USING (true);
CREATE POLICY "Admin write redcross" ON redcross FOR ALL USING (true) WITH CHECK (true);

-- research
CREATE TABLE research (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  grade text NOT NULL,
  department text NOT NULL,
  year text NOT NULL,
  category text NOT NULL,
  image text,
  file text,
  created_at timestamptz DEFAULT now()
);

-- RLS policies for research table
ALTER TABLE research ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read research" ON research FOR SELECT USING (true);
CREATE POLICY "Admin write research" ON research FOR ALL USING (true) WITH CHECK (true);

-- transparency
CREATE TABLE transparency (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  type text NOT NULL,
  title text NOT NULL,
  date date NOT NULL,
  description text,
  file text,
  created_at timestamptz DEFAULT now()
);

-- RLS policies for transparency table
ALTER TABLE transparency ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read transparency" ON transparency FOR SELECT USING (true);
CREATE POLICY "Admin write transparency" ON transparency FOR ALL USING (true) WITH CHECK (true);

-- learning_materials
CREATE TABLE learning_materials (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  grade text NOT NULL,
  subject text NOT NULL,
  file text NOT NULL,
  path text NOT NULL,
  filesize integer,
  created_at timestamptz DEFAULT now()
);

-- RLS policies for learning_materials table
ALTER TABLE learning_materials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read learning_materials" ON learning_materials FOR SELECT USING (true);
CREATE POLICY "Admin write learning_materials" ON learning_materials FOR ALL USING (true) WITH CHECK (true);

-- organizational_structure
CREATE TABLE organizational_structure (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  department text UNIQUE NOT NULL,
  mime text,
  image text,
  pdf text,
  pdf_mime text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS policies for organizational_structure table
ALTER TABLE organizational_structure ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read organizational_structure" ON organizational_structure FOR SELECT USING (true);
CREATE POLICY "Admin write organizational_structure" ON organizational_structure FOR ALL USING (true) WITH CHECK (true);

-- recognized_organization
CREATE TABLE recognized_organization (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  org_name text NOT NULL,
  date_established integer,
  adviser_name text,
  image_url text NOT NULL,
  image_path text NOT NULL,
  image_mime text,
  logo_url text,
  logo_path text,
  logo_mime text,
  chart_url text,
  chart_path text,
  chart_mime text,
  pdf_url text,
  pdf_path text,
  pdf_mime text,
  pdf_urls text[] DEFAULT '{}'::text[],
  pdf_paths text[] DEFAULT '{}'::text[],
  pdf_mimes text[] DEFAULT '{}'::text[],
  pdf_names text[] DEFAULT '{}'::text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS policies for recognized_organization table
ALTER TABLE recognized_organization ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read recognized_organization" ON recognized_organization FOR SELECT USING (true);
CREATE POLICY "Admin write recognized_organization" ON recognized_organization FOR ALL USING (true) WITH CHECK (true);

-- app
CREATE TABLE app (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  date date NOT NULL,
  description text,
  file text,
  created_at timestamptz DEFAULT now()
);

-- RLS policies for app table
ALTER TABLE app ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read app" ON app FOR SELECT USING (true);
CREATE POLICY "Admin write app" ON app FOR ALL USING (true) WITH CHECK (true);

-- award_contracts
CREATE TABLE award_contracts (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  date date NOT NULL,
  description text,
  file text,
  created_at timestamptz DEFAULT now()
);

-- RLS policies for award_contracts table
ALTER TABLE award_contracts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read award_contracts" ON award_contracts FOR SELECT USING (true);
CREATE POLICY "Admin write award_contracts" ON award_contracts FOR ALL USING (true) WITH CHECK (true);

-- bac
CREATE TABLE bac (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  date date NOT NULL,
  description text,
  file text,
  created_at timestamptz DEFAULT now()
);

-- RLS policies for bac table
ALTER TABLE bac ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read bac" ON bac FOR SELECT USING (true);
CREATE POLICY "Admin write bac" ON bac FOR ALL USING (true) WITH CHECK (true);

-- bid_bulletin
CREATE TABLE bid_bulletin (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  date date NOT NULL,
  description text,
  file text,
  created_at timestamptz DEFAULT now()
);

-- RLS policies for bid_bulletin table
ALTER TABLE bid_bulletin ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read bid_bulletin" ON bid_bulletin FOR SELECT USING (true);
CREATE POLICY "Admin write bid_bulletin" ON bid_bulletin FOR ALL USING (true) WITH CHECK (true);

-- philgeps
CREATE TABLE philgeps (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  date date NOT NULL,
  description text,
  file text,
  created_at timestamptz DEFAULT now()
);

-- RLS policies for philgeps table
ALTER TABLE philgeps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read philgeps" ON philgeps FOR SELECT USING (true);
CREATE POLICY "Admin write philgeps" ON philgeps FOR ALL USING (true) WITH CHECK (true);

-- procurement_report
CREATE TABLE procurement_report (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  date date NOT NULL,
  description text,
  file text,
  created_at timestamptz DEFAULT now()
);

-- RLS policies for procurement_report table
ALTER TABLE procurement_report ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read procurement_report" ON procurement_report FOR SELECT USING (true);
CREATE POLICY "Admin write procurement_report" ON procurement_report FOR ALL USING (true) WITH CHECK (true);

-- invitation_bid
CREATE TABLE invitation_bid (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  date date NOT NULL,
  description text,
  file text,
  created_at timestamptz DEFAULT now()
);

-- RLS policies for invitation_bid table
ALTER TABLE invitation_bid ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read invitation_bid" ON invitation_bid FOR SELECT USING (true);
CREATE POLICY "Admin write invitation_bid" ON invitation_bid FOR ALL USING (true) WITH CHECK (true);
