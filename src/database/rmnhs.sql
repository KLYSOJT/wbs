-- announcement
CREATE TABLE announcement (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  image text NOT NULL,
  announcement_posts text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- news
CREATE TABLE news (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  image text NOT NULL,
  news_posts text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- featured_videos
CREATE TABLE featured_videos (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  description text,
  filename text,
  url text,
  created_at timestamptz DEFAULT now()
);

-- school_memorandum
CREATE TABLE school_memorandum (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  date date NOT NULL,
  description text,
  file text,
  created_at timestamptz DEFAULT now()
);

-- division_memorandum
CREATE TABLE division_memorandum (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  date date NOT NULL,
  description text,
  file text,
  created_at timestamptz DEFAULT now()
);

-- deped_order
CREATE TABLE deped_order (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  date date NOT NULL,
  description text,
  file text,
  created_at timestamptz DEFAULT now()
);

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