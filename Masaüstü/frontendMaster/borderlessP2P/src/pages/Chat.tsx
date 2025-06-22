import React from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MapPin, Calendar, DollarSign, Plane } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBlockchain } from '../contexts/BlockchainContext';

// Define the Message type
interface Message {
  id: number;
  sender: 'me' | 'other';
  text: string;
  timestamp: string;
}

// Define the Conversation type
interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  unread: number;
  avatar: string;
  messages: Message[];
  sellerAddress?: string;
  productId?: string;
}

const Chat = () => {
  const { publicKey } = useWallet();
  const { products } = useBlockchain();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [activeConversation, setActiveConversation] = useState<number | null>(1);
  const [newMessage, setNewMessage] = useState('');
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Get URL parameters
  const productId = searchParams.get('product');
  const type = searchParams.get('type');
  const sellerAddress = location.pathname.split('/chat/')[1]?.split('?')[0];

  // Find the product if coming from product detail
  const travelProduct = productId ? products.find(p => p.id === productId) : null;

  // Mock conversations data
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      name: 'Ahmet Yılmaz',
      lastMessage: 'Ürün ne zaman gelir?',
      unread: 2,
      avatar: 'AY',
      messages: [
        { id: 1, sender: 'other', text: 'Merhaba, AirPods Pro siparişim hakkında bilgi almak istiyorum.', timestamp: '10:30' },
        { id: 2, sender: 'me', text: 'Merhaba! Tabii, hangi konuda yardımcı olabilirim?', timestamp: '10:32' },
        { id: 3, sender: 'other', text: 'Ürün ne zaman gelir acaba?', timestamp: '10:33' },
        { id: 4, sender: 'me', text: 'ABD\'den getiriyorum, tahmini 2 hafta içinde teslim edebilirim.', timestamp: '10:35' },
      ]
    },
    {
      id: 2,
      name: 'Zeynep Kaya',
      lastMessage: 'Teşekkür ederim!',
      unread: 0,
      avatar: 'ZK',
      messages: [
        { id: 1, sender: 'other', text: 'PlayStation 5 için teşekkürler, sorunsuz geldi!', timestamp: '09:15' },
        { id: 2, sender: 'me', text: 'Rica ederim, kullanımınız güzel olsun!', timestamp: '09:20' },
        { id: 3, sender: 'other', text: 'Teşekkür ederim!', timestamp: '09:21' },
      ]
    },
    {
      id: 3,
      name: 'Mehmet Demir',
      lastMessage: 'Fiyat konusunda anlaştık o zaman.',
      unread: 1,
      avatar: 'MD',
      messages: [
        { id: 1, sender: 'other', text: 'Merhaba, iPhone 15 Pro için pazarlık yapabilir miyiz?', timestamp: '14:40' },
        { id: 2, sender: 'me', text: 'Merhaba, ne kadar düşünüyorsunuz?', timestamp: '14:45' },
        { id: 3, sender: 'other', text: '32.000 TL olabilir mi?', timestamp: '14:47' },
        { id: 4, sender: 'me', text: '33.500 TL yapabilirim en fazla.', timestamp: '14:50' },
        { id: 5, sender: 'other', text: 'Fiyat konusunda anlaştık o zaman.', timestamp: '14:52' },
      ]
    }
  ]);

  // Create new conversation for travel request if needed
  useEffect(() => {
    if (travelProduct && sellerAddress && type === 'travel_request') {
      const sellerName = sellerAddress.slice(0, 6) + '...' + sellerAddress.slice(-4);
      const newConversation: Conversation = {
        id: Date.now(),
        name: sellerName,
        lastMessage: `Seyahat talebi: ${travelProduct.name}`,
        unread: 0,
        avatar: sellerName.slice(0, 2).toUpperCase(),
        messages: [
          {
            id: 1,
            sender: 'other',
            text: `Merhaba! ${travelProduct.name} seyahat talebim hakkında bilgi almak istiyorum.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ],
        sellerAddress: sellerAddress,
        productId: productId || undefined
      };
      
      setConversations(prev => [newConversation, ...prev]);
      setActiveConversation(newConversation.id);
    }
  }, [travelProduct, sellerAddress, type, productId]);

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation, conversations]);

  // Handle sending a new message
  const handleSendMessage = () => {
    if (newMessage.trim() === '' || activeConversation === null) return;

    const updatedConversations = [...conversations];
    const conversationIndex = updatedConversations.findIndex(c => c.id === activeConversation);
    
    if (conversationIndex !== -1) {
      const newMsg: Message = {
        id: updatedConversations[conversationIndex].messages.length + 1,
        sender: 'me',
        text: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      updatedConversations[conversationIndex].messages.push(newMsg);
      updatedConversations[conversationIndex].lastMessage = newMessage;
      
      setConversations(updatedConversations);
      setNewMessage('');
    }
  };

  if (!publicKey) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-md">
        <h1 className="text-2xl font-extrabold mb-6">Messages</h1>
        
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Please connect your wallet to view messages.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get the active conversation
  const activeChat = conversations.find(c => c.id === activeConversation);
  const activeTravelProduct = activeChat?.productId ? products.find(p => p.id === activeChat.productId) : null;

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 lg:py-12 pb-24 max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-7xl">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-extrabold mb-6">Messages</h1>
        
        {/* Travel Request Info Card */}
        {activeTravelProduct && (
          <Card className="mb-4 border-blue-200 bg-blue-50 dark:bg-blue-950/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Plane className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-800 dark:text-blue-200">Seyahat Talebi</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-700 dark:text-blue-300">{activeTravelProduct.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-700 dark:text-blue-300">Tarih: {activeTravelProduct.estimatedDelivery}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-700 dark:text-blue-300">Bütçe: {activeTravelProduct.price} XLM</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card className="overflow-hidden flex flex-col h-[500px] shadow-xs">
          {/* Conversation List */}
          <div className="border-b border-border overflow-x-auto">
            <div className="flex p-2">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setActiveConversation(conversation.id)}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg mr-2 relative flex-shrink-0 transition-all duration-200",
                    activeConversation === conversation.id
                      ? "bg-muted text-foreground"
                      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarFallback className="bg-accent text-accent-foreground text-sm">
                      {conversation.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{conversation.name}</span>
                  {conversation.unread > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
                    >
                      {conversation.unread}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-3">
            {activeChat?.messages.map((message, index) => (
              <div
                key={message.id}
                className={cn(
                  "flex animate-in fade-in-0",
                  message.sender === 'me' ? "justify-end" : "justify-start",
                  index > 0 ? "slide-in-from-bottom-1 delay-[30ms]" : ""
                )}
              >
                <div
                  className={cn(
                    "max-w-[70%] rounded-lg px-4 py-2 relative",
                    message.sender === 'me'
                      ? "bg-gradient-to-br from-primary to-primary/90 text-secondary rounded-br-none"
                      : "bg-muted text-foreground rounded-bl-none"
                  )}
                >
                  <p className="leading-relaxed">{message.text}</p>
                  <p className={cn(
                    "text-xs mt-1",
                    message.sender === 'me'
                      ? "text-secondary/70"
                      : "text-muted-foreground"
                  )}>
                    {message.timestamp}
                  </p>
                  <div 
                    className={cn(
                      "absolute bottom-0 w-2 h-2",
                      message.sender === 'me' 
                        ? "right-0 translate-x-full -translate-y-px border-t-8 border-r-8 border-transparent border-t-primary/90" 
                        : "left-0 -translate-x-full -translate-y-px border-t-8 border-l-8 border-transparent border-t-muted"
                    )}
                  />
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
          
          {/* Message Input */}
          <div className="border-t border-border p-3 flex items-center gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 rounded-full border-border focus-visible:ring-accent"
            />
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="rounded-full h-10 w-10 bg-gradient-to-r from-primary to-primary/90 text-secondary hover:from-primary hover:to-primary"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Chat; 