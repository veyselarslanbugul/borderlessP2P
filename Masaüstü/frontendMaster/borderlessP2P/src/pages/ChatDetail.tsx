import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, PaperclipIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
  read: boolean;
}

const ChatDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Array<{
    id: number;
    text: string;
    sender: string;
    timestamp: string;
  }>>([
    {
      id: 1,
      text: "Merhaba! Bu ürün hala mevcut mu?",
      sender: "other",
      timestamp: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      text: "Evet, hala mevcut. Fiyatta pazarlık yapabiliriz.",
      sender: "user",
      timestamp: "2024-01-15T10:32:00Z"
    }
  ]);
  
  // Mock chat data - in real app, fetch from API or blockchain
  const [chat] = useState({
    id: id || '1',
    contactName: 'Ali S.',
    contactAddress: 'G...456',
    messages: [
      {
        id: '1',
        text: 'Merhaba!',
        sender: 'other',
        timestamp: '14:20',
        read: true
      },
      {
        id: '2',
        text: 'iPhone için yazıyorum',
        sender: 'other',
        timestamp: '14:20',
        read: true
      },
      {
        id: '3',
        text: 'Merhaba, evet hala satılık',
        sender: 'me',
        timestamp: '14:22',
        read: true
      },
      {
        id: '4',
        text: 'Harika, ne zaman teslim edebilirsiniz?',
        sender: 'other',
        timestamp: '14:25',
        read: true
      }
    ] as Message[]
  });

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        text: newMessage,
        sender: 'user',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-screen pb-16">
      {/* Header */}
      <div className="flex items-center p-4 border-b">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2"
          onClick={() => navigate('/chat')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-medium">{chat.contactName}</h1>
          <p className="text-xs text-gray-500">{chat.contactAddress}</p>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.messages.map((message) => (
          <div 
            key={message.id}
            className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[75%] rounded-lg px-4 py-2 ${
                message.sender === 'me' 
                  ? 'bg-yellow-400 text-black' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
              }`}
            >
              <p>{message.text}</p>
              <div className="flex justify-end items-center mt-1">
                <span className="text-xs opacity-70">{message.timestamp}</span>
                {message.sender === 'me' && (
                  <span className="ml-1 text-xs">
                    {message.read ? '✓✓' : '✓'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Input */}
      <div className="border-t p-2 bg-white dark:bg-gray-900 flex items-center">
        <Button variant="ghost" size="icon" className="text-gray-500">
          <PaperclipIcon className="h-5 w-5" />
        </Button>
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Mesaj yazın..."
          className="flex-1 mx-2 bg-gray-100 dark:bg-gray-800 border-0"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <Button 
          size="icon" 
          className="bg-yellow-400 hover:bg-yellow-500 text-black"
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatDetail; 