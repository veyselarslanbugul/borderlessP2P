import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import TransactionApproval from './TransactionApproval';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Calendar, Plane, MessageCircle, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const Layout = () => {
  const location = useLocation();
  
  // Helper function to determine if a link is active
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };
  
  // Navigation items
  const navItems = [
    { path: '/home', label: 'Discover', icon: Search },
    { path: '/orders', label: 'Orders', icon: Calendar },
    { path: '/products', label: 'Travels', icon: Plane },
    { path: '/chat', label: 'Messages', icon: MessageCircle },
  ];

  // Viewport height düzeltmesi için
  useEffect(() => {
    // Mobil tarayıcılarda viewport height sorununu çözmek için
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  return (
    <div className="min-h-screen min-h-[calc(var(--vh,1vh)*100)] bg-background flex flex-col">
      {/* Desktop Top Navigation */}
      <nav className="hidden lg:flex bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/home" className="text-2xl font-bold text-primary">
              BorderlessP2P
            </Link>
            
            {/* Navigation Links */}
            <div className="flex space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive(item.path)
                        ? "text-primary bg-primary/10"
                        : "text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/5"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
            
            {/* Create Button */}
            <Link
              to="/create"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add New</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content with responsive bottom padding */}
      <main className="flex-1 pb-20 lg:pb-0">
        <Outlet />
      </main>
      
      {/* Bottom Navigation (Mobile Only) */}
      <BottomNav />
      
      {/* Transaction Approval Dialog */}
      <TransactionApproval />
    </div>
  );
};

export default Layout; 