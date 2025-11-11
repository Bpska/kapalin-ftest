-- Fix auth email templates by resetting to defaults
-- Remove any malformed template configurations
UPDATE auth.config 
SET email_template = jsonb_build_object(
  'invite', jsonb_build_object(
    'subject', 'You have been invited',
    'body', 'You have been invited to join {{.SiteURL}}. Click this link to accept the invite: {{.ConfirmationURL}}'
  ),
  'confirmation', jsonb_build_object(
    'subject', 'Confirm your signup',
    'body', 'Follow this link to confirm your signup: {{.ConfirmationURL}}'
  ),
  'recovery', jsonb_build_object(
    'subject', 'Reset your password',
    'body', 'Follow this link to reset your password: {{.ConfirmationURL}}'
  ),
  'magic_link', jsonb_build_object(
    'subject', 'Your magic link',
    'body', 'Follow this link to login: {{.ConfirmationURL}}'
  )
) WHERE true;

-- Ensure auth settings are properly configured
UPDATE auth.config 
SET 
  site_url = 'https://preview--kapalin-tales-store.lovable.app',
  disable_signup = false,
  mailer_autoconfirm = true
WHERE true;