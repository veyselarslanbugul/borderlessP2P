import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useBlockchain } from '../contexts/BlockchainContext';
import { useSorobanReact } from '@soroban-react/core';
import TransactionApproval from '../components/TransactionApproval';

const TestBlockchain: React.FC = () => {
  const { publicKey, connect, disconnect, isConnecting, isConnected, activeChain } = useWallet();
  const { 
    products, 
    addProduct, 
    isLoading, 
    error, 
    contractId, 
    isConnected: blockchainConnected 
  } = useBlockchain();
  
  // Get Soroban context for additional wallet info
  const sorobanContext = useSorobanReact();
  
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [debugInfo, setDebugInfo] = useState<any>({});

  // Debug information
  useEffect(() => {
    setDebugInfo({
      connectors: sorobanContext.connectors,
      connectorNames: sorobanContext.connectors.map(c => c.name),
      activeConnector: sorobanContext.activeConnector,
      address: sorobanContext.address,
      connected: sorobanContext.address ? true : false,
      chains: sorobanContext.chains,
      activeChain: sorobanContext.activeChain
    });
  }, [sorobanContext]);

  const handleConnect = async () => {
    try {
      console.log('Connecting to wallet...');
      console.log('Available connectors:', sorobanContext.connectors);
      await connect();
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  const handleAddProduct = async () => {
    if (!productName || !productDescription || !productPrice) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    try {
      await addProduct({
        name: productName,
        description: productDescription,
        price: productPrice,
        details: productDescription,
        estimatedDelivery: '7 gün'
      });
      
      // Clear form
      setProductName('');
      setProductDescription('');
      setProductPrice('');
      
      alert('Ürün başarıyla eklendi!');
    } catch (error) {
      console.error('Failed to add product:', error);
      alert('Ürün eklenirken hata oluştu');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Blockchain Entegrasyon Testi</h1>
      
      {/* Debug Information */}
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-3 text-yellow-800">🔍 Debug Bilgileri</h2>
        <div className="text-sm space-y-2">
          <p><strong>Mevcut Connector'lar:</strong> {debugInfo.connectorNames?.join(', ') || 'Yok'}</p>
          <p><strong>Aktif Connector:</strong> {debugInfo.activeConnector?.name || 'Yok'}</p>
          <p><strong>Adres:</strong> {debugInfo.address || 'Yok'}</p>
          <p><strong>Bağlı:</strong> {debugInfo.connected ? 'Evet' : 'Hayır'}</p>
          <p><strong>Zincirler:</strong> {debugInfo.chains?.length || 0} adet</p>
          <p><strong>Aktif Zincir:</strong> {debugInfo.activeChain?.name || 'Yok'}</p>
        </div>
        <details className="mt-3">
          <summary className="cursor-pointer text-yellow-700 font-medium">Tam Debug Bilgileri</summary>
          <pre className="mt-2 text-xs bg-yellow-100 p-2 rounded overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </details>
      </div>
      
      {/* Wallet Status */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">🦊 Freighter Cüzdan Durumu</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Bağlı:</strong> {isConnected ? '✅ Evet' : '❌ Hayır'}</p>
            <p><strong>Adres:</strong> {publicKey || 'Bağlı değil'}</p>
            <p><strong>Zincir:</strong> {activeChain || 'Bilinmiyor'}</p>
            <p><strong>Cüzdan Tipi:</strong> {sorobanContext.activeConnector?.name || 'Bilinmiyor'}</p>
          </div>
          <div>
            <p><strong>Blockchain Bağlı:</strong> {blockchainConnected ? '✅ Evet' : '❌ Hayır'}</p>
            <p><strong>Contract ID:</strong> {contractId}</p>
            <p><strong>Yükleniyor:</strong> {isLoading ? '⏳ Evet' : '✅ Hayır'}</p>
            <p><strong>Bağlantı Durumu:</strong> {sorobanContext.address ? '✅ Bağlı' : '❌ Bağlı Değil'}</p>
          </div>
        </div>
        
        {/* Freighter Info */}
        {!isConnected && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
            <h3 className="font-semibold mb-2 text-blue-800">🦊 Freighter Cüzdanı Gerekli</h3>
            <p className="text-blue-700 text-sm mb-3">
              Bu uygulama sadece Freighter cüzdanı ile çalışır. Lütfen Freighter cüzdanınızın tarayıcıda yüklü ve aktif olduğundan emin olun.
            </p>
            <div className="text-xs text-blue-600">
              <p>• Freighter cüzdanını <a href="https://www.freighter.app/" target="_blank" rel="noopener noreferrer" className="underline">buradan</a> indirebilirsiniz</p>
              <p>• Cüzdanı tarayıcıya yükledikten sonra bu sayfayı yenileyin</p>
              <p>• Tarayıcı konsolunu açıp hata mesajlarını kontrol edin</p>
            </div>
          </div>
        )}
        
        <div className="mt-4 space-x-4">
          {!isConnected ? (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium"
            >
              {isConnecting ? '🔄 Bağlanıyor...' : '🦊 Freighter ile Bağlan'}
            </button>
          ) : (
            <button
              onClick={disconnect}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 font-medium"
            >
              🔌 Bağlantıyı Kes
            </button>
          )}
        </div>
        
        {/* Available Connectors */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Mevcut Cüzdanlar:</h3>
          <div className="flex gap-2">
            {sorobanContext.connectors.map((connector) => (
              <div key={connector.name} className="text-sm">
                <span className={`px-3 py-1 rounded-full ${
                  sorobanContext.activeConnector?.name === connector.name 
                    ? 'bg-green-200 text-green-800 font-medium' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {connector.name === 'freighter' ? '🦊 Freighter' : connector.name}
                </span>
              </div>
            ))}
          </div>
          {sorobanContext.connectors.length === 0 && (
            <p className="text-red-600 text-sm">❌ Hiçbir cüzdan bulunamadı!</p>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Hata:</strong> {error}
        </div>
      )}

      {/* Add Product Form */}
      {isConnected && (
        <div className="bg-white border border-gray-300 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Ürün Ekle</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Ürün Adı</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Ürün adını girin"
                maxLength={32}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Açıklama</label>
              <textarea
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Ürün açıklamasını girin"
                maxLength={64}
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fiyat (XLM)</label>
              <input
                type="number"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Fiyatı girin"
              />
            </div>
            <button
              onClick={handleAddProduct}
              disabled={isLoading}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {isLoading ? 'Ekleniyor...' : 'Ürün Ekle'}
            </button>
          </div>
        </div>
      )}

      {/* Products List */}
      <div className="bg-white border border-gray-300 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Ürünler ({products.length})</h2>
        {products.length === 0 ? (
          <p className="text-gray-500">Henüz ürün eklenmemiş.</p>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="border border-gray-200 p-4 rounded">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-gray-600">{product.description}</p>
                <p className="text-green-600 font-medium">{product.price} XLM</p>
                <p className="text-sm text-gray-500">Satıcı: {product.seller}</p>
                <p className="text-sm text-gray-500">Durum: {product.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Transaction Approval Modal */}
      <TransactionApproval />
    </div>
  );
};

export default TestBlockchain; 