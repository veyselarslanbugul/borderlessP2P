import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Orders = () => {
  // Tab options
  const tabs = [
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' },
    { id: 'canceled', label: 'Canceled' },
  ];

  // Mock orders data
  const mockOrders = [
    {
      id: '1',
      productName: 'iPhone 15 Pro',
      counterparty: 'G...456',
      isCounterpartySeller: true,
      amount: '2,500',
      status: 'Shipping',
      date: 'Oct 12, 2023',
      type: 'active'
    },
    {
      id: '2',
      productName: 'Nike Air Jordan',
      counterparty: 'G...789',
      isCounterpartySeller: false,
      amount: '150',
      status: 'In Escrow',
      date: 'Oct 15, 2023',
      type: 'active'
    },
    {
      id: '3',
      productName: 'Apple Watch',
      counterparty: 'G...123',
      isCounterpartySeller: true,
      amount: '800',
      status: 'Delivered',
      date: 'Oct 5, 2023',
      type: 'completed'
    },
    {
      id: '4',
      productName: 'Samsung Galaxy S23',
      counterparty: 'G...567',
      isCounterpartySeller: true,
      amount: '1,800',
      status: 'Canceled',
      date: 'Oct 1, 2023',
      type: 'canceled'
    }
  ];

  // Filter orders by tab
  const getOrdersByType = (type: string) => {
    return mockOrders.filter(order => order.type === type);
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-24 max-w-md">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      
      {/* Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl mb-6">
          <TabsList className="w-full bg-transparent gap-1">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.id}
                value={tab.id}
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-black dark:data-[state=active]:text-white rounded-xl"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-0">
            {getOrdersByType(tab.id).length > 0 ? (
              <div className="space-y-4">
                {getOrdersByType(tab.id).map((order) => (
                  <Card key={order.id} className="shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{order.productName}</h3>
                          <Badge 
                            variant={
                              order.status === 'Delivered' ? 'secondary' : 
                              order.status === 'Canceled' ? 'destructive' : 
                              'outline'
                            }
                            className={order.status === 'Delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : ''}
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {order.isCounterpartySeller ? 'Seller: ' : 'Buyer: '}{order.counterparty}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold">{order.amount} XLM</span>
                          <span className="text-xs text-gray-500">{order.date}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="shadow-sm">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <p className="mb-2">No orders found in this category.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Orders; 