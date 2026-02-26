-- Create storage bucket for wedding photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('wedding-photos', 'wedding-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to upload to the bucket
CREATE POLICY "Allow public upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'wedding-photos');

-- Allow anyone to read from the bucket
CREATE POLICY "Allow public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'wedding-photos');
