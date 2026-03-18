import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, ShoppingCart, Sparkles } from 'lucide-react';

interface CreditsBannerProps {
  available: number;
  isCompact?: boolean;
}

export function CreditsBanner({ available, isCompact }: CreditsBannerProps) {
  const isLow = available <= 2;
  const isEmpty = available <= 0;

  if (isCompact) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-sm">
          <ImageIcon className="h-4 w-4 text-primary" />
          <span className="font-medium text-foreground">{available}</span>
          <span className="text-muted-foreground">fotiek</span>
        </div>
        <Link to="/dashboard/credits">
          <Button size="sm" variant={isEmpty ? 'default' : 'outline'} className="h-7 text-xs">
            <ShoppingCart className="h-3 w-3 mr-1" />
            Dokúpiť
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <Card className={isEmpty ? 'border-destructive/50 bg-destructive/5' : isLow ? 'border-warning/50 bg-warning/5' : 'border-primary/20 bg-primary/5'}>
      <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg shrink-0 ${isEmpty ? 'bg-destructive/10' : isLow ? 'bg-warning/10' : 'bg-primary/10'}`}>
            <Sparkles className={`h-5 w-5 ${isEmpty ? 'text-destructive' : isLow ? 'text-warning' : 'text-primary'}`} />
          </div>
          <div>
            <p className="font-medium text-sm sm:text-base text-foreground">
              {isEmpty ? 'Minuli ste všetky kredity' : `${available} ${available === 1 ? 'fotka' : available < 5 ? 'fotky' : 'fotiek'} k dispozícii`}
            </p>
            <p className="text-xs text-muted-foreground">
              {isEmpty ? 'Dokúpte si ďalšie a pokračujte' : isLow ? 'Zostáva málo — doplňte si kredity' : '1 kredit = 1 spracovaná fotka'}
            </p>
          </div>
        </div>
        <Link to="/dashboard/credits" className="w-full sm:w-auto shrink-0">
          <Button size="sm" className={`w-full sm:w-auto ${isEmpty ? 'bg-success hover:bg-success/90 text-success-foreground' : ''}`}>
            <ShoppingCart className="h-4 w-4 mr-1.5" />
            Dokúpiť kredity
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
