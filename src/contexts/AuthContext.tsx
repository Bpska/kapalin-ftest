import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  phoneNumber?: string;
  bio?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phoneNumber?: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthContext useEffect triggered');
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        setSession(session);
        
        if (session?.user) {
          // Defer profile fetch to avoid blocking auth state changes
          setTimeout(async () => {
            try {
              console.log('Fetching user profile for:', session.user.id);
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();
              
              if (error) {
                console.error('Profile fetch error:', error);
              }
              
              console.log('Profile fetch result:', profile);
              
              setUser({
                id: session.user.id,
                name: profile?.name || session.user.email?.split('@')[0] || '',
                email: session.user.email || '',
                phoneNumber: profile?.phone || undefined,
                bio: profile?.bio || undefined,
                photoURL: profile?.avatar_url || undefined,
                createdAt: profile?.created_at ? new Date(profile.created_at) : new Date(),
                updatedAt: profile?.updated_at ? new Date(profile.updated_at) : new Date()
              });
              console.log('User state updated');
            } catch (error) {
              console.error('Error fetching profile:', error);
              // Set basic user info even if profile fetch fails
              setUser({
                id: session.user.id,
                name: session.user.email?.split('@')[0] || '',
                email: session.user.email || '',
              });
            }
          }, 0);
        } else {
          setUser(null);
          console.log('User logged out');
        }
        setLoading(false);
        console.log('Auth loading set to false');
      }
    );

    // Check for existing session
    console.log('Checking for existing session');
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Existing session check result:', session?.user?.id);
      if (session) {
        setSession(session);
        // The auth state change listener will handle user profile fetching
      } else {
        setLoading(false);
        console.log('No existing session, loading set to false');
      }
    }).catch((error) => {
      console.error('Error checking session:', error);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    // User state will be updated by the auth state listener
  };

  const register = async (name: string, email: string, password: string, phoneNumber?: string): Promise<void> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name,
            phone: phoneNumber
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        throw error;
      }

      console.log('Registration successful:', data);
      // Profile will be created automatically by the trigger
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    
    setUser(null);
    setSession(null);
  };

  const value = {
    user,
    session,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!session?.user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};