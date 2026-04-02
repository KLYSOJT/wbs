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
  date_established date,
  adviser_name text,
  mime text,
  image text,
  pdf text,
  pdf_mime text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS policies for recognized_organization table
ALTER TABLE recognized_organization ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read recognized_organization" ON recognized_organization FOR SELECT USING (true);
CREATE POLICY "Admin write recognized_organization" ON recognized_organization FOR ALL USING (true) WITH CHECK (true);
