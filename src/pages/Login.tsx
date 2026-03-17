import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUserAuth } from '@/hooks/use-user-auth';
import { lovable } from '@/integrations/lovable/index';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Zap, Mail, ArrowLeft } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import logoRealfoto from '@/assets/logo-realfoto.svg';
import { getStoredAvatar } from '@/components/AvatarSelector';

type AuthStep = 'initial' | 'otp';

export default function Login() {
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<AuthStep>('initial');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const { demoLogin } = useUserAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const photosParam = searchParams.get('photos');
  const purchasedPhotos = photosParam ? parseInt(photosParam, 10) : null;
  const isPaidUser = purchasedPhotos !== null && purchasedPhotos > 0;

  const landingPage = getStoredAvatar() === 'photographer' ? '/pre-fotografov' : getStoredAvatar() === 'no-photographer' ? '/bez-fotografa' : '/';

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    // Persist redirect target across OAuth round-trip
    if (redirectTo !== '/dashboard') {
      sessionStorage.setItem('auth_redirect', redirectTo);
    }
    const { error } = await lovable.auth.signInWithOAuth('google', {
      redirect_uri: window.location.origin,
    });
    setIsGoogleLoading(false);
    if (error) {
      toast({ title: 'Chyba prihlásenia', description: String(error), variant: 'destructive' });
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: true,
      },
    });
    setIsLoading(false);

    if (error) {
      toast({ title: 'Chyba', description: error.message, variant: 'destructive' });
    } else {
      setStep('otp');
      toast({ title: 'Kód odoslaný', description: 'Skontrolujte si email a zadajte overovací kód.' });
    }
  };

  const handleOtpVerify = async () => {
    if (otpCode.length < 6) return;
    
    setIsLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: otpCode,
      type: 'email',
    });
    setIsLoading(false);

    if (error) {
      toast({ title: 'Neplatný kód', description: error.message, variant: 'destructive' });
    } else {
      // Ensure user role exists
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('user_roles').upsert(
          { user_id: user.id, role: 'user' as const },
          { onConflict: 'user_id,role' }
        );
      }
      navigate(redirectTo);
    }
  };

  const handleDemoLogin = async () => {
    setIsDemoLoading(true);
    const { error } = await demoLogin();
    setIsDemoLoading(false);
    if (error) {
      toast({ title: 'Chyba', description: error.message, variant: 'destructive' });
    } else {
      navigate(redirectTo);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      {/* Navigation bar */}
      <header className="w-full border-b border-border bg-background/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
          <a href={landingPage} onClick={(e) => { e.preventDefault(); navigate(landingPage); }} className="flex items-center gap-2 group">
            <img src={logoRealfoto} alt="RealFoto" className="h-10 w-auto" />
            <span className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">RealFoto</span>
          </a>
          <Button variant="ghost" size="sm" onClick={() => navigate(landingPage)}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Späť
          </Button>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-heading">
            {step === 'otp'
              ? 'Zadajte overovací kód'
              : isPaidUser
                ? `Pre prístup k vašim ${purchasedPhotos} fotkám sa zaregistrujte`
                : 'Vyskúšajte 5 fotiek zadarmo'}
          </CardTitle>
          <CardDescription>
            {step === 'otp'
              ? `Poslali sme kód na ${email}`
              : isPaidUser
                ? 'Vytvorte si účet a vaše kredity budú automaticky pripísané'
                : 'Prihláste sa a začnite za 30 sekúnd'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {step === 'initial' ? (
            <>
              {/* Google sign-in */}
              <Button
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
                variant="outline"
                className="w-full"
                size="lg"
              >
                {isGoogleLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                Pokračovať s Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">alebo</span>
                </div>
              </div>

              {/* Email OTP */}
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vas@email.sk"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Mail className="h-4 w-4 mr-2" />
                  )}
                  Poslať overovací kód
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">demo</span>
                </div>
              </div>

              <Button
                onClick={handleDemoLogin}
                disabled={isDemoLoading}
                variant="ghost"
                className="w-full text-muted-foreground"
              >
                {isDemoLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Zap className="h-4 w-4 mr-2" />
                )}
                Demo prihlásenie (vývojári)
              </Button>
            </>
          ) : (
            /* OTP verification step */
            <div className="space-y-6">
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button
                onClick={handleOtpVerify}
                disabled={isLoading || otpCode.length < 6}
                className="w-full"
                size="lg"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Overiť a pokračovať
              </Button>

              <button
                onClick={() => { setStep('initial'); setOtpCode(''); }}
                className="text-sm text-muted-foreground hover:text-foreground w-full text-center"
              >
                ← Zadať iný email
              </button>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
