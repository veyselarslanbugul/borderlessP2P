import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import TransactionApproval from './TransactionApproval';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Calendar, Plane, MessageCircle, Plus, Wallet, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';

const Layout = () => {
  const location = useLocation();
  const { publicKey, disconnect, isConnected } = useWallet();
  
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

  // Format wallet address for display
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col" style={{ width: '100vw', maxWidth: 'none' }}>
      {/* Desktop Top Navigation */}
      <nav className="hidden lg:flex bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50" style={{ width: '100vw' }}>
        <div className="w-full px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/home" className="text-2xl font-bold text-primary">
              PeerZone
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
            
            {/* Wallet Status and Actions */}
            <div className="flex items-center space-x-4">
              {/* Wallet Address */}
              {isConnected && publicKey && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                  <Wallet className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    {formatAddress(publicKey)}
                  </span>
                </div>
              )}
              
              {/* Create Button */}
              <Link
                to="/create"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add New</span>
              </Link>
              
              {/* Disconnect Button */}
              <Button
                onClick={disconnect}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content with responsive bottom padding */}
      <main className="flex-1 pb-20 lg:pb-0" style={{ width: '100vw' }}>
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