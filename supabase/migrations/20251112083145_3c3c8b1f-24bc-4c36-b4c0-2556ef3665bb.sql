-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create books table (if not exists)
CREATE TABLE IF NOT EXISTS public.books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    currency TEXT DEFAULT 'INR',
    image_url TEXT,
    author TEXT,
    pages INTEGER,
    language TEXT,
    category TEXT,
    content_preview TEXT,
    book_type TEXT DEFAULT 'hardcover' CHECK (book_type IN ('hardcover', 'ebook', 'both')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- Books policies
CREATE POLICY "Anyone can view books"
ON public.books
FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Only admins can manage books"
ON public.books
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create audio_content table
CREATE TABLE public.audio_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    audio_url TEXT NOT NULL,
    duration INTEGER,
    category TEXT,
    book_id UUID REFERENCES public.books(id) ON DELETE SET NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.audio_content ENABLE ROW LEVEL SECURITY;

-- Audio policies
CREATE POLICY "Anyone can view audio"
ON public.audio_content
FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Only admins can manage audio"
ON public.audio_content
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create animated_series table
CREATE TABLE public.animated_series (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    episode_number INTEGER,
    season_number INTEGER,
    video_url TEXT,
    duration INTEGER,
    category TEXT,
    book_id UUID REFERENCES public.books(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.animated_series ENABLE ROW LEVEL SECURITY;

-- Animated series policies
CREATE POLICY "Anyone can view animated series"
ON public.animated_series
FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Only admins can manage animated series"
ON public.animated_series
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create triggers for updated_at (using correct function name)
CREATE TRIGGER update_books_updated_at
BEFORE UPDATE ON public.books
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_audio_content_updated_at
BEFORE UPDATE ON public.audio_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_animated_series_updated_at
BEFORE UPDATE ON public.animated_series
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Create storage buckets for content
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('book-covers', 'book-covers', true),
  ('audio-files', 'audio-files', true),
  ('video-content', 'video-content', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for book covers
CREATE POLICY "Public can view book covers"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'book-covers');

CREATE POLICY "Admins can upload book covers"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'book-covers' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update book covers"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'book-covers' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete book covers"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'book-covers' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Storage policies for audio files
CREATE POLICY "Public can view audio files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'audio-files');

CREATE POLICY "Admins can upload audio files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'audio-files' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update audio files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'audio-files' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete audio files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'audio-files' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Storage policies for video content
CREATE POLICY "Public can view video content"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'video-content');

CREATE POLICY "Admins can upload video content"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'video-content' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update video content"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'video-content' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete video content"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'video-content' 
  AND public.has_role(auth.uid(), 'admin')
);