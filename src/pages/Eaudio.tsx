import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Headphones, Play, Pause, Volume2, Clock, Star, Download, Heart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ThemeToggle from '@/components/ThemeToggle';

interface Eaudio {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  image_url: string;
  author: string;
  narrator: string;
  duration: string;
  language: string;
  category: string;
  content_preview: string;
  file_size: string;
  download_count: number;
  rating: number;
  isPlaying?: boolean;
}

const Eaudio = () => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [audios, setAudios] = useState<Eaudio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  useEffect(() => {
    const fetchAudios = async () => {
      try {
        const { data, error } = await supabase
          .from('books')
          .select('*')
          .eq('category', 'Audio')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching audio books:', error);
          // Use fallback data if database fails
          setAudios([
            {
              id: 'audio-1',
              title: 'Bhagavad Gita - Audio Narration',
              description: 'Complete audio narration with soothing voice and background music.',
              price: 299,
              currency: 'INR',
              image_url: '/api/placeholder/300/400',
              author: 'Sage Vyasa',
              narrator: 'Swami Chinmayananda',
              duration: '4h 32m',
              language: 'English',
              category: 'Spiritual Literature',
              content_preview: 'Listen to the divine wisdom with expert commentary.',
              file_size: '125 MB',
              download_count: 2100,
              rating: 4.9
            }
          ]);
        } else {
          // Transform database data to match component interface
          const transformedAudios = data.map(book => ({
            id: book.id,
            title: book.title,
            description: book.description || 'No description available',
            price: book.price,
            currency: book.currency,
            image_url: book.image_url || '/api/placeholder/300/400',
            author: book.author || 'Unknown Author',
            narrator: 'Professional Narrator', // This would need to be added to DB schema
            duration: '2h 30m', // This would need to be added to DB schema
            language: book.language || 'English',
            category: book.category || 'Spiritual',
            content_preview: book.content_preview || 'Preview not available',
            file_size: '85 MB', // This would need to be added to DB schema
            download_count: 1500, // This would need to be added to DB schema
            rating: 4.8 // This would need to be added to DB schema
          }));
          setAudios(transformedAudios);
        }
      } catch (error) {
        console.error('Error fetching audio books:', error);
        // Fallback data on error
        setAudios([
          {
            id: 'audio-1',
            title: 'Bhagavad Gita - Audio Narration',
            description: 'Complete audio narration with soothing voice and background music.',
            price: 299,
            currency: 'INR',
            image_url: '/api/placeholder/300/400',
            author: 'Sage Vyasa',
            narrator: 'Swami Chinmayananda',
            duration: '4h 32m',
            language: 'English',
            category: 'Spiritual Literature',
            content_preview: 'Listen to the divine wisdom with expert commentary.',
            file_size: '125 MB',
            download_count: 2100,
            rating: 4.9
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAudios();
  }, []);

  const handleAddToCart = (audio: Eaudio) => {
    addToCart({
      id: audio.id,
      title: audio.title,
      description: audio.description,
      price: audio.price,
      image: audio.image_url,
      about: audio.content_preview,
      samplePages: []
    });

    toast({
      title: "Added to cart!",
      description: `${audio.title} has been added to your cart.`,
    });
  };

  const handlePlayPause = (audioId: string) => {
    if (currentlyPlaying === audioId) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(audioId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-transparent py-16 dark:from-primary/20 dark:via-primary/10 dark:to-transparent">
        <div className="absolute inset-0 opacity-30 dark:opacity-20"></div>

        {/* Theme Toggle Button - Top Right */}
        <div className="absolute top-6 right-6 z-10">
          <ThemeToggle />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4 border-primary/20 text-primary dark:border-primary/40 dark:text-primary dark:bg-primary/10">
            Audio Library
          </Badge>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight dark:text-foreground">
            E-Audio Collection
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto dark:text-muted-foreground">
            Immerse yourself in ancient wisdom through professional audio narration and beautiful music
          </p>
        </div>
      </div>

      {/* Audio Books Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {audios.map((audio) => (
            <Card key={audio.id} className="overflow-hidden shadow-xl border-0 bg-card/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105 dark:bg-card/90 dark:border-border dark:shadow-2xl dark:hover:shadow-3xl">
              <div className="p-6 space-y-4">
                {/* Audio Cover */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300 dark:from-primary/30"></div>
                  <div className="relative bg-white p-3 rounded-xl shadow-lg dark:bg-gray-800 dark:shadow-xl">
                    <img
                      src={audio.image_url}
                      alt={audio.title}
                      className="w-full h-64 object-cover rounded-lg shadow-md"
                    />
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button
                        onClick={() => handlePlayPause(audio.id)}
                        className="h-16 w-16 rounded-full bg-primary/90 hover:bg-primary text-primary-foreground shadow-lg dark:bg-primary dark:hover:bg-primary/80"
                        size="icon"
                      >
                        {currentlyPlaying === audio.id ? (
                          <Pause className="h-8 w-8" />
                        ) : (
                          <Play className="h-8 w-8 ml-1" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Audio Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-foreground mb-2 dark:text-foreground">
                      {audio.title}
                    </h3>
                    <p className="text-primary font-medium mb-1 dark:text-primary">
                      by {audio.author}
                    </p>
                    <p className="text-muted-foreground text-sm mb-2 dark:text-muted-foreground">
                      Narrated by {audio.narrator}
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed dark:text-muted-foreground">
                      {audio.description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="space-y-1">
                      <Clock className="h-5 w-5 text-primary mx-auto dark:text-primary" />
                      <p className="text-xs font-medium dark:text-foreground">{audio.duration}</p>
                    </div>
                    <div className="space-y-1">
                      <Star className="h-5 w-5 text-yellow-500 mx-auto dark:text-yellow-400" />
                      <p className="text-xs font-medium dark:text-foreground">{audio.rating}/5</p>
                    </div>
                    <div className="space-y-1">
                      <Volume2 className="h-5 w-5 text-green-500 mx-auto dark:text-green-400" />
                      <p className="text-xs font-medium dark:text-foreground">{audio.file_size}</p>
                    </div>
                  </div>

                  {/* Download Info */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground dark:text-muted-foreground">
                    <span>{audio.download_count} downloads</span>
                    <span>{audio.language}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleAddToCart(audio)}
                      className="flex-1"
                      variant="default"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="dark:border-border dark:hover:bg-accent/50"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Eaudio; 