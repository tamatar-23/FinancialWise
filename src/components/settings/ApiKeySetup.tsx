
import { useState } from 'react';
import { useOpenAI } from '../../contexts/OpenAIContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const ApiKeySetup = () => {
  const { apiKey, setApiKey, isKeySet } = useOpenAI();
  const { currentUser } = useAuth();
  const [key, setKey] = useState(apiKey);
  const [isEditing, setIsEditing] = useState(!isKeySet);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiKey(key);
    setIsEditing(false);
    toast.success("API key saved successfully");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>OpenAI API Key</CardTitle>
        <CardDescription>
          Your API key is required to use the AI-powered features of this application.
          It is stored securely in your browser's local storage.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          {isEditing ? (
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="sk-..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground mt-2">
                You can get your API key from{' '}
                <a 
                  href="https://platform.openai.com/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  OpenAI's dashboard
                </a>
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                value="••••••••••••••••••••••••••••••••"
                disabled
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {isEditing ? (
            <Button type="submit">Save API Key</Button>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)}>Change API Key</Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};

export default ApiKeySetup;
