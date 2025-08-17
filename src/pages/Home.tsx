import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, BookOpen, Star } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import bgCover from '@/assets/bhagavad-gita-cover.jpg';

interface Book {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  image_url: string;
  author: string;
  pages: number;
  language: string;
  category: string;
  content_preview: string;
}

const Home = () => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data, error } = await supabase
          .from('books')
          .select('*')
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setBook(data);
        } else {
          // If no book in database, create a default book object using local image
          setBook({
            id: 'bhagavad-gita',
            title: 'Bhagavad Gita - Ancient Wisdom for Young Minds',
            description: 'A beautifully illustrated children\'s version of the timeless spiritual classic, presenting profound wisdom in simple, accessible language for young readers.',
            price: 299,
            currency: 'INR',
            image_url: bgCover,
            author: 'Sage Vyasa',
            pages: 128,
            language: 'English',
            category: 'Spiritual Literature',
            content_preview: 'Discover the eternal teachings of Krishna through colorful illustrations and simple stories that will inspire and guide young minds on their spiritual journey.'
          });
        }
      } catch (error) {
        console.error('Error fetching book:', error);
        // Fallback to local image if database fails
        setBook({
          id: 'bhagavad-gita',
          title: 'Bhagavad Gita - Ancient Wisdom for Young Minds',
          description: 'A beautifully illustrated children\'s version of the timeless spiritual classic, presenting profound wisdom in simple, accessible language for young readers.',
          price: 299,
          currency: 'INR',
          image_url: bgCover,
          author: 'Sage Vyasa',
          pages: 128,
          language: 'English',
          category: 'Spiritual Literature',
          content_preview: 'Discover the eternal teachings of Krishna through colorful illustrations and simple stories that will inspire and guide young minds on their spiritual journey.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, []);

  const handleAddToCart = () => {
    if (!book) return;
    
    addToCart({
      id: book.id,
      title: book.title,
      description: book.description,
      price: book.price,
      image: book.image_url,
      about: book.content_preview,
      samplePages: []
    });

    toast({
      title: "Added to cart!",
      description: `${book.title} has been added to your cart.`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">No book available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-transparent py-12">
        <div className="absolute inset-0 opacity-30"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4 border-primary/20 text-primary">
            {book.category}
          </Badge>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            Kapalin Gita Tales
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Ancient wisdom for young minds - Discover timeless teachings through beautiful storytelling
          </p>
        </div>
      </div>

      {/* Main Book Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <Card className="overflow-hidden shadow-xl border-0 bg-card/80 backdrop-blur-sm">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Book Cover */}
            <div className="space-y-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
                <div className="relative bg-white p-4 rounded-2xl shadow-2xl">
                  <img
                    src={book.image_url}
                    alt={book.title}
                    className="w-full h-96 object-cover rounded-xl shadow-lg"
                  />
                </div>
              </div>
              
              {/* Book Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <BookOpen className="h-6 w-6 text-primary mx-auto" />
                  <p className="text-sm font-medium">{book.pages} Pages</p>
                  <p className="text-xs text-muted-foreground">Easy Reading</p>
                </div>
                <div className="space-y-1">
                  <Star className="h-6 w-6 text-yellow-500 mx-auto" />
                  <p className="text-sm font-medium">4.9/5</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
                <div className="space-y-1">
                  <div className="h-6 w-6 bg-primary/20 rounded-full mx-auto flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">EN</span>
                  </div>
                  <p className="text-sm font-medium">{book.language}</p>
                  <p className="text-xs text-muted-foreground">Language</p>
                </div>
              </div>
            </div>

            {/* Book Details */}
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-3xl font-bold text-foreground mb-3">
                  {book.title}
                </h2>
                <p className="text-lg text-primary font-medium mb-4">
                  by {book.author}
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {book.description}
                </p>
              </div>

              {/* Preview Content */}
              <div className="bg-muted/30 rounded-xl p-6 border border-border/50">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  What's Inside
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {book.content_preview}
                </p>
              </div>

              {/* Pricing & Actions */}
              <div className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">
                    ₹{book.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {book.currency}
                  </span>
                </div>

                <div className="flex gap-4">
                  <Button 
                    onClick={handleAddToCart}
                    className="flex-1 h-12 text-base font-medium"
                    variant="default"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-12 px-6"
                  >
                    Preview
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Home;