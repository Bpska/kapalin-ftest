import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Book, useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import LoginPrompt from '@/components/LoginPrompt';

interface BookCardProps {
  book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    
    addToCart(book);
    toast({
      title: "Added to Cart!",
      description: `${book.title} has been added to your cart.`,
    });
  };

  const handleCardClick = () => {
    navigate(`/book/${book.id}`);
  };

  return (
    <Card 
      onClick={handleCardClick}
      className="p-4 shadow-soft border-border hover:shadow-warm transition-all duration-300 cursor-pointer hover:scale-[1.02] bg-gradient-subtle"
    >
      <div className="flex space-x-4">
        {/* Book Cover */}
        <div className="w-20 h-28 rounded-xl shadow-soft overflow-hidden flex-shrink-0">
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Book Info */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <h3 className="font-serif font-semibold text-sage-brown text-lg leading-tight mb-1">
              {book.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-3 line-clamp-2">
              {book.description}
            </p>
            
            {/* Rating */}
            <div className="flex items-center space-x-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-wisdom-gold text-wisdom-gold" />
              ))}
              <span className="text-xs text-muted-foreground ml-1">(4.8)</span>
            </div>
          </div>

          {/* Price & Add to Cart */}
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary">₹{book.price}</span>
            <Button
              onClick={handleAddToCart}
              size="sm"
              className="bg-gradient-primary text-primary-foreground shadow-soft hover:opacity-90 transition-all duration-300"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </div>
      
      <LoginPrompt
        open={showLoginPrompt}
        onOpenChange={setShowLoginPrompt}
        feature="add items to cart"
      />
    </Card>
  );
};

export default BookCard;