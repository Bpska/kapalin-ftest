import { User, Package, CreditCard, MapPin, HelpCircle, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  
  const profileSections = [
    {
      icon: Package,
      title: 'My Orders',
      description: 'Track your wisdom tales',
      items: [
        { name: 'The Young Krishna\'s Adventures', status: 'Delivered' },
        { name: 'Chanakya\'s Smart Tales', status: 'Processing' },
      ]
    },
    {
      icon: CreditCard,
      title: 'Payment Methods',
      description: 'Manage your payment options',
      items: [
        { name: 'UPI: user@paytm', status: 'Primary' },
        { name: '**** 1234', status: 'Visa' },
      ]
    },
    {
      icon: MapPin,
      title: 'Shipping Addresses',
      description: 'Manage delivery locations',
      items: [
        { name: 'Home', status: '123 Wisdom Street, Mumbai' },
        { name: 'Office', status: '456 Knowledge Lane, Delhi' },
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
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback className="bg-gradient-primary text-primary-foreground text-lg font-medium">
              {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold text-foreground">{user?.name || 'User'}</h2>
            <p className="text-muted-foreground">{user?.email || 'user@example.com'}</p>
            <p className="text-sm text-muted-foreground mt-1">Member since Jan 2024</p>
          </div>
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