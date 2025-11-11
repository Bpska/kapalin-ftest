-- Update the handle_new_user function to correctly extract phone number
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, name, phone, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.raw_user_meta_data->>'phone',
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$function$;

-- Insert the Bhagavad Gita book into the books table
INSERT INTO public.books (
  title,
  author,
  description,
  price,
  currency,
  pages,
  language,
  category,
  content_preview,
  image_url
) VALUES (
  'Bhagavad Gita - Ancient Wisdom for Young Minds',
  'Sage Vyasa',
  'A beautifully illustrated children''s version of the timeless spiritual classic, presenting profound wisdom in simple, accessible language for young readers.',
  299,
  'INR',
  128,
  'English',
  'Spiritual Literature',
  'Discover the eternal teachings of Krishna through colorful illustrations and simple stories that will inspire and guide young minds on their spiritual journey.',
  '/src/assets/bhagavad-gita-cover.jpg'
);

-- Update existing profiles to populate phone numbers from user metadata where missing
UPDATE public.profiles 
SET phone = auth.users.raw_user_meta_data->>'phone'
FROM auth.users 
WHERE profiles.id = auth.users.id 
AND profiles.phone IS NULL 
AND auth.users.raw_user_meta_data->>'phone' IS NOT NULL;