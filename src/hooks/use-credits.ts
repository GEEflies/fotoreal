import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Credits {
  free_credits: number;
  purchased_credits: number;
  total_used: number;
  available: number;
}

export function useCredits() {
  const [credits, setCredits] = useState<Credits | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadCredits = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setIsLoading(false); return; }

    let { data, error } = await supabase
      .from('user_credits')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    // Auto-create credits row for new users
    if (!data && !error) {
      const { data: newData } = await supabase
        .from('user_credits')
        .insert({ user_id: user.id })
        .select('*')
        .single();
      data = newData;
    }

    if (data) {
      setCredits({
        free_credits: data.free_credits,
        purchased_credits: data.purchased_credits,
        total_used: data.total_used,
        available: data.free_credits + data.purchased_credits - data.total_used,
      });
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadCredits();

    // Auto-refresh when credits change in DB (photo processing, purchases, etc.)
    let channel: ReturnType<typeof supabase.channel> | undefined;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      channel = supabase
        .channel('credits-realtime')
        .on('postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'user_credits', filter: `user_id=eq.${user.id}` },
          () => { loadCredits(); }
        )
        .subscribe();
    });

    return () => { if (channel) supabase.removeChannel(channel); };
  }, [loadCredits]);

  const useCreditsForPhotos = useCallback(async (count: number): Promise<boolean> => {
    if (!credits || credits.available < count) return false;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('user_credits')
      .update({ total_used: credits.total_used + count })
      .eq('user_id', user.id);

    if (error) return false;
    
    setCredits(prev => prev ? {
      ...prev,
      total_used: prev.total_used + count,
      available: prev.available - count,
    } : null);
    
    return true;
  }, [credits]);

  return { credits, isLoading, loadCredits, useCreditsForPhotos };
}
