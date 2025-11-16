import { useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import LoginPrompt from '@/components/LoginPrompt';

const Cart = () => {
  const { state, removeFromCart, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleRemoveItem = (bookId: string, bookTitle: string) => {
    removeFromCart(bookId);
    toast({
      title: "Removed from Cart",
      description: `${bookTitle} has been removed from your cart.`,
    });
  };

  const handleUpdateQuantity = (bookId: string, bookTitle: string, newQuantity: number) => {
    updateQuantity(bookId, newQuantity);
    if (newQuantity === 0) {
      toast({
        title: "Removed from Cart",
        description: `${bookTitle} has been removed from your cart.`,
      });
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    navigate('/checkout');
  };

  if (state.items.length === 0) {
    return (
      <div className="container-mobile py-4 sm:py-6">
        <h1 className="font-serif text-xl sm:text-2xl font-bold text-sage-brown mb-4 sm:mb-6 text-center">
          Your Cart
        </h1>
        <div className="text-center py-8 sm:py-12">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <div className="text-3xl sm:text-4xl">📚</div>
          </div>
          <h3 className="text-base sm:text-lg font-medium text-foreground mb-2">Your cart is empty</h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 px-4">Add some wisdom tales to get started!</p>
          <Button 
            onClick={() => window.history.back()} 
            variant="outline"
            className="btn-mobile touch-manipulation"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-mobile py-4 sm:py-6 space-y-4 sm:space-y-6">
      <h1 className="font-serif text-xl sm:text-2xl font-bold text-sage-brown text-center">
        Your Cart
      </h1>

      <div className="space-y-3 sm:space-y-4">
        {state.items.map((item) => (
          <Card key={item.book.id} className="card-mobile shadow-soft border-border touch-manipulation">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-14 h-18 sm:w-16 sm:h-20 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                <img
                  src={item.book.image}
                  alt={item.book.title}
                  className="img-responsive"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-medium text-foreground truncate">
                  {item.book.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  ₹{item.book.price}
                </p>
                <div className="flex items-center justify-between mt-2 sm:mt-3">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateQuantity(item.book.id, item.book.title, item.quantity - 1)}
                      className="btn-mobile h-8 w-8 p-0 touch-manipulation"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateQuantity(item.book.id, item.book.title, item.quantity + 1)}
                      className="btn-mobile h-8 w-8 p-0 touch-manipulation"
                    >
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveItem(item.book.id, item.book.title)}
                    className="btn-mobile text-destructive hover:text-destructive hover:bg-destructive/10 touch-manipulation"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Total & Checkout */}
      <Card className="card-mobile shadow-soft border-border">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-base sm:text-lg font-medium">Total</span>
            <span className="text-xl sm:text-2xl font-bold text-primary">₹{state.total}</span>
          </div>
          <Button
            type="button"
            onClick={handleCheckout}
            className="w-full btn-mobile bg-gradient-primary text-primary-foreground shadow-warm hover:opacity-90 transition-all duration-300 touch-manipulation"
          >
            Buy Now
          </Button>
        </div>
      </Card>
      
      <LoginPrompt 
        open={showLoginPrompt}
        onOpenChange={setShowLoginPrompt}
        feature="complete your purchase"
      />
    </div>
  );
};

export default Cart;