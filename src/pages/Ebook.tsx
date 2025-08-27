import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Download, Play, Star, Clock, Users, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ThemeToggle from '@/components/ThemeToggle';
import gitaImg from '@/assets/original.jpg';
import page2Img from '@/assets/page-2.jpg';

interface Ebook {
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
  file_size: string;
  download_count: number;
  rating: number;
}

// Book preview pages data
const previewPages = [
  {
    id: 1,
    title: "Chapter 1: Arjuna's Dilemma",
    content: "In the midst of the battlefield, Arjuna stood with his mighty bow, Gandiva, surveying the armies arrayed before him. His heart was heavy with sorrow and confusion as he beheld his relatives, teachers, and friends ready to engage in battle.",
    image: gitaImg
  },
  {
    id: 2,
    title: "The Divine Charioteer",
    content: "Krishna, the Supreme Lord, sat as Arjuna's charioteer, guiding the magnificent white horses. His presence radiated divine wisdom and compassion, ready to impart the eternal knowledge that would dispel Arjuna's doubts.",
    image: page2Img
  },
  {
    id: 3,
    title: "The Path of Righteousness",
    content: "Through Krishna's teachings, Arjuna learned that true dharma lies not in avoiding action, but in performing one's duties with detachment and devotion. The path to liberation is through selfless service and surrender to the divine will.",
    image: gitaImg
  },
  {
    id: 4,
    title: "Wisdom for All Ages",
    content: "The Bhagavad Gita's timeless wisdom transcends time and culture, offering guidance for every stage of life. Its teachings on duty, devotion, and self-realization continue to inspire seekers of truth across the world.",
    image: page2Img
  }
];

