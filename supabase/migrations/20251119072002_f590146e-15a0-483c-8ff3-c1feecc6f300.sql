-- Assign admin role to the specified email
-- This will work after the user signs up with this email

-- First, insert admin role for existing user if they exist
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'sjena1616@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Create a function to auto-assign admin role to this specific email on signup
CREATE OR REPLACE FUNCTION public.assign_admin_role_to_specific_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the new user's email is the admin email
  IF NEW.email = 'sjena1616@gmail.com' THEN
    -- Insert admin role for this user
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger to run after user signup
DROP TRIGGER IF EXISTS on_auth_user_created_assign_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_assign_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_admin_role_to_specific_user();