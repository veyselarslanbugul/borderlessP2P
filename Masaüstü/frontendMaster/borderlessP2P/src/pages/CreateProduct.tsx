import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlockchain } from '../contexts/BlockchainContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { TransactionStatus } from '../components/TransactionStatus';

const CreateProduct: React.FC = () => {
  const navigate = useNavigate();
  const { addProduct, isLoading, error, isConnected } = useBlockchain();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    estimatedDelivery: '',
    details: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      alert('Lütfen önce cüzdanınızı bağlayın');
      return;
    }

    try {
      const product = await addProduct({
        name: formData.name,
        description: formData.description,
        price: formData.price,
        estimatedDelivery: formData.estimatedDelivery,
        details: formData.details
      });

      alert('Ürün başarıyla eklendi!');
      navigate('/products');
    } catch (error) {
      console.error('Failed to add product:', error);
      alert('Ürün eklenirken hata oluştu: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

    return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Yeni Ürün Ekle</h1>
        <p className="text-gray-600">Ürününüzü blockchain'e ekleyin</p>
      </div>

      {isConnected && <TransactionStatus />}

      <Card>
        <CardHeader>
          <CardTitle>Ürün Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Ürün Adı</label>
              <Input
                name="name"
                value={formData.name}
            onChange={handleChange}
                placeholder="Ürün adını girin"
            required
          />
        </div>
        
            <div>
              <label className="block text-sm font-medium mb-2">Açıklama</label>
              <Textarea
                name="description"
                value={formData.description}
            onChange={handleChange}
                placeholder="Ürün açıklamasını girin"
                rows={3}
            required
          />
        </div>
        
            <div>
              <label className="block text-sm font-medium mb-2">Fiyat (XLM)</label>
              <Input
                name="price"
                type="number"
                value={formData.price}
            onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
            required
          />
        </div>
        
            <div>
              <label className="block text-sm font-medium mb-2">Tahmini Teslimat</label>
              <Input
                name="estimatedDelivery"
                value={formData.estimatedDelivery}
            onChange={handleChange}
                placeholder="örn: 3-5 gün"
            required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Detaylar</label>
              <Textarea
                name="details"
                value={formData.details}
                onChange={handleChange}
                placeholder="Ek detaylar (opsiyonel)"
                rows={2}
          />
        </div>
        
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

        <div className="flex gap-4">
              <Button
            type="button"
                variant="outline"
            onClick={() => navigate('/products')}
                className="flex-1"
          >
            İptal
              </Button>
              <Button
            type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Ekleniyor...' : 'Ürün Ekle'}
              </Button>
        </div>
      </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProduct; 