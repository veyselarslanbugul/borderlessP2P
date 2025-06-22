import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWallet } from '@/contexts/WalletContext';

const CreateProposal = () => {
  const navigate = useNavigate();
  const { publicKey } = useWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    votingPeriod: '7' // Default 7 days
  });
  const [error, setError] = useState<string | null>(null);

  // Available categories
  const categories = [
    { id: 'fees', name: 'Komisyon Oranları' },
    { id: 'features', name: 'Platform Özellikleri' },
    { id: 'governance', name: 'Yönetişim' },
    { id: 'nft', name: 'NFT ve İtibar' },
    { id: 'other', name: 'Diğer' }
  ];

  // Available voting periods
  const votingPeriods = [
    { id: '3', name: '3 gün' },
    { id: '7', name: '7 gün' },
    { id: '14', name: '14 gün' },
    { id: '30', name: '30 gün' }
  ];

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      // Add proposal logic here
      navigate('/proposals');
    } catch (error) {
      console.error('Failed to create proposal:', error);
      setError('Failed to create proposal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect if not connected
  if (!publicKey) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-md mx-auto text-center">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Öneri oluşturmak için cüzdanınızı bağlayın.
          </p>
          <Button
            onClick={() => navigate('/home')}
            className="bg-yellow-400 hover:bg-yellow-500 text-black"
          >
            Ana Sayfaya Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-24 max-w-md">
      <Button 
        variant="ghost" 
        className="mb-4 pl-0 flex items-center gap-1" 
        onClick={() => navigate('/proposals')}
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Geri</span>
      </Button>
      
      <h1 className="text-2xl font-bold mb-6">Yeni Öneri</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Öneri Başlığı
          </label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Örn: Komisyon Oranı Düşürülmesi"
            className="w-full"
          />
        </div>
        
        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Kategori
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={(e) => handleSelectChange('category', e.target.value)}
            className="w-full p-2 border rounded-md bg-white dark:bg-gray-800"
            required
          >
            <option value="" disabled>Kategori seçin</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Açıklama
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Önerinizi detaylı bir şekilde açıklayın..."
            className="min-h-[150px] w-full p-2 border rounded-md bg-white dark:bg-gray-800"
            rows={5}
          />
        </div>
        
        {/* Voting Period */}
        <div>
          <label htmlFor="votingPeriod" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Oylama Süresi
          </label>
          <select
            id="votingPeriod"
            name="votingPeriod"
            value={formData.votingPeriod}
            onChange={(e) => handleSelectChange('votingPeriod', e.target.value)}
            className="w-full p-2 border rounded-md bg-white dark:bg-gray-800"
          >
            {votingPeriods.map((period) => (
              <option key={period.id} value={period.id}>
                {period.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Submit Button */}
        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            className="w-1/2"
            onClick={() => navigate('/proposals')}
            disabled={isSubmitting}
          >
            İptal
          </Button>
          <Button
            type="submit"
            className="w-1/2 bg-yellow-400 hover:bg-yellow-500 text-black"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Gönderiliyor...' : 'Öneri Oluştur'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateProposal; 