-- Create guests table for RSVP tracking
CREATE TABLE IF NOT EXISTS guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  attending BOOLEAN DEFAULT NULL,
  additional_guests INTEGER DEFAULT 0,
  attending_ceremony BOOLEAN DEFAULT TRUE,
  attending_traditional BOOLEAN DEFAULT TRUE,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all read" ON guests FOR SELECT USING (true);
CREATE POLICY "Allow all insert" ON guests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update" ON guests FOR UPDATE USING (true);

-- Create photos table for gallery metadata
CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_by TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all read" ON photos FOR SELECT USING (true);
CREATE POLICY "Allow all insert" ON photos FOR INSERT WITH CHECK (true);
