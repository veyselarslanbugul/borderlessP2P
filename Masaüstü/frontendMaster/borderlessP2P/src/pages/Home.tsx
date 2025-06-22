import React from 'react';
import Auth from '../components/Auth';
import { Link } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { useBlockchain } from '../contexts/BlockchainContext';
import { TransactionStatus } from '../components/TransactionStatus';

const Home = () => {
  const { publicKey } = useWallet();
  const { products, requests, transactions, isConnected } = useBlockchain();

  // Mock popular products data
  const popularProducts = [
    { id: 1, title: 'Garmin fenix 7X', price: '2800 TL', country: 'ABD', brand: 'GARMIN', image: '/icons/watch.svg' },
    { id: 2, title: 'iPhone 15 Plus', price: '35000 TL', country: 'Dubai', brand: 'APPLE', image: '/icons/phone.svg' },
    { id: 3, title: 'MacBook Air M3', price: '28000 TL', country: 'ABD', brand: 'APPLE', image: '/icons/laptop.svg' },
    { id: 4, title: 'AirPods Pro 2', price: '3200 TL', country: 'ABD', brand: 'APPLE', image: '/icons/headphones.svg' },
    { id: 5, title: 'Nike Air Max 270', price: '1800 TL', country: 'ABD', brand: 'NIKE', image: '/icons/shoes.svg' },
    { id: 6, title: 'Samsung Galaxy S24', price: '22000 TL', country: 'Dubai', brand: 'SAMSUNG', image: '/icons/phone.svg' },
    { id: 7, title: 'Sony WH-1000XM5', price: '4500 TL', country: 'Japonya', brand: 'SONY', image: '/icons/headphones.svg' },
    { id: 8, title: 'iPad Pro 11"', price: '18000 TL', country: 'ABD', brand: 'APPLE', image: '/icons/tablet.svg' },
    { id: 9, title: 'Dyson V15 Detect', price: '6500 TL', country: 'İngiltere', brand: 'DYSON', image: '/icons/vacuum.svg' },
    { id: 10, title: 'Canon EOS R6', price: '32000 TL', country: 'Japonya', brand: 'CANON', image: '/icons/camera.svg' },
    { id: 11, title: 'Levi\'s 501 Jeans', price: '850 TL', country: 'ABD', brand: 'LEVI\'S', image: '/icons/jeans.svg' },
    { id: 12, title: 'The North Face Jacket', price: '2200 TL', country: 'ABD', brand: 'TNF', image: '/icons/jacket.svg' },
    { id: 13, title: 'Nintendo Switch OLED', price: '4800 TL', country: 'Japonya', brand: 'NINTENDO', image: '/icons/gaming.svg' },
    { id: 14, title: 'Vitamix Blender', price: '5200 TL', country: 'ABD', brand: 'VITAMIX', image: '/icons/blender.svg' },
    { id: 15, title: 'Ray-Ban Aviator', price: '1400 TL', country: 'İtalya', brand: 'RAY-BAN', image: '/icons/sunglasses.svg' }
  ];

  return (
    <div className={`container mx-auto px-4 max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-7xl ${
      !publicKey 
        ? 'min-h-screen flex flex-col items-center justify-center' 
        : 'py-6 md:py-8 lg:py-12'
    }`}>
      {!publicKey ? (
        <div className="flex flex-col h-full max-w-sm mx-auto w-full">
          <h1 className="text-xl font-bold mb-6 text-center text-secondary">BorderlessP2P</h1>
          
          <div className="mb-6">
            <Auth />
          </div>
          
          <Card className="shadow-xs border-t border-border mt-4">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold mb-2">Welcome</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Connect your wallet to get products from abroad or earn money if you're traveling abroad.
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Discover</h1>
            <div className="flex items-center gap-3">
              <button className="p-1" aria-label="Show notifications">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                VM
              </div>
            </div>
          </div>
          
          <p className="text-gray-500 mb-6">
            Hello Veysel, welcome to Glocalzone! Select or add products from the "Start Shopping" button, or add your travel to earn money!
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full justify-items-center mb-6">
            <Button 
              variant="outline"
              asChild
              className="h-auto py-4 flex items-center justify-between px-5 transition-all duration-120 active:scale-[1.02] rounded-2xl bg-blue-100/50 border-0 shadow-sm w-full"
            >
              <Link to="/create-request">
                <span className="text-sm font-medium">Start Shopping</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </Button>
            
            <Button 
              variant="outline"
              asChild
              className="h-auto py-4 flex items-center justify-between px-5 transition-all duration-120 active:scale-[1.02] rounded-2xl bg-blue-100/50 border-0 shadow-sm w-full"
            >
              <Link to="/create-product">
                <span className="text-sm font-medium">Add Travel</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 16.32C22 16.32 18 20 12 20C6 20 2 16.32 2 16.32" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 7.68C22 7.68 18 4 12 4C6 4 2 7.68 2 7.68" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12H22" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </Button>
          </div>
          
          <Card className="shadow-xs mb-6 rounded-xl overflow-hidden bg-white">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm">
                    We need you to customize your profile so we can offer you special deals and coupons.
                  </p>
                </div>
                <Button 
                  variant="ghost"
                  size="icon"
                  asChild
                  className="text-muted-foreground bg-blue-100/50 rounded-full h-8 w-8"
                >
                  <Link to="/profile">
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Popular Products Section */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Most Purchased from Abroad</h2>
                <span className="text-red-500">🔊</span>
              </div>
              <Button variant="link" size="sm" className="text-muted-foreground text-sm">
                View All
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full justify-items-center">
              {popularProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden shadow-xs">
                  <CardContent className="p-0">
                    <div className="aspect-square relative bg-white flex items-center justify-center p-2">
                      <img 
                        src={product.image} 
                        alt={product.title} 
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="p-3">
                      <div className="text-xs text-muted-foreground uppercase font-medium mb-1">
                        {product.brand}
                      </div>
                      <h3 className="font-medium text-sm line-clamp-1 mb-0">{product.title}</h3>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {isConnected && <TransactionStatus />}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ürünler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{products.length}</div>
                <p className="text-gray-600">Aktif ürün</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Talepler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{requests.length}</div>
                <p className="text-gray-600">Açık talep</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">İşlemler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">{transactions.length}</div>
                <p className="text-gray-600">Toplam işlem</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Son Ürünler</CardTitle>
              </CardHeader>
              <CardContent>
                {products.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div>
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-gray-600">{product.price} XLM</p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {product.status}
                    </span>
                  </div>
                ))}
                {products.length === 0 && (
                  <p className="text-gray-500 text-center py-4">Henüz ürün yok</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Son İşlemler</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.slice(0, 5).map((tx) => (
                  <div key={tx.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div>
                      <h4 className="font-medium">{tx.description}</h4>
                      <p className="text-sm text-gray-600">{tx.amount} XLM</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      {tx.status}
                    </span>
                  </div>
                ))}
                {transactions.length === 0 && (
                  <p className="text-gray-500 text-center py-4">Henüz işlem yok</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home; 