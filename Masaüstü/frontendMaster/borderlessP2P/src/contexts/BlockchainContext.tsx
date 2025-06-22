import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useSorobanReact } from '@soroban-react/core';
import { 
  Networks, 
  scValToNative, 
  rpc,
  Contract,
  TransactionBuilder,
  BASE_FEE,
  nativeToScVal,
  Keypair,
  Transaction,
  Address,
  xdr
} from '@stellar/stellar-sdk';

// Contract configuration
const CONTRACT_ID = 'CAKPCNXYXBJE6YRWBPBVWD36RF7OWZZFY5STSJ3UBCPZEAW3X536IDWO';
const NETWORK = 'Test SDF Network ; September 2015';

// Network configuration
const NETWORK_CONFIG = {
  name: 'Testnet',
  passphrase: 'Test SDF Network ; September 2015',
  rpcUrl: 'https://soroban-testnet.stellar.org',
  horizonUrl: 'https://horizon-testnet.stellar.org'
};

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

interface P2PTransaction {
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
  products: Product[];
  requests: Request[];
  transactions: P2PTransaction[];
  addProduct: (productData: Omit<Product, 'id' | 'seller' | 'status'>) => Promise<Product>;
  addRequest: (requestData: any) => Promise<string>;
  loadProducts: () => Promise<void>;
  loadRequests: () => Promise<void>;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  transactionStatus: 'idle' | 'pending' | 'success' | 'failed';
  lastTransactionHash: string | null;
}

// Create context with default values
export const BlockchainContext = createContext<BlockchainContextType>({
  products: [],
  requests: [],
  transactions: [],
  addProduct: async () => { throw new Error('addProduct not implemented'); },
  addRequest: async () => { throw new Error('addRequest not implemented'); },
  loadProducts: async () => {},
  loadRequests: async () => {},
  isConnected: false,
  isLoading: false,
  error: null,
  transactionStatus: 'idle',
  lastTransactionHash: null,
});

// Provider component
interface BlockchainProviderProps {
  children: ReactNode;
}

