import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useBlockchain } from '@/contexts/BlockchainContext';
import { ArrowLeft, Package, DollarSign, MapPin, Calendar, FileText } from 'lucide-react';

const CreateRequest: React.FC = () => {
  const { publicKey } = useWallet();
  const navigate = useNavigate();
  const { addRequest } = useBlockchain();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    location: '',
    deadline: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await addRequest({
        title: formData.title,
        description: formData.description,
        budget: parseFloat(formData.budget) || 0,
        location: formData.location,
        deadline: formData.deadline,
        status: 'Active'
      });

      navigate('/requests');
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Failed to create request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Redirect if not connected
  if (!publicKey) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-md mx-auto text-center">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Sipariş oluşturmak için cüzdanınızı bağlayın.
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
    <div className="container mx-auto px-4 py-6 md:py-8 lg:py-12 pb-24 max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-7xl">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-extrabold">Create Product Request</h1>
            <p className="text-muted-foreground">Tell us what you're looking for</p>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Product Request Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Request Title *
                </label>
                <Input
                  id="title"
                  type="text"
                  placeholder="What are you looking for?"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description *
                </label>
                <Textarea
                  id="description"
                  placeholder="Describe your requirements in detail..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <label htmlFor="budget" className="text-sm font-medium">
                  Budget (XLM) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="budget"
                    type="number"
                    placeholder="0.00"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    required
                    className="h-12 pl-10"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    type="text"
                    placeholder="Where do you need this?"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="h-12 pl-10"
                  />
                </div>
              </div>

              {/* Deadline */}
              <div className="space-y-2">
                <label htmlFor="deadline" className="text-sm font-medium">
                  Deadline
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    className="h-12 pl-10"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                    Creating Request...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Create Request
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateRequest; 