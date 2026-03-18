import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import {
  Upload,
  Sparkles,
  Download,
  ArrowRight,
  Camera,
  CheckCircle2,
  Rocket,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ONBOARDING_KEY = 'realfoto_onboarding_complete';
const LOGIN_KEY = 'realfoto_just_logged_in';

interface WelcomeOnboardingProps {
  onComplete: () => void;
}

function fireConfetti() {
  const duration = 2500;
  const end = Date.now() + duration;

  // Initial big burst from center
  confetti({
    particleCount: 100,
    spread: 80,
    origin: { y: 0.5, x: 0.5 },
    colors: ['#0358e7', '#34d399', '#fbbf24', '#f472b6', '#818cf8'],
    startVelocity: 35,
    gravity: 0.8,
    ticks: 200,
  });

  // Side cannons with interval
  const interval = setInterval(() => {
    if (Date.now() > end) {
      clearInterval(interval);
      return;
    }
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: ['#0358e7', '#34d399', '#fbbf24'],
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: ['#0358e7', '#f472b6', '#818cf8'],
    });
  }, 80);

  return () => clearInterval(interval);
}

function fireQuickConfetti() {
  confetti({
    particleCount: 60,
    spread: 70,
    origin: { y: 0.6, x: 0.5 },
    colors: ['#0358e7', '#34d399', '#fbbf24', '#f472b6'],
    startVelocity: 30,
    gravity: 1,
    ticks: 150,
  });
}

const steps = [
  {
    key: 'welcome',
    icon: Camera,
    title: 'Vitajte v RealFoto!',
    subtitle: 'Profesionálne fotky nehnuteľností\nna pár kliknutí',
    badge: null,
  },
  {
    key: 'how',
    icon: null,
    title: 'Ako to funguje',
    subtitle: 'Tri jednoduché kroky k dokonalým fotkám',
    badge: null,
    features: [
      {
        icon: Upload,
        title: 'Nahrajte fotky',
        desc: 'Stačí nahrať fotky priamo z mobilu alebo počítača',
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
      },
      {
        icon: Sparkles,
        title: 'AI spracovanie',
        desc: 'AI upraví svetlo, farby, perspektívu aj oblohu',
        color: 'text-amber-500',
        bg: 'bg-amber-500/10',
      },
      {
        icon: Download,
        title: 'Stiahnite výsledky',
        desc: 'Hotové fotky stiahnete jedným kliknutím',
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
      },
    ],
  },
  {
    key: 'start',
    icon: Rocket,
    title: '5 fotiek máte na nás!',
    subtitle: 'Žiadna karta, žiadny záväzok.\nVyskúšajte hneď.',
    badge: 'BONUS',
  },
];

