import { Home, ShoppingCart, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

const BottomNavigation = () => {
  const { state } = useCart();
  const cartCount = state.items.reduce((total, item) => total + item.quantity, 0);

  const navItems = [
    {
      icon: Home,
      label: 'Home',
      path: '/',
    },
    {
      icon: ShoppingCart,
      label: 'Cart',
      path: '/cart',
      badge: cartCount > 0 ? cartCount : undefined,
    },
    {
      icon: User,
      label: 'Profile',
      path: '/profile',
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-glass border-t border-border shadow-elevated z-50">
      <div className="flex items-center justify-around px-6 py-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center space-y-1 px-4 py-2 rounded-xl transition-all duration-300',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )
            }
          >
            <div className="relative">
              <item.icon className="w-6 h-6" />
              {item.badge && (
                <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;