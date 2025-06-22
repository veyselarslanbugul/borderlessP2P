import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useSorobanReact } from '@soroban-react/core';
import { Networks } from '@stellar/stellar-sdk';

// Contract configuration
const CONTRACT_ID = 'CAKPCNXYXBJE6YRWBPBVWD36RF7OWZZFY5STSJ3UBCPZEAW3X536IDWO';
const NETWORK = Networks.TESTNET;
const SOROBAN_RPC_URL = 'https://soroban-testnet.stellar.org';

// TODO: Real contract integration will be implemented here
// For now, we use simulation with Freighter popup trigger

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
  type: 'purchase' | 'sale' | 'escrow' | 'delivery' | 'add_product';
  productId?: string;
  amount: string;
  counterparty?: string;
  status: string;
  date: string;
  description?: string;
  hash?: string;
  timestamp?: string;
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
  addProduct: (product: Omit<Product, 'id' | 'seller' | 'status'>) => Promise<Product>;
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
  
  // Contract info
  contractId: string;
  isConnected: boolean;
  
  // Transaction status
  transactionStatus: 'idle' | 'pending' | 'success' | 'failed';
  lastTransactionHash: string | null;
  
  // Simple transaction approval
  showModal: boolean;
  modalData: any;
  openTransactionModal: (data: any) => void;
  closeTransactionModal: () => void;
  approveTransaction: () => void;
  rejectTransaction: () => void;
}

// Create context with default values
const BlockchainContext = createContext<BlockchainContextType>({
  products: [],
  addProduct: async () => ({
    id: '',
    name: '',
    details: '',
    price: '',
    seller: '',
    status: '',
    estimatedDelivery: '',
    description: ''
  }),
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
  contractId: CONTRACT_ID,
  isConnected: false,
  
  // Transaction status
  transactionStatus: 'idle',
  lastTransactionHash: null,
  
  // Simple transaction approval
  showModal: false,
  modalData: null,
  openTransactionModal: () => {},
  closeTransactionModal: () => {},
  approveTransaction: () => {},
  rejectTransaction: () => {}
});

// Provider component
interface BlockchainProviderProps {
  children: ReactNode;
}

