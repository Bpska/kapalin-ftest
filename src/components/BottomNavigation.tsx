import { Home, ShoppingCart, User, LogIn, LogOut, Upload, Shield } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/hooks/useAdmin';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const BottomNavigation = () => {
  const { state } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const { isAdmin, isLoading } = useAdmin();
  const navigate = useNavigate();
  const cartCount = state.items.reduce((total, item) => total + item.quantity, 0);

  console.log('BottomNavigation: isAuthenticated:', isAuthenticated, 'isAdmin:', isAdmin, 'isLoading:', isLoading);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    {
      icon: Upload,
      label: 'Upload',
      path: '/upload',
      public: false,
      adminOnly: false,
    },
    {
      icon: Home,
      label: 'Home',
      path: '/',
      public: true,
      adminOnly: false,
    },
    {
      icon: ShoppingCart,
      label: 'Cart',
      path: '/cart',
      badge: cartCount > 0 ? cartCount : undefined,
      public: false,
      adminOnly: false,
    },
    {
      icon: Shield,
      label: 'Admin',
      path: '/admin',
      public: false,
      adminOnly: true,
    },
    {
      icon: User,
      label: 'Profile',
      path: '/profile',
      public: false,
      adminOnly: false,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-glass border-t border-border shadow-elevated z-50 safe-area-pb">
      <div className="flex items-center justify-around px-2 sm:px-6 py-2 sm:py-3">
        {navItems.map((item) => {
          // Show all items for authenticated users, only public items for non-authenticated
          if (!isAuthenticated && !item.public) {
            return null;
          }
          
          // Hide admin-only items if user is not admin
          if (item.adminOnly && !isAdmin) {
            return null;
          }
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center space-y-1 px-2 sm:px-4 py-2 rounded-xl transition-all duration-300 min-w-[60px] touch-manipulation',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 active:bg-muted/70'
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
          );
        })}
        
        {/* Auth actions */}
        {!isAuthenticated ? (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center space-y-1 px-2 sm:px-4 py-2 rounded-xl transition-all duration-300 min-w-[60px] touch-manipulation',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 active:bg-muted/70'
              )
            }
          >
            <LogIn className="w-6 h-6" />
            <span className="text-xs font-medium">Login</span>
          </NavLink>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="flex flex-col items-center space-y-1 px-2 sm:px-4 py-2 rounded-xl transition-all duration-300 text-muted-foreground hover:text-foreground hover:bg-muted/50 active:bg-muted/70 h-auto min-w-[60px] touch-manipulation"
          >
            <LogOut className="w-6 h-6" />
            <span className="text-xs font-medium">Logout</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default BottomNavigation;