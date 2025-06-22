import React from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useState } from 'react';
import ReputationBar from '../components/ReputationBar';
import { Card, CardContent } from '../components/ui/card';

const Profile = () => {
  const { publicKey, connect, disconnect } = useWallet();
  const [activeTab, setActiveTab] = useState('orders');

  // Mock user data
  const userData = {
    reputation: 4,
    orders: [
      { id: 1, title: 'Apple AirPods Pro', status: 'Teslim Edildi', date: '10.05.2023' },
      { id: 2, title: 'PlayStation 5', status: 'Yolda', date: '22.06.2023' },
    ],
    deliveries: [
      { id: 1, title: 'iPhone 15 Pro', status: 'Teslim Edildi', date: '15.04.2023' },
      { id: 2, title: 'Nike Air Jordan', status: 'Teslim Edildi', date: '03.05.2023' },
      { id: 3, title: 'Samsung Galaxy S23', status: 'Teslim Edildi', date: '28.05.2023' },
    ]
  };

  // Function to shorten the wallet address for display
  const shortenAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!publicKey) {
    return (
      <div className="container mx-auto px-4 py-6 pb-24 max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">Profile</h1>
        
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Connect your wallet to view your profile.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Tab options
  const tabs = [
    { id: 'orders', label: 'Siparişlerim' },
    { id: 'deliveries', label: 'Teslimlerim' },
  ];

  const menuItems = [
    { id: 'orders', label: 'My Orders' },
    { id: 'settings', label: 'Settings' },
    { id: 'help', label: 'Help' },
    { id: 'logout', label: 'Logout' },
  ];

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 lg:py-12 pb-24 max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-7xl">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">Profile</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          {/* Wallet Info */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl text-white">👤</span>
            </div>
            <div className="font-mono bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm mb-2">
              {shortenAddress(publicKey)}
            </div>
          </div>
          
          {/* Reputation NFT */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-lg mb-6">
            <div className="text-white text-center mb-2 font-medium">İtibar NFT</div>
            <div className="flex justify-center">
              <ReputationBar rating={userData.reputation} />
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-center">
              <div className="text-center">
                <p className="text-2xl font-bold">{userData.orders.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Orders</p>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Teslimler</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">{userData.deliveries.length}</p>
            </div>
          </div>
          
          {/* Disconnect Button */}
          <button
            onClick={disconnect}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Cüzdanı Ayır
          </button>
        </div>
        
        {/* History Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`py-3 px-4 text-center flex-1 ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-500 font-medium'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Tab Content */}
          <div className="p-4">
            {activeTab === 'orders' ? (
              userData.orders.length > 0 ? (
                <div className="space-y-3">
                  {userData.orders.map((order) => (
                    <div key={order.id} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">{order.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{order.date}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">No orders found yet.</p>
              )
            ) : (
              userData.deliveries.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {userData.deliveries.map((delivery) => (
                    <div key={delivery.id} className="py-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-gray-800 dark:text-white">{delivery.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{delivery.date}</p>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {delivery.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">Henüz teslimat bulunmuyor.</p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 