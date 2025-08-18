import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Headphones, 
  Youtube, 
  Instagram, 
  Lightbulb, 
  ArrowRight, 
  Star, 
  Users, 
  Clock,
  Play,
  Download,
  ExternalLink,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import bgCover from '@/assets/bhagavad-gita-cover.jpg';
import originalImg from '@/assets/original.jpg';
import page2Img from '@/assets/page-2.jpg';
import ThemeToggle from '@/components/ThemeToggle';

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
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  // Book preview pages data
  const previewPages = [
    {
      id: 1,
      title: "Chapter 1: Arjuna's Dilemma",
      content: "In the midst of the battlefield, Arjuna stood with his mighty bow, Gandiva, surveying the armies arrayed before him. His heart was heavy with sorrow and confusion as he beheld his relatives, teachers, and friends ready to engage in battle.",
      image: originalImg
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
      image: originalImg
    },
    {
      id: 4,
      title: "Wisdom for All Ages",
      content: "The Bhagavad Gita's timeless wisdom transcends time and culture, offering guidance for every stage of life. Its teachings on duty, devotion, and self-realization continue to inspire seekers of truth across the world.",
      image: page2Img
    }
  ];

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data, error } = await supabase
          .from('books')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          const imageUrl = data.image_url && data.image_url.startsWith('http') ? data.image_url : bgCover;
          setBook({...data, image_url: imageUrl});
        } else {
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

  const handleNavigation = (path: string) => {
    navigate(path);
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
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-transparent py-20 dark:from-primary/20 dark:via-primary/10 dark:to-transparent">
        <div className="absolute inset-0 opacity-30 dark:opacity-20"></div>
        
        {/* Theme Toggle Button - Top Right */}
        <div className="absolute top-6 right-6 z-10">
          <ThemeToggle />
        </div>
        
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-6 border-primary/20 text-primary text-base px-4 py-2 dark:border-primary/40 dark:text-primary dark:bg-primary/10">
            Welcome to
          </Badge>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight dark:text-foreground">
            Kapalin Gita Tales
          </h1>
          <p className="text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed dark:text-muted-foreground">
            Ancient wisdom for young minds - Discover timeless teachings through beautiful storytelling, 
            digital experiences, and spiritual guidance
          </p>
          
          {/* Featured Book with Two Images */}
          {book && (
            <Card className="max-w-6xl mx-auto p-8 bg-card/80 backdrop-blur-sm border-primary/20 dark:bg-card/90 dark:border-primary/30">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Left Side - Two Book Images */}
                <div className="space-y-6">
                  {/* First Image - Original */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300 dark:from-primary/30"></div>
                    <div className="relative bg-white p-4 rounded-2xl shadow-2xl dark:bg-gray-800">
                      <img
                        src={originalImg}
                        alt="Bhagavad Gita Original Cover"
                        className="w-full object-contain rounded-xl shadow-lg"
                        style={{ maxHeight: '300px', minHeight: '250px' }}
                      />
                    </div>
                  </div>
                  
                  {/* Second Image - Page 2 */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-2xl transform -rotate-1 group-hover:-rotate-2 transition-transform duration-300 dark:from-primary/30"></div>
                    <div className="relative bg-white p-4 rounded-2xl shadow-2xl dark:bg-gray-800">
                      <img
                        src={page2Img}
                        alt="Bhagavad Gita Page 2"
                        className="w-full object-contain rounded-xl shadow-lg"
                        style={{ maxHeight: '300px', minHeight: '250px' }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Right Side - Book Info and Preview Button */}
                <div className="space-y-6 text-left">
                  <h2 className="font-serif text-3xl font-bold text-foreground dark:text-foreground">
                    Featured Book
                  </h2>
                  <h3 className="font-serif text-2xl font-bold text-primary dark:text-primary">
                    {book.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg dark:text-muted-foreground">
                    {book.description}
                  </p>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-3xl font-bold text-foreground dark:text-foreground">
                      ₹{book.price}
                    </span>
                    <span className="text-sm text-muted-foreground dark:text-muted-foreground">
                      {book.currency}
                    </span>
                  </div>
                  
                  {/* Preview Button */}
                  <Button 
                    onClick={openPreview}
                    className="w-full h-14 text-lg font-medium bg-yellow-500 hover:bg-yellow-600 text-white dark:bg-yellow-600 dark:hover:bg-yellow-700"
                    variant="default"
                  >
                    <BookOpen className="mr-3 h-6 w-6" />
                    Preview Book (3-4 Pages)
                  </Button>
                  
                  <Button 
                    onClick={handleAddToCart}
                    className="w-full h-12 text-base font-medium"
                    variant="outline"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Book Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden dark:bg-card">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border dark:border-border">
              <h3 className="font-serif text-2xl font-bold text-foreground dark:text-foreground">
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
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6 items-start">
                {/* Left Side - Page Image */}
                <div className="relative">
                  <div className="bg-white p-4 rounded-xl shadow-lg dark:bg-gray-800">
                    <img
                      src={previewPages[currentPage].image}
                      alt={`Page ${currentPage + 1}`}
                      className="w-full object-contain rounded-lg"
                      style={{ maxHeight: '400px', minHeight: '350px' }}
                    />
                  </div>
                </div>
                
                {/* Right Side - Page Content */}
                <div className="space-y-4">
                  <h4 className="font-serif text-xl font-bold text-foreground dark:text-foreground">
                    {previewPages[currentPage].title}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed dark:text-muted-foreground">
                    {previewPages[currentPage].content}
                  </p>
                  
                  {/* Page Navigation */}
                  <div className="flex items-center justify-between pt-4">
                    <Button
                      onClick={prevPage}
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 0}
                      className="dark:border-border dark:hover:bg-accent/50"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    
                    <span className="text-sm text-muted-foreground dark:text-muted-foreground">
                      Page {currentPage + 1} of {previewPages.length}
                    </span>
                    
                    <Button
                      onClick={nextPage}
                      variant="outline"
                      size="sm"
                      disabled={currentPage === previewPages.length - 1}
                      className="dark:border-border dark:hover:bg-accent/50"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Sections Grid */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl font-bold text-foreground mb-4 dark:text-foreground">
            Explore Our Digital Library
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto dark:text-muted-foreground">
            Choose from our four main sections to discover spiritual wisdom in your preferred format
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* E-Book Section */}
          <Card 
            className="group cursor-pointer overflow-hidden shadow-xl border-0 bg-gradient-to-br from-blue-500/10 via-blue-600/5 to-transparent hover:shadow-2xl transition-all duration-300 hover:scale-105 dark:from-blue-500/20 dark:via-blue-600/10 dark:to-transparent dark:bg-card/90 dark:border-blue-500/20"
            onClick={() => handleNavigation('/ebook')}
          >
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="h-16 w-16 bg-blue-500/20 rounded-2xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors dark:bg-blue-500/30 dark:group-hover:bg-blue-500/40">
                  <BookOpen className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-blue-500 transition-colors dark:text-muted-foreground dark:group-hover:text-blue-400" />
              </div>
              
              <div>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-3 dark:text-foreground">
                  E-Book Collection
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4 dark:text-muted-foreground">
                  Interactive digital books with audio narration, animated illustrations, and engaging features 
                  that bring ancient wisdom to life on any device.
                </p>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-1">
                    <Download className="h-5 w-5 text-blue-500 mx-auto dark:text-blue-400" />
                    <p className="text-xs font-medium dark:text-foreground">Instant Download</p>
                  </div>
                  <div className="space-y-1">
                    <Play className="h-5 w-5 text-green-500 mx-auto dark:text-green-400" />
                    <p className="text-xs font-medium dark:text-foreground">Audio Narration</p>
                  </div>
                  <div className="space-y-1">
                    <Star className="h-5 w-5 text-yellow-500 mx-auto dark:text-yellow-400" />
                    <p className="text-xs font-medium dark:text-foreground">Interactive</p>
                  </div>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full border-blue-500/30 text-blue-500 hover:bg-blue-500 hover:text-white dark:border-blue-400/40 dark:text-blue-400 dark:hover:bg-blue-500 dark:hover:text-white"
              >
                Explore E-Books
              </Button>
            </div>
          </Card>

          {/* E-Audio Section */}
          <Card 
            className="group cursor-pointer overflow-hidden shadow-xl border-0 bg-gradient-to-br from-green-500/10 via-green-600/5 to-transparent hover:shadow-2xl transition-all duration-300 hover:scale-105 dark:from-green-500/20 dark:via-green-600/10 dark:to-transparent dark:bg-card/90 dark:border-green-500/20"
            onClick={() => handleNavigation('/eaudio')}
          >
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="h-16 w-16 bg-green-500/20 rounded-2xl flex items-center justify-center group-hover:bg-green-500/30 transition-colors dark:bg-green-500/30 dark:group-hover:bg-green-500/40">
                  <Headphones className="h-8 w-8 text-green-500 dark:text-green-400" />
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-green-500 transition-colors dark:text-muted-foreground dark:group-hover:text-green-400" />
              </div>
              
              <div>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-3 dark:text-foreground">
                  E-Audio Library
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4 dark:text-muted-foreground">
                  Immerse yourself in professional audio narrations with soothing voices, beautiful music, 
                  and expert commentary on spiritual texts and stories.
                </p>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-1">
                    <Headphones className="h-5 w-5 text-green-500 mx-auto dark:text-green-400" />
                    <p className="text-xs font-medium dark:text-foreground">High Quality</p>
                  </div>
                  <div className="space-y-1">
                    <Clock className="h-5 w-5 text-blue-500 mx-auto dark:text-blue-400" />
                    <p className="text-xs font-medium dark:text-foreground">Variable Length</p>
                  </div>
                  <div className="space-y-1">
                    <Users className="h-5 w-5 text-purple-500 mx-auto dark:text-purple-400" />
                    <p className="text-xs font-medium dark:text-foreground">Expert Narrators</p>
                  </div>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full border-green-500/30 text-green-500 hover:bg-green-500 hover:text-white dark:border-green-400/40 dark:text-green-400 dark:hover:bg-green-500 dark:hover:text-white"
              >
                Listen to Audio
              </Button>
            </div>
          </Card>

          {/* Social Media Section */}
          <Card 
            className="group cursor-pointer overflow-hidden shadow-xl border-0 bg-gradient-to-br from-red-500/10 via-red-600/5 to-transparent hover:shadow-2xl transition-all duration-300 hover:scale-105 dark:from-red-500/20 dark:via-red-600/10 dark:to-transparent dark:bg-card/90 dark:border-red-500/20"
            onClick={() => handleNavigation('/social')}
          >
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="h-16 w-16 bg-red-500/20 rounded-2xl flex items-center justify-center group-hover:bg-red-500/30 transition-colors dark:bg-red-500/30 dark:group-hover:bg-red-500/40">
                  <div className="flex gap-1">
                    <Youtube className="h-6 w-6 text-red-500 dark:text-red-400" />
                    <Instagram className="h-6 w-6 text-pink-500 dark:text-pink-400" />
                  </div>
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-red-500 transition-colors dark:text-muted-foreground dark:group-hover:text-red-400" />
              </div>
              
              <div>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-3 dark:text-foreground">
                  Social Media Hub
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4 dark:text-muted-foreground">
                  Connect with us on YouTube and Instagram for daily wisdom, engaging stories, 
                  meditation guides, and spiritual insights delivered directly to your feed.
                </p>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-1">
                    <Youtube className="h-5 w-5 text-red-500 mx-auto dark:text-red-400" />
                    <p className="text-xs font-medium dark:text-foreground">Video Content</p>
                  </div>
                  <div className="space-y-1">
                    <Instagram className="h-5 w-5 text-pink-500 mx-auto dark:text-pink-400" />
                    <p className="text-xs font-medium dark:text-foreground">Daily Posts</p>
                  </div>
                  <div className="space-y-1">
                    <ExternalLink className="h-5 w-5 text-blue-500 mx-auto dark:text-blue-400" />
                    <p className="text-xs font-medium dark:text-foreground">Direct Links</p>
                  </div>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white dark:border-red-400/40 dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-white"
              >
                Connect With Us
              </Button>
            </div>
          </Card>

          {/* Future Prompts Section */}
          <Card 
            className="group cursor-pointer overflow-hidden shadow-xl border-0 bg-gradient-to-br from-yellow-500/10 via-yellow-600/5 to-transparent hover:shadow-2xl transition-all duration-300 hover:scale-105 dark:from-yellow-500/20 dark:via-yellow-600/10 dark:to-transparent dark:bg-card/90 dark:border-yellow-500/20"
            onClick={() => handleNavigation('/future-prompts')}
          >
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="h-16 w-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center group-hover:bg-yellow-500/30 transition-colors dark:bg-yellow-500/30 dark:group-hover:bg-yellow-500/40">
                  <Lightbulb className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-yellow-500 transition-colors dark:text-muted-foreground dark:group-hover:text-yellow-400" />
              </div>
              
              <div>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-3 dark:text-foreground">
                  Future Prompts
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4 dark:text-muted-foreground">
                  Access our curated collection of AI prompts for creating spiritual content, 
                  educational materials, and inspiring stories that connect with readers of all ages.
                </p>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-1">
                    <Lightbulb className="h-5 w-5 text-yellow-500 mx-auto dark:text-yellow-400" />
                    <p className="text-xs font-medium dark:text-foreground">AI Ready</p>
                  </div>
                  <div className="space-y-1">
                    <BookOpen className="h-5 w-5 text-blue-500 mx-auto dark:text-blue-400" />
                    <p className="text-xs font-medium dark:text-foreground">Templates</p>
                  </div>
                  <div className="space-y-1">
                    <Star className="h-5 w-5 text-purple-500 mx-auto dark:text-purple-400" />
                    <p className="text-xs font-medium dark:text-foreground">Curated</p>
                  </div>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full border-yellow-500/30 text-yellow-500 hover:bg-yellow-500 hover:text-white dark:border-yellow-400/40 dark:text-yellow-400 dark:hover:bg-yellow-500 dark:hover:text-white"
              >
                Explore Prompts
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Card className="p-12 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20 dark:from-primary/20 dark:via-primary/10 dark:to-transparent dark:border-primary/30 dark:bg-card/90">
          <h2 className="font-serif text-4xl font-bold text-foreground mb-6 dark:text-foreground">
            Start Your Spiritual Journey Today
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto dark:text-muted-foreground">
            Whether you prefer reading, listening, watching, or creating, we have the perfect 
            way for you to connect with ancient wisdom and spiritual teachings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => handleNavigation('/ebook')}
              variant="default"
              size="lg"
              className="h-14 px-8 text-lg"
            >
              <BookOpen className="mr-2 h-6 w-6" />
              Start with E-Books
            </Button>
            <Button
              onClick={() => handleNavigation('/eaudio')}
              variant="outline"
              size="lg"
              className="h-14 px-8 text-lg"
            >
              <Headphones className="mr-2 h-6 w-6" />
              Listen to Audio
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Home;