-- Check current auth configuration and ensure it's properly set up
-- This will help verify if there are any database-level auth issues

-- First, let's check if the auth trigger is working properly
SELECT 
  trigger_name, 
  event_manipulation, 
  action_timing, 
  action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'auth' 
   OR event_object_table = 'users';

-- Also check if our profiles trigger exists
SELECT 
  trigger_name, 
  event_manipulation, 
  action_timing, 
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';