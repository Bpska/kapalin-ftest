import { useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/components/ui/use-toast';

const Cart = () => {
  const { state, removeFromCart, updateQuantity } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    toast({
      title: "Order Placed!",
      description: "Your wisdom tales are on their way. Thank you for your purchase!",
    });
    setTimeout(() => setIsCheckingOut(false), 2000);
  };

  if (state.items.length === 0) {
    return (
      <div className="px-4 py-6">
        <h1 className="font-serif text-2xl font-bold text-sage-brown mb-6 text-center">
          Your Cart
        </h1>
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <div className="text-4xl">📚</div>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">Your cart is empty</h3>
          <p className="text-muted-foreground mb-6">Add some wisdom tales to get started!</p>
          <Button onClick={() => window.history.back()} variant="outline">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-6">
      <h1 className="font-serif text-2xl font-bold text-sage-brown text-center">
        Your Cart
      </h1>

      <div className="space-y-4">
        {state.items.map((item) => (
          <Card key={item.book.id} className="p-4 shadow-soft border-border">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-20 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                <img
                  src={item.book.image}
                  alt={item.book.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">
                  {item.book.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  ₹{item.book.price}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFromCart(item.book.id)}
                    className="text-destructive hover:text-destructive"
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
      <Card className="p-6 shadow-soft border-border">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">Total</span>
            <span className="text-2xl font-bold text-primary">₹{state.total}</span>
          </div>
          <Button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="w-full bg-gradient-primary text-primary-foreground shadow-warm hover:opacity-90 transition-all duration-300"
          >
            {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Cart;