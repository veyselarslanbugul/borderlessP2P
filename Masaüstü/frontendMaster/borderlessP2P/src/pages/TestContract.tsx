import React, { useState } from 'react';
import { useBlockchain } from '../contexts/BlockchainContext';
import { useWallet } from '../contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const TestContract = () => {
  const { publicKey, isConnected } = useWallet();
  const { 
    products, 
    isConnected: blockchainConnected, 
    isLoading, 
    error, 
    transactionStatus,
    loadProducts,
    addProduct 
  } = useBlockchain();

  const [testResult, setTestResult] = useState<string>('');

  const runBasicTests = async () => {
    setTestResult('');
    const results = [];

    // Test 1: Wallet Connection
    results.push(`1. Wallet Connected: ${isConnected ? '✅' : '❌'}`);
    if (isConnected) {
      results.push(`   Address: ${publicKey}`);
    }

    // Test 2: Blockchain Context
    results.push(`2. Blockchain Context: ${blockchainConnected ? '✅' : '❌'}`);

    // Test 3: Products Array
    results.push(`3. Products Array: ${Array.isArray(products) ? '✅' : '❌'}`);
    results.push(`   Products Count: ${products?.length || 0}`);

    // Test 4: Loading State
    results.push(`4. Loading State: ${isLoading ? '🔄' : '✅'}`);

    // Test 5: Error State
    results.push(`5. Error State: ${error ? `❌ ${error}` : '✅'}`);

    // Test 6: Transaction Status
    results.push(`6. Transaction Status: ${transactionStatus}`);

    setTestResult(results.join('\n'));
  };

  const testLoadProducts = async () => {
    try {
      setTestResult('Loading products...');
      await loadProducts();
      setTestResult(`Products loaded successfully! Count: ${products.length}`);
    } catch (err: any) {
      setTestResult(`Error loading products: ${err.message}`);
    }
  };

  const testAddProduct = async () => {
    try {
      setTestResult('Adding test product...');
      const testProduct = {
        name: 'Test Product',
        description: 'This is a test product',
        price: '100',
        details: 'Test details',
        estimatedDelivery: '2024-01-01'
      };
      
      await addProduct(testProduct);
      setTestResult('Test product added successfully!');
    } catch (err: any) {
      setTestResult(`Error adding product: ${err.message}`);
    }
  };

  return (
    <div className="w-screen px-4 py-6" style={{ maxWidth: 'none', width: '100vw' }}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Smart Contract Test Page</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Badge variant={isConnected ? "default" : "destructive"}>
                Wallet: {isConnected ? 'Connected' : 'Disconnected'}
              </Badge>
              <Badge variant={blockchainConnected ? "default" : "destructive"}>
                Blockchain: {blockchainConnected ? 'Connected' : 'Disconnected'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button onClick={runBasicTests} variant="outline">
                Run Basic Tests
              </Button>
              <Button onClick={testLoadProducts} variant="outline">
                Test Load Products
              </Button>
              <Button onClick={testAddProduct} variant="outline">
                Test Add Product
              </Button>
            </div>

            {testResult && (
              <Card>
                <CardHeader>
                  <CardTitle>Test Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-4 rounded">
                    {testResult}
                  </pre>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Current State</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>Products Count: {products?.length || 0}</div>
                  <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
                  <div>Error: {error || 'None'}</div>
                  <div>Transaction Status: {transactionStatus}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestContract; 