import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { booksData } from '@/data/books';
import { toast } from '@/components/ui/use-toast';
import LoginPrompt from '@/components/LoginPrompt';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loginPromptFeature, setLoginPromptFeature] = useState('');

  const book = booksData.find(b => b.id === id);

  if (!book) {
    return (
      <div className="px-4 py-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Book not found</h2>
        <Button onClick={() => navigate('/')}>Go Home</Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setLoginPromptFeature('add items to cart');
      setShowLoginPrompt(true);
      return;
    }
    
    addToCart(book);
    toast({
      title: "Added to Cart!",
      description: `${book.title} has been added to your cart.`,
    });
  };

  const handleViewSamplePages = () => {
    if (!isAuthenticated) {
      setLoginPromptFeature('view sample pages');
      setShowLoginPrompt(true);
      return;
    }
    // Sample pages are already visible, so we don't need additional logic here
    // This function is just for the authentication check
  };

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="p-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-serif text-xl font-bold text-sage-brown">Book Details</h1>
      </div>

      {/* Book Cover */}
      <div className="flex justify-center">
        <div className="w-48 h-64 rounded-2xl shadow-elevated overflow-hidden">
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Book Info */}
      <div className="text-center space-y-2">
        <h2 className="font-serif text-2xl font-bold text-sage-brown">{book.title}</h2>
        <div className="flex items-center justify-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-wisdom-gold text-wisdom-gold" />
          ))}
          <span className="text-sm text-muted-foreground ml-2">(4.8)</span>
        </div>
        <p className="text-3xl font-bold text-primary">₹{book.price}</p>
      </div>

      {/* Add to Cart */}
      <Button
        onClick={handleAddToCart}
        className="w-full bg-gradient-primary text-primary-foreground shadow-warm hover:opacity-90 transition-all duration-300 h-12"
      >
        Add to Cart
      </Button>

      {/* About the Book */}
      <Card className="p-6 shadow-soft border-border">
        <h3 className="font-serif text-lg font-semibold text-sage-brown mb-3">
          About this Book
        </h3>
        <p className="text-muted-foreground leading-relaxed">{book.about}</p>
      </Card>

      {/* Sample Pages */}
      <Card className="p-6 shadow-soft border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg font-semibold text-sage-brown">
            Sample Pages
          </h3>
          {!isAuthenticated && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewSamplePages}
            >
              Login to View
            </Button>
          )}
        </div>
        
        {isAuthenticated ? (
          <Carousel className="w-full">
            <CarouselContent>
              {book.samplePages.map((page, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-soft">
                    <img
                      src={page}
                      alt={`Sample page ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : (
          <div 
            className="aspect-[3/4] rounded-xl overflow-hidden shadow-soft bg-muted flex items-center justify-center cursor-pointer"
            onClick={handleViewSamplePages}
          >
            <div className="text-center">
              <p className="text-muted-foreground mb-2">Sample pages available</p>
              <Button variant="outline" size="sm">
                Login to View
              </Button>
            </div>
          </div>
        )}
      </Card>
      
      <LoginPrompt
        open={showLoginPrompt}
        onOpenChange={setShowLoginPrompt}
        feature={loginPromptFeature}
      />
    </div>
  );
};

export default BookDetail;