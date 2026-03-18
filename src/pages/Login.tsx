import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUserAuth } from '@/hooks/use-user-auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Zap, LogIn, UserPlus, KeyRound, Eye, EyeOff, ArrowLeft, Mail } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import LogoRealfoto from '@/components/LogoRealfoto';
import { getStoredAvatar } from '@/components/AvatarSelector';
import { translateError } from '@/lib/translate-error';

type AuthStep = 'login' | 'signup' | 'reset-password' | 'check-email';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<AuthStep>('signup');
  const [checkEmailReason, setCheckEmailReason] = useState<'signup' | 'reset'>('signup');
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const { signIn, signUp, resetPassword, demoLogin } = useUserAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const photosParam = searchParams.get('photos');
  const purchasedPhotos = photosParam ? parseInt(photosParam, 10) : null;
  const isPaidUser = purchasedPhotos !== null && purchasedPhotos > 0;

  const landingPage = getStoredAvatar() === 'photographer' ? '/pre-fotografov' : getStoredAvatar() === 'no-photographer' ? '/bez-fotografa' : '/';

  // If the user already has a session (e.g. returning from Google OAuth), redirect immediately
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          sessionStorage.setItem('realfoto_just_logged_in', '1');
          navigate(redirectTo, { replace: true });
        }
      }
    );
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        sessionStorage.setItem('realfoto_just_logged_in', '1');
        navigate(redirectTo, { replace: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate, redirectTo]);

  const switchStep = (newStep: AuthStep) => {
    setStep(newStep);
    setFormError(null);
    setPassword('');
    setConfirmPassword('');
    setOtpCode('');
  };

  // After Google OAuth, redirect back to /login with the original redirect param
  // so the session-detection effect below can forward to /dashboard (or wherever).
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    const callbackUrl = `${window.location.origin}/login?redirect=${encodeURIComponent(redirectTo)}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl,
      },
    });
    setIsGoogleLoading(false);
    if (error) {
      toast({ title: 'Chyba prihlásenia', description: translateError(error.message), variant: 'destructive' });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!email.trim() || !password) return;
    if (password.length < 6) {
      setFormError('Heslo musí mať aspoň 6 znakov.');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signIn(email.trim(), password);
      if (error) {
        setFormError(translateError(error.message));
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('user_roles').upsert(
            { user_id: user.id, role: 'user' as const },
            { onConflict: 'user_id,role' }
          );
        }
        sessionStorage.setItem('realfoto_just_logged_in', '1');
        navigate(redirectTo);
      }
    } catch {
      setFormError('Nastala neočakávaná chyba. Skúste to znova.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!email.trim() || !password) return;
    if (password.length < 6) {
      setFormError('Heslo musí mať aspoň 6 znakov.');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Heslá sa nezhodujú.');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signUp(email.trim(), password);
      if (error) {
        setFormError(translateError(error.message));
      } else {
        setCheckEmailReason('signup');
        setStep('check-email');
      }
    } catch {
      setFormError('Nastala neočakávaná chyba. Skúste to znova.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      const { error } = await resetPassword(email.trim());
      if (error) {
        setFormError(translateError(error.message));
      } else {
        setCheckEmailReason('reset');
        setStep('check-email');
      }
    } catch {
      setFormError('Nastala neočakávaná chyba. Skúste to znova.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerify = async () => {
    if (otpCode.length < 6) return;
    setFormError(null);
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otpCode,
        type: 'signup',
      });
      if (error) {
        setFormError(translateError(error.message));
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('user_roles').upsert(
            { user_id: user.id, role: 'user' as const },
            { onConflict: 'user_id,role' }
          );
        }
        sessionStorage.setItem('realfoto_just_logged_in', '1');
        navigate(redirectTo);
      }
    } catch {
      setFormError('Nastala neočakávaná chyba. Skúste to znova.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsDemoLoading(true);
    const { error } = await demoLogin();
    setIsDemoLoading(false);
    if (error) {
      toast({ title: 'Chyba', description: translateError(error.message), variant: 'destructive' });
    } else {
      sessionStorage.setItem('realfoto_just_logged_in', '1');
      navigate(redirectTo);
    }
  };

  const getTitle = () => {
    switch (step) {
      case 'signup':
        return isPaidUser
          ? `Pre prístup k vašim ${purchasedPhotos} fotkám sa zaregistrujte`
          : 'Vyskúšajte 5 fotiek zadarmo';
      case 'reset-password':
        return 'Zabudnuté heslo';
      case 'check-email':
        return checkEmailReason === 'signup' ? 'Zadajte overovací kód' : 'Skontrolujte si email';
      default:
        return isPaidUser
          ? `Pre prístup k vašim ${purchasedPhotos} fotkám sa prihláste`
          : 'Prihlásiť sa';
    }
  };

  const getDescription = () => {
    switch (step) {
      case 'signup':
        return isPaidUser
          ? 'Vytvorte si účet a vaše kredity budú automaticky pripísané'
          : 'Zaregistrujte sa s emailom a heslom';
      case 'reset-password':
        return 'Pošleme vám odkaz na obnovenie hesla';
      case 'check-email':
        return checkEmailReason === 'signup'
          ? `Poslali sme overovací kód na ${email}`
          : `Poslali sme odkaz na obnovenie hesla na ${email}`;
      default:
        return isPaidUser
          ? 'Prihláste sa a vaše kredity budú automaticky pripísané'
          : 'Prihláste sa a začnite za 30 sekúnd';
    }
  };

  const googleButton = (
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
  );

  const divider = (text: string) => (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-card px-2 text-muted-foreground">{text}</span>
      </div>
    </div>
  );

  const passwordField = (id: string, value: string, onChange: (v: string) => void, label: string) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
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
  );

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <header className="w-full border-b border-border bg-background">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
          <a href={landingPage} onClick={(e) => { e.preventDefault(); navigate(landingPage); }} className="flex items-center gap-2">
            <LogoRealfoto className="h-10 w-10" />
            <span className="text-lg font-bold text-foreground">RealFoto</span>
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
            <CardTitle className="text-2xl font-heading">{getTitle()}</CardTitle>
            <CardDescription>{getDescription()}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">

            {/* LOGIN STEP */}
            {step === 'login' && (
              <>
                {googleButton}
                {divider('alebo')}

                <form onSubmit={handleLogin} className="space-y-4">
                  {formError && (
                    <Alert variant="destructive">
                      <AlertDescription>{formError}</AlertDescription>
                    </Alert>
                  )}

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

                  {passwordField('password', password, setPassword, 'Heslo')}

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => switchStep('reset-password')}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Zabudli ste heslo?
                    </button>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <LogIn className="h-4 w-4 mr-2" />
                    )}
                    Prihlásiť sa
                  </Button>
                </form>

                <p className="text-sm text-center text-muted-foreground">
                  Nemáte účet?{' '}
                  <button
                    onClick={() => switchStep('signup')}
                    className="text-primary hover:underline font-medium"
                  >
                    Zaregistrujte sa
                  </button>
                </p>

                {divider('demo')}

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
            )}

            {/* SIGNUP STEP */}
            {step === 'signup' && (
              <>
                {googleButton}
                {divider('alebo')}

                <form onSubmit={handleSignUp} className="space-y-4">
                  {formError && (
                    <Alert variant="destructive">
                      <AlertDescription>{formError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vas@email.sk"
                      required
                    />
                  </div>

                  {passwordField('signup-password', password, setPassword, 'Heslo')}

                  {passwordField('signup-confirm', confirmPassword, setConfirmPassword, 'Potvrďte heslo')}

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <UserPlus className="h-4 w-4 mr-2" />
                    )}
                    Vytvoriť účet
                  </Button>
                </form>

                <p className="text-sm text-center text-muted-foreground">
                  Už máte účet?{' '}
                  <button
                    onClick={() => switchStep('login')}
                    className="text-primary hover:underline font-medium"
                  >
                    Prihláste sa
                  </button>
                </p>

                {divider('demo')}

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
            )}

            {/* RESET PASSWORD STEP */}
            {step === 'reset-password' && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                {formError && (
                  <Alert variant="destructive">
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
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
                    <KeyRound className="h-4 w-4 mr-2" />
                  )}
                  Odoslať odkaz na obnovenie
                </Button>

                <button
                  type="button"
                  onClick={() => switchStep('login')}
                  className="text-sm text-muted-foreground hover:text-foreground w-full text-center"
                >
                  ← Späť na prihlásenie
                </button>
              </form>
            )}

            {/* CHECK EMAIL STEP */}
            {step === 'check-email' && checkEmailReason === 'signup' && (
              <div className="space-y-6">
                {formError && (
                  <Alert variant="destructive">
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                )}

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

                <p className="text-xs text-muted-foreground text-center bg-muted/50 rounded-lg px-3 py-2">
                  Nevidíte email? Skontrolujte priečinok <span className="font-medium text-foreground">Spam</span> alebo <span className="font-medium text-foreground">Reklamy</span>.
                </p>

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
                  onClick={() => switchStep('signup')}
                  className="text-sm text-muted-foreground hover:text-foreground w-full text-center"
                >
                  ← Zadať iný email
                </button>
              </div>
            )}

            {/* CHECK EMAIL STEP - PASSWORD RESET */}
            {step === 'check-email' && checkEmailReason === 'reset' && (
              <div className="space-y-6 text-center">
                <div className="flex justify-center">
                  <Mail className="h-12 w-12 text-muted-foreground" />
                </div>

                <p className="text-sm text-muted-foreground">
                  Kliknite na odkaz v emaile pre obnovenie hesla.
                </p>

                <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                  Nevidíte email? Skontrolujte priečinok <span className="font-medium text-foreground">Spam</span> alebo <span className="font-medium text-foreground">Reklamy</span>.
                </p>

                <button
                  onClick={() => switchStep('login')}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  ← Späť na prihlásenie
                </button>
              </div>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
