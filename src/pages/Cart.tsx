import { useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { orderService } from '@/services/orderService';
import LoginPrompt from '@/components/LoginPrompt';

const Cart = () => {
  const { state, removeFromCart, updateQuantity, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    setIsCheckingOut(true);
    try {
      // Create order in database
      const orderId = await orderService.createOrder({
        total_amount: state.total,
        currency: 'INR'
      });

      // Add order items
      const orderItems = state.items.map(item => ({
        book_id: item.book.id,
        book_title: item.book.title,
        book_price: item.book.price,
        quantity: item.quantity
      }));

      await orderService.addOrderItems(orderId, orderItems);

      // Clear cart and show success
      clearCart();
      toast({
        title: "Order Placed Successfully!",
        description: "Your wisdom tales order has been created. Check your profile for order details.",
      });
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCheckingOut(false);
    }
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
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                      className="btn-mobile h-8 w-8 p-0 touch-manipulation"
                    >
                      <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                      className="btn-mobile h-8 w-8 p-0 touch-manipulation"
                    >
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFromCart(item.book.id)}
                    className="btn-mobile text-destructive hover:text-destructive touch-manipulation"
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
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="w-full btn-mobile bg-gradient-primary text-primary-foreground shadow-warm hover:opacity-90 transition-all duration-300 touch-manipulation"
          >
            {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
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