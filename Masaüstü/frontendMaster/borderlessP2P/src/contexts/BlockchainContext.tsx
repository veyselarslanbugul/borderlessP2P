import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Define types for blockchain operations
interface Product {
  id: string;
  name: string;
  details: string;
  price: string;
  seller: string;
  status: string;
  estimatedDelivery: string;
  description: string;
}

interface Request {
  id: string;
  name: string;
  maxPrice: string;
  requester: string;
  status: string;
  deliveryDate: string;
  description: string;
}

interface Transaction {
  id: string;
  type: 'purchase' | 'sale' | 'escrow' | 'delivery';
  productId: string;
  amount: string;
  counterparty: string;
  status: string;
  date: string;
}

interface EscrowDetails {
  id: string;
  productId: string;
  buyer: string;
  seller: string;
  amount: string;
  status: 'pending' | 'shipped' | 'delivered' | 'completed' | 'disputed';
  escrowAddress: string;
  transactionId: string;
  deliveryProof?: string;
}

interface BlockchainContextType {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'seller' | 'status'>) => Promise<string>;
  getProduct: (id: string) => Promise<Product | null>;
  
  // Requests
  requests: Request[];
  addRequest: (request: Omit<Request, 'id' | 'requester' | 'status'>) => Promise<string>;
  
  // Transactions
  transactions: Transaction[];
  purchaseProduct: (productId: string, amount: string) => Promise<string>;
  
  // Escrow
  escrows: EscrowDetails[];
  getEscrowDetails: (id: string) => Promise<EscrowDetails | null>;
  confirmDelivery: (escrowId: string) => Promise<boolean>;
  addDeliveryProof: (escrowId: string, proofHash: string) => Promise<boolean>;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
}

// Create context with default values
const BlockchainContext = createContext<BlockchainContextType>({
  products: [],
  addProduct: async () => '',
  getProduct: async () => null,
  
  requests: [],
  addRequest: async () => '',
  
  transactions: [],
  purchaseProduct: async () => '',
  
  escrows: [],
  getEscrowDetails: async () => null,
  confirmDelivery: async () => false,
  addDeliveryProof: async () => false,
  
  isLoading: false,
  error: null,
});

// Provider component
interface BlockchainProviderProps {
  children: ReactNode;
}

export const BlockchainProvider = ({ children }: BlockchainProviderProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Mock data - would be fetched from blockchain in real implementation
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'iPhone 15 Pro - 256GB',
      details: '256GB, Siyah, ABD versiyonu',
      price: '2,500',
      seller: 'G...456',
      status: 'Satışta',
      estimatedDelivery: '15 Ekim 2023',
      description: 'ABD versiyonu, sıfır, kutulu. Tüm aksesuarları tam.'
    }
  ]);
  
  const [requests, setRequests] = useState<Request[]>([
    {
      id: '1',
      name: 'PS5 Digital Edition',
      maxPrice: '800',
      requester: 'G...123',
      status: 'Aktif',
      deliveryDate: '20 Ekim 2023',
      description: 'Sıfır veya az kullanılmış olmalı. Kutusu ile birlikte.'
    }
  ]);
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  const [escrows, setEscrows] = useState<EscrowDetails[]>([]);
  
  // Mock functions for blockchain operations
  const addProduct = async (product: Omit<Product, 'id' | 'seller' | 'status'>): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate blockchain interaction
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newId = `${products.length + 1}`;
      const newProduct: Product = {
        ...product,
        id: newId,
        seller: 'G...123', // Would come from wallet context
        status: 'Satışta'
      };
      
      setProducts([...products, newProduct]);
      return newId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ürün eklenirken bir hata oluştu';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getProduct = async (id: string): Promise<Product | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate blockchain interaction
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const product = products.find(p => p.id === id) || null;
      return product;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ürün bilgisi alınırken bir hata oluştu';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const addRequest = async (request: Omit<Request, 'id' | 'requester' | 'status'>): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate blockchain interaction
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newId = `${requests.length + 1}`;
      const newRequest: Request = {
        ...request,
        id: newId,
        requester: 'G...123', // Would come from wallet context
        status: 'Aktif'
      };
      
      setRequests([...requests, newRequest]);
      return newId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Talep eklenirken bir hata oluştu';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const purchaseProduct = async (productId: string, amount: string): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate blockchain interaction
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const product = products.find(p => p.id === productId);
      if (!product) {
        throw new Error('Ürün bulunamadı');
      }
      
      const escrowId = `escrow-${escrows.length + 1}`;
      const transactionId = `tx-${transactions.length + 1}`;
      
      // Create new escrow
      const newEscrow: EscrowDetails = {
        id: escrowId,
        productId,
        buyer: 'G...123', // Would come from wallet context
        seller: product.seller,
        amount,
        status: 'pending',
        escrowAddress: `G...${Math.floor(Math.random() * 1000)}`,
        transactionId
      };
      
      // Create new transaction
      const newTransaction: Transaction = {
        id: transactionId,
        type: 'purchase',
        productId,
        amount,
        counterparty: product.seller,
        status: 'Escrow\'da',
        date: new Date().toLocaleDateString('tr-TR')
      };
      
      // Update product status
      const updatedProducts = products.map(p => 
        p.id === productId ? { ...p, status: 'Satın Alındı' } : p
      );
      
      setEscrows([...escrows, newEscrow]);
      setTransactions([...transactions, newTransaction]);
      setProducts(updatedProducts);
      
      return escrowId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Satın alma işlemi sırasında bir hata oluştu';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getEscrowDetails = async (id: string): Promise<EscrowDetails | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate blockchain interaction
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const escrow = escrows.find(e => e.id === id) || null;
      return escrow;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Escrow bilgisi alınırken bir hata oluştu';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const confirmDelivery = async (escrowId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate blockchain interaction
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update escrow status
      const updatedEscrows = escrows.map(e => 
        e.id === escrowId ? { ...e, status: 'completed' as const } : e
      );
      
      // Update related transaction
      const escrow = escrows.find(e => e.id === escrowId);
      if (escrow) {
        const updatedTransactions = transactions.map(t => 
          t.id === escrow.transactionId ? { ...t, status: 'Tamamlandı' } : t
        );
        setTransactions(updatedTransactions);
      }
      
      setEscrows(updatedEscrows);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Teslimat onaylanırken bir hata oluştu';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const addDeliveryProof = async (escrowId: string, proofHash: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate blockchain interaction
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update escrow with delivery proof
      const updatedEscrows = escrows.map(e => 
        e.id === escrowId ? { ...e, deliveryProof: proofHash, status: 'shipped' as const } : e
      );
      
      setEscrows(updatedEscrows);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Teslimat kanıtı eklenirken bir hata oluştu';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const value = {
    products,
    addProduct,
    getProduct,
    
    requests,
    addRequest,
    
    transactions,
    purchaseProduct,
    
    escrows,
    getEscrowDetails,
    confirmDelivery,
    addDeliveryProof,
    
    isLoading,
    error
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
};

// Custom hook
export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  
  if (context === undefined) {
    throw new Error('useBlockchain hook must be used within a BlockchainProvider');
  }
  
  return context;
};

export default BlockchainContext; 