export function WelcomeOnboarding({ onComplete }: WelcomeOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  // Entrance animation
  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  // Fire confetti on welcome step
  useEffect(() => {
    if (currentStep === 0 && isVisible) {
      const cleanup = fireConfetti();
      return cleanup;
    }
  }, [currentStep, isVisible]);

  const goToStep = useCallback(
    (nextStep: number) => {
      if (isAnimating || nextStep === currentStep) return;
      setIsAnimating(true);
      setDirection(nextStep > currentStep ? 'forward' : 'backward');
      setTimeout(() => {
        setCurrentStep(nextStep);
        setIsAnimating(false);
      }, 250);
    },
    [currentStep, isAnimating]
  );

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      goToStep(currentStep + 1);
    }
  };

  const handleFinish = (goToNew: boolean) => {
    localStorage.setItem(ONBOARDING_KEY, '1');
    sessionStorage.removeItem(LOGIN_KEY);
    fireQuickConfetti();
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
      if (goToNew) navigate('/dashboard/new');
    }, 400);
  };

  const handleSkip = () => {
    localStorage.setItem(ONBOARDING_KEY, '1');
    sessionStorage.removeItem(LOGIN_KEY);
    setIsVisible(false);
    setTimeout(() => onComplete(), 350);
  };

  const step = steps[currentStep];

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center transition-all duration-500',
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
    >
      {/* Backdrop */}
      <div
        className={cn(
          'absolute inset-0 bg-background/80 backdrop-blur-md transition-opacity duration-500',
          isVisible ? 'opacity-100' : 'opacity-0'
        )}
      />

      {/* Content card */}
      <div
        className={cn(
          'relative z-10 w-full max-w-lg mx-4 transition-all duration-500 ease-out',
          isVisible
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-8 scale-95'
        )}
      >
        <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
          {/* Progress bar */}
          <div className="h-1 bg-muted">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out rounded-r-full"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* Step content */}
          <div className="px-6 pt-8 pb-6 sm:px-8 sm:pt-10 sm:pb-8">
            <div
              className={cn(
                'transition-all duration-300 ease-out',
                isAnimating
                  ? direction === 'forward'
                    ? 'opacity-0 -translate-x-4'
                    : 'opacity-0 translate-x-4'
                  : 'opacity-100 translate-x-0'
              )}
            >
              {/* Welcome step */}
              {step.key === 'welcome' && (
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 animate-scale-in">
                    <Camera className="w-10 h-10 text-primary" />
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
                      {step.title}
                    </h2>
                    <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                      {step.subtitle}
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Účet úspešne vytvorený</span>
                  </div>
                </div>
              )}

              {/* How it works step */}
              {step.key === 'how' && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground">
                      {step.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">{step.subtitle}</p>
                  </div>
                  <div className="space-y-3">
                    {step.features?.map((feat, i) => (
                      <div
                        key={feat.title}
                        className="flex items-start gap-4 p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/60 transition-colors"
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        <div
                          className={cn(
                            'flex items-center justify-center w-10 h-10 rounded-lg shrink-0',
                            feat.bg
                          )}
                        >
                          <feat.icon className={cn('w-5 h-5', feat.color)} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-muted-foreground/60 w-5">
                              {i + 1}.
                            </span>
                            <h3 className="font-semibold text-sm text-foreground">
                              {feat.title}
                            </h3>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 ml-7">
                            {feat.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Get started step */}
              {step.key === 'start' && (
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 animate-scale-in">
                    <Rocket className="w-10 h-10 text-emerald-500" />
                  </div>
                  {step.badge && (
                    <span className="inline-block text-xs font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full">
                      {step.badge}
                    </span>
                  )}
                  <div className="space-y-3">
                    <h2 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
                      {step.title}
                    </h2>
                    <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                      {step.subtitle}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-8 space-y-3">
              {currentStep < steps.length - 1 ? (
                <Button onClick={handleNext} className="w-full" size="lg">
                  Ďalej
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => handleFinish(true)}
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Nahrať prvú nehnuteľnosť
                  </Button>
                  <Button
                    onClick={() => handleFinish(false)}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    Prejsť na dashboard
                  </Button>
                </>
              )}

              {currentStep < steps.length - 1 && (
                <button
                  onClick={handleSkip}
                  className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                >
                  Preskočiť
                </button>
              )}
            </div>

            {/* Step dots */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToStep(i)}
                  className={cn(
                    'h-2 rounded-full transition-all duration-300',
                    i === currentStep
                      ? 'w-6 bg-primary'
                      : i < currentStep
                        ? 'w-2 bg-primary/40'
                        : 'w-2 bg-muted-foreground/20'
                  )}
                  aria-label={`Step ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook to determine whether to show onboarding or quick confetti.
 * Returns:
 *  - showOnboarding: true if first-ever visit after login
 *  - showConfetti: true if returning user who just logged in
 */
export function useWelcomeState() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const justLoggedIn = sessionStorage.getItem(LOGIN_KEY) === '1';
    const onboardingDone = localStorage.getItem(ONBOARDING_KEY) === '1';

    if (justLoggedIn && !onboardingDone) {
      // First-time user: show full onboarding
      setShowOnboarding(true);
    } else if (justLoggedIn && onboardingDone) {
      // Returning user who just logged in: quick confetti
      sessionStorage.removeItem(LOGIN_KEY);
      setShowConfetti(true);
      fireQuickConfetti();
    }
  }, []);

  const completeOnboarding = useCallback(() => {
    setShowOnboarding(false);
  }, []);

  return { showOnboarding, showConfetti, completeOnboarding };
}
