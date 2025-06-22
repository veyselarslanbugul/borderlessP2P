import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlockchain } from '../contexts/BlockchainContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { TransactionStatus } from '../components/TransactionStatus';
import { Badge } from '../components/ui/badge';
import { AlertTriangle, CheckCircle, Info, MapPin, Calendar, DollarSign } from 'lucide-react';

const CreateProduct: React.FC = () => {
  const navigate = useNavigate();
  const { addProduct, isLoading, error, isConnected, transactionStatus } = useBlockchain();
  const [formData, setFormData] = useState({
    route: '',
    travelDate: '',
    maxBudget: '',
    description: ''
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      setSubmitStatus('error');
      setStatusMessage('Lütfen önce cüzdanınızı bağlayın');
      return;
    }

    // Validate form data
    if (!formData.route.trim() || !formData.description.trim() || !formData.maxBudget.trim()) {
      setSubmitStatus('error');
      setStatusMessage('Lütfen tüm gerekli alanları doldurun');
      return;
    }

    if (parseFloat(formData.maxBudget) <= 0) {
      setSubmitStatus('error');
      setStatusMessage('Maksimum bütçe 0\'dan büyük olmalıdır');
      return;
    }

    try {
      setSubmitStatus('idle');
      setStatusMessage('Seyahat ekleniyor...');

      console.log('🚀 Starting travel product creation...');
      console.log('📝 Form data:', formData);

      // Use addProduct function with travel data
      const product = await addProduct({
        name: formData.route.trim(), // Route as product name
        description: formData.description.trim(),
        price: formData.maxBudget,
        estimatedDelivery: formData.travelDate.trim() || 'Belirtilmedi',
        details: `Seyahat: ${formData.route} - ${formData.travelDate}`
      });

      console.log('✅ Travel product created successfully:', product);

      setSubmitStatus('success');
      setStatusMessage('Seyahat başarıyla eklendi! Yönlendiriliyorsunuz...');

      // Clear form
      setFormData({
        route: '',
        travelDate: '',
        maxBudget: '',
        description: ''
      });

      // Navigate after a short delay
      setTimeout(() => {
        navigate('/products');
      }, 2000);

    } catch (error) {
      console.error('❌ Failed to add travel product:', error);
      setSubmitStatus('error');
      setStatusMessage('Seyahat eklenirken hata oluştu: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear status when user starts typing
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
      setStatusMessage('');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Seyahat Ekle</h1>
        <p className="text-gray-600">Seyahat rotanızı ve ücretinizi belirtin, yolcular sizinle iletişime geçsin</p>
        
        {/* Connection Status */}
        <div className="mt-4">
          {isConnected ? (
            <Badge variant="default" className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Cüzdan Bağlı
            </Badge>
          ) : (
            <Badge variant="destructive">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Cüzdan Bağlı Değil
            </Badge>
          )}
        </div>
      </div>

      {isConnected && <TransactionStatus />}

      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          {statusMessage}
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          {statusMessage}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-500" />
            Seyahat Bilgileri
          </CardTitle>
          <div className="flex items-center text-sm text-gray-600">
            <Info className="h-4 w-4 mr-2" />
            Seyahatiniz blockchain'e kaydedilecek ve yolcular tarafından görülebilecek
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                Seyahat Rotası <span className="text-red-500">*</span>
              </label>
              <Input
                name="route"
                value={formData.route}
                onChange={handleChange}
                placeholder="örn: İstanbul → Ankara"
                required
                disabled={isLoading}
              />
            </div>
        
            <div>
              <label className="block text-sm font-medium mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Seyahat Tarihi
              </label>
              <Input
                name="travelDate"
                type="date"
                value={formData.travelDate}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
        
            <div>
              <label className="block text-sm font-medium mb-2">
                <DollarSign className="h-4 w-4 inline mr-1" />
                Ücret (XLM) <span className="text-red-500">*</span>
              </label>
              <Input
                name="maxBudget"
                type="number"
                value={formData.maxBudget}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
                disabled={isLoading}
              />
            </div>
        
            <div>
              <label className="block text-sm font-medium mb-2">
                Seyahat Detayları <span className="text-red-500">*</span>
              </label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Seyahat detaylarınızı, bagaj kapasitesi, özel istekler veya ek bilgileri buraya yazın..."
                rows={4}
                required
                disabled={isLoading}
              />
            </div>
        
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/products')}
                className="flex-1"
                disabled={isLoading}
              >
                İptal
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !isConnected}
                className="flex-1"
              >
                {isLoading ? 'Ekleniyor...' : 'Seyahat Ekle'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProduct; 