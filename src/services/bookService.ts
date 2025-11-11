import { supabase } from '@/integrations/supabase/client';

export interface BookData {
  id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  image_url: string | null;
  author: string | null;
  pages: number | null;
  language: string | null;
  category: string | null;
  content_preview: string | null;
  created_at: string;
  updated_at: string;
}

export const bookService = {
  async getAllBooks(): Promise<BookData[]> {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching books:', error);
      throw error;
    }

    return data || [];
  },

  async getBookById(id: string): Promise<BookData | null> {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching book:', error);
      throw error;
    }

    return data;
  },

  async getBooksByCategory(category: string): Promise<BookData[]> {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching books by category:', error);
      throw error;
    }

    return data || [];
  }
};