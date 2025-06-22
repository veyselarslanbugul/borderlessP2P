import { Card, CardContent } from '@/components/ui/card';

interface NFT {
  id: string;
  name: string;
  image: string;
  description: string;
  dateAcquired: string;
  type: 'achievement' | 'reputation' | 'transaction' | 'special';
}

interface NFTGalleryProps {
  nfts: NFT[];
  title?: string;
  emptyMessage?: string;
}

const NFTGallery = ({ 
  nfts, 
  title = "NFT Koleksiyonum", 
  emptyMessage = "Henüz NFT'niz bulunmuyor."
}: NFTGalleryProps) => {
  // Get badge color based on NFT type
  const getBadgeColor = (type: NFT['type']): string => {
    switch (type) {
      case 'achievement':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'reputation':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'transaction':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      case 'special':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  // Get type label
  const getTypeLabel = (type: NFT['type']): string => {
    switch (type) {
      case 'achievement':
        return 'Başarı';
      case 'reputation':
        return 'İtibar';
      case 'transaction':
        return 'İşlem';
      case 'special':
        return 'Özel';
      default:
        return type;
    }
  };

  return (
    <div>
      {title && <h3 className="font-medium mb-3">{title}</h3>}
      
      {nfts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {nfts.map((nft) => (
            <Card key={nft.id} className="overflow-hidden">
              <div className="aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <img 
                  src={nft.image} 
                  alt={nft.name} 
                  className="h-full w-full object-cover"
                />
              </div>
              <CardContent className="p-3">
                <div className="flex flex-col gap-1">
                  <h4 className="font-medium text-sm truncate">{nft.name}</h4>
                  <div className={`text-xs px-1.5 py-0.5 rounded-full w-fit ${getBadgeColor(nft.type)}`}>
                    {getTypeLabel(nft.type)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{nft.dateAcquired}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">{emptyMessage}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NFTGallery; 