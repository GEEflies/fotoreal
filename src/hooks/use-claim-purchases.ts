import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useClaimPurchases() {
  const [claimed, setClaimed] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const claimPurchases = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        setIsLoading(false);
        return 0;
      }

      const { data, error } = await (supabase.rpc as any)('claim_purchases_by_email', {
        _user_id: user.id,
        _email: user.email,
      });

      if (error) {
        console.error('Failed to claim purchases:', error.message, error.details, error.hint);
        if (error.message?.includes('function') || error.code === '42883') {
          console.error('CRITICAL: claim_purchases_by_email function does not exist in database. Apply migration 20260317230000.');
        }
        setIsLoading(false);
        return 0;
      }

      const count = data as number;
      setClaimed(count);

      if (count > 0) {
        toast({
          title: 'Kredity pripísané!',
          description: 'Kredity z vášho nákupu boli pripísané na váš účet.',
        });
      }

      setIsLoading(false);
      return count;
    } catch (e) {
      console.error('Claim error:', e);
      setIsLoading(false);
      return 0;
    }
  }, [toast]);

  return { claimed, isLoading, claimPurchases };
}
