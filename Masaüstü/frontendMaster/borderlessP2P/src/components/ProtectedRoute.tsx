import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@/contexts/WalletContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isConnected, publicKey } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    // If wallet is not connected, redirect to connect wallet page
    if (!isConnected || !publicKey) {
      navigate('/connect-wallet');
    }
  }, [isConnected, publicKey, navigate]);

  // Show loading while checking connection status
  if (!isConnected || !publicKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center" style={{ width: '100vw' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Checking wallet connection...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute; 