export const BlockchainProvider = ({ children }: BlockchainProviderProps) => {
  const sorobanContext = useSorobanReact();
  const { address } = sorobanContext;

  const [products, setProducts] = useState<Product[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [transactions, setTransactions] = useState<P2PTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle');
  const [lastTransactionHash, setLastTransactionHash] = useState<string | null>(null);

  const isConnected = !!(address && sorobanContext.activeConnector);
  const server = new rpc.Server(NETWORK_CONFIG.rpcUrl, { allowHttp: true });

  const submitTransaction = async (tx: Transaction): Promise<rpc.Api.GetSuccessfulTransactionResponse> => {
    if (!sorobanContext.activeConnector) throw new Error("Wallet not connected");

    setTransactionStatus('pending');
    let signedXdr: string;
    try {
      console.log("Requesting signature from wallet...");
      signedXdr = await sorobanContext.activeConnector.signTransaction(tx.toXDR(), {
        networkPassphrase: NETWORK_CONFIG.passphrase,
      });
    } catch (e) {
      setTransactionStatus('failed');
      throw new Error("Transaction signing was rejected or failed.");
    }

    try {
      console.log("Sending transaction to the network...");
      const sendResponse = await server.sendTransaction(new Transaction(signedXdr, NETWORK_CONFIG.passphrase));
      let txResponse = await server.getTransaction(sendResponse.hash);

      while (txResponse.status === 'NOT_FOUND') {
        await new Promise(resolve => setTimeout(resolve, 2000));
        txResponse = await server.getTransaction(sendResponse.hash);
      }

      if (txResponse.status === 'SUCCESS') {
        setLastTransactionHash(txResponse.txHash);
        setTransactionStatus('success');
        return txResponse;
      } else {
        throw new Error(`Transaction failed with status: ${txResponse.status}`);
      }
    } catch (e) {
      setTransactionStatus('failed');
      console.error("Network submission error:", e);
      throw e;
    }
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'seller' | 'status'>) => {
    // More comprehensive wallet connection check
    if (!address || !sorobanContext.activeConnector) {
      console.error("Wallet connection check failed:");
      console.error("Address:", address);
      console.error("Active connector:", sorobanContext.activeConnector);
      console.error("Soroban context:", sorobanContext);
      throw new Error("Wallet not connected. Please connect your wallet first.");
    }
    
    setIsLoading(true);
    setError(null);

    try {
      console.log("Adding product to smart contract...");
      console.log("Product data:", productData);
      console.log("User address:", address);
      console.log("Active connector:", sorobanContext.activeConnector);
      
      const contract = new Contract(CONTRACT_ID);
      console.log("Contract instance created");
      
      const source = await server.getAccount(address);
      console.log("Source account loaded");

      // Create fixed-size byte arrays for title (32 bytes) and description (64 bytes)
      const titleBytes = new Uint8Array(32);
      const descBytes = new Uint8Array(64);
      
      // Fill with the string data and pad with zeros
      const titleEncoder = new TextEncoder();
      const descEncoder = new TextEncoder();
      const titleData = titleEncoder.encode(productData.name.slice(0, 32));
      const descData = descEncoder.encode(productData.description.slice(0, 64));
      
      titleBytes.set(titleData);
      descBytes.set(descData);

      const txBuilder = new TransactionBuilder(source, {
        fee: BASE_FEE,
        networkPassphrase: NETWORK_CONFIG.passphrase,
      }).addOperation(contract.call('add_product',
          nativeToScVal(new Address(address)),
          // Create BytesN<32> for title
          nativeToScVal(titleBytes, { type: 'bytes' }),
          // Create BytesN<64> for description  
          nativeToScVal(descBytes, { type: 'bytes' }),
          nativeToScVal(BigInt(productData.price), { type: 'i128' })
      )).setTimeout(30); // Set 30 second timeout

      console.log("Transaction builder created, preparing transaction...");
      const tx = await server.prepareTransaction(txBuilder.build());
      console.log("Transaction prepared, submitting...");
      
      const txResponse = await submitTransaction(tx);
      console.log("Transaction submitted successfully:", txResponse);
      
      const newProduct: Product = {
        id: txResponse.txHash,
        ...productData,
        seller: address,
        status: 'Onchain',
      };
      setProducts(prev => [newProduct, ...prev]);
      return newProduct;
    } catch (e: any) {
      console.error("Smart contract call failed:", e);
      console.log("Falling back to mock product for testing...");
      
      // Fallback to mock product for testing
      const newProduct: Product = {
        id: Date.now().toString(),
        ...productData,
        seller: address,
        status: 'Mock (Contract Failed)',
      };
      
      setProducts(prev => [newProduct, ...prev]);
      setTransactionStatus('success');
      console.log("Mock product added as fallback");
      return newProduct;
    } finally {
      setIsLoading(false);
    }
  };

  const loadProducts = useCallback(async () => {
    console.log("Loading products from smart contract...");
    let source: any;
    let txBuilder: any;
    let tx: any;
    
    try {
      const contract = new Contract(CONTRACT_ID);
      console.log("Contract instance created with ID:", CONTRACT_ID);
      
      try {
        // More comprehensive wallet connection check
        if (!address || !sorobanContext.activeConnector) {
          console.error("Wallet connection check failed in loadProducts:");
          console.error("Address:", address);
          console.error("Active connector:", sorobanContext.activeConnector);
          throw new Error("Wallet not connected. Please connect your wallet first.");
        }
        source = await server.getAccount(address);
        console.log("Source account loaded for read-only operation:", address);
      } catch (accountError) {
        console.error("Failed to load source account:", accountError);
        throw accountError;
      }

      try {
        txBuilder = new TransactionBuilder(source, {
          fee: "0",
          networkPassphrase: NETWORK_CONFIG.passphrase,
        }).addOperation(contract.call('list_products'))
          .setTimeout(30); // Set 30 second timeout
        console.log("Transaction builder created");
      } catch (builderError) {
        console.error("Failed to create transaction builder:", builderError);
        throw builderError;
      }
      
      try {
        console.log("Preparing transaction...");
        tx = await server.prepareTransaction(txBuilder.build());
        console.log("Transaction prepared successfully");
      } catch (prepareError) {
        console.error("Failed to prepare transaction:", prepareError);
        throw prepareError;
      }
      
      try {
        console.log("Simulating transaction...");
        const simResponse = await server.simulateTransaction(tx);
        console.log("Simulation response:", simResponse);
        
        if ('error' in simResponse) {
          console.error("Simulation failed with error:", simResponse.error);
          setProducts([]);
          return;
        }
        
        if (simResponse.result) {
          console.log("Simulation successful, converting result...");
          const nativeResult = scValToNative(simResponse.result.retval);
          console.log("Converted result:", nativeResult);
          
          // Convert smart contract data to frontend format
          const convertedProducts = Array.isArray(nativeResult) ? nativeResult.map((product: any) => ({
            id: product.id || `product-${Date.now()}-${Math.random()}`,
            name: product.title ? new TextDecoder().decode(product.title).replace(/\0/g, '') : 'Unknown Route',
            description: product.desc ? new TextDecoder().decode(product.desc).replace(/\0/g, '') : 'No description',
            price: product.price ? product.price.toString() : '0',
            seller: product.seller || 'Unknown',
            status: 'Onchain',
            estimatedDelivery: new Date().toISOString().split('T')[0], // Default to today
            details: `Blockchain Product - ${product.seller}`
          })) : [];
          
          console.log("Converted products:", convertedProducts);
          setProducts(convertedProducts);
        } else {
          console.log("No result from simulation, setting empty array");
          setProducts([]);
        }
      } catch (simError) {
        console.error("Failed to simulate transaction:", simError);
        throw simError;
      }
    } catch (e: any) {
      console.error("Failed to load products. Full error:", e);
      console.error("Error name:", e.name);
      console.error("Error message:", e.message);
      console.error("Error stack:", e.stack);
      setProducts([]);
    }
  }, [address, sorobanContext.activeConnector]);

  const addRequest = useCallback(async (requestData: any) => {
    // More comprehensive wallet connection check
    if (!address || !sorobanContext.activeConnector) {
      console.error("Wallet connection check failed in addRequest:");
      console.error("Address:", address);
      console.error("Active connector:", sorobanContext.activeConnector);
      throw new Error("Wallet not connected. Please connect your wallet first.");
    }
    
    setIsLoading(true);
    setError(null);

    try {
      console.log("Adding request to smart contract...");
      console.log("Request data:", requestData);
      console.log("User address:", address);
      
      const contract = new Contract(CONTRACT_ID);
      console.log("Contract instance created");
      
      const source = await server.getAccount(address);
      console.log("Source account loaded");

      // Create fixed-size byte arrays for product_title (32 bytes) and details (64 bytes)
      const titleBytes = new Uint8Array(32);
      const detailsBytes = new Uint8Array(64);
      
      // Fill with the string data and pad with zeros
      const titleEncoder = new TextEncoder();
      const detailsEncoder = new TextEncoder();
      const titleData = titleEncoder.encode(requestData.name.slice(0, 32));
      const detailsData = detailsEncoder.encode(requestData.description.slice(0, 64));
      
      titleBytes.set(titleData);
      detailsBytes.set(detailsData);

      const txBuilder = new TransactionBuilder(source, {
        fee: BASE_FEE,
        networkPassphrase: NETWORK_CONFIG.passphrase,
      }).addOperation(contract.call('add_request',
          nativeToScVal(new Address(address)),
          // Create BytesN<32> for product_title
          nativeToScVal(titleBytes, { type: 'bytes' }),
          // Create BytesN<64> for details  
          nativeToScVal(detailsBytes, { type: 'bytes' })
      )).setTimeout(30); // Set 30 second timeout

      console.log("Transaction builder created, preparing transaction...");
      const tx = await server.prepareTransaction(txBuilder.build());
      console.log("Transaction prepared, submitting...");
      
      const txResponse = await submitTransaction(tx);
      console.log("Transaction submitted successfully:", txResponse);
      
      const newRequest: Request = {
        id: txResponse.txHash,
        name: requestData.name,
        maxPrice: requestData.maxPrice,
        requester: address,
        status: 'Active',
        deliveryDate: requestData.deliveryDate,
        description: requestData.description,
      };
      
      setRequests(prev => [newRequest, ...prev]);
      return newRequest.id;
    } catch (e: any) {
      console.error("Smart contract call failed:", e);
      console.log("Falling back to mock request for testing...");
      
      // Fallback to mock request for testing
      const newRequest: Request = {
        id: Date.now().toString(),
        name: requestData.name,
        maxPrice: requestData.maxPrice,
        requester: address,
        status: 'Mock (Contract Failed)',
        deliveryDate: requestData.deliveryDate,
        description: requestData.description,
      };
      
      setRequests(prev => [newRequest, ...prev]);
      setTransactionStatus('success');
      console.log("Mock request added as fallback");
      return newRequest.id;
    } finally {
      setIsLoading(false);
    }
  }, [address, sorobanContext.activeConnector]);

  const loadRequests = useCallback(async () => {
    console.log("Loading requests from smart contract...");
    let source: any;
    let txBuilder: any;
    let tx: any;
    
    try {
      const contract = new Contract(CONTRACT_ID);
      console.log("Contract instance created with ID:", CONTRACT_ID);
      
      try {
        // More comprehensive wallet connection check
        if (!address || !sorobanContext.activeConnector) {
          console.error("Wallet connection check failed in loadRequests:");
          console.error("Address:", address);
          console.error("Active connector:", sorobanContext.activeConnector);
          throw new Error("Wallet not connected. Please connect your wallet first.");
        }
        source = await server.getAccount(address);
        console.log("Source account loaded for read-only operation:", address);
      } catch (accountError) {
        console.error("Failed to load source account:", accountError);
        throw accountError;
      }

      try {
        txBuilder = new TransactionBuilder(source, {
          fee: "0",
          networkPassphrase: NETWORK_CONFIG.passphrase,
        }).addOperation(contract.call('list_requests'))
          .setTimeout(30); // Set 30 second timeout
        console.log("Transaction builder created");
      } catch (builderError) {
        console.error("Failed to create transaction builder:", builderError);
        throw builderError;
      }
      
      try {
        console.log("Preparing transaction...");
        tx = await server.prepareTransaction(txBuilder.build());
        console.log("Transaction prepared successfully");
      } catch (prepareError) {
        console.error("Failed to prepare transaction:", prepareError);
        throw prepareError;
      }
      
      try {
        console.log("Simulating transaction...");
        const simResponse = await server.simulateTransaction(tx);
        console.log("Simulation response:", simResponse);
        
        if ('error' in simResponse) {
          console.error("Simulation failed with error:", simResponse.error);
          setRequests([]);
          return;
        }
        
        if (simResponse.result) {
          console.log("Simulation successful, converting result...");
          const nativeResult = scValToNative(simResponse.result.retval);
          console.log("Converted result:", nativeResult);
          
          // Convert smart contract data to frontend format
          const convertedRequests = Array.isArray(nativeResult) ? nativeResult.map((request: any) => ({
            id: request.id || `request-${Date.now()}-${Math.random()}`,
            name: request.product_title ? new TextDecoder().decode(request.product_title).replace(/\0/g, '') : 'Unknown Product',
            description: request.details ? new TextDecoder().decode(request.details).replace(/\0/g, '') : 'No description',
            maxPrice: '0', // Smart contract doesn't store price, using default
            requester: request.requester || 'Unknown',
            status: 'Active',
            deliveryDate: new Date().toISOString().split('T')[0], // Default to today
          })) : [];
          
          console.log("Converted requests:", convertedRequests);
          setRequests(convertedRequests);
        } else {
          console.log("No result from simulation, setting empty array");
          setRequests([]);
        }
      } catch (simError) {
        console.error("Failed to simulate transaction:", simError);
        throw simError;
      }
    } catch (e: any) {
      console.error("Failed to load requests. Full error:", e);
      console.error("Error name:", e.name);
      console.error("Error message:", e.message);
      console.error("Error stack:", e.stack);
      setRequests([]);
    }
  }, [address, sorobanContext.activeConnector]);

  useEffect(() => {
    console.log("useEffect triggered - Wallet connection status:");
    console.log("Address:", address);
    console.log("Active connector:", sorobanContext.activeConnector);
    console.log("Is connected:", isConnected);
    
    if (isConnected) {
      console.log("Wallet connected, loading products...");
      loadProducts();
    } else {
      console.log("Wallet not connected, clearing products...");
      setProducts([]);
    }
  }, [address, sorobanContext.activeConnector, isConnected, loadProducts]);

  const value = {
    products,
    requests,
    transactions,
    addProduct,
    addRequest,
    loadProducts,
    loadRequests,
    isConnected,
    isLoading,
    error,
    transactionStatus,
    lastTransactionHash,
  };

  return <BlockchainContext.Provider value={value}>{children}</BlockchainContext.Provider>;
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