import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { cleanupAuthState } from '@/lib/authCleanup';

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
  loginWithGoogle: () => Promise<void>;
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
                createdAt: profile?.created_at ? new Date(profile?.created_at) : new Date(),
                updatedAt: profile?.updated_at ? new Date(profile?.updated_at) : new Date()
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
    // Ensure clean auth state before login
    cleanupAuthState();
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch { }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }
    // Auth state listener will handle session/user updates
  };

  const register = async (name: string, email: string, password: string, phoneNumber?: string): Promise<void> => {
    const maxRetries = 3;
    let lastError: any;

    // Clean stale sessions before sign up to avoid limbo states
    cleanupAuthState();
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch { }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Registration attempt ${attempt}/${maxRetries}`);
        const redirectUrl = `${window.location.origin}/`;

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              name,
              phone: phoneNumber,
            },
          },
        });

        if (error) {
          console.error(`Registration error (attempt ${attempt}):`, error);
          lastError = error as any;
          const msg = (error as any)?.message || '';
          if (
            attempt < maxRetries &&
            (msg.includes('503') ||
              msg.includes('Service Unavailable') ||
              msg.includes('upstream connect error'))
          ) {
            console.log(`Retrying in ${attempt * 1000}ms...`);
            await new Promise((r) => setTimeout(r, attempt * 1000));
            continue;
          }
          throw error;
        }

        console.log('Registration successful:', data);
        return; // Success, exit retry loop
      } catch (error: any) {
        console.error(`Registration failed (attempt ${attempt}):`, error);
        lastError = error;
        const msg = error?.message || '';
        if (
          attempt < maxRetries &&
          (msg.includes('503') ||
            msg.includes('Service Unavailable') ||
            msg.includes('upstream connect error'))
        ) {
          console.log(`Retrying in ${attempt * 1000}ms...`);
          await new Promise((r) => setTimeout(r, attempt * 1000));
          continue;
        }
        throw error;
      }
    }

    throw lastError;
  };

  const loginWithGoogle = async (): Promise<void> => {
    cleanupAuthState();
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch { }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      cleanupAuthState();
      await supabase.auth.signOut({ scope: 'global' });
    } finally {
      setUser(null);
      setSession(null);
      // Force reload to ensure a clean state
      window.location.href = '/login';
    }
  };

  const value = {
    user,
    session,
    loading,
    login,
    register,
    loginWithGoogle,
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