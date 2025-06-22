import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ClipboardList, Package, User, DollarSign, Calendar } from "lucide-react";
import { useBlockchain } from '../contexts/BlockchainContext';
import { useWallet } from '../contexts/WalletContext';
import { Badge } from '../components/ui/badge';

const Requests = () => {
  const { requests, isLoading, error, isConnected, loadRequests } = useBlockchain();
  const { publicKey } = useWallet();

  // Debug information
  useEffect(() => {
    console.log("Requests page - Debug Info:", {
      requestsCount: requests.length,
      requests: requests,
      isLoading: isLoading,
      error: error,
      isConnected: isConnected,
      publicKey: publicKey
    });
  }, [requests.length, isLoading, error, isConnected, publicKey]);

  // Load requests when component mounts or connection changes
  useEffect(() => {
    if (isConnected && loadRequests) {
      console.log("Loading requests on component mount...");
      loadRequests();
    }
  }, [isConnected]);

  // Tab options
  const tabs = [
    { id: 'active', label: 'Active' },
    { id: 'inactive', label: 'Inactive' },
    { id: 'archived', label: 'Archived' },
  ];

  // Filter requests by status
  const getRequestsByStatus = (status: string) => {
    if (status === 'active') return requests.filter(request => request.status === 'Active');
    if (status === 'inactive') return requests.filter(request => request.status === 'Inactive');
    if (status === 'archived') return requests.filter(request => request.status === 'Archived');
    return requests;
  };

  // Render request card
  const renderRequestCard = (request: any) => (
    <Card key={request.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="h-4 w-4 text-blue-500" />
            {request.name}
          </CardTitle>
          <Badge variant={request.status === 'Active' ? 'default' : 'secondary'}>
            {request.status}
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-blue-600">
            {request.maxPrice} XLM
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600">{request.description}</p>
        <div className="text-sm text-gray-500 space-y-1">
          <div className="flex items-center gap-2">
            <User className="h-3 w-3" />
            <span>Requester: {request.requester}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-3 w-3" />
            <span>Max Price: {request.maxPrice} XLM</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <span>Delivery: {request.deliveryDate}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">
            Details
          </Button>
          {request.status === 'Active' && (
            <Button className="flex-1">
              Make Offer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Redirect if not connected
  if (!publicKey) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-md mx-auto text-center">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Connect your wallet to view product requests.
          </p>
          <Button asChild>
            <Link to="/home">
              Go to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 lg:py-12 pb-24 max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-7xl">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold mb-6">Product Requests</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center mb-4">
            <ClipboardList className="h-4 w-4 mr-2" />
            {error}
          </div>
        )}

        {/* Request Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold">{requests.length}</p>
                </div>
                <ClipboardList className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-2xl font-bold">{requests.filter(r => r.status === 'Active').length}</p>
                </div>
                <Badge variant="default" className="h-8 px-2">Active</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold">{requests.filter(r => r.status === 'Archived').length}</p>
                </div>
                <Package className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <div className="bg-muted/50 p-1 rounded-2xl mb-6">
            <TabsList className="w-full bg-transparent gap-1">
              {tabs.map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="data-[state=active]:bg-white data-[state=active]:text-secondary rounded-xl"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-0">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading product requests...</p>
                </div>
              ) : getRequestsByStatus(tab.id).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getRequestsByStatus(tab.id).map((request) => renderRequestCard(request))}
                </div>
              ) : (
                <Card className="shadow-xs">
                  <CardContent className="p-8 flex flex-col items-center text-center">
                    <div className="text-6xl mb-4">📋</div>
                    <h2 className="text-lg font-bold mb-2">No Requests Yet</h2>
                    <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                      {tab.id === 'active' ? 'No active product requests' : 
                       tab.id === 'inactive' ? 'No inactive product requests' :
                       'No archived product requests'}
                    </p>
                    <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                      Create your first product request from the home page.
                    </p>
                    
                    <Button asChild className="bg-yellow-400 hover:bg-yellow-500 text-black">
                      <Link to="/home">
                        Go to Home
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Requests; 