import { supabase } from '@/integrations/supabase/client';

export interface OrderData {
  id: string;
  user_id: string;
  total_amount: number;
  currency: string;
  status: string;
  payment_status: string;
  shipping_address_id: string | null;
  payment_method_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItemData {
  id: string;
  order_id: string;
  book_id: string;
  book_title: string;
  book_price: number;
  quantity: number;
  created_at: string;
}

export const orderService = {
  async createOrder(orderData: {
    total_amount: number;
    currency: string;
    shipping_address_id?: string;
    payment_method_id?: string;
  }): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('orders')
      .insert({
        ...orderData,
        user_id: user.id,
        status: 'pending',
        payment_status: 'pending'
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating order:', error);
      throw error;
    }

    return data.id;
  },

  async addOrderItems(orderId: string, items: {
    book_id: string;
    book_title: string;
    book_price: number;
    quantity: number;
  }[]): Promise<void> {
    const orderItems = items.map(item => ({
      order_id: orderId,
      ...item
    }));

    const { error } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (error) {
      console.error('Error adding order items:', error);
      throw error;
    }
  },

  async getUserOrders(): Promise<OrderData[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }

    return data || [];
  },

  async getOrderItems(orderId: string): Promise<OrderItemData[]> {
    const { data, error } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (error) {
      console.error('Error fetching order items:', error);
      throw error;
    }

    return data || [];
  }
};