import { Link, useLocation } from 'react-router-dom';
import { Search, Calendar, Plane, MessageCircle, Plus, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWallet } from '@/contexts/WalletContext';

const BottomNav = () => {
  const location = useLocation();
  const { isConnected } = useWallet();
  
  // Helper function to determine if a link is active
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };
  
  // Navigation items with Lucide icons
  const navItems = [
    { path: '/home', label: 'Discover', icon: Search },
    { path: '/orders', label: 'Orders', icon: Calendar },
    { path: '/products', label: 'Travels', icon: Plane },
    { path: '/chat', label: 'Messages', icon: MessageCircle },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 pb-safe lg:hidden">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto lg:max-w-full relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full py-1",
                isActive(item.path)
                  ? "text-primary"
                  : "text-gray-500"
              )}
              aria-label={item.label}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
        
        {/* Floating Action Button */}
        <Link
          to="/create"
          className="absolute -top-6 right-4 bg-yellow-400 hover:bg-yellow-500 text-white p-3 rounded-full shadow-lg"
          aria-label="Add New"
        >
          <Plus className="h-6 w-6" />
        </Link>
        
        {/* Wallet Connection Indicator */}
        {isConnected && (
          <div className="absolute -top-6 left-4 bg-green-500 text-white p-2 rounded-full shadow-lg">
            <Wallet className="h-4 w-4" />
          </div>
        )}
      </div>
    </nav>
  );
};

export default BottomNav; 