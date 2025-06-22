import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Mock product data - in real app, fetch from blockchain using id
  const product = {
    id: id || '1',
    name: 'iPhone 15 Pro - 256GB',
    image: '/icons/phone.svg', // Using placeholder from public folder
    price: '2,500',
    seller: 'G...456',
    reputation: 4,
    status: 'Satışta',
    description: 'ABD versiyonu, sıfır, kutulu. Tüm aksesuarları tam.',
    estimatedDelivery: '15 Ekim 2023'
  };

  const handlePurchase = () => {
    // In real app, this would initiate the blockchain transaction
    navigate(`/purchase/${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-24 max-w-md">
      <Button 
        variant="ghost" 
        className="mb-4 pl-0 flex items-center gap-1" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Geri</span>
      </Button>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline">{product.status}</Badge>
          </div>
        </div>
        
        <Card className="overflow-hidden">
          <div className="bg-gray-100 dark:bg-gray-800 p-8 flex justify-center">
            <img 
              src={product.image} 
              alt={product.name} 
              className="h-48 w-48 object-contain"
            />
          </div>
          
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-2xl font-bold">{product.price} XLM</p>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-sm text-gray-500">Satıcı: {product.seller}</p>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < product.reputation ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Açıklama</h3>
              <p className="text-gray-600 dark:text-gray-400">{product.description}</p>
              <p className="text-sm text-gray-500">Tahmini teslimat: {product.estimatedDelivery}</p>
            </div>
          </CardContent>
        </Card>
        
        <Button 
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black"
          onClick={handlePurchase}
        >
          Satın Al
        </Button>
      </div>
    </div>
  );
};

export default ProductDetail; 