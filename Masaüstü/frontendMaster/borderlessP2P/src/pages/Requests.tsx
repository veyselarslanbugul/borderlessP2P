import React from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, ClipboardList } from "lucide-react";

const Requests = () => {
  // Tab options
  const tabs = [
    { id: 'active', label: 'Active' },
    { id: 'inactive', label: 'Inactive' },
    { id: 'archived', label: 'Archived' },
  ];

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 lg:py-12 pb-24 max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-7xl">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold mb-6">Requests</h1>
          
          <Link
            to="/create-request"
            className="bg-yellow-400 hover:bg-yellow-500 text-black p-3 rounded-full shadow-lg transition-colors"
            aria-label="Create new request"
          >
            <Plus className="h-6 w-6" />
          </Link>
        </div>
        
        {/* Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <div className="bg-muted/50 p-1 rounded-2xl mb-6">
            <TabsList className="w-full bg-transparent gap-1">
              {tabs.map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="data-[state=active]:bg-white data-[state=active]:text-secondary rounded-xl"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-0">
              {/* Empty state */}
              <Card className="shadow-xs">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="text-6xl mb-4">📋</div>
                  <h2 className="text-lg font-bold mb-2">No Requests Yet</h2>
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                    You don't have any requests yet.
                  </p>
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                    Create a new request with the ➕ button in the top right.
                  </p>
                  
                  <Button asChild className="bg-yellow-400 hover:bg-yellow-500 text-black">
                    <Link to="/create-request">
                      Create New Request
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Requests; 