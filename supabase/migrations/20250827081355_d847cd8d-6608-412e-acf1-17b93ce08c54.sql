-- Create table to record image uploads
CREATE TABLE IF NOT EXISTS public.image_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  instagram TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.image_uploads ENABLE ROW LEVEL SECURITY;

-- RLS policies: users can insert/select their own rows
CREATE POLICY IF NOT EXISTS "Users can insert own image uploads"
ON public.image_uploads FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can view own image uploads"
ON public.image_uploads FOR SELECT
USING (auth.uid() = user_id);

-- Optional: allow users to delete their own uploads
CREATE POLICY IF NOT EXISTS "Users can delete own image uploads"
ON public.image_uploads FOR DELETE
USING (auth.uid() = user_id);

-- Keep updated_at fresh
CREATE TRIGGER IF NOT EXISTS update_image_uploads_updated_at
  BEFORE UPDATE ON public.image_uploads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();