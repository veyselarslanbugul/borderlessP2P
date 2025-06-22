import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Calendar, DollarSign, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBlockchain } from '@/contexts/BlockchainContext';
import { useWallet } from '@/contexts/WalletContext';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, isConnected } = useBlockchain();
  const { publicKey } = useWallet();
  
  // Find the product from blockchain data using useMemo to prevent unnecessary re-renders
  const product = useMemo(() => {
    if (!id || !products) return null;
    return products.find(p => p.id === id);
  }, [id, products]);
  
  // Debug information - only log once when component mounts or dependencies change
  console.log("ProductDetail - Debug Info:", {
    productId: id,
    foundProduct: product,
    productsCount: products?.length,
    isConnected
  });
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-6 pb-24 max-w-md">
        <Button 
          variant="ghost" 
          className="mb-4 pl-0 flex items-center gap-1" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        
        <div className="text-center py-8">
          <p className="text-gray-500">Product not found</p>
          <Button asChild className="mt-4">
            <Link to="/products">
              Back to Products
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const handlePurchase = () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    // Navigate to chat to discuss the travel request
    navigate(`/chat/${product.seller}?product=${product.id}&type=travel_request`);
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-24 max-w-md">
      <Button 
        variant="ghost" 
        className="mb-4 pl-0 flex items-center gap-1" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </Button>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MapPin className="h-6 w-6 text-blue-500" />
            {product.name}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={product.status === 'Onchain' ? 'default' : 'secondary'}>
              {product.status === 'Onchain' ? 'Active' : product.status}
            </Badge>
          </div>
        </div>
        
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 p-8 flex justify-center">
            <div className="text-center">
              <MapPin className="h-24 w-24 text-blue-500 mx-auto mb-4" />
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Travel Request</p>
            </div>
          </div>
          
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-2xl font-bold text-blue-600">{product.price} XLM</p>
                <p className="text-sm text-gray-500">Max Budget</p>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Requester: {product.seller}
                </p>
                <div className="flex items-center mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium">Travel Details</h3>
              <p className="text-gray-600 dark:text-gray-400">{product.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Date: {product.estimatedDelivery}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <DollarSign className="h-4 w-4" />
                  <span>Budget: {product.price} XLM</span>
                </div>
                {product.details && (
                  <p className="text-xs text-gray-400">Details: {product.details}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {product.status === 'Onchain' && (
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handlePurchase}
          >
            Make Offer
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductDetail; 