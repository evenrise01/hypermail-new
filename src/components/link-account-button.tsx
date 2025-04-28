"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { getAurinkoAuthUrl } from "@/lib/aurinko";

// Make sure this import matches what's in your lib/aurinko.ts
// If your function accepts specific provider IDs, you need to match those types
import { ChevronRight, Loader2 } from "lucide-react";

const LinkAccountButton = () => {
  // Define a type for valid provider IDs
  type ProviderID = 'Office365' | 'Google';
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ProviderID | null>(null);
  
  const providers = [
    { id: 'Office365' as ProviderID, name: 'Microsoft 365', icon: '/outlook.svg' },
    { id: 'Google' as ProviderID, name: 'Gmail', icon: '/gmail.svg' }
  ];

  const handleConnect = async (providerId: ProviderID) => {
    setIsLoading(true);
    setSelectedProvider(providerId);
    
    try {
      const authUrl = await getAurinkoAuthUrl(providerId);
      window.location.href = authUrl;
    } catch (error) {
      console.error("Error getting auth URL:", error);
      setIsLoading(false);
      setSelectedProvider(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="mb-2 text-lg font-medium text-gray-200">Choose your email provider</h2>
        <p className="text-sm text-gray-400">
          We&apos;ll securely connect to your email to help you track important conversations
        </p>
      </div>

      <div className="space-y-3">
        {providers.map((provider) => (
          <Button
            key={provider.id}
            onClick={() => handleConnect(provider.id)}
            disabled={isLoading}
            className="relative flex w-full items-center justify-between bg-gray-800 px-4 py-6 hover:bg-gray-700 hover:text-green-400"
            variant="outline"
          >
            <div className="flex items-center gap-3">
              {renderProviderIcon(provider.icon)}
              <span className="font-medium">{provider.name}</span>
            </div>
            
            {isLoading && selectedProvider === provider.id ? (
              <Loader2 className="h-5 w-5 animate-spin text-green-400" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-400" />
            )}
          </Button>
        ))}
      </div>
      
      <p className="mt-4 text-center text-xs text-gray-500">
        Your credentials are securely handled through OAuth. We never store your passwords.
      </p>
    </div>
  );
};

const renderProviderIcon = (icon: string) => {
  return (
    <div className="flex h-6 w-6 items-center justify-center">
      <img src={icon} alt="Provider icon" className="h-6 w-6" />
    </div>
  );
};

export default LinkAccountButton;