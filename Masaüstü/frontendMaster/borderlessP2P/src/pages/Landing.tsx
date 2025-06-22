import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Landing = () => {
  const features = [
    {
      id: 1,
      title: "get from anywhere in the world",
      description: "",
      color: "bg-yellow-200",
      textColor: "text-gray-800"
    },
    {
      id: 2,
      title: "Your products are safe until they reach you",
      description: "",
      color: "bg-pink-200", 
      textColor: "text-gray-800"
    },
    {
      id: 3,
      title: "Match quickly with the most suitable users",
      description: "",
      color: "bg-purple-200",
      textColor: "text-gray-800"
    },
    {
      id: 4,
      title: "Bring what's requested, earn and travel more!",
      description: "",
      color: "bg-blue-200",
      textColor: "text-gray-800"
    }
  ];

  const steps = [
    {
      id: 1,
      category: "MATCHING",
      title: "Fast Shopping",
      description: "Match with the most suitable travels and reach your order faster.",
      icon: "🔗",
      bgColor: "bg-blue-100"
    },
    {
      id: 2,
      category: "AGREEMENT", 
      title: "Agree with Product Bringer",
      description: "Browse matched travels and start talking with bringers, agree on details.",
      icon: "🤝",
      bgColor: "bg-blue-100"
    },
    {
      id: 3,
      category: "PAYMENT",
      title: "Pay Safely", 
      description: "Make your payment to Glocalzone for the bringer to purchase products. Your money stays safe in Glocalzone until you receive your order.",
      icon: "💳",
      bgColor: "bg-blue-100"
    },
    {
      id: 4,
      category: "DELIVERY",
      title: "Receive Order & Confirm",
      description: "Agree on delivery details with the bringer, receive the product and give approval for payment transfer to the bringer.",
      icon: "📦",
      bgColor: "bg-blue-100"
    }
  ];

  const tabs = [
    { id: 'product', label: 'Product Requester', active: true },
    { id: 'traveler', label: 'Product Bringer', active: false }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              Limitless World
            </h1>
            <div className="flex items-center gap-2 md:gap-4">
              <Button variant="ghost" size="sm" className="text-sm md:text-base">
                Discover
              </Button>
              <Button variant="ghost" size="sm" className="text-sm md:text-base">
                Help
              </Button>
              <Button variant="ghost" size="sm" className="text-sm md:text-base">
                Security
              </Button>
              <Button variant="ghost" size="sm" className="text-sm md:text-base">
                Download
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                className="bg-gray-800 hover:bg-gray-700 text-white text-sm md:text-base"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Feature Cards */}
      <section className="container mx-auto px-4 py-6 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
          {features.map((feature) => (
            <Card key={feature.id} className={`${feature.color} border-0 shadow-sm`}>
              <CardContent className="p-4 md:p-6">
                <p className={`${feature.textColor} text-sm md:text-base font-medium leading-relaxed`}>
                  {feature.title}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8 md:mb-12">
          <div className="flex bg-white rounded-lg p-1 shadow-sm border">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={tab.active ? "default" : "ghost"}
                size="sm"
                className={`px-4 md:px-6 py-2 text-sm md:text-base ${
                  tab.active 
                    ? "bg-gray-800 text-white" 
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            How It Works?
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step) => (
            <Card key={step.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                {/* Icon */}
                <div className={`w-16 h-16 md:w-20 md:h-20 ${step.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-2xl md:text-3xl">{step.icon}</span>
                </div>
                
                {/* Category */}
                <div className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  {step.category}
                </div>
                
                {/* Title */}
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3">
                  {step.title}
                </h3>
                
                {/* Description */}
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12 md:mt-16">
          <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
            <Button 
              asChild
              size="lg"
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            >
              <Link to="/home">
                Start Shopping
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline"
              size="lg" 
              className="w-full md:w-auto border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3"
            >
              <Link to="/create-product">
                Add Travel
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t mt-16 md:mt-24">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="#" className="hover:text-blue-600">How It Works</Link></li>
                <li><Link to="#" className="hover:text-blue-600">Security</Link></li>
                <li><Link to="#" className="hover:text-blue-600">Fees</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="#" className="hover:text-blue-600">Help Center</Link></li>
                <li><Link to="#" className="hover:text-blue-600">Contact</Link></li>
                <li><Link to="#" className="hover:text-blue-600">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="#" className="hover:text-blue-600">About Us</Link></li>
                <li><Link to="#" className="hover:text-blue-600">Careers</Link></li>
                <li><Link to="#" className="hover:text-blue-600">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="#" className="hover:text-blue-600">Privacy</Link></li>
                <li><Link to="#" className="hover:text-blue-600">Terms</Link></li>
                <li><Link to="#" className="hover:text-blue-600">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2024 BorderlessP2P. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing; 