
import React, { createContext, useContext, useState } from 'react';

interface OpenAIContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  isKeySet: boolean;
}

const OpenAIContext = createContext<OpenAIContextType | undefined>(undefined);

export function useOpenAI() {
  const context = useContext(OpenAIContext);
  if (context === undefined) {
    throw new Error('useOpenAI must be used within an OpenAIProvider');
  }
  return context;
}

export const OpenAIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, setApiKey] = useState<string>(() => {
    // Try to get API key from localStorage
    const savedKey = localStorage.getItem('openai_api_key');
    return savedKey || '';
  });

  const handleSetApiKey = (key: string) => {
    setApiKey(key);
    // Save to localStorage
    localStorage.setItem('openai_api_key', key);
  };

  const value = {
    apiKey,
    setApiKey: handleSetApiKey,
    isKeySet: apiKey !== ''
  };

  return <OpenAIContext.Provider value={value}>{children}</OpenAIContext.Provider>;
};
