
import React, { createContext, useContext } from 'react';

// The API key will be hardcoded in the environment or set once by the application owner
const OPENAI_API_KEY = ""; // This will be provided by the application owner

interface OpenAIContextType {
  apiKey: string;
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
  // Fixed API key - application owner will set this value
  const apiKey = OPENAI_API_KEY;

  const value = {
    apiKey,
    isKeySet: apiKey !== ''
  };

  return <OpenAIContext.Provider value={value}>{children}</OpenAIContext.Provider>;
};
