BEGIN;

-- Create media storage bucket for blog CMS images and uploads (public read access)
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS: Anyone can read media objects (public bucket)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Media images are publicly accessible'
  ) THEN
    CREATE POLICY "Media images are publicly accessible"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'media');
  END IF;
END $$;

-- Storage RLS: Authenticated authors and admins can upload media
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated users can upload media'
  ) THEN
    CREATE POLICY "Authenticated users can upload media"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'media');
  END IF;
END $$;

-- Storage RLS: Authenticated authors and admins can update media
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated users can update media'
  ) THEN
    CREATE POLICY "Authenticated users can update media"
      ON storage.objects FOR UPDATE
      TO authenticated
      USING (bucket_id = 'media')
      WITH CHECK (bucket_id = 'media');
  END IF;
END $$;

-- Storage RLS: Authenticated authors and admins can delete media
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated users can delete media'
  ) THEN
    CREATE POLICY "Authenticated users can delete media"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (bucket_id = 'media');
  END IF;
END $$;

COMMIT;
