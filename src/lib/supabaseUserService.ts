import { supabase } from '@/integrations/supabase/client';

// User profile data interface
export interface UserProfile {
  id: string;
  name: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  type: 'home' | 'office' | 'other';
  name: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethod {
  id: string;
  user_id: string;
  type: 'card' | 'upi' | 'net_banking' | 'wallet';
  name: string;
  details: any;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method_id?: string;
  shipping_address_id?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  book_id: string;
  book_title: string;
  book_price: number;
  quantity: number;
  created_at: string;
}

// User service class
export class SupabaseUserService {
  // Get user profile
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  // Update user profile
  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Add address
  static async addAddress(userId: string, address: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .insert({
          ...address,
          user_id: userId
        })
        .select('id')
        .single();

      if (error) throw error;
      if (!data) throw new Error('Failed to insert address');
      return data.id;
    } catch (error) {
      console.error('Error adding address:', error);
      throw error;
    }
  }

  // Get addresses
  static async getAddresses(userId: string): Promise<Address[]> {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Address[];
    } catch (error) {
      console.error('Error getting addresses:', error);
      throw error;
    }
  }

  // Update address
  static async updateAddress(addressId: string, updates: Partial<Address>): Promise<void> {
    try {
      const { error } = await supabase
        .from('addresses')
        .update(updates)
        .eq('id', addressId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  }

  // Delete address
  static async deleteAddress(addressId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  }

  // Add payment method
  static async addPaymentMethod(userId: string, paymentMethod: Omit<PaymentMethod, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .insert({
          ...paymentMethod,
          user_id: userId
        })
        .select('id')
        .single();

      if (error) throw error;
      if (!data) throw new Error('Failed to insert payment method');
      return data.id;
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw error;
    }
  }

  // Get payment methods
  static async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as PaymentMethod[];
    } catch (error) {
      console.error('Error getting payment methods:', error);
      throw error;
    }
  }

  // Update payment method
  static async updatePaymentMethod(paymentId: string, updates: Partial<PaymentMethod>): Promise<void> {
    try {
      const { error } = await supabase
        .from('payment_methods')
        .update(updates)
        .eq('id', paymentId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating payment method:', error);
      throw error;
    }
  }

  // Delete payment method
  static async deletePaymentMethod(paymentId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', paymentId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting payment method:', error);
      throw error;
    }
  }

  // Set default address
  static async setDefaultAddress(userId: string, addressId: string): Promise<void> {
    try {
      // First, unset all default addresses for the user
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', userId);

      // Then set the selected address as default
      const { error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', addressId);

      if (error) throw error;
    } catch (error) {
      console.error('Error setting default address:', error);
      throw error;
    }
  }

  // Set default payment method
  static async setDefaultPaymentMethod(userId: string, paymentId: string): Promise<void> {
    try {
      // First, unset all default payment methods for the user
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', userId);

      // Then set the selected payment method as default
      const { error } = await supabase
        .from('payment_methods')
        .update({ is_default: true })
        .eq('id', paymentId);

      if (error) throw error;
    } catch (error) {
      console.error('Error setting default payment method:', error);
      throw error;
    }
  }

  // Get user orders
  static async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Order[];
    } catch (error) {
      console.error('Error getting user orders:', error);
      throw error;
    }
  }

  // Get order items
  static async getOrderItems(orderId: string): Promise<OrderItem[]> {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting order items:', error);
      throw error;
    }
  }
}

export default SupabaseUserService;