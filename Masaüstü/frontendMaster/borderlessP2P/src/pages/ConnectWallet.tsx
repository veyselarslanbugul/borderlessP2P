import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useWallet } from '@/contexts/WalletContext';
import { useSorobanReact } from '@soroban-react/core';
import { Wallet, Shield, Globe, Zap } from 'lucide-react';

const ConnectWallet = () => {
  const { connect, isConnected, isConnecting, publicKey } = useWallet();
  const sorobanContext = useSorobanReact();
  const navigate = useNavigate();

  // Debug information
  useEffect(() => {
    console.log("ConnectWallet - Debug Info:");
    console.log("WalletContext isConnected:", isConnected);
    console.log("WalletContext publicKey:", publicKey);
    console.log("SorobanContext address:", sorobanContext.address);
    console.log("SorobanContext activeConnector:", sorobanContext.activeConnector);
    console.log("SorobanContext connectors:", sorobanContext.connectors);
  }, [isConnected, publicKey, sorobanContext.address, sorobanContext.activeConnector]);

  // If already connected, redirect to home
  useEffect(() => {
    if (isConnected && publicKey) {
      console.log("Wallet connected, redirecting to home...");
      navigate('/home');
    }
  }, [isConnected, publicKey, navigate]);

  const handleConnect = async () => {
    try {
      console.log("Attempting to connect wallet...");
      await connect();
      console.log("Wallet connection successful");
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const features = [
    {
      icon: Shield,
      title: "Secure Transactions",
      description: "Your funds are protected by blockchain technology"
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Connect with users worldwide without borders"
    },
    {
      icon: Zap,
      title: "Fast & Efficient",
      description: "Instant transactions on the Stellar network"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4" style={{ width: '100vw' }}>
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            BorderlessP2P
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Connect your wallet to start your journey
          </p>
        </div>

        {/* Connect Wallet Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-xl">Connect Your Wallet</CardTitle>
            <CardDescription>
              Connect with Freighter to access the decentralized marketplace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              size="lg"
            >
              {isConnecting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Connecting...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Wallet className="w-5 h-5" />
                  <span>Connect Freighter Wallet</span>
                </div>
              )}
            </Button>

            {isConnecting && (
              <p className="text-sm text-gray-500 text-center">
                Please approve the connection in your Freighter wallet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 space-y-4">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            By connecting your wallet, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConnectWallet; 