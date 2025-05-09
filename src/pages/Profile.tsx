
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const getInitials = (email: string) => {
    return email?.substring(0, 2).toUpperCase() || 'U';
  };
  
  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your personal and account details</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                  {currentUser ? getInitials(currentUser.email || "") : <User size={36} />}
                </AvatarFallback>
              </Avatar>
              
              <h3 className="text-xl font-medium mb-2">
                {currentUser?.email?.split('@')[0]}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {currentUser?.email}
              </p>
              
              <div className="w-full space-y-2 mt-4">
                <div className="flex justify-between text-sm">
                  <span>Member since:</span>
                  <span className="font-medium">
                    {currentUser?.metadata.creationTime
                      ? new Date(currentUser.metadata.creationTime).toLocaleDateString()
                      : 'N/A'}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Last login:</span>
                  <span className="font-medium">
                    {currentUser?.metadata.lastSignInTime
                      ? new Date(currentUser.metadata.lastSignInTime).toLocaleDateString()
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button variant="outline" onClick={() => navigate('/settings')} className="w-full">
                Settings
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Overview</CardTitle>
              <CardDescription>Summary of your financial status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-secondary p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Current Budget</p>
                  <p className="text-xl font-bold">
                    <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/budget')}>
                      View Budget
                    </Button>
                  </p>
                </div>
                
                <div className="bg-secondary p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Investment Strategy</p>
                  <p className="text-xl font-bold">
                    <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/investment')}>
                      View Strategy
                    </Button>
                  </p>
                </div>
                
                <div className="bg-secondary p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Financial Score</p>
                  <p className="text-xl font-bold">
                    <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/score')}>
                      View Score
                    </Button>
                  </p>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button variant="outline" onClick={() => navigate('/budget')}>
                  Update Budget
                </Button>
                <Button variant="outline" onClick={() => navigate('/investment')}>
                  Review Investments
                </Button>
                <Button variant="outline" onClick={() => navigate('/score')}>
                  Recalculate Score
                </Button>
                <Button variant="outline" onClick={() => navigate('/chat')}>
                  Ask Financial Questions
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Financial Goals</CardTitle>
              <CardDescription>Track your progress toward financial targets</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Goals tracking will be available in an upcoming feature update.
              </p>
              <Button disabled>Coming Soon</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
