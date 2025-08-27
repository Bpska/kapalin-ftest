-- Create user-images bucket for storing user uploaded images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('user-images', 'user-images', true);

-- Create RLS policies for user-images bucket
CREATE POLICY "Anyone can view user images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'user-images');

CREATE POLICY "Users can upload their own images" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'user-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own images" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'user-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own images" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'user-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Fix the security warnings from previous migration by adding search_path
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;