const Ebook = () => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchEbooks = async () => {
      try {
        const { data, error } = await supabase
          .from('books')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching books:', error);
          // Use fallback data if database fails
          setEbooks([
            {
              id: 'ebook-1',
              title: 'Bhagavad Gita - Digital Edition',
              description: 'Interactive digital version with audio narration and animated illustrations.',
              price: 199,
              currency: 'INR',
              image_url: gitaImg,
              author: 'Sage Vyasa',
              pages: 128,
              language: 'English',
              category: 'Spiritual Literature',
              content_preview: 'Experience the timeless wisdom in a modern digital format.',
              file_size: '25 MB',
              download_count: 1250,
              rating: 4.8
            }
          ]);
        } else {
          // Transform database data to match component interface
          const transformedBooks = data.map(book => ({
            id: book.id,
            title: book.title,
            description: book.description || 'No description available',
            price: book.price,
            currency: book.currency,
            image_url: book.image_url || gitaImg,
            author: book.author || 'Unknown Author',
            pages: book.pages || 100,
            language: book.language || 'English',
            category: book.category || 'Spiritual',
            content_preview: book.content_preview || 'Preview not available',
            file_size: '25 MB', // This would need to be added to DB schema
            download_count: 1250, // This would need to be added to DB schema
            rating: 4.8 // This would need to be added to DB schema
          }));
          setEbooks(transformedBooks);
        }
      } catch (error) {
        console.error('Error fetching ebooks:', error);
        // Fallback data on error
        setEbooks([
          {
            id: 'ebook-1',
            title: 'Bhagavad Gita - Digital Edition',
            description: 'Interactive digital version with audio narration and animated illustrations.',
            price: 199,
            currency: 'INR',
            image_url: gitaImg,
            author: 'Sage Vyasa',
            pages: 128,
            language: 'English',
            category: 'Spiritual Literature',
            content_preview: 'Experience the timeless wisdom in a modern digital format.',
            file_size: '25 MB',
            download_count: 1250,
            rating: 4.8
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEbooks();
  }, []);

  const handleAddToCart = (ebook: Ebook) => {
    addToCart({
      id: ebook.id,
      title: ebook.title,
      description: ebook.description,
      price: ebook.price,
      image: ebook.image_url,
      about: ebook.content_preview,
      samplePages: []
    });

    toast({
      title: "Added to cart!",
      description: `${ebook.title} has been added to your cart.`,
    });
  };

  const openPreview = () => {
    setShowPreview(true);
    setCurrentPage(0);
  };

  const closePreview = () => {
    setShowPreview(false);
    setCurrentPage(0);
  };

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % previewPages.length);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + previewPages.length) % previewPages.length);
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
      {/* Theme Toggle Button - Top Right Corner */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-transparent py-16 dark:from-primary/20 dark:via-primary/10 dark:to-transparent">
        <div className="absolute inset-0 opacity-30 dark:opacity-20"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4 border-primary/20 text-primary dark:border-primary/40 dark:text-primary dark:bg-primary/10">
            Digital Library
          </Badge>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight dark:text-foreground">
            E-Book Collection
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto dark:text-muted-foreground">
            Discover ancient wisdom in modern digital format with interactive features and audio narration
          </p>
        </div>
      </div>

      {/* E-Books Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ebooks.map((ebook) => (
            <Card key={ebook.id} className="overflow-hidden shadow-xl border-0 bg-card/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105 dark:bg-card/90 dark:border-border dark:shadow-2xl dark:hover:shadow-3xl">
              <div className="p-6 space-y-4">
                {/* Book Cover - Full Image Display */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300 dark:from-primary/30"></div>
                  <div className="relative bg-white p-3 rounded-xl shadow-lg dark:bg-gray-800 dark:shadow-xl">
                    <img
                      src={gitaImg}
                      alt={ebook.title}
                      className="w-full object-contain rounded-lg shadow-md"
                      style={{ maxHeight: '400px', minHeight: '300px' }}
                    />
                  </div>
                </div>
                
                {/* Book Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-foreground mb-2 dark:text-foreground">
                      {ebook.title}
                    </h3>
                    <p className="text-primary font-medium mb-2 dark:text-primary">
                      by {ebook.author}
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed dark:text-muted-foreground">
                      {ebook.description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="space-y-1">
                      <BookOpen className="h-5 w-5 text-primary mx-auto dark:text-primary" />
                      <p className="text-xs font-medium dark:text-foreground">{ebook.pages} Pages</p>
                    </div>
                    <div className="space-y-1">
                      <Star className="h-5 w-5 text-yellow-500 mx-auto dark:text-yellow-400" />
                      <p className="text-xs font-medium dark:text-foreground">{ebook.rating}/5</p>
                    </div>
                    <div className="space-y-1">
                      <Download className="h-5 w-5 text-green-500 mx-auto dark:text-green-400" />
                      <p className="text-xs font-medium dark:text-foreground">{ebook.file_size}</p>
                    </div>
                  </div>

                  {/* Download Info */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground dark:text-muted-foreground">
                    <span>{ebook.download_count} downloads</span>
                    <span>{ebook.language}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => handleAddToCart(ebook)}
                      className="flex-1"
                      variant="default"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                    <Button 
                      onClick={openPreview}
                      variant="outline" 
                      size="sm"
                      className="dark:border-border dark:hover:bg-accent/50"
                    >
                      <BookOpen className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Book Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden dark:bg-card transform transition-all duration-300 scale-100 animate-in slide-in-from-bottom-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-border dark:border-border">
              <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground dark:text-foreground">
                Book Preview
              </h3>
              <Button
                onClick={closePreview}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Modal Content */}
            <div className="p-4 md:p-6">
              {/* Mobile: Stacked Layout, Desktop: Side-by-side */}
              <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-6 md:items-start">
                {/* Page Image */}
                <div className="relative">
                  <div className="bg-white p-3 md:p-4 rounded-xl shadow-lg dark:bg-gray-800">
                    <img
                      src={previewPages[currentPage].image}
                      alt={`Page ${currentPage + 1}`}
                      className="w-full object-contain rounded-lg"
                      style={{ maxHeight: '300px', minHeight: '250px' }}
                    />
                  </div>
                </div>
                
                {/* Page Content */}
                <div className="space-y-4">
                  <h4 className="font-serif text-lg md:text-xl font-bold text-foreground dark:text-foreground">
                    {previewPages[currentPage].title}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base dark:text-muted-foreground">
                    {previewPages[currentPage].content}
                  </p>
                  
                  {/* Page Navigation */}
                  <div className="flex items-center justify-between pt-4">
                    <Button
                      onClick={prevPage}
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 0}
                      className="dark:border-border dark:hover:bg-accent/50 text-xs md:text-sm"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Previous</span>
                    </Button>
                    
                    <span className="text-xs md:text-sm text-muted-foreground dark:text-muted-foreground">
                      {currentPage + 1} / {previewPages.length}
                    </span>
                    
                    <Button
                      onClick={nextPage}
                      variant="outline"
                      size="sm"
                      disabled={currentPage === previewPages.length - 1}
                      className="dark:border-border dark:hover:bg-accent/50 text-xs md:text-sm"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Mobile: Swipe Instructions */}
              <div className="mt-6 text-center md:hidden">
                <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                  💡 Swipe left/right or use buttons to navigate pages
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ebook; 