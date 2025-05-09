
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { currentUser } = useAuth();
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        {currentUser && <Sidebar />}
        <main className={`flex-1 p-4 md:p-6 ${currentUser ? 'ml-0 md:ml-64' : ''}`}>
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
