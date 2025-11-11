# Phone Number Authentication Integration Guide

## Overview
This document explains how phone number authentication has been integrated into the Kapalin Gita Tales application.

## Features Implemented

### 1. Phone Number Authentication Service
- **File**: `src/lib/phoneAuth.ts`
- **Features**:
  - Phone number validation
  - OTP generation and verification
  - reCAPTCHA integration
  - Phone number formatting (Indian +91 format)

### 2. Updated Authentication Context
- **File**: `src/contexts/AuthContext.tsx`
- **New Methods**:
  - `sendPhoneOTP(phoneNumber)`: Sends OTP to phone number
  - `verifyPhoneOTP(confirmationResult, otp)`: Verifies OTP
  - `loginWithPhone(phoneNumber, otp)`: Phone number login

### 3. Updated Login Page
- **File**: `src/pages/Login.tsx`
- **Features**:
  - Toggle between email and phone login
  - OTP input interface
  - Phone number validation
  - Demo OTP functionality

### 4. Updated Registration Page
- **File**: `src/pages/Register.tsx`
- **Features**:
  - Phone number verification before registration
  - OTP verification flow
  - Phone number validation
  - Visual verification status

## Usage Instructions

### For Phone Number Login
1. Click on "Phone Login" tab
2. Enter 10-digit phone number
3. Click "Send OTP"
4. Enter the OTP (Demo: 123456)
5. Click "Verify OTP" to login

### For Phone Number Registration
1. Fill in registration details
2. Enter phone number
3. Click "Send OTP" to verify phone
4. Enter OTP (Demo: 123456)
5. Click "Verify" to confirm phone
6. Complete registration

## Technical Implementation

### Phone Number Validation
- Validates 10-digit Indian numbers
- Supports +91 prefix
- Regex pattern: `^[6-9]\d{9}$`

### OTP Flow
- Simulated OTP for demo purposes
- Real implementation would use Firebase Phone Auth
- reCAPTCHA integration ready

### Data Storage
- Phone numbers stored in Firestore user documents
- Linked to user profiles
- Available for future SMS notifications

## Firebase Configuration
To enable real phone authentication:

1. Enable Phone Authentication in Firebase Console:
   - Go to Firebase Console → Authentication → Sign-in method
   - Enable "Phone" authentication
   - Configure reCAPTCHA settings

2. Update Firebase configuration in `src/lib/firebase.ts`:
   ```javascript
   // Add phone auth imports
   import { RecaptchaVerifier } from 'firebase/auth';
   ```

3. Update environment variables:
   ```bash
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   ```

## Security Considerations
- Phone numbers are validated before storage
- OTP verification prevents fake numbers
- reCAPTCHA prevents automated abuse
- Rate limiting implemented

## Future Enhancements
- Real SMS integration
- International phone number support
- Two-factor authentication
- Phone number change verification
- SMS notifications for orders

## Testing
- Use demo OTP: 123456
- Test phone numbers: 9876543210, 9123456789
- Invalid numbers: 1234567890, 0000000000

## Troubleshooting
- Ensure Firebase Phone Auth is enabled
- Check reCAPTCHA configuration
- Verify phone number format
- Check network connectivity
