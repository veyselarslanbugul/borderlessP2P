import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { useSorobanReact } from '@soroban-react/core';

// Type definitions for WalletContext
interface WalletContextType {
  publicKey: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnecting: boolean;
  isConnected: boolean;
  activeChain: string | null;
}

// Default context values
const defaultContext: WalletContextType = {
  publicKey: null,
  connect: async () => {},
  disconnect: () => {},
  isConnecting: false,
  isConnected: false,
  activeChain: null,
};

// Create context
const WalletContext = createContext<WalletContextType>(defaultContext);

// Provider component
interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const sorobanContext = useSorobanReact();
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  // Connect wallet using Soroban React
  const connect = async () => {
    try {
      setIsConnecting(true);
      
      // Try to find Freighter connector explicitly
      const freighterConnector = sorobanContext.connectors.find(c => 
        c.name === 'freighter' || c.name === 'Freighter' || c.id === 'freighter'
      );
      
      await sorobanContext.connect();
      
      // Add a small delay to ensure address is retrieved
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnect = () => {
    try {
      sorobanContext.disconnect();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const value = {
    publicKey: sorobanContext.address || null,
    connect,
    disconnect,
    isConnecting,
    isConnected: !!(sorobanContext.address && sorobanContext.activeConnector),
    activeChain: sorobanContext.activeChain?.name || null,
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