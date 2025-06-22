import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Check } from 'lucide-react';

interface DeliveryProofProps {
  productName: string;
  counterpartyAddress: string;
  isSeller: boolean;
  ipfsHash?: string;
  onConfirmDelivery?: () => void;
  onAddDeliveryProof?: (hash: string) => void;
  status: 'pending' | 'shipped' | 'delivered' | 'completed' | 'disputed';
}

const DeliveryProof = ({
  productName,
  counterpartyAddress,
  isSeller,
  ipfsHash,
  onConfirmDelivery,
  onAddDeliveryProof,
  status
}: DeliveryProofProps) => {
  const [newHash, setNewHash] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle delivery proof submission
  const handleAddProof = () => {
    if (!newHash.trim() || !onAddDeliveryProof) return;
    
    setIsSubmitting(true);
    // In real app, this would upload to IPFS first
    onAddDeliveryProof(newHash);
    setIsSubmitting(false);
    setNewHash('');
  };

  // Handle delivery confirmation
  const handleConfirmDelivery = () => {
    if (onConfirmDelivery) {
      setIsSubmitting(true);
      onConfirmDelivery();
      setIsSubmitting(false);
    }
  };

  // Get status text
  const getStatusText = () => {
    switch (status) {
      case 'pending': return 'Bekleniyor';
      case 'shipped': return 'Kargoda';
      case 'delivered': return 'Teslim Edildi';
      case 'completed': return 'Tamamlandı';
      case 'disputed': return 'İtiraz Edildi';
      default: return status;
    }
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <h3 className="font-medium">{productName}</h3>
            <Badge variant={status === 'completed' ? 'default' : 'outline'}>
              {getStatusText()}
            </Badge>
          </div>
          
          <p className="text-sm text-gray-500">
            {isSeller ? 'Alıcı: ' : 'Satıcı: '}{counterpartyAddress}
          </p>
          
          {ipfsHash ? (
            <div className="mt-2">
              <p className="text-sm font-medium mb-1">Teslimat Kanıtı:</p>
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-md overflow-x-auto">
                <code className="text-xs">{ipfsHash}</code>
                <a 
                  href={`https://ipfs.io/ipfs/${ipfsHash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-yellow-600 hover:text-yellow-700 dark:text-yellow-400"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              
              {status === 'shipped' && !isSeller && (
                <Button
                  onClick={handleConfirmDelivery}
                  className="w-full mt-4 bg-yellow-400 hover:bg-yellow-500 text-black"
                  disabled={isSubmitting}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Teslimatı Onayla
                </Button>
              )}
            </div>
          ) : (
            isSeller && status === 'pending' && (
              <div className="mt-2">
                <p className="text-sm font-medium mb-1">Teslimat Kanıtı Ekle:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newHash}
                    onChange={(e) => setNewHash(e.target.value)}
                    placeholder="IPFS Hash'i girin"
                    className="flex-1 p-2 text-sm border rounded-md"
                  />
                  <Button
                    onClick={handleAddProof}
                    disabled={!newHash.trim() || isSubmitting}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black"
                  >
                    Ekle
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  IPFS'e dosya yükledikten sonra hash'i buraya girin.
                </p>
              </div>
            )
          )}
          
          {status === 'completed' && (
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md mt-2">
              <p className="text-green-800 dark:text-green-200 text-sm">
                Bu işlem başarıyla tamamlandı. Ödeme satıcıya aktarıldı.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryProof; 