import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Type definitions for WalletContext
interface WalletContextType {
  publicKey: string | null;
  connect: () => void;
  disconnect: () => void;
}

// Default context values
const defaultContext: WalletContextType = {
  publicKey: null,
  connect: () => {},
  disconnect: () => {},
};

// Create context
const WalletContext = createContext<WalletContextType>(defaultContext);

// Provider component
interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [publicKey, setPublicKey] = useState<string | null>(null);

  // Load publicKey from localStorage - commented out to ensure login screen shows
  /*
  useEffect(() => {
    const savedPublicKey = localStorage.getItem('walletPublicKey');
    if (savedPublicKey) {
      setPublicKey(savedPublicKey);
    }
  }, []);
  */

  // Connect wallet
  const connect = () => {
    const mockAddress = "G...123";
    setPublicKey(mockAddress);
    localStorage.setItem('walletPublicKey', mockAddress);
  };

  // Disconnect wallet
  const disconnect = () => {
    setPublicKey(null);
    localStorage.removeItem('walletPublicKey');
  };

  const value = {
    publicKey,
    connect,
    disconnect,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook
export const useWallet = () => {
  const context = useContext(WalletContext);
  
  if (context === undefined) {
    throw new Error('useWallet hook must be used within a WalletProvider');
  }
  
  return context;
};

export default WalletContext; 