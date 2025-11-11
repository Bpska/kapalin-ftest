import { ReactNode } from 'react';
import BottomNavigation from '@/components/BottomNavigation';
import Footer from '@/components/Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <main className="pb-20">
        {children}
      </main>
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default Layout;