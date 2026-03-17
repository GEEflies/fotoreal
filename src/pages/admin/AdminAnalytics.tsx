import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface StepAnalytics {
  step_number: number;
  step_name: string;
  unique_visitors: number;
  next_step_visitors: number;
}

const STEP_NAMES: Record<number, string> = {
  1: 'Kontakt',
  2: 'Typ nehnuteľnosti',
  3: 'Adresa',
  4: 'Plocha',
  5: 'Izby',
  6: 'Poschodie & Výťah',
  7: 'Stav',
  8: 'Príslušenstvo',
  9: 'Roky',
  10: 'Kúrenie',
  11: 'Fotky & Poznámky',
};

const SHORT_STEP_NAMES: Record<number, string> = {
  1: 'Kontakt',
  2: 'Typ',
  3: 'Adresa',
  4: 'Plocha',
  5: 'Izby',
  6: 'Posch./Výťah',
  7: 'Stav',
  8: 'Prísl.',
  9: 'Roky',
  10: 'Kúrenie',
  11: 'Fotky',
};

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<StepAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReset, setShowReset] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('step_analytics')
        .select('step_number, step_name, session_id');

      if (error) throw error;

      // Count unique sessions per step
      const stepCounts: Record<number, Set<string>> = {};
      const stepNames: Record<number, string> = {};
      
      data?.forEach(row => {
        if (!stepCounts[row.step_number]) {
          stepCounts[row.step_number] = new Set();
          stepNames[row.step_number] = row.step_name;
        }
        stepCounts[row.step_number].add(row.session_id);
      });

      // Convert to array with all steps (1-11 only, no redirect)
      const analyticsData: StepAnalytics[] = [];
      for (let i = 1; i <= 11; i++) {
        const currentVisitors = stepCounts[i]?.size || 0;
        const nextVisitors = i < 11 ? (stepCounts[i + 1]?.size || 0) : 0;
        analyticsData.push({
          step_number: i,
          step_name: stepNames[i] || STEP_NAMES[i] || `Krok ${i}`,
          unique_visitors: currentVisitors,
          next_step_visitors: nextVisitors,
        });
      }

      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: 'Chyba',
        description: 'Nepodarilo sa načítať analytiku.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      const { error } = await supabase
        .from('step_analytics')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) throw error;

      toast({
        title: 'Analytika resetovaná',
        description: 'Všetky dáta boli vymazané.',
      });
      fetchAnalytics();
    } catch (error) {
      console.error('Error resetting analytics:', error);
      toast({
        title: 'Chyba',
        description: 'Nepodarilo sa resetovať analytiku.',
        variant: 'destructive',
      });
    } finally {
      setIsResetting(false);
      setShowReset(false);
    }
  };

  const getConversionRate = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return Math.round((current / previous) * 100);
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-heading font-bold text-foreground">Analytika</h1>
            <p className="text-sm text-muted-foreground">Konverzný funnel</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="icon" onClick={fetchAnalytics} disabled={isLoading} className="h-9 w-9">
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="destructive" size="icon" onClick={() => setShowReset(true)} className="h-9 w-9">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Compact Table */}
        <Card>
          <CardHeader className="py-3 px-3">
            <CardTitle className="text-base">Funnel</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Načítavam...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground text-xs">Krok</th>
                      <th className="text-right py-2 px-2 font-medium text-muted-foreground text-xs">
                        <span className="hidden sm:inline">Unikátni</span>
                        <span className="sm:hidden">Unik.</span>
                      </th>
                      <th className="text-right py-2 px-2 font-medium text-muted-foreground text-xs">
                        <span className="hidden sm:inline">Ďalší</span>
                        <span className="sm:hidden">→</span>
                      </th>
                      <th className="text-right py-2 px-3 font-medium text-muted-foreground text-xs">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.map((step, index) => {
                      const conversionRate = getConversionRate(step.next_step_visitors, step.unique_visitors);
                      const isLastStep = index === analytics.length - 1;

                      return (
                        <tr key={step.step_number} className="border-b border-border">
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-1.5">
                              <span className="font-medium text-foreground w-4 text-center">{step.step_number}</span>
                              <span className="hidden sm:inline text-muted-foreground">{step.step_name}</span>
                              <span className="sm:hidden text-muted-foreground text-xs">{SHORT_STEP_NAMES[step.step_number]}</span>
                            </div>
                          </td>
                          <td className="py-2 px-2 text-right font-medium tabular-nums">
                            {step.unique_visitors}
                          </td>
                          <td className="py-2 px-2 text-right text-muted-foreground tabular-nums">
                            {isLastStep ? '-' : step.next_step_visitors}
                          </td>
                          <td className="py-2 px-3 text-right tabular-nums">
                            {isLastStep ? (
                              <span className="text-muted-foreground">-</span>
                            ) : (
                              <span className={
                                conversionRate >= 70 ? 'text-green-600 font-medium' : 
                                conversionRate >= 40 ? 'text-orange-600 font-medium' : 
                                'text-red-600 font-medium'
                              }>
                                {conversionRate}%
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showReset} onOpenChange={setShowReset}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Resetovať analytiku?</AlertDialogTitle>
            <AlertDialogDescription>
              Všetky dáta budú vymazané.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-10">Zrušiť</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleReset} 
              className="h-10 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isResetting}
            >
              {isResetting ? 'Mazanie...' : 'Resetovať'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}