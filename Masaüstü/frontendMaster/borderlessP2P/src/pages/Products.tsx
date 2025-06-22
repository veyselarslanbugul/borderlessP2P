import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, Plus, Database, Globe, AlertTriangle, MapPin, Calendar, DollarSign } from "lucide-react";
import { useBlockchain } from '../contexts/BlockchainContext';
import { useWallet } from '../contexts/WalletContext';
import { Badge } from '../components/ui/badge';
import { TransactionStatus } from '../components/TransactionStatus';

const Products: React.FC = () => {
  const { products, isLoading, error, isConnected, loadProducts } = useBlockchain();
  const { publicKey } = useWallet();
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  // Debug information
  useEffect(() => {
    console.log("Products page - Debug Info:", {
      productsCount: products.length,
      products: products,
      isLoading: isLoading,
      error: error,
      isConnected: isConnected,
      publicKey: publicKey
    });
  }, [products.length, isLoading, error, isConnected, publicKey]);

  // Load products when component mounts or connection changes
  useEffect(() => {
    if (isConnected && loadProducts) {
      console.log("Loading products on component mount...");
      loadProducts();
    }
  }, [isConnected]);

  // Tab options
  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'matched', label: 'Matched' },
    { id: 'completed', label: 'Completed' },
  ];

  // Filter products by status (treating them as travel requests)
  const getProductsByStatus = (status: string) => {
    if (status === 'all') return products;
    if (status === 'active') return products.filter(product => product.status === 'Satışta' || product.status === 'active');
    if (status === 'matched') return products.filter(product => product.status === 'matched');
    if (status === 'completed') return products.filter(product => product.status === 'Satıldı' || product.status === 'completed');
    return products;
  };

  const handlePurchase = async (productId: string, price: string) => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      setPurchasingId(productId);
      // Find the product to get seller information
      const product = products.find(p => p.id === productId);
      if (product) {
        // Navigate to chat to discuss the travel request
        window.location.href = `/chat/${product.seller}?product=${productId}&type=travel_request`;
      } else {
        alert('Product not found');
      }
    } catch (error) {
      console.error('Navigation failed:', error);
      alert('Operation failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setPurchasingId(null);
    }
  };

  // Check if product is local (not on blockchain)
  const isLocalProduct = (productId: string) => {
    if (!productId) return false;
    return productId.startsWith('local_') || productId.startsWith('sample_');
  };

  // Render product card as travel request
  const renderProductCard = (product: any) => (
    <Card key={product.id || `product-${Math.random()}`} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-500" />
            {product.name} {/* Route name */}
          </CardTitle>
          <div className="flex items-center gap-1">
            {isLocalProduct(product.id) ? (
              <Database className="h-4 w-4 text-orange-500" />
            ) : (
              <Globe className="h-4 w-4 text-green-500" />
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Badge variant={product.status === 'Satışta' || product.status === 'active' ? 'default' : 'secondary'}>
            {product.status === 'Satışta' ? 'Active' : 
             product.status === 'Satıldı' ? 'Completed' : product.status}
          </Badge>
          <span className="text-lg font-bold text-blue-600">
            {product.price} XLM {/* Max budget */}
          </span>
        </div>
        {isLocalProduct(product.id) && (
          <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
            <AlertTriangle className="h-3 w-3" />
            Local Storage
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600">{product.description}</p>
        <div className="text-sm text-gray-500 space-y-1">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <span>Date: {product.estimatedDelivery}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-3 w-3" />
            <span>Max Budget: {product.price} XLM</span>
          </div>
          <p>Requester: {product.seller}</p>
          {product.details && (
            <p className="text-xs text-gray-400">Details: {product.details}</p>
          )}
        </div>
        
        <div className="flex gap-2">
          <Link to={`/products/${product.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              Details
            </Button>
          </Link>
          
          {(product.status === 'Satışta' || product.status === 'active') && (
            <Button
              onClick={() => handlePurchase(product.id, product.price)}
              disabled={purchasingId === product.id || isLocalProduct(product.id)}
              className="flex-1"
              title={isLocalProduct(product.id) ? 'Local requests cannot be accepted yet' : ''}
            >
              {purchasingId === product.id ? 'Accepting...' : 'Make Offer'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Redirect if not connected
  if (!publicKey) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-md mx-auto text-center">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Connect your wallet to view travel requests.
          </p>
          <Button asChild>
            <Link to="/home">
              Go to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Travel Requests</h1>
          <p className="text-gray-600">Total {products.length} travel requests</p>
        </div>
        <Link to="/create-product">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Travel Request
          </Button>
        </Link>
      </div>

      {isConnected && <TransactionStatus />}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2" />
          {error}
        </div>
      )}

      {/* Travel Request Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
              <Plane className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold">{products.filter(p => p.status === 'Satışta' || p.status === 'active').length}</p>
              </div>
              <Badge variant="default" className="h-8 px-2">Active</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Matched</p>
                <p className="text-2xl font-bold">{products.filter(p => p.status === 'matched').length}</p>
              </div>
              <Badge variant="secondary" className="h-8 px-2">Matched</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{products.filter(p => p.status === 'Satıldı' || p.status === 'completed').length}</p>
              </div>
              <Database className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Seyahat talepleri yükleniyor...</p>
        </div>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getProductsByStatus(tab.id).map((product) => renderProductCard(product))}
              </div>
              
              {getProductsByStatus(tab.id).length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">
                    {tab.id === 'all' ? 'Henüz seyahat talebi bulunmuyor' : 
                     tab.id === 'active' ? 'Aktif seyahat talebi bulunmuyor' :
                     tab.id === 'matched' ? 'Eşleşen seyahat talebi bulunmuyor' :
                     'Tamamlanan seyahat talebi bulunmuyor'}
                  </p>
                  <p className="text-gray-400">İlk seyahat talebini eklemek için yukarıdaki butonu kullanın</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default Products; 