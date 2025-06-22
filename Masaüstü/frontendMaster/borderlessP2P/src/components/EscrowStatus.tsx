import { ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EscrowStatusProps {
  productName: string;
  sellerAddress: string;
  amount: string;
  status: 'pending' | 'shipped' | 'delivered' | 'completed' | 'disputed';
  escrowAddress: string;
  transactionId: string;
  onViewBlockchain?: () => void;
}

const EscrowStatus = ({
  productName,
  sellerAddress,
  amount,
  status,
  escrowAddress,
  transactionId,
  onViewBlockchain
}: EscrowStatusProps) => {
  // Helper function to determine step completion
  const isStepCompleted = (step: string): boolean => {
    switch (step) {
      case 'payment':
        return true; // Payment is always completed if we're showing escrow
      case 'shipping':
        return ['shipped', 'delivered', 'completed'].includes(status);
      case 'delivery':
        return ['delivered', 'completed'].includes(status);
      case 'completed':
        return status === 'completed';
      default:
        return false;
    }
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="font-medium">{productName}</h3>
            <div className="text-sm text-gray-500">
              <p>Satıcı: {sellerAddress}</p>
              <p>Tutar: {amount} XLM</p>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                isStepCompleted('payment') 
                  ? 'bg-yellow-400 text-black' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}>
                {isStepCompleted('payment') ? '✓' : '1'}
              </div>
              <div className="flex-1">
                <p className="font-medium">Ödeme Escrow'a Gönderildi</p>
                <p className="text-sm text-gray-500">
                  Ödeme güvenli escrow adresine gönderildi
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                isStepCompleted('shipping') 
                  ? 'bg-yellow-400 text-black' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}>
                {isStepCompleted('shipping') ? '✓' : '2'}
              </div>
              <div className="flex-1">
                <p className="font-medium">Ürün Gönderildi</p>
                <p className="text-sm text-gray-500">
                  Satıcı ürünü gönderdi ve teslimat kanıtı ekledi
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                isStepCompleted('delivery') 
                  ? 'bg-yellow-400 text-black' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}>
                {isStepCompleted('delivery') ? '✓' : '3'}
              </div>
              <div className="flex-1">
                <p className="font-medium">Teslimat Onaylandı</p>
                <p className="text-sm text-gray-500">
                  Alıcı teslimatı onayladı
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                isStepCompleted('completed') 
                  ? 'bg-yellow-400 text-black' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}>
                {isStepCompleted('completed') ? '✓' : '4'}
              </div>
              <div className="flex-1">
                <p className="font-medium">Ödeme Tamamlandı</p>
                <p className="text-sm text-gray-500">
                  Ödeme satıcıya aktarıldı
                </p>
              </div>
            </div>
          </div>
          
          {/* Escrow Details */}
          <div className="mt-2 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm">
              <p className="flex justify-between">
                <span className="text-gray-500">Escrow Adresi:</span>
                <span className="font-mono">{escrowAddress}</span>
              </p>
              <p className="flex justify-between mt-1">
                <span className="text-gray-500">İşlem ID:</span>
                <span className="font-mono">{transactionId.substring(0, 10)}...</span>
              </p>
            </div>
            
            <Button 
              variant="outline"
              size="sm"
              onClick={onViewBlockchain}
              className="w-full mt-3 flex items-center justify-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Blockchain'de Görüntüle
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EscrowStatus; 