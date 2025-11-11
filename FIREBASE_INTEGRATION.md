# Firebase Integration Guide

This document provides a comprehensive guide for the Firebase authentication and Firestore integration in the Kapalin Gita Tales project.

## Overview

The project has been successfully integrated with Firebase for:
- **Authentication**: User registration and login with email/password
- **Firestore**: User data storage including profiles, addresses, and payment methods
- **Real-time updates**: Automatic user state management

## Firebase Configuration

### Project Details
- **Project ID**: `kapalin-1cb37`
- **Authentication**: Email/Password enabled
- **Firestore**: Database for storing user data

### Configuration Files
- `src/lib/firebase.ts`: Firebase initialization and configuration
- `src/contexts/AuthContext.tsx`: Authentication state management
- `src/lib/userService.ts`: User data operations (CRUD)

## Features Implemented

### 1. User Authentication
- ✅ Email/Password registration
- ✅ Email/Password login
- ✅ User session management
- ✅ Logout functionality
- ✅ Error handling with user-friendly messages

### 2. User Profile Management
- ✅ User data storage in Firestore
- ✅ Profile information display
- ✅ Member since tracking
- ✅ Profile photo support

### 3. Data Storage
- ✅ User profiles in `users` collection
- ✅ Addresses in `users/{userId}/addresses` subcollection
- ✅ Payment methods in `users/{userId}/paymentMethods` subcollection

## Usage

### Registration
```typescript
// In Register component
const { register } = useAuth();
await register(name, email, password);
```

### Login
```typescript
// In Login component
const { login } = useAuth();
await login(email, password);
```

### Logout
```typescript
// In any component
const { logout } = useAuth();
await logout();
```

### Access User Data
```typescript
// In any component
const { user, isAuthenticated, loading } = useAuth();

// user object contains:
// {
//   id: string,
//   name: string,
//   email: string,
//   photoURL?: string,
//   phoneNumber?: string,
//   createdAt: Date,
//   updatedAt: Date
// }
```

### User Service Operations
```typescript
import UserService from '@/lib/userService';

// Add address
const addressId = await UserService.addAddress(userId, {
  type: 'home',
  street: '123 Main St',
  city: 'Mumbai',
  state: 'Maharashtra',
  zipCode: '400001',
  isDefault: true
});

// Get addresses
const addresses = await UserService.getAddresses(userId);

// Add payment method
const paymentId = await UserService.addPaymentMethod(userId, {
  type: 'card',
  name: 'Visa Card',
  details: '**** 1234',
  isDefault: true
});

// Get payment methods
const paymentMethods = await UserService.getPaymentMethods(userId);
```

## Firestore Database Structure

### Users Collection
```
users/
  {userId}/
    name: string
    email: string
    phoneNumber: string (optional)
    photoURL: string (optional)
    createdAt: timestamp
    updatedAt: timestamp
    addresses/ (subcollection)
      {addressId}/
        type: string
        street: string
        city: string
        state: string
        zipCode: string
        isDefault: boolean
    paymentMethods/ (subcollection)
      {paymentId}/
        type: string
        name: string
        details: string
        isDefault: boolean
```

## Error Handling

The system includes comprehensive error handling for common Firebase authentication errors:

- **Registration errors**:
  - `auth/email-already-in-use`: Email already registered
  - `auth/invalid-email`: Invalid email format
  - `auth/weak-password`: Password too weak

- **Login errors**:
  - `auth/invalid-credential`: Invalid email or password
  - `auth/user-not-found`: User not found
  - `auth/wrong-password`: Incorrect password
  - `auth/too-many-requests`: Too many failed attempts

## Testing

### Test Account
You can create test accounts using the registration form. The system will automatically store all user data in Firestore.

### Development Tips
1. Check the Firebase Console for real-time data updates
2. Use browser dev tools to monitor network requests
3. Check console for any error messages

## Security Rules

Make sure your Firestore security rules are configured to allow:
- User registration and authentication
- Users to read/write their own data
- Proper validation of user inputs

## Next Steps

1. **Add more authentication methods** (Google, Facebook, etc.)
2. **Implement password reset functionality**
3. **Add email verification**
4. **Enhance user profile editing**
5. **Add profile picture upload**
6. **Implement order history tracking**

## Troubleshooting

### Common Issues

1. **"Firebase: Error (auth/invalid-api-key)"**
   - Check if the API key in `firebase.ts` is correct

2. **"Permission denied" errors**
   - Ensure Firestore security rules allow the operations
   - Check if the user is properly authenticated

3. **Data not appearing in Firestore**
   - Check browser console for errors
   - Verify network connectivity
   - Check Firebase project settings

### Support
For any issues with the Firebase integration, please check:
- Firebase Console: https://console.firebase.google.com/project/kapalin-1cb37
- Firestore Database: Check the `users` collection
- Authentication: Check the Users section

