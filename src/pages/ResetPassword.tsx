import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import LogoRealfoto from '@/components/LogoRealfoto';
import { translateError } from '@/lib/translate-error';

type PageState = 'loading' | 'form' | 'success' | 'error';

export default function ResetPassword() {
  const [pageState, setPageState] = useState<PageState>('loading');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setPageState('form');
      }
    });

    // Check if we already have a session (user may have landed with recovery token already processed)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setPageState('form');
      } else {
        // Give Supabase a moment to process the hash fragment
        setTimeout(() => {
          setPageState((prev) => (prev === 'loading' ? 'error' : prev));
        }, 2000);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (password.length < 6) {
      setFormError('Heslo musí mať aspoň 6 znakov.');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Heslá sa nezhodujú.');
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsLoading(false);

    if (error) {
      setFormError(translateError(error.message));
    } else {
      setPageState('success');
      setTimeout(() => navigate('/dashboard'), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <header className="w-full border-b border-border bg-background">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
          <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="flex items-center gap-2">
            <LogoRealfoto className="h-10 w-10" />
            <span className="text-lg font-bold text-foreground">RealFoto</span>
          </a>
          <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Späť
          </Button>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          {pageState === 'loading' && (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-heading">Overovanie...</CardTitle>
                <CardDescription>Čakajte prosím.</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </CardContent>
            </>
          )}

          {pageState === 'error' && (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-heading">Neplatný odkaz</CardTitle>
                <CardDescription>Odkaz na obnovenie hesla vypršal alebo je neplatný.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => navigate('/login')}>
                  Späť na prihlásenie
                </Button>
              </CardContent>
            </>
          )}

          {pageState === 'success' && (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-heading">Heslo zmenené</CardTitle>
                <CardDescription>Vaše heslo bolo úspešne aktualizované. Presmerúvame vás...</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </CardContent>
            </>
          )}

          {pageState === 'form' && (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-heading">Nové heslo</CardTitle>
                <CardDescription>Zadajte svoje nové heslo.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {formError && (
                    <Alert variant="destructive">
                      <AlertDescription>{formError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="password">Nové heslo</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Potvrďte heslo</Label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Nastaviť heslo
                  </Button>
                </form>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
