import { useState, useEffect, useRef } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AddressPrompt from '@/components/AddressPrompt';
import SupabaseUserService from '@/lib/supabaseUserService';
import { toast } from '@/hooks/use-toast';
import LoginPrompt from '@/components/LoginPrompt';

const Cart = () => {
  const { state, removeFromCart, updateQuantity } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showAddressPrompt, setShowAddressPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const _lastFallbackRef = useRef(false);

  // Debug: Log when component mounts
  useEffect(() => {
    console.log('Cart component mounted. Auth:', isAuthenticated, 'User:', user?.id);
  }, [isAuthenticated, user?.id]);

  // Debug helpers: log pointer events and element at pointer for diagnosing click interception
  useEffect(() => {
    const onPointerDownCapture = (e: PointerEvent) => {
      try {
        const x = e.clientX;
        const y = e.clientY;
        const el = document.elementFromPoint(x, y) as HTMLElement | null;
        console.log('GLOBAL pointerdown (capture) at', { x, y, target: e.target, topElement: el });
        if (el) {
          console.log('Topmost element tag/class/id:', el.tagName, el.className, el.id);
        }
      } catch (err) {
        console.error('Error in pointer debug handler', err);
      }
    };

    document.addEventListener('pointerdown', onPointerDownCapture, true);
    return () => document.removeEventListener('pointerdown', onPointerDownCapture, true);
  }, []);

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

  const handleCheckout = async () => {
    console.log('=== BUY NOW CLICKED ===');
    console.log('Auth status:', isAuthenticated);
    console.log('User:', user);
    
    setIsLoading(true);

    try {
      // Check authentication first
      if (!isAuthenticated) {
        console.log('User not authenticated - showing login prompt');
        setShowLoginPrompt(true);
        setIsLoading(false);
        return;
      }

      // Get user ID
      const userId = user?.id;
      if (!userId) {
        console.log('No user ID found');
        toast({
          title: 'Error',
          description: 'Unable to identify user. Please login again.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      console.log('Checking addresses for user:', userId);

      // Fetch user addresses
      const addresses = await SupabaseUserService.getAddresses(userId);
      console.log('Addresses fetched:', addresses);

      if (!addresses || addresses.length === 0) {
        console.log('No addresses found - showing address prompt');
        setShowAddressPrompt(true);
      } else {
        console.log('Addresses found - navigating to payment');
        navigate('/payment');
      }
    } catch (error) {
      console.error('Error in checkout:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Proceeding to payment page.',
        variant: 'destructive',
      });
      // Still allow user to continue to payment
      navigate('/payment');
    } finally {
      setIsLoading(false);
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
    // add bottom padding so fixed bottom nav does not cover the Buy Now button
    <div className="container-mobile py-4 sm:py-6 space-y-4 sm:space-y-6 pb-28 safe-area-pb">
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
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    ₹{item.book.price} × {item.quantity}
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-foreground">
                    = ₹{item.book.price * item.quantity}
                  </p>
                </div>
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
          <div style={{ position: 'relative' }}>
            <button
              onClick={handleCheckout}
              onPointerDown={(e) => {
                // Log local pointerdown and as a fallback call handleCheckout once
                try {
                  const x = (e as any).clientX;
                  const y = (e as any).clientY;
                  const el = document.elementFromPoint(x, y) as HTMLElement | null;
                  console.log('CTA pointerdown', { x, y, target: e.target, topElement: el });
                } catch (err) {
                  console.error('CTA pointerdown error', err);
                }
                // fallback invoke if click doesn't arrive (debounced by ref)
                if (!_lastFallbackRef.current && !isLoading) {
                  _lastFallbackRef.current = true;
                  // small timeout to allow normal onClick to run if it will
                  setTimeout(() => { _lastFallbackRef.current = false; }, 1200);
                }
              }}
              disabled={isLoading}
              type="button"
              style={{
                // ensure the CTA sits above any fixed overlays (bottom nav, dialogs)
                position: 'relative',
                zIndex: 60,
                pointerEvents: 'auto',
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#F59E0B',
                color: '#78471C',
                fontSize: '16px',
                fontWeight: '600',
                border: 'none',
                borderRadius: '8px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#D97706';
                  (e.target as HTMLButtonElement).style.transform = 'scale(1.02)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#F59E0B';
                  (e.target as HTMLButtonElement).style.transform = 'scale(1)';
                }
              }}
            >
              {isLoading ? 'Processing...' : 'Buy Now'}
            </button>
          </div>
        </div>
      </Card>
      
      <LoginPrompt 
        open={showLoginPrompt}
        onOpenChange={setShowLoginPrompt}
        feature="complete your purchase"
      />
      <AddressPrompt open={showAddressPrompt} onOpenChange={setShowAddressPrompt} />
    </div>
  );
};

export default Cart;