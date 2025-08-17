import { useState, useEffect } from 'react';
import { User, Package, CreditCard, MapPin, HelpCircle, ChevronRight, Calendar, Edit3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { SupabaseUserService, Order, Address, PaymentMethod } from '@/lib/supabaseUserService';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const [userOrders, userAddresses, userPaymentMethods] = await Promise.all([
        SupabaseUserService.getUserOrders(user.id),
        SupabaseUserService.getAddresses(user.id),
        SupabaseUserService.getPaymentMethods(user.id)
      ]);
      
      setOrders(userOrders);
      setAddresses(userAddresses);
      setPaymentMethods(userPaymentMethods);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const profileSections = [
    {
      icon: Package,
      title: 'My Orders',
      description: 'Track your wisdom tales',
      items: orders.length > 0 ? orders.slice(0, 2).map(order => ({
        name: `Order #${order.id.slice(0, 8)}...`,
        status: order.status.charAt(0).toUpperCase() + order.status.slice(1)
      })) : [
        { name: 'No orders yet', status: 'Start shopping!' }
      ]
    },
    {
      icon: CreditCard,
      title: 'Payment Methods',
      description: 'Manage your payment options',
      items: paymentMethods.length > 0 ? paymentMethods.slice(0, 2).map(method => ({
        name: method.name,
        status: method.is_default ? 'Default' : method.type.toUpperCase()
      })) : [
        { name: 'No payment methods', status: 'Add one now' }
      ]
    },
    {
      icon: MapPin,
      title: 'Shipping Addresses',
      description: 'Manage delivery locations',
      items: addresses.length > 0 ? addresses.slice(0, 2).map(address => ({
        name: address.name,
        status: `${address.city}, ${address.state}`
      })) : [
        { name: 'No addresses saved', status: 'Add your address' }
      ]
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      description: 'Get assistance when needed',
      items: [
        { name: 'FAQ', status: 'Common questions' },
        { name: 'Contact Us', status: 'Get in touch' },
      ]
    }
  ];

  return (
    <div className="px-4 py-6 space-y-6">
      <h1 className="font-serif text-2xl font-bold text-sage-brown text-center">
        Profile
      </h1>

      {/* Profile Header */}
      <Card className="p-6 shadow-soft border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.photoURL || '/placeholder-user.jpg'} />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-lg font-medium">
                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{user?.name || 'User'}</h2>
              <p className="text-muted-foreground">{user?.email || 'user@example.com'}</p>
              {user?.createdAt && (
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Member since {format(user.createdAt, 'MMM yyyy')}
                </p>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/profile/edit')}
            className="flex items-center gap-2"
          >
            <Edit3 className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </Card>

      {/* Profile Sections */}
      <div className="space-y-4">
        {profileSections.map((section) => (
          <Card key={section.title} className="p-4 shadow-soft border-border">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <section.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{section.title}</h3>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              {section.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.status}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Profile;
