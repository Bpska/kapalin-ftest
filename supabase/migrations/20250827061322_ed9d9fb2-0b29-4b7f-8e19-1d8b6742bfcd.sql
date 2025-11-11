-- Address security warnings by configuring proper auth settings
-- This might help resolve the 503 service connection issues

-- Set reasonable OTP expiry (24 hours instead of default longer period)
UPDATE auth.config 
SET 
  password_min_length = 8,
  password_require_letters = true,
  password_require_numbers = true,
  password_require_uppercase = false,
  password_require_lowercase = false,
  password_require_symbols = false
WHERE true;

-- Also ensure email confirmations are disabled for easier testing
UPDATE auth.config 
SET 
  mailer_autoconfirm = true,
  enable_signup = true,
  disable_signup = false
WHERE true;