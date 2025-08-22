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
    <div className="container-mobile py-4 sm:py-6 space-y-4 sm:space-y-6">
      <h1 className="font-serif text-xl sm:text-2xl font-bold text-sage-brown text-center">
        Profile
      </h1>

      {/* Profile Header */}
      <Card className="card-mobile shadow-soft border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
            <Avatar className="h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0">
              <AvatarImage src={user?.photoURL || '/placeholder-user.jpg'} />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm sm:text-lg font-medium">
                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground truncate">{user?.name || 'User'}</h2>
              <p className="text-sm sm:text-base text-muted-foreground truncate">{user?.email || 'user@example.com'}</p>
              {user?.phoneNumber && (
                <p className="text-sm text-muted-foreground">{user.phoneNumber}</p>
              )}
              {user?.createdAt && (
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 flex items-center gap-1">
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
            className="flex items-center gap-2 btn-mobile touch-manipulation w-full sm:w-auto"
          >
            <Edit3 className="h-4 w-4" />
            <span className="sm:inline">Edit Profile</span>
          </Button>
        </div>
      </Card>

      {/* Profile Sections */}
      <div className="space-y-3 sm:space-y-4">
        {profileSections.map((section) => (
          <Card key={section.title} className="card-mobile shadow-soft border-border">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                <section.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-base font-medium text-foreground">{section.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{section.description}</p>
              </div>
            </div>
            
            <div className="space-y-1 sm:space-y-2">
              {section.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 sm:p-3 rounded-lg hover:bg-muted/50 active:bg-muted/70 transition-colors cursor-pointer touch-manipulation">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.status}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
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
