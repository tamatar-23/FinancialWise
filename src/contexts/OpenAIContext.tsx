
import React, { createContext, useContext } from 'react';

// The Gemini API key is hardcoded for all users
const GEMINI_API_KEY = "AIzaSyDY3SKcBrmkUTi4jIQhZnG_NDU0dZWKpfM";

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
  // Fixed Gemini API key for all users
  const apiKey = GEMINI_API_KEY;

  const value = {
    apiKey,
    isKeySet: true // Always true since we're using a hardcoded API key
  };

  return <OpenAIContext.Provider value={value}>{children}</OpenAIContext.Provider>;
};
