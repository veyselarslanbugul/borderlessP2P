import React from 'react';
import { useBlockchain } from '../contexts/BlockchainContext';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export const TransactionStatus: React.FC = () => {
  const { transactionStatus, lastTransactionHash, isConnected, contractId } = useBlockchain();

  if (!isConnected) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'success':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'İşlem Bekliyor';
      case 'success':
        return 'İşlem Başarılı';
      case 'failed':
        return 'İşlem Başarısız';
      default:
        return 'Hazır';
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-sm">Blockchain Durumu</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Bağlantı:</span>
          <Badge variant={isConnected ? 'default' : 'secondary'}>
            {isConnected ? 'Bağlı' : 'Bağlı Değil'}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">İşlem Durumu:</span>
          <Badge className={getStatusColor(transactionStatus)}>
            {getStatusText(transactionStatus)}
          </Badge>
        </div>
        
        {lastTransactionHash && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Son İşlem:</span>
            <span className="text-xs font-mono text-blue-600 truncate max-w-32">
              {lastTransactionHash}
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Contract ID:</span>
          <span className="text-xs font-mono text-gray-500 truncate max-w-32">
            {contractId}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}; 