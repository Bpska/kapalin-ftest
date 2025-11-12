import { Link, Outlet, useLocation } from 'react-router-dom';
import { Book, Music, Video, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminLayout = () => {
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/books', label: 'Books', icon: Book },
    { path: '/admin/audio', label: 'Audio Content', icon: Music },
    { path: '/admin/animated-series', label: 'Animated Series', icon: Video },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-card border-r border-border">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-primary">Admin Panel</h2>
          </div>
          <nav className="px-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
