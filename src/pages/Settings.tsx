
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ApiKeySetup from '@/components/settings/ApiKeySetup';

const Settings = () => {
  const { currentUser, logout } = useAuth();
  
  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Manage your account details</CardDescription>
          </CardHeader>
          <CardContent>
            {currentUser && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Email</p>
                  <p>{currentUser.email}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="destructive" size="sm" onClick={logout}>
                    Sign Out
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>Manage your API keys for the application</CardDescription>
          </CardHeader>
          <CardContent>
            <ApiKeySetup />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
            <CardDescription>Application information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Application Name</p>
                <p>FinancialWise</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Version</p>
                <p>1.0.0</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Description</p>
                <p>
                  FinancialWise is an AI-powered financial planning application designed to help users budget effectively, 
                  develop investment strategies, improve financial literacy, and track their overall financial health.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