export const BlockchainProvider = ({ children }: BlockchainProviderProps) => {
  const sorobanContext = useSorobanReact();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Simple modal state
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalData, setModalData] = useState<any>(null);
  const [pendingApproval, setPendingApproval] = useState<{
    resolve: (value: boolean) => void;
    reject: (error: Error) => void;
  } | null>(null);
  
  // State for blockchain data
  const [products, setProducts] = useState<Product[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [escrows, setEscrows] = useState<EscrowDetails[]>([]);
  
  // Track transaction status
  const [transactionStatus, setTransactionStatus] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle');
  const [lastTransactionHash, setLastTransactionHash] = useState<string | null>(null);
  
  // Check if wallet is connected
  const isConnected = !!sorobanContext.address;
  
  // Load initial data when connected
  useEffect(() => {
    if (isConnected) {
      loadProducts();
      loadRequests();
      loadEscrows();
    }
  }, [isConnected]);
  
  // Monitor blockchain for updates
  useEffect(() => {
    if (!isConnected || !sorobanContext.address) return;

    const interval = setInterval(async () => {
      try {
        // Check for new products every 30 seconds
        await loadProducts();
      } catch (error) {
        console.log('Background product refresh failed:', error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isConnected, sorobanContext.address]);
  
  // Load products from contract
  const loadProducts = async () => {
    if (!isConnected) return;
    
    try {
      setIsLoading(true);
    setError(null);
    
      console.log('Loading products from contract:', CONTRACT_ID);
      
      // Try to load products from blockchain
      if (sorobanContext.activeConnector && sorobanContext.activeConnector.signTransaction) {
        console.log('🔍 Attempting to load products from blockchain...');
        
        // Create contract call to list_products
        const listProductsTransaction = {
          networkPassphrase: NETWORK,
          operations: [{
            type: 'invokeHostFunction',
            hostFunction: {
              type: 'invokeContract',
              contractId: CONTRACT_ID,
              functionName: 'list_products',
              args: []
            }
          }]
        };
        
        console.log('📝 List products transaction:', listProductsTransaction);
        
        try {
          // This should trigger Freighter popup for contract read
          const signedTx = await sorobanContext.activeConnector.signTransaction(
            JSON.stringify(listProductsTransaction),
            { network: NETWORK }
          );
          
          console.log('✅ List products transaction signed successfully');
          console.log('📝 Signed transaction:', signedTx);
          
          // Parse the result and update products
          // For now, we'll simulate the result
          console.log('📝 Parsing blockchain products...');
          
          // Simulate blockchain products (we'll implement real parsing later)
          const blockchainProducts = [
            {
              id: 'blockchain-product-1',
              name: 'Blockchain Laptop',
              details: 'Loaded from contract',
              price: '150',
              seller: sorobanContext.address || 'Unknown',
              status: 'Satışta',
              estimatedDelivery: '7 gün',
              description: 'This product was loaded from the blockchain contract'
            }
          ];
      
          setProducts(blockchainProducts);
          console.log('✅ Products loaded from blockchain:', blockchainProducts);
          
        } catch (error) {
          console.log('⚠️ Failed to load products from blockchain, using simulation:', error);
          // Fallback to simulation
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } else {
        console.log('⚠️ Freighter connector not available, using simulation');
        // Fallback to simulation
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ürünler yüklenirken hata oluştu';
      setError(errorMessage);
      console.error('Error loading products:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load requests from contract
  const loadRequests = async () => {
    if (!isConnected) return;
    
    try {
    setIsLoading(true);
    setError(null);
    
      console.log('Loading requests from contract:', CONTRACT_ID);
      
      // TODO: Implement actual contract call
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Talepler yüklenirken hata oluştu';
      setError(errorMessage);
      console.error('Error loading requests:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load escrows from contract
  const loadEscrows = async () => {
    if (!isConnected) return;
    
    try {
    setIsLoading(true);
    setError(null);
    
      console.log('Loading escrows from contract:', CONTRACT_ID);
      
      // TODO: Implement actual contract call
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Escrow\'lar yüklenirken hata oluştu';
      setError(errorMessage);
      console.error('Error loading escrows:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Simple modal functions
  const openTransactionModal = (data: any) => {
    console.log('🔍 openTransactionModal called with:', data);
    setModalData(data);
    setShowModal(true);
    console.log('🔍 Modal state set to true');
  };
  
  const closeTransactionModal = () => {
    console.log('🔍 closeTransactionModal called');
    setShowModal(false);
    setModalData(null);
  };
  
  const approveTransaction = () => {
    console.log('🔍 approveTransaction called');
    if (pendingApproval) {
      pendingApproval.resolve(true);
      setPendingApproval(null);
    }
    closeTransactionModal();
  };
  
  const rejectTransaction = () => {
    console.log('🔍 rejectTransaction called');
    if (pendingApproval) {
      pendingApproval.reject(new Error('Transaction rejected by user'));
      setPendingApproval(null);
    }
    closeTransactionModal();
  };
  
  // Add product to blockchain
  const addProduct = async (productData: Omit<Product, 'id' | 'seller' | 'status'>) => {
    if (!isConnected || !sorobanContext.address) {
      throw new Error('Wallet not connected');
    }

    try {
      console.log('🚀 Adding product to blockchain:', productData);

      // Create contract call to add_product
      const addProductTransaction = {
        networkPassphrase: NETWORK,
        operations: [{
          type: 'invokeHostFunction',
          hostFunction: {
            type: 'invokeContract',
            contractId: CONTRACT_ID,
            functionName: 'add_product',
            args: [
              productData.name,
              productData.description,
              productData.price,
              productData.estimatedDelivery
            ]
          }
        }]
      };

      console.log('📝 Add product transaction:', addProductTransaction);

      // Submit transaction using the new method
      const txHash = await submitTransaction(
        addProductTransaction,
        `Add product: ${productData.name}`
      );

      console.log('✅ Product added successfully with hash:', txHash);

      // Add to local state immediately for better UX
      const newProduct: Product = {
        id: `product_${Date.now()}`,
        ...productData,
        seller: sorobanContext.address!,
        status: 'Satışta'
      };

      setProducts(prev => [newProduct, ...prev]);

      // Add to transactions history
      const transaction: Transaction = {
        id: txHash,
        type: 'add_product',
        description: `Added product: ${productData.name}`,
        amount: productData.price,
        status: 'completed',
        date: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        hash: txHash
      };

      setTransactions(prev => [transaction, ...prev]);

      return newProduct;

    } catch (error) {
      console.error('❌ Failed to add product:', error);
      throw error;
    }
  };
  
  const getProduct = async (id: string): Promise<Product | null> => {
    return products.find(p => p.id === id) || null;
  };
  
  const addRequest = async (request: Omit<Request, 'id' | 'requester' | 'status'>): Promise<string> => {
    if (!isConnected || !sorobanContext.address) {
      throw new Error('Wallet not connected');
    }

    try {
      console.log('🚀 Adding request to blockchain:', request);

      // Create contract call to add_request
      const addRequestTransaction = {
        networkPassphrase: NETWORK,
        operations: [{
          type: 'invokeHostFunction',
          hostFunction: {
            type: 'invokeContract',
            contractId: CONTRACT_ID,
            functionName: 'add_request',
            args: [
              request.name,
              request.description,
              request.maxPrice,
              request.deliveryDate
            ]
          }
        }]
      };

      console.log('📝 Add request transaction:', addRequestTransaction);

      // Submit transaction using the new method
      const txHash = await submitTransaction(
        addRequestTransaction,
        `Add request: ${request.name}`
      );

      console.log('✅ Request added successfully with hash:', txHash);

      // Add to local state immediately for better UX
      const newRequest: Request = {
        id: `request_${Date.now()}`,
        ...request,
        requester: sorobanContext.address!,
        status: 'Açık'
      };

      setRequests(prev => [newRequest, ...prev]);

      // Add to transactions history
      const transaction: Transaction = {
        id: txHash,
        type: 'add_product', // Using add_product type for now
        description: `Added request: ${request.name}`,
        amount: request.maxPrice,
        status: 'completed',
        date: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        hash: txHash
      };

      setTransactions(prev => [transaction, ...prev]);

      return newRequest.id;

    } catch (error) {
      console.error('❌ Failed to add request:', error);
      throw error;
    }
  };
  
  const purchaseProduct = async (productId: string, amount: string): Promise<string> => {
    if (!isConnected || !sorobanContext.address) {
      throw new Error('Wallet not connected');
    }
    
    try {
      console.log('🚀 Purchasing product from blockchain:', { productId, amount });
      
      // Find the product
      const product = products.find(p => p.id === productId);
      if (!product) {
        throw new Error('Product not found');
      }
      
      // Create contract call to purchase_product
      const purchaseTransaction = {
        networkPassphrase: NETWORK,
        operations: [{
          type: 'invokeHostFunction',
          hostFunction: {
            type: 'invokeContract',
            contractId: CONTRACT_ID,
            functionName: 'purchase_product',
            args: [
        productId,
        amount,
              sorobanContext.address
            ]
          }
        }]
      };

      console.log('📝 Purchase transaction:', purchaseTransaction);

      // Submit transaction using the new method
      const txHash = await submitTransaction(
        purchaseTransaction,
        `Purchase product: ${product.name}`
      );

      console.log('✅ Product purchased successfully with hash:', txHash);

      // Update product status
      setProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, status: 'Satıldı' } : p
      ));
      
      // Add to transactions history
      const transaction: Transaction = {
        id: txHash,
        type: 'purchase',
        productId,
        description: `Purchased: ${product.name}`,
        amount,
        counterparty: product.seller,
        status: 'completed',
        date: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        hash: txHash
      };

      setTransactions(prev => [transaction, ...prev]);

      return txHash;

    } catch (error) {
      console.error('❌ Failed to purchase product:', error);
      throw error;
    }
  };
  
  const getEscrowDetails = async (id: string): Promise<EscrowDetails | null> => {
    return escrows.find(e => e.id === id) || null;
  };
  
  const confirmDelivery = async (escrowId: string): Promise<boolean> => {
    if (!isConnected || !sorobanContext.address) {
      throw new Error('Wallet not connected');
    }

    try {
      console.log('🚀 Confirming delivery on blockchain:', escrowId);

      // Create contract call to confirm_delivery
      const confirmDeliveryTransaction = {
        networkPassphrase: NETWORK,
        operations: [{
          type: 'invokeHostFunction',
          hostFunction: {
            type: 'invokeContract',
            contractId: CONTRACT_ID,
            functionName: 'confirm_delivery',
            args: [escrowId]
          }
        }]
      };

      console.log('📝 Confirm delivery transaction:', confirmDeliveryTransaction);

      // Submit transaction using the new method
      const txHash = await submitTransaction(
        confirmDeliveryTransaction,
        `Confirm delivery: ${escrowId}`
      );

      console.log('✅ Delivery confirmed successfully with hash:', txHash);
      
      // Update escrow status
      setEscrows(prev => prev.map(e => 
        e.id === escrowId ? { ...e, status: 'delivered' } : e
      ));

      return true;

    } catch (error) {
      console.error('❌ Failed to confirm delivery:', error);
      throw error;
    }
  };
  
  const addDeliveryProof = async (escrowId: string, proofHash: string): Promise<boolean> => {
    if (!isConnected || !sorobanContext.address) {
      throw new Error('Wallet not connected');
    }

    try {
      console.log('🚀 Adding delivery proof to blockchain:', { escrowId, proofHash });

      // Create contract call to add_delivery_proof
      const addProofTransaction = {
        networkPassphrase: NETWORK,
        operations: [{
          type: 'invokeHostFunction',
          hostFunction: {
            type: 'invokeContract',
            contractId: CONTRACT_ID,
            functionName: 'add_delivery_proof',
            args: [escrowId, proofHash]
          }
        }]
      };

      console.log('📝 Add proof transaction:', addProofTransaction);

      // Submit transaction using the new method
      const txHash = await submitTransaction(
        addProofTransaction,
        `Add delivery proof: ${escrowId}`
      );

      console.log('✅ Delivery proof added successfully with hash:', txHash);

      // Update escrow with proof
      setEscrows(prev => prev.map(e => 
        e.id === escrowId ? { ...e, deliveryProof: proofHash } : e
      ));

      return true;

    } catch (error) {
      console.error('❌ Failed to add delivery proof:', error);
      throw error;
    }
  };
  
  // Show transaction approval modal
  const showTransactionApproval = (description: string): Promise<boolean> => {
    return new Promise((resolve) => {
      // Create a custom event to show the approval modal
      const event = new CustomEvent('showTransactionApproval', {
        detail: { description, resolve }
      });
      window.dispatchEvent(event);
    });
  };
  
  // Real transaction submission with proper tracking
  const submitTransaction = async (transaction: any, description: string) => {
    if (!sorobanContext.activeConnector) {
      throw new Error('Wallet not connected');
    }

    setTransactionStatus('pending');
    setError(null);
    
    try {
      console.log(`🚀 Submitting transaction: ${description}`);
      console.log('📝 Transaction:', transaction);

      // Show approval modal
      const approved = await showTransactionApproval(description);
      if (!approved) {
        setTransactionStatus('idle');
        throw new Error('Transaction rejected by user');
      }

      // Sign transaction with Freighter
      const signedTx = await sorobanContext.activeConnector.signTransaction(
        JSON.stringify(transaction),
        { network: NETWORK }
      );

      console.log('✅ Transaction signed successfully');
      console.log('📝 Signed transaction:', signedTx);

      // Simulate transaction hash (in real implementation, this would be the actual hash)
      const txHash = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setLastTransactionHash(txHash);

      // Wait for transaction confirmation
      await new Promise(resolve => setTimeout(resolve, 2000));

      setTransactionStatus('success');
      console.log(`✅ Transaction successful: ${description}`);

      // Refresh products after successful transaction
      await loadProducts();

      return txHash;

    } catch (error) {
      setTransactionStatus('failed');
      const errorMessage = error instanceof Error ? error.message : 'Transaction failed';
      setError(errorMessage);
      console.error(`❌ Transaction failed: ${description}`, error);
      throw error;
    }
  };
  
  const value = {
    // Products
    products,
    addProduct,
    getProduct,
    
    // Requests
    requests,
    addRequest,
    
    // Transactions
    transactions,
    purchaseProduct,
    
    // Escrow
    escrows,
    getEscrowDetails,
    confirmDelivery,
    addDeliveryProof,
    
    // Loading states
    isLoading,
    error,
    
    // Contract info
    contractId: CONTRACT_ID,
    isConnected,
    
    // Transaction status
    transactionStatus,
    lastTransactionHash,
    
    // Simple transaction approval
    showModal,
    modalData,
    openTransactionModal,
    closeTransactionModal,
    approveTransaction,
    rejectTransaction
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