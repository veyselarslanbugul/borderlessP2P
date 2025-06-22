import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, Plus } from "lucide-react";
import { useBlockchain } from '../contexts/BlockchainContext';
import { useWallet } from '../contexts/WalletContext';
import { Badge } from '../components/ui/badge';
import { TransactionStatus } from '../components/TransactionStatus';

const Products: React.FC = () => {
  const { products, purchaseProduct, isLoading, error, isConnected } = useBlockchain();
  const { publicKey } = useWallet();
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  // Tab options
  const tabs = [
    { id: 'active', label: 'Active' },
    { id: 'inactive', label: 'Inactive' },
    { id: 'archived', label: 'Archived' },
  ];

  // Filter products by status
  const getProductsByStatus = (status: string) => {
    return products.filter(product => product.status === status);
  };

  const handlePurchase = async (productId: string, price: string) => {
    if (!isConnected) {
      alert('Lütfen önce cüzdanınızı bağlayın');
      return;
    }

    try {
      setPurchasingId(productId);
      await purchaseProduct(productId, price);
      alert('Ürün başarıyla satın alındı!');
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Satın alma işlemi başarısız: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
    } finally {
      setPurchasingId(null);
    }
  };

  // Render product card
  const renderProductCard = (product: any) => (
    <Card key={product.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{product.name}</CardTitle>
        <div className="flex justify-between items-center">
          <Badge variant={product.status === 'Satışta' ? 'default' : 'secondary'}>
            {product.status}
          </Badge>
          <span className="text-lg font-bold text-blue-600">
            {product.price} XLM
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600">{product.description}</p>
        <div className="text-sm text-gray-500">
          <p>Satıcı: {product.seller}</p>
          <p>Teslimat: {product.estimatedDelivery}</p>
        </div>
        
        <div className="flex gap-2">
          <Link to={`/product/${product.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              Detaylar
            </Button>
          </Link>
          
          {product.status === 'Satışta' && (
            <Button
              onClick={() => handlePurchase(product.id, product.price)}
              disabled={purchasingId === product.id}
              className="flex-1"
            >
              {purchasingId === product.id ? 'Satın Alınıyor...' : 'Satın Al'}
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
            Ürünleri görmek için cüzdanınızı bağlayın.
          </p>
          <Button asChild>
            <Link to="/home">
              Ana Sayfaya Dön
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ürünler</h1>
        <Link to="/create-product">
          <Button>Yeni Ürün Ekle</Button>
          </Link>
      </div>

      {isConnected && <TransactionStatus />}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Ürünler yükleniyor...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <div className="flex justify-between items-center">
                  <Badge variant={product.status === 'Satışta' ? 'default' : 'secondary'}>
                    {product.status}
                  </Badge>
                  <span className="text-lg font-bold text-blue-600">
                    {product.price} XLM
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">{product.description}</p>
                <div className="text-sm text-gray-500">
                  <p>Satıcı: {product.seller}</p>
                  <p>Teslimat: {product.estimatedDelivery}</p>
          </div>

                <div className="flex gap-2">
                  <Link to={`/product/${product.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      Detaylar
                    </Button>
                  </Link>
                  
                  {product.status === 'Satışta' && (
                    <Button
                      onClick={() => handlePurchase(product.id, product.price)}
                      disabled={purchasingId === product.id}
                      className="flex-1"
                    >
                      {purchasingId === product.id ? 'Satın Alınıyor...' : 'Satın Al'}
                  </Button>
                  )}
                </div>
                </CardContent>
              </Card>
          ))}
        </div>
      )}

      {!isLoading && products.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">Henüz ürün bulunmuyor</p>
          <p className="text-gray-400">İlk ürünü eklemek için yukarıdaki butonu kullanın</p>
      </div>
      )}
    </div>
  );
};

export default Products; 