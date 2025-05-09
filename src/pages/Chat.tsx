
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useOpenAI } from '../contexts/OpenAIContext';
import { callOpenAI } from '../services/openai';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chat = () => {
  const { currentUser } = useAuth();
  const { apiKey, isKeySet } = useOpenAI();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your financial literacy assistant. Ask me any questions about budgeting, saving, investments, or other financial topics.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isKeySet) {
      toast.error("OpenAI API key not configured. Please contact the administrator.");
      return;
    }
    
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setInput('');
    
    // Add user message to chat
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    
    setLoading(true);
    
    try {
      // Create prompt with financial literacy context
      const prompt = `
        I need information about the following financial question or topic:
        
        ${userMessage}
        
        Please provide a clear, educational response that helps improve financial literacy. 
        If it's a complex topic, break it down in simple terms. 
        If appropriate, include practical advice or examples.
      `;
      
      const response = await callOpenAI(prompt, apiKey);
      
      // Add assistant response to chat
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error getting chat response:', error);
      toast.error("Failed to get response");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold mb-6">Financial Literacy Chatbot</h1>
      
      <Card className="w-full h-[calc(100vh-220px)] flex flex-col">
        <CardHeader>
          <CardTitle>Financial Assistant</CardTitle>
          <CardDescription>
            Ask me anything about personal finance, budgeting, investments, or financial terms
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col overflow-hidden">
          <div className="flex-grow overflow-y-auto pr-1 mb-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about finance..."
              disabled={loading || !isKeySet}
            />
            <Button type="submit" disabled={loading || !isKeySet || !input.trim()}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full" />
                  <span className="hidden sm:block">Thinking</span>
                </span>
              ) : (
                <Send size={18} />
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>Example questions you can ask:</p>
        <div className="mt-2 flex flex-wrap gap-2 justify-center">
          <button
            className="bg-secondary px-3 py-1 rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => setInput("What's the difference between stocks and bonds?")}
          >
            Stocks vs. bonds?
          </button>
          <button
            className="bg-secondary px-3 py-1 rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => setInput("How do I start an emergency fund?")}
          >
            Starting an emergency fund?
          </button>
          <button
            className="bg-secondary px-3 py-1 rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => setInput("Explain compound interest in simple terms")}
          >
            Explain compound interest
          </button>
          <button
            className="bg-secondary px-3 py-1 rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => setInput("What is the 50/30/20 budgeting rule?")}
          >
            50/30/20 budgeting rule?
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
