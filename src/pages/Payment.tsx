import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext';
import { orderService } from '@/services/orderService';
import { toast } from '@/components/ui/use-toast';

const Payment = () => {
  const navigate = useNavigate();
  const { state, clearCart } = useCart();
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const [addressData, setAddressData] = useState<any>(null);

  useEffect(() => {
    // Get address from session storage
    const storedAddress = sessionStorage.getItem('checkoutAddress');
    if (!storedAddress) {
      // If no address, redirect back to checkout
      navigate('/checkout');
      return;
    }
    setAddressData(JSON.parse(storedAddress));
  }, [navigate]);

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
        <Button onClick={() => navigate('/')}>Continue Shopping</Button>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!addressData) {
      toast({
        title: 'Error',
        description: 'Delivery address not found. Please go back and enter your address.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Create order in database
      const orderId = await orderService.createOrder({
        total_amount: state.total,
        currency: 'INR',
      });

      // Add order items
      const orderItems = state.items.map(item => ({
        book_id: item.book.id,
        book_title: item.book.title,
        book_price: item.book.price,
        quantity: item.quantity,
      }));

      await orderService.addOrderItems(orderId, orderItems);

      // Clear cart and session storage
      clearCart();
      sessionStorage.removeItem('checkoutAddress');

      toast({
        title: 'Order Placed Successfully!',
        description: `Your order has been placed with ${selectedPayment === 'cod' ? 'Cash on Delivery' : selectedPayment.toUpperCase()} payment method.`,
      });

      // Navigate to success page or home
      navigate('/');
    } catch (error) {
      console.error('Order placement error:', error);
      toast({
        title: 'Order Failed',
        description: 'There was an error placing your order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/checkout')}
          className="p-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-serif text-2xl font-bold text-foreground">Payment Options</h1>
      </div>

      {/* Delivery Address Summary */}
      {addressData && (
        <Card className="p-4 mb-6 bg-muted/50">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold mb-2">Delivering to:</h3>
              <p className="text-sm text-muted-foreground">
                {addressData.name}<br />
                {addressData.street}<br />
                {addressData.city}, {addressData.state} {addressData.zipCode}<br />
                Phone: {addressData.phone}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/checkout')}
            >
              Change
            </Button>
          </div>
        </Card>
      )}

      {/* Order Summary */}
      <Card className="p-4 mb-6 bg-muted/50">
        <h3 className="font-semibold mb-3">Order Summary</h3>
        <div className="space-y-2">
          {state.items.map((item) => (
            <div key={item.book.id} className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {item.book.title} x {item.quantity}
              </span>
              <span className="font-medium">₹{item.book.price * item.quantity}</span>
            </div>
          ))}
          <div className="pt-2 border-t flex justify-between font-semibold text-lg">
            <span>Total Amount</span>
            <span className="text-primary">₹{state.total}</span>
          </div>
        </div>
      </Card>

      {/* Payment Methods */}
      <Card className="p-6 mb-6">
        <h3 className="font-semibold mb-4">Select Payment Method</h3>
        <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
          <div className="space-y-4">
            {/* Cash on Delivery */}
            <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
              <RadioGroupItem value="cod" id="cod" />
              <Label htmlFor="cod" className="flex items-center space-x-3 cursor-pointer flex-1">
                <Wallet className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Cash on Delivery</p>
                  <p className="text-sm text-muted-foreground">Pay when you receive</p>
                </div>
              </Label>
            </div>

            {/* UPI */}
            <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
              <RadioGroupItem value="upi" id="upi" />
              <Label htmlFor="upi" className="flex items-center space-x-3 cursor-pointer flex-1">
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">UPI</p>
                  <p className="text-sm text-muted-foreground">Pay using UPI apps</p>
                </div>
              </Label>
            </div>

            {/* Card */}
            <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex items-center space-x-3 cursor-pointer flex-1">
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Credit/Debit Card</p>
                  <p className="text-sm text-muted-foreground">Visa, Mastercard, RuPay</p>
                </div>
              </Label>
            </div>

            {/* Net Banking */}
            <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
              <RadioGroupItem value="netbanking" id="netbanking" />
              <Label htmlFor="netbanking" className="flex items-center space-x-3 cursor-pointer flex-1">
                <Wallet className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Net Banking</p>
                  <p className="text-sm text-muted-foreground">All Indian banks</p>
                </div>
              </Label>
            </div>
          </div>
        </RadioGroup>
      </Card>

      {/* Place Order Button */}
      <Button
        onClick={handlePlaceOrder}
        className="w-full bg-gradient-primary text-primary-foreground h-12"
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : `Place Order - ₹${state.total}`}
      </Button>
    </div>
  );
};

export default Payment;
