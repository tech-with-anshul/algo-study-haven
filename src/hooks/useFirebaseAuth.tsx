
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider, twitterProvider, githubProvider } from '@/lib/firebase';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithTwitter: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const FirebaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Sync Firebase user with Supabase
        await syncWithSupabase(firebaseUser);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const syncWithSupabase = async (firebaseUser: User) => {
    try {
      // Check if user exists in Supabase profiles table
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', firebaseUser.email)
        .single();

      if (!existingProfile) {
        // Create new profile in Supabase
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: firebaseUser.uid,
            email: firebaseUser.email,
            full_name: firebaseUser.displayName,
            avatar_url: firebaseUser.photoURL
          });

        if (profileError) {
          console.error('Error creating Supabase profile:', profileError);
        }

        // Create initial game state
        const { error: gameStateError } = await supabase
          .from('game_state')
          .insert({
            user_id: firebaseUser.uid
          });

        if (gameStateError) {
          console.error('Error creating game state:', gameStateError);
        }
      }
    } catch (error) {
      console.error('Error syncing with Supabase:', error);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "⚔️ Welcome Back, Hero!",
        description: "Your coding adventure continues!",
        duration: 3000,
      });
    } catch (error: any) {
      toast({
        title: "❌ Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({
        title: "🎉 Welcome to the Adventure!",
        description: "Your coding quest begins now!",
        duration: 5000,
      });
    } catch (error: any) {
      toast({
        title: "❌ Sign Up Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast({
        title: "🚀 Google Sign In Successful!",
        description: "Welcome to your coding adventure!",
        duration: 3000,
      });
    } catch (error: any) {
      toast({
        title: "❌ Google Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signInWithTwitter = async () => {
    try {
      await signInWithPopup(auth, twitterProvider);
      toast({
        title: "🐦 Twitter Sign In Successful!",
        description: "Welcome to your coding adventure!",
        duration: 3000,
      });
    } catch (error: any) {
      toast({
        title: "❌ Twitter Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signInWithGithub = async () => {
    try {
      await signInWithPopup(auth, githubProvider);
      toast({
        title: "🐙 GitHub Sign In Successful!",
        description: "Welcome to your coding adventure!",
        duration: 3000,
      });
    } catch (error: any) {
      toast({
        title: "❌ GitHub Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast({
        title: "👋 See You Later!",
        description: "Your progress has been saved.",
        duration: 3000,
      });
      // Force page reload for clean state
      window.location.href = '/auth';
    } catch (error: any) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signInWithTwitter,
      signInWithGithub,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useFirebaseAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
  }
  return context;
};
