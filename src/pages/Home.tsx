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
import bgCover from '@/assets/books.png';
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
  const [isPlaying, setIsPlaying] = useState(false);

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
      <div className="relative overflow-hidden py-24" style={{background: 'linear-gradient(180deg, rgba(4,7,19,1) 0%, rgba(10,12,25,1) 100%)'}}>
        <div className="absolute top-6 right-6 z-10">
          <ThemeToggle />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <Badge variant="outline" className="mb-6 border-white/10 text-wisdom-gold text-base px-4 py-2 bg-white/2">
                Wisdom of the Ages
              </Badge>
              <h1 className="font-serif text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
                Kapalin Gita Tales for the Next Generation
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
                Ancient wisdom with modern storytelling
              </p>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
                Stories for the future — modern, accessible retellings with audio, e-books, and visual experiences.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => handleNavigation('/ebook')}
                  className="h-14 px-6 text-lg font-medium bg-wisdom-gold text-black hover:brightness-95"
                  variant="default">
                  Buy Now
                </Button>

                <Button
                  // onClick={() => handleNavigation('/eaudio')}
                  className="h-14 px-6 text-lg font-medium border border-white/10 text-foreground bg-transparent hover:bg-white/3"
                  variant="outline">
                  pree booking
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-xs md:max-w-sm">
                <img src={bgCover} alt="Bhagavad Gita Cover" className="w-full rounded-2xl shadow-elevated" />
              </div>
            </div>
          </div>
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

      {/* Experience Section (features, audio player, media tiles) */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-center font-serif text-3xl md:text-4xl font-bold text-foreground mb-8">
          Experience Kapalin Gita Tales
        </h2>

        {/* Feature Row */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <div className="p-6 rounded-xl bg-card/70 border border-border shadow-soft flex items-start gap-4">
            <div className="p-3 rounded-md bg-wisdom-gold/10 text-wisdom-gold">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Easy to Understand</h4>
              <p className="text-sm text-muted-foreground">Modern story-telling style</p>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-card/70 border border-border shadow-soft flex items-start gap-4">
            <div className="p-3 rounded-md bg-wisdom-gold/10 text-wisdom-gold">
              <Headphones className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Audio + Digital</h4>
              <p className="text-sm text-muted-foreground">Listen or read anywhere</p>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-card/70 border border-border shadow-soft flex items-start gap-4">
            <div className="p-3 rounded-md bg-wisdom-gold/10 text-wisdom-gold">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Global Reach</h4>
              <p className="text-sm text-muted-foreground">20,000+ seekers already on the journey</p>
            </div>
          </div>
        </div>

        {/* Audio Player Card */}
        <Card className="mb-10 p-6 bg-card/70 border border-border shadow-elevated">
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-1">
              <div className="relative rounded-lg overflow-hidden">
                <img src={originalImg} alt="Book" className="w-full object-cover rounded-lg shadow-lg" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
            </div>
            <div className="md:col-span-2">
              <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">Play Chapter 1 – Arjuna's Dilemma</h3>
              <p className="text-sm text-muted-foreground mb-4">Listen to a short narration of the opening chapter — experience the moment that begins the Gita.</p>

              {/* Mock waveform + controls */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsPlaying(prev => !prev)}
                  className="h-12 w-12 rounded-full flex items-center justify-center bg-wisdom-gold text-black shadow-soft"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <X className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </button>

                <div className="flex-1">
                  <div className="h-10 rounded-md bg-muted/40 flex items-center px-3">
                    {/* simple animated bars to mimic waveform */}
                    <div className={`flex gap-1 w-full items-end`}> 
                      {Array.from({ length: 40 }).map((_, i) => (
                        <div key={i} className={`bg-foreground/20 rounded-sm`} style={{ width: 3, height: `${isPlaying ? (10 + (i % 8) * 6) : 4}px`, transition: 'height 200ms ease' }} />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                    <span>00:00</span>
                    <span>03:24</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Media Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="rounded-lg overflow-hidden bg-card/70 border border-border shadow-soft cursor-pointer" onClick={() => handleNavigation('/hardcover')}>
            <img src={bgCover} alt="Hardcover" className="w-full h-44 object-cover" />
            <div className="p-4 text-center">
              <h4 className="text-foreground font-serif">Hardcover</h4>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden bg-card/70 border border-border shadow-soft cursor-pointer" onClick={() => handleNavigation('/ebook')}>
            <img src={page2Img} alt="E-Book" className="w-full h-44 object-cover" />
            <div className="p-4 text-center">
              <h4 className="text-foreground font-serif">E-Book</h4>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden bg-card/70 border border-border shadow-soft cursor-pointer" onClick={() => handleNavigation('/social')}>
            <img src={originalImg} alt="Animated Series" className="w-full h-44 object-cover" />
            <div className="p-4 text-center">
              <h4 className="text-foreground font-serif">Animated Series</h4>
            </div>
          </div>
        </div>

        {/* Stats & Testimonial */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* <div className="text-left">
            <div className="text-4xl font-serif font-bold text-foreground">10,000+</div>
            <div className="text-sm text-muted-foreground">SEEKERS</div>
          </div> */}

          {/* <div className="flex items-center gap-4 bg-card/60 p-4 rounded-lg border border-border shadow-soft">
            <img src={page2Img} alt="avatar" className="h-12 w-12 rounded-full object-cover" />
            <div>
              <div className="font-semibold text-foreground">Amrita S.</div>
              <div className="text-sm text-muted-foreground">"Beautifully written and perfect for introducing children to the Gita."</div>
            </div>
          </div> */}
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