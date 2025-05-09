
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut
} from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { toast } from "sonner";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  isGuestMode: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  enableGuestMode: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuestMode, setIsGuestMode] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setIsGuestMode(false);
      toast.success("Account created successfully");
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error("Failed to create account. Please try again.");
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsGuestMode(false);
      toast.success("Signed in successfully");
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error("Failed to sign in. Please check your credentials.");
      throw error;
    }
  };
  
  const enableGuestMode = () => {
    setIsGuestMode(true);
    toast.success("Guest mode enabled. Your data won't be saved.");
  };

  const logout = async () => {
    try {
      if (currentUser) {
        await signOut(auth);
        toast.success("Signed out successfully");
      }
      // Reset guest mode as well when logging out
      setIsGuestMode(false);
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out. Please try again.");
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    isGuestMode,
    signUp,
    signIn,
    enableGuestMode,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
