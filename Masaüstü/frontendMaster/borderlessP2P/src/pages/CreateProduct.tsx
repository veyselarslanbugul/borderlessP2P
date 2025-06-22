import { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useNavigate } from 'react-router-dom';

const CreateProduct = () => {
  const { publicKey } = useWallet();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    productName: '',
    productDetails: '',
    estimatedDeliveryDate: '',
    description: '',
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Product data:', formData);
      setIsSubmitting(false);
      navigate('/products');
    }, 1000);
  };

  // Redirect if not connected
  if (!publicKey) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-md mx-auto text-center">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Ürün eklemek için cüzdanınızı bağlayın.
          </p>
          <button
            onClick={() => navigate('/home')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Yeni Ürün</h1>
      
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-md mx-auto">
        {/* Product Details */}
        <div className="mb-4">
          <label htmlFor="productName" className="block text-gray-700 dark:text-gray-300 mb-2">
            Getirilecek ürün adı
          </label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            required
            placeholder="Örn: Apple iPhone 15 Pro"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="productDetails" className="block text-gray-700 dark:text-gray-300 mb-2">
            Ürün detayları
          </label>
          <input
            type="text"
            id="productDetails"
            name="productDetails"
            value={formData.productDetails}
            onChange={handleChange}
            required
            placeholder="Örn: 256GB, Siyah, ABD versiyonu"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        {/* Estimated Delivery Date */}
        <div className="mb-4">
          <label htmlFor="estimatedDeliveryDate" className="block text-gray-700 dark:text-gray-300 mb-2">
            Tahmini teslim tarihi
          </label>
          <input
            type="date"
            id="estimatedDeliveryDate"
            name="estimatedDeliveryDate"
            value={formData.estimatedDeliveryDate}
            onChange={handleChange}
            required
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        {/* Description */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-gray-700 dark:text-gray-300 mb-2">
            Açıklama
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Ürün hakkında ek bilgiler, teslim şartları, vb."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="w-1/2 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            disabled={isSubmitting}
          >
            İptal
          </button>
          <button
            type="submit"
            className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Kaydediliyor...
              </>
            ) : (
              'Kaydet'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct; 