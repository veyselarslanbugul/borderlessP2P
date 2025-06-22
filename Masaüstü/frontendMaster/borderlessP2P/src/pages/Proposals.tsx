import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface Proposal {
  id: string;
  title: string;
  creator: string;
  status: 'active' | 'passed' | 'rejected' | 'expired';
  endDate: string;
  votesFor: number;
  votesAgainst: number;
  description: string;
}

const Proposals = () => {
  // Mock proposals data - in real app, fetch from blockchain
  const proposals: Proposal[] = [
    {
      id: '1',
      title: 'Komisyon Oranı Düşürülmesi',
      creator: 'G...456',
      status: 'active',
      endDate: '2 gün sonra',
      votesFor: 120,
      votesAgainst: 45,
      description: 'Platform komisyon oranının %2\'den %1.5\'e düşürülmesi önerisi.'
    },
    {
      id: '2',
      title: 'IPFS Entegrasyonu',
      creator: 'G...123',
      status: 'passed',
      endDate: '5 gün önce',
      votesFor: 230,
      votesAgainst: 12,
      description: 'Teslimat kanıtları için IPFS entegrasyonu eklenmesi.'
    },
    {
      id: '3',
      title: 'Yeni NFT Rozeti',
      creator: 'G...789',
      status: 'rejected',
      endDate: '1 hafta önce',
      votesFor: 67,
      votesAgainst: 89,
      description: 'Premium satıcılar için yeni bir NFT rozeti eklenmesi.'
    }
  ];

  // Helper function to render status badge
  const renderStatusBadge = (status: Proposal['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">Oylama Açık</Badge>;
      case 'passed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Kabul Edildi</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Reddedildi</Badge>;
      case 'expired':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100">Süresi Doldu</Badge>;
      default:
        return null;
    }
  };

  // Helper function to calculate vote percentage
  const calculateVotePercentage = (votesFor: number, votesAgainst: number) => {
    const total = votesFor + votesAgainst;
    if (total === 0) return 0;
    return Math.round((votesFor / total) * 100);
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 lg:py-12 pb-24 max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-7xl">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">DAO Önerileri</h1>
          <Button 
            asChild
            size="sm"
            className="bg-yellow-400 hover:bg-yellow-500 text-black"
          >
            <Link to="/create-proposal">
              <Plus className="h-4 w-4 mr-1" />
              Yeni Öneri
            </Link>
          </Button>
        </div>
        
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <Card key={proposal.id} className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{proposal.title}</h3>
                    {renderStatusBadge(proposal.status)}
                  </div>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Oluşturan: {proposal.creator}
                  </div>
                  
                  <p className="text-sm">{proposal.description}</p>
                  
                  {proposal.status === 'active' && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Oylar: {proposal.votesFor} lehte / {proposal.votesAgainst} aleyhte</span>
                        <span>{calculateVotePercentage(proposal.votesFor, proposal.votesAgainst)}% Kabul</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full" 
                          style={{ width: `${calculateVotePercentage(proposal.votesFor, proposal.votesAgainst)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">
                      {proposal.status === 'active' ? 'Bitiş: ' : 'Sonuçlandı: '} 
                      {proposal.endDate}
                    </span>
                    
                    <Link 
                      to={`/proposals/${proposal.id}`}
                      className="text-sm font-medium text-yellow-600 hover:text-yellow-700 dark:text-yellow-400"
                    >
                      Detay
                    </Link>
                  </div>
                  
                  {proposal.status === 'active' && (
                    <div className="flex gap-2 mt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                      >
                        Kabul
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        Ret
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Proposals; 