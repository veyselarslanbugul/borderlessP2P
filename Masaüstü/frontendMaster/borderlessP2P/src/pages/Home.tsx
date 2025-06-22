import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { useBlockchain } from '../contexts/BlockchainContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Plane, 
  Search, 
  TrendingUp, 
  Clock, 
  MapPin, 
  DollarSign,
  Users,
  Package,
  Activity
} from 'lucide-react';

const Home = () => {
  const { publicKey } = useWallet();
  const { products, requests, transactions, isConnected } = useBlockchain();

  // Format wallet address for display
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Quick stats
  const stats = [
    {
      title: "Active Products",
      value: products.length,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Open Requests", 
      value: requests.length,
      icon: ShoppingCart,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Total Transactions",
      value: transactions.length,
      icon: Activity,
      color: "text-purple-600", 
      bgColor: "bg-purple-50"
    }
  ];

  // Recent activities
  const recentActivities = [
    {
      type: "product",
      title: "New iPhone 15 available",
      location: "Dubai",
      price: "35,000 TL",
      time: "2 hours ago"
    },
    {
      type: "request", 
      title: "Looking for MacBook Air",
      location: "USA",
      price: "28,000 TL",
      time: "4 hours ago"
    },
    {
      type: "transaction",
      title: "Payment completed",
      location: "Germany", 
      price: "1,200 TL",
      time: "6 hours ago"
    }
  ];

  return (
    <div className="w-screen px-4 py-6" style={{ maxWidth: 'none', width: '100vw' }}>
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-8 shadow-lg">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Welcome to PeerZone!
            </h1>
            <p className="text-lg text-gray-700 mb-4">
              Ready to discover global products or earn from your travels?
            </p>
            {publicKey && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-800">
                  {formatAddress(publicKey)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-blue-50 to-indigo-100">
          <Link to="/create-request">
            <CardContent className="p-8">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <ShoppingCart className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-gray-800 mb-2">Create Request</h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    Tell us what you're looking for
                  </p>
                </div>
                <div className="text-blue-600">
                  <Search className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-green-50 to-emerald-100">
          <Link to="/create-product">
            <CardContent className="p-8">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Plane className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-gray-800 mb-2">Add Travel</h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    Earn money by bringing products
                  </p>
                </div>
                <div className="text-green-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center shadow-md`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                    <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activities */}
      <Card className="mb-8 border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
          <CardTitle className="flex items-center space-x-3 text-gray-800">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold">Recent Activities</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-100">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                  activity.type === 'product' ? 'bg-gradient-to-br from-blue-100 to-blue-200' :
                  activity.type === 'request' ? 'bg-gradient-to-br from-green-100 to-green-200' : 
                  'bg-gradient-to-br from-purple-100 to-purple-200'
                }`}>
                  {activity.type === 'product' && <Package className="w-6 h-6 text-blue-600" />}
                  {activity.type === 'request' && <ShoppingCart className="w-6 h-6 text-green-600" />}
                  {activity.type === 'transaction' && <Activity className="w-6 h-6 text-purple-600" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{activity.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{activity.location}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <DollarSign className="w-3 h-3" />
                      <span>{activity.price}</span>
                    </span>
                  </div>
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Button variant="outline" asChild className="h-auto py-6 flex flex-col space-y-3 border-2 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200">
          <Link to="/products">
            <Package className="w-8 h-8 text-blue-600" />
            <span className="text-sm font-semibold">Browse Products</span>
          </Link>
        </Button>
        
        <Button variant="outline" asChild className="h-auto py-6 flex flex-col space-y-3 border-2 hover:border-green-500 hover:bg-green-50 transition-all duration-200">
          <Link to="/requests">
            <ShoppingCart className="w-8 h-8 text-green-600" />
            <span className="text-sm font-semibold">View Requests</span>
          </Link>
        </Button>
        
        <Button variant="outline" asChild className="h-auto py-6 flex flex-col space-y-3 border-2 hover:border-purple-500 hover:bg-purple-50 transition-all duration-200">
          <Link to="/orders">
            <Clock className="w-8 h-8 text-purple-600" />
            <span className="text-sm font-semibold">My Orders</span>
          </Link>
        </Button>
        
        <Button variant="outline" asChild className="h-auto py-6 flex flex-col space-y-3 border-2 hover:border-orange-500 hover:bg-orange-50 transition-all duration-200">
          <Link to="/profile">
            <Users className="w-8 h-8 text-orange-600" />
            <span className="text-sm font-semibold">Profile</span>
          </Link>
        </Button>
      </div>

      {/* Blockchain Connection Status */}
      {isConnected && (
        <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-700 dark:text-green-300">
              Connected to Stellar Testnet
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home; 