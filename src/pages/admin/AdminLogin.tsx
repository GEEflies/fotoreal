import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { z } from 'zod';

// Fixed admin email for universal login
const ADMIN_EMAIL = 'admin@ocenenie.local';

const authSchema = z.object({
  password: z.string().min(6, 'Heslo musí mať aspoň 6 znakov'),
});

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user, isAdmin, isLoading, signIn } = useAdminAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!isLoading && user && isAdmin) {
      navigate('/admin');
    }
  }, [user, isAdmin, isLoading, navigate]);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'not_admin') {
      setError('Nemáte oprávnenie na prístup do admin panelu.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const validation = authSchema.safeParse({ password });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await signIn(ADMIN_EMAIL, password);
      if (error) {
        setError('Nesprávne heslo.');
      }
    } catch {
      setError('Nastala neočakávaná chyba. Skúste to znova.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-heading">
            Admin Panel
          </CardTitle>
          <CardDescription>
            Zadajte heslo pre prístup
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Heslo</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Načítavam...' : 'Prihlásiť sa'}
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">alebo</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={isSubmitting}
            onClick={async () => {
              setError(null);
              setIsSubmitting(true);
              try {
                const { error } = await signIn(ADMIN_EMAIL, 'admin123456');
                if (error) setError('Demo prihlásenie zlyhalo.');
              } catch {
                setError('Nastala neočakávaná chyba.');
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            🚀 Demo prihlásenie
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
