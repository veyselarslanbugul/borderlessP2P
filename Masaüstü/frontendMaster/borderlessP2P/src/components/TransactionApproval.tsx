import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBlockchain } from '@/contexts/BlockchainContext';
import { Wallet, Check, X, AlertTriangle } from 'lucide-react';

const TransactionApproval: React.FC = () => {
  const { 
    showModal, 
    modalData, 
    approveTransaction, 
    rejectTransaction 
  } = useBlockchain();

  // Test if component is mounting
  useEffect(() => {
    console.log('🔍 TransactionApproval component MOUNTED');
  }, []);

  // Detailed debug logging
  console.log('🔍 TransactionApproval render:', { 
    showModal, 
    modalData,
    hasModalData: !!modalData,
    shouldShow: showModal && modalData
  });

  // Always show debug info
  if (!showModal || !modalData) {
    console.log('🔍 Modal not showing because:', {
      showModal,
      hasModalData: !!modalData
    });
    
    // Show debug element
    return (
      <div className="fixed top-0 right-0 bg-red-500 text-white p-2 text-xs z-[9999]">
        Modal Debug: show={String(showModal)}, data={String(!!modalData)}
      </div>
    );
  }

  console.log('🔍 Modal should be visible now!');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <Card className="w-full max-w-md border-4 border-blue-500">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Wallet className="h-8 w-8 text-blue-500 mr-2" />
            <CardTitle className="text-blue-600">Transaction Approval</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Please review and approve this transaction
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Transaction Details */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Contract:</span>
              <Badge variant="outline" className="text-xs">
                {modalData.contractId.slice(0, 8)}...
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Method:</span>
              <Badge variant="secondary" className="text-xs">
                {modalData.method}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Network:</span>
              <Badge variant="outline" className="text-xs">
                {modalData.network}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Fee:</span>
              <span className="text-sm font-mono">{modalData.fee}</span>
            </div>
          </div>

          {/* Parameters */}
          <div className="border-t pt-3">
            <h4 className="text-sm font-medium mb-2">Parameters:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Seller:</span>
                <span className="font-mono text-xs">
                  {modalData.parameters.seller.slice(0, 8)}...
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Title:</span>
                <span className="font-medium">{modalData.parameters.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price:</span>
                <span className="font-medium">{modalData.parameters.price}</span>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-yellow-800">
              This transaction will be executed on the Stellar testnet. 
              Make sure you're connected to the correct network.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-2">
            <Button 
              variant="outline" 
              onClick={rejectTransaction}
              className="flex-1 hover:bg-red-50 hover:border-red-300"
            >
              <X className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button 
              onClick={approveTransaction}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionApproval; 