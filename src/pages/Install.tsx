import { useInstallPrompt } from '@/hooks/use-pwa';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Share, Plus, CheckCircle2, Smartphone, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LogoRealfoto from '@/components/LogoRealfoto';

export default function Install() {
  const { deferredPrompt, isInstalled, isIOS, install } = useInstallPrompt();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Späť
        </button>

        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <LogoRealfoto className="h-14 w-auto" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            Nainštaluj si RealFoto
          </h1>
          <p className="text-sm text-muted-foreground">
            Pridaj si RealFoto na plochu a používaj ju ako bežnú appku — rýchlejšie, bez prehliadača.
          </p>
        </div>

        {isInstalled ? (
          <Card>
            <CardContent className="p-6 text-center space-y-3">
              <CheckCircle2 className="h-12 w-12 text-success mx-auto" />
              <h2 className="text-lg font-semibold text-foreground">Appka je nainštalovaná!</h2>
              <p className="text-sm text-muted-foreground">
                RealFoto je už na tvojom zariadení. Otvor ju z plochy.
              </p>
              <Button onClick={() => navigate('/login')} className="w-full">
                Pokračovať
              </Button>
            </CardContent>
          </Card>
        ) : isIOS ? (
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground text-center">
                Inštalácia na iPhone / iPad
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Share className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">1. Klikni na Zdieľať</p>
                    <p className="text-xs text-muted-foreground">
                      V Safari klikni na ikonu zdieľania v dolnej lište
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Plus className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">2. Pridať na plochu</p>
                    <p className="text-xs text-muted-foreground">
                      Vyber možnosť „Pridať na plochu"
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Smartphone className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">3. Hotovo!</p>
                    <p className="text-xs text-muted-foreground">
                      RealFoto sa objaví na tvojej ploche
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <Smartphone className="h-12 w-12 text-primary mx-auto" />
              {deferredPrompt ? (
                <>
                  <h2 className="text-lg font-semibold text-foreground">Nainštalovať appku</h2>
                  <p className="text-sm text-muted-foreground">
                    Klikni nižšie a pridaj si RealFoto na plochu.
                  </p>
                  <Button onClick={install} className="w-full" size="lg">
                    <Download className="h-4 w-4 mr-2" />
                    Nainštalovať
                  </Button>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-semibold text-foreground">Inštalácia cez prehliadač</h2>
                  <p className="text-sm text-muted-foreground">
                    Otvor túto stránku v prehliadači Chrome a klikni na menu (⋮) → „Nainštalovať aplikáciu" alebo „Pridať na plochu".
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        )}

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Appka funguje offline a zaberá minimum miesta.
          </p>
        </div>
      </div>
    </div>
  );
}
