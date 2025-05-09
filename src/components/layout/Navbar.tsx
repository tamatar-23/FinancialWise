
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, X, User } from 'lucide-react';
import { toast } from 'sonner';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className="bg-background border-b border-muted py-3 px-4 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-foreground font-medium text-2xl flex items-center">
          <span className="text-primary font-bold">Financial</span>
          <span className="text-accent">Wise</span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6">
          {currentUser ? (
            <>
              <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors">Dashboard</Link>
              <Link to="/budget" className="text-foreground hover:text-primary transition-colors">Budget</Link>
              <Link to="/investment" className="text-foreground hover:text-primary transition-colors">Investment</Link>
              <Link to="/chat" className="text-foreground hover:text-primary transition-colors">Chat</Link>
              <Link to="/profile" className="text-foreground hover:text-primary transition-colors">Profile</Link>
              <Button variant="ghost" onClick={handleLogout} className="text-foreground hover:text-primary">Logout</Button>
            </>
          ) : (
            <>
              <Link to="/features" className="text-foreground hover:text-primary transition-colors">Features</Link>
              <Link to="/about" className="text-foreground hover:text-primary transition-colors">About</Link>
              <Link to="/login">
                <Button variant="outline" className="mr-2">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background py-4 px-4 absolute top-full left-0 w-full shadow-md animate-slide-in">
          {currentUser ? (
            <>
              <Link to="/dashboard" className="block py-2 text-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
              <Link to="/budget" className="block py-2 text-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>Budget</Link>
              <Link to="/investment" className="block py-2 text-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>Investment</Link>
              <Link to="/chat" className="block py-2 text-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>Chat</Link>
              <Link to="/profile" className="block py-2 text-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>Profile</Link>
              <Button variant="ghost" onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full justify-start py-2 text-foreground hover:text-primary">Logout</Button>
            </>
          ) : (
            <>
              <Link to="/features" className="block py-2 text-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>Features</Link>
              <Link to="/about" className="block py-2 text-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>About</Link>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full mt-2">Login</Button>
              </Link>
              <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full mt-2">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
