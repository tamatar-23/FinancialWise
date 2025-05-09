
import { Link, useLocation } from 'react-router-dom';
import { 
  Calculator, 
  ChartPie, 
  MessageCircle, 
  User,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: <ChartPie size={20} />
    },
    {
      path: '/budget',
      name: 'Budget',
      icon: <Calculator size={20} />
    },
    {
      path: '/investment',
      name: 'Investment',
      icon: <ChartPie size={20} />
    },
    {
      path: '/chat',
      name: 'Finance Chat',
      icon: <MessageCircle size={20} />
    },
    {
      path: '/profile',
      name: 'Profile',
      icon: <User size={20} />
    },
    {
      path: '/settings',
      name: 'Settings',
      icon: <Settings size={20} />
    }
  ];
  
  return (
    <aside className="hidden md:block fixed top-[61px] left-0 w-64 h-[calc(100vh-61px)] bg-background border-r border-border overflow-y-auto">
      <div className="py-6">
        <ul className="space-y-2 px-3">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-md transition-colors",
                  location.pathname === item.path 
                    ? "bg-primary text-primary-foreground" 
                    : "text-foreground hover:bg-secondary"
                )}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
