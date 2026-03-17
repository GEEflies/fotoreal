import { UserLayout } from '@/components/dashboard/UserLayout';
import { useCredits } from '@/hooks/use-credits';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const PACKAGES = [
  { photos: 20, price: 14, pricePerPhoto: '0,70 €', popular: false },
  { photos: 40, price: 26, pricePerPhoto: '0,65 €', popular: false },
  { photos: 80, price: 48, pricePerPhoto: '0,60 €', popular: true },
  { photos: 160, price: 87, pricePerPhoto: '0,54 €', popular: false },
  { photos: 320, price: 165, pricePerPhoto: '0,52 €', popular: false },
];

export default function DashboardCredits() {
  const { credits, isLoading } = useCredits();
  const { toast } = useToast();

  const handlePurchase = async (photos: number, price: number) => {
    // TODO: Integrate with Stripe checkout
    toast({
      title: 'Čoskoro dostupné',
      description: `Platba za ${photos} fotiek (${price} €) bude čoskoro k dispozícii.`,
    });
  };

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Kredity</h1>
          <p className="text-muted-foreground">1 kredit = 1 AI-spracovaná fotka</p>
        </div>

        {/* Current balance */}
        {isLoading ? (
          <Skeleton className="h-24 rounded-lg" />
        ) : credits && (
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/20">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Váš zostatok</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-heading font-bold text-foreground">{credits.available}</span>
                  <span className="text-muted-foreground">fotiek</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {credits.free_credits - Math.min(credits.total_used, credits.free_credits)} voľných + {credits.purchased_credits - Math.max(0, credits.total_used - credits.free_credits)} zakúpených
                </p>
              </div>
              <div className="p-4 rounded-full bg-primary/10">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Packages */}
        <div>
          <h2 className="text-lg font-heading font-bold text-foreground mb-4">Dokúpiť kredity</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PACKAGES.map((pkg) => (
              <Card
                key={pkg.photos}
                className={pkg.popular ? 'border-primary ring-2 ring-primary/20 relative' : ''}
              >
                {pkg.popular && (
                  <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    Najpopulárnejší
                  </Badge>
                )}
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-primary" />
                    {pkg.photos} fotiek
                  </CardTitle>
                  <CardDescription>{pkg.pricePerPhoto} / fotka</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-heading font-bold text-foreground">
                    {pkg.price} €
                  </div>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-success" />HDR vylepšenie</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-success" />Výmena oblohy</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-success" />GDPR rozmazanie</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-success" />Osvetlenie okien</li>
                  </ul>
                  <Button
                    onClick={() => handlePurchase(pkg.photos, pkg.price)}
                    className={pkg.popular ? 'w-full bg-success hover:bg-success/90 text-success-foreground font-bold' : 'w-full'}
                    variant={pkg.popular ? 'default' : 'outline'}
                  >
                    Kúpiť za {pkg.price} €
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Kredity nemajú expiráciu • Bezpečná platba cez Stripe • Faktúra emailom
        </p>
      </div>
    </UserLayout>
  );
}
