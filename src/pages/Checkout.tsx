import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const addressSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(4, 'ZIP code is required'),
  country: z.string().min(2, 'Country is required'),
});

type AddressFormData = z.infer<typeof addressSchema>;

const Checkout = () => {
  const navigate = useNavigate();
  const { state } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      country: 'India',
    },
  });

  const onSubmit = async (data: AddressFormData) => {
    setIsSubmitting(true);
    // Store address in session storage to use in payment page
    sessionStorage.setItem('checkoutAddress', JSON.stringify(data));
    setIsSubmitting(false);
    // Navigate to payment page
    navigate('/checkout/payment');
  };

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
        <Button onClick={() => navigate('/')}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/cart')}
          className="p-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-serif text-2xl font-bold text-foreground">Delivery Details</h1>
      </div>

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
          <div className="pt-2 border-t flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-primary">₹{state.total}</span>
          </div>
        </div>
      </Card>

      {/* Delivery Address Form */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Delivery Address</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Enter your full name"
              className="mt-1"
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              {...register('phone')}
              placeholder="10 digit mobile number"
              className="mt-1"
            />
            {errors.phone && (
              <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="street">Street Address *</Label>
            <Input
              id="street"
              {...register('street')}
              placeholder="House No., Building Name, Street"
              className="mt-1"
            />
            {errors.street && (
              <p className="text-sm text-destructive mt-1">{errors.street.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                {...register('city')}
                placeholder="City"
                className="mt-1"
              />
              {errors.city && (
                <p className="text-sm text-destructive mt-1">{errors.city.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                {...register('state')}
                placeholder="State"
                className="mt-1"
              />
              {errors.state && (
                <p className="text-sm text-destructive mt-1">{errors.state.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="zipCode">ZIP Code *</Label>
              <Input
                id="zipCode"
                {...register('zipCode')}
                placeholder="PIN Code"
                className="mt-1"
              />
              {errors.zipCode && (
                <p className="text-sm text-destructive mt-1">{errors.zipCode.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                {...register('country')}
                placeholder="Country"
                className="mt-1"
              />
              {errors.country && (
                <p className="text-sm text-destructive mt-1">{errors.country.message}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-primary text-primary-foreground h-12 mt-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Continue to Payment'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Checkout;
