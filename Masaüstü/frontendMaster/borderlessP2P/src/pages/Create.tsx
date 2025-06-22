import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';

const Create = () => {
  const { publicKey } = useWallet();

  return (
    <div className="container mx-auto min-h-screen flex flex-col items-center justify-center px-4 max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-7xl">
      <div className="max-w-md mx-auto w-full">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800 dark:text-white">What do you want to do?</h1>
        
        {publicKey ? (
          <div className="grid gap-6 mt-8">
            <Link 
              to="/create-request" 
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-6 px-6 rounded-lg transition-colors flex flex-col items-center justify-center gap-4 shadow-md"
            >
              <span className="text-4xl">📝</span>
              <span className="text-xl font-semibold">I want to request a product</span>
            </Link>
            
            <Link 
              to="/create-product" 
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-6 px-6 rounded-lg transition-colors flex flex-col items-center justify-center gap-4 shadow-md"
            >
              <span className="text-4xl">📦</span>
              <span className="text-xl font-semibold">I want to offer a product I can bring</span>
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center mt-8">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Please connect your wallet to continue.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Create; 