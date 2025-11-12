import { supabase } from '@/integrations/supabase/client';

export interface BookForm {
  title: string;
  description: string;
  price: number;
  currency?: string;
  author?: string;
  pages?: number;
  language?: string;
  category?: string;
  content_preview?: string;
  book_type: 'hardcover' | 'ebook' | 'both';
  image_url?: string;
}

export interface AudioForm {
  title: string;
  description?: string;
  audio_url: string;
  duration?: number;
  category?: string;
  book_id?: string;
  image_url?: string;
}

export interface AnimatedSeriesForm {
  title: string;
  description?: string;
  thumbnail_url?: string;
  episode_number?: number;
  season_number?: number;
  video_url?: string;
  duration?: number;
  category?: string;
  book_id?: string;
}

export const adminService = {
  // Books
  async createBook(book: BookForm) {
    const { data, error } = await supabase
      .from('books')
      .insert(book)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateBook(id: string, book: Partial<BookForm>) {
    const { data, error } = await supabase
      .from('books')
      .update(book)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteBook(id: string) {
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Audio Content
  async createAudio(audio: AudioForm) {
    const { data, error } = await supabase
      .from('audio_content')
      .insert(audio)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getAudioList() {
    const { data, error } = await supabase
      .from('audio_content')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async updateAudio(id: string, audio: Partial<AudioForm>) {
    const { data, error } = await supabase
      .from('audio_content')
      .update(audio)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteAudio(id: string) {
    const { error } = await supabase
      .from('audio_content')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Animated Series
  async createAnimatedSeries(series: AnimatedSeriesForm) {
    const { data, error } = await supabase
      .from('animated_series')
      .insert(series)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getAnimatedSeriesList() {
    const { data, error } = await supabase
      .from('animated_series')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async updateAnimatedSeries(id: string, series: Partial<AnimatedSeriesForm>) {
    const { data, error } = await supabase
      .from('animated_series')
      .update(series)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteAnimatedSeries(id: string) {
    const { error } = await supabase
      .from('animated_series')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // File Upload
  async uploadFile(bucket: string, path: string, file: File) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    return publicUrl;
  }
};
