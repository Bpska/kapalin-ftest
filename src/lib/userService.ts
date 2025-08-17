import { doc, setDoc, getDoc, updateDoc, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

// User profile data interface
export interface UserProfile {
  name: string;
  email: string;
  phoneNumber?: string;
  photoURL?: string;
  addresses?: Address[];
  paymentMethods?: PaymentMethod[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  id: string;
  type: 'home' | 'office' | 'other';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'netbanking';
  name: string;
  details: string;
  isDefault: boolean;
}

// User service class
export class UserService {
  // Get user profile
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  // Update user profile
  static async updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...data,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Add address
  static async addAddress(userId: string, address: Omit<Address, 'id'>): Promise<string> {
    try {
      const addressRef = await addDoc(collection(db, 'users', userId, 'addresses'), {
        ...address,
        createdAt: new Date()
      });
      return addressRef.id;
    } catch (error) {
      console.error('Error adding address:', error);
      throw error;
    }
  }

  // Get addresses
  static async getAddresses(userId: string): Promise<Address[]> {
    try {
      const addressesSnapshot = await getDocs(collection(db, 'users', userId, 'addresses'));
      return addressesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Address));
    } catch (error) {
      console.error('Error getting addresses:', error);
      throw error;
    }
  }

  // Update address
  static async updateAddress(userId: string, addressId: string, data: Partial<Address>): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId, 'addresses', addressId), {
        ...data,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  }

  // Delete address
  static async deleteAddress(userId: string, addressId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'users', userId, 'addresses', addressId));
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  }

  // Add payment method
  static async addPaymentMethod(userId: string, paymentMethod: Omit<PaymentMethod, 'id'>): Promise<string> {
    try {
      const paymentRef = await addDoc(collection(db, 'users', userId, 'paymentMethods'), {
        ...paymentMethod,
        createdAt: new Date()
      });
      return paymentRef.id;
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw error;
    }
  }

  // Get payment methods
  static async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    try {
      const paymentsSnapshot = await getDocs(collection(db, 'users', userId, 'paymentMethods'));
      return paymentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as PaymentMethod));
    } catch (error) {
      console.error('Error getting payment methods:', error);
      throw error;
    }
  }

  // Update payment method
  static async updatePaymentMethod(userId: string, paymentId: string, data: Partial<PaymentMethod>): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId, 'paymentMethods', paymentId), {
        ...data,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating payment method:', error);
      throw error;
    }
  }

  // Delete payment method
  static async deletePaymentMethod(userId: string, paymentId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'users', userId, 'paymentMethods', paymentId));
    } catch (error) {
      console.error('Error deleting payment method:', error);
      throw error;
    }
  }

  // Set default address
  static async setDefaultAddress(userId: string, addressId: string): Promise<void> {
    try {
      const addresses = await this.getAddresses(userId);
      const batch = [];
      
      // Reset all addresses to non-default
      for (const address of addresses) {
        batch.push(updateDoc(doc(db, 'users', userId, 'addresses', address.id), {
          isDefault: false
        }));
      }
      
      // Set the selected address as default
      batch.push(updateDoc(doc(db, 'users', userId, 'addresses', addressId), {
        isDefault: true
      }));
      
      await Promise.all(batch);
    } catch (error) {
      console.error('Error setting default address:', error);
      throw error;
    }
  }

  // Set default payment method
  static async setDefaultPaymentMethod(userId: string, paymentId: string): Promise<void> {
    try {
      const paymentMethods = await this.getPaymentMethods(userId);
      const batch = [];
      
      // Reset all payment methods to non-default
      for (const method of paymentMethods) {
        batch.push(updateDoc(doc(db, 'users', userId, 'paymentMethods', method.id), {
          isDefault: false
        }));
      }
      
      // Set the selected payment method as default
      batch.push(updateDoc(doc(db, 'users', userId, 'paymentMethods', paymentId), {
        isDefault: true
      }));
      
      await Promise.all(batch);
    } catch (error) {
      console.error('Error setting default payment method:', error);
      throw error;
    }
  }
}

export default UserService;
