import { supabase } from '@/integrations/supabase/client';

export interface AddressData {
  id: string;
  user_id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  type: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethodData {
  id: string;
  user_id: string;
  name: string;
  type: string;
  details: any;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface ImageUploadData {
  id: string;
  user_id: string;
  name: string;
  phone: string | null;
  instagram: string | null;
  image_url: string;
  created_at: string;
}

export const profileService = {
  // Address Management
  async getUserAddresses(): Promise<AddressData[]> {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .order('is_default', { ascending: false });

    if (error) {
      console.error('Error fetching addresses:', error);
      throw error;
    }

    return data || [];
  },

  async addAddress(address: Omit<AddressData, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('addresses')
      .insert({
        ...address,
        user_id: user.id
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error adding address:', error);
      throw error;
    }

    return data.id;
  },

  async updateAddress(id: string, updates: Partial<AddressData>): Promise<void> {
    const { error } = await supabase
      .from('addresses')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  },

  async deleteAddress(id: string): Promise<void> {
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  },

  // Payment Method Management
  async getUserPaymentMethods(): Promise<PaymentMethodData[]> {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .order('is_default', { ascending: false });

    if (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }

    return data || [];
  },

  async addPaymentMethod(paymentMethod: Omit<PaymentMethodData, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('payment_methods')
      .insert({
        ...paymentMethod,
        user_id: user.id
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error adding payment method:', error);
      throw error;
    }

    return data.id;
  },

  async updatePaymentMethod(id: string, updates: Partial<PaymentMethodData>): Promise<void> {
    const { error } = await supabase
      .from('payment_methods')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating payment method:', error);
      throw error;
    }
  },

  async deletePaymentMethod(id: string): Promise<void> {
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting payment method:', error);
      throw error;
    }
  },

  // Image Upload Management
  async getUserImageUploads(): Promise<ImageUploadData[]> {
    const { data, error } = await supabase
      .from('image_uploads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching image uploads:', error);
      throw error;
    }

    return data || [];
  },

  async addImageUpload(imageData: Omit<ImageUploadData, 'id' | 'user_id' | 'created_at'>): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('image_uploads')
      .insert({
        ...imageData,
        user_id: user.id
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error adding image upload:', error);
      throw error;
    }

    return data.id;
  }
};