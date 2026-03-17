import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UserAuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

export function useUserAuth() {
  const [state, setState] = useState<UserAuthState>({
    user: null,
    session: null,
    isLoading: true,
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setState({
          session,
          user: session?.user ?? null,
          isLoading: false,
        });
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setState({
        session,
        user: session?.user ?? null,
        isLoading: false,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const demoLogin = async () => {
    // First ensure demo user exists
    await supabase.functions.invoke('setup-demo');
    // Then sign in
    return signIn('demo@realfoto.sk', 'demo123456');
  };

  return {
    ...state,
    signIn,
    signOut,
    demoLogin,
  };
}
