import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useUserAuth } from '@/hooks/use-user-auth';
import { useCredits } from '@/hooks/use-credits';
import { supabase } from '@/integrations/supabase/client';
import { Building2, Plus, LogOut, Home, Menu, Sparkles, ShoppingCart, ChevronDown, User, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface UserLayoutProps {
  children: ReactNode;
}

interface SidebarProperty {
  id: string;
  name: string;
  status: string;
}

function CreditWidget() {
  const { credits } = useCredits();
  const loaded = !!credits;

  const available = credits?.available ?? 0;
  const total = credits ? credits.free_credits + credits.purchased_credits : 0;
  const pct = total > 0 ? Math.round((available / total) * 100) : 0;
  const isLow = available <= 2;
  const isEmpty = available <= 0;

  return (
    <div className="mx-4 my-3 rounded-xl border border-border bg-muted/50 p-3 space-y-2.5">
      <div className="flex items-center gap-2">
        <Sparkles className={cn("h-4 w-4 transition-colors duration-500", !loaded ? "text-muted-foreground/40" : isEmpty ? "text-destructive" : isLow ? "text-warning" : "text-primary")} />
        <span className={cn("font-semibold text-sm transition-opacity duration-500", loaded ? "opacity-100" : "opacity-0")}>{available}</span>
        <span className="text-xs text-muted-foreground">fotiek</span>
      </div>
      <Progress
        value={loaded ? pct : 0}
        className={cn("h-1.5 transition-all duration-700", isEmpty ? "[&>div]:bg-destructive" : isLow ? "[&>div]:bg-warning" : "")}
      />
      <Link to="/dashboard/credits" className="block">
        <Button size="sm" className="w-full bg-success hover:bg-success/90 text-success-foreground text-xs h-8">
          <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
          Dokúpiť kredity
        </Button>
      </Link>
    </div>
  );
}

function Sidebar({ currentPath, userEmail }: { currentPath: string; userEmail?: string }) {
  const { signOut } = useUserAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<SidebarProperty[]>([]);
  const [propertiesOpen, setPropertiesOpen] = useState(true);

  useEffect(() => {
    const loadProperties = async () => {
      const { data } = await supabase
        .from('properties')
        .select('id, name, status')
        .order('created_at', { ascending: false });
      if (data) setProperties(data);
    };
    loadProperties();

    // Listen for realtime changes
    const channel = supabase
      .channel('sidebar-properties')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, () => {
        loadProperties();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const statusDot: Record<string, string> = {
    uploading: 'bg-muted-foreground',
    processing: 'bg-primary animate-pulse',
    done: 'bg-success',
    error: 'bg-destructive',
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h1 className="text-lg font-heading font-bold text-foreground">RealFoto</h1>
        <p className="text-xs text-muted-foreground">Spracovanie fotiek</p>
      </div>

      <CreditWidget />

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {/* Nová nehnuteľnosť - above the list */}
        <Link
          to="/dashboard/new"
          className={cn(
            "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            currentPath === '/dashboard/new'
              ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary rounded-l-none"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Plus className="h-4 w-4" />
          Nová nehnuteľnosť
        </Link>

        {/* Všetky nehnuteľnosti - navigable + collapsible */}
        <div
          className={cn(
            "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            currentPath === '/dashboard'
              ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary rounded-l-none"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Link to="/dashboard" className="flex items-center gap-2.5 flex-1">
            <Building2 className="h-4 w-4" />
            Všetky nehnuteľnosti
          </Link>
          <button onClick={() => setPropertiesOpen(!propertiesOpen)} className="p-0.5 -mr-1">
            <ChevronDown className={cn("h-4 w-4 transition-transform", propertiesOpen && "rotate-180")} />
          </button>
        </div>

        {propertiesOpen && (
          <div className="ml-4 pl-3 border-l border-border space-y-0.5">
            {properties.length === 0 ? (
              <p className="text-xs text-muted-foreground px-3 py-2">Žiadne nehnuteľnosti</p>
            ) : (
              properties.map((p) => {
                const isActive = currentPath === `/dashboard/properties/${p.id}`;
                return (
                  <Link
                    key={p.id}
                    to={`/dashboard/properties/${p.id}`}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-colors truncate",
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <span className={cn("h-2 w-2 rounded-full shrink-0", statusDot[p.status] || statusDot.uploading)} />
                    <span className="truncate">{p.name}</span>
                  </Link>
                );
              })
            )}
          </div>
        )}
      </nav>

      <div className="p-3 border-t border-border space-y-2">
        <Link
          to="/install"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Smartphone className="h-4 w-4" />
          Stiahnuť appku
        </Link>
        <div className="flex items-center gap-2 rounded-xl bg-muted/60">
          <Link
            to="/dashboard/profile"
            className="flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-muted min-w-0"
          >
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground truncate leading-tight">{userEmail}</p>
          </Link>
          <button
            onClick={handleSignOut}
            className="p-2.5 mr-1 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0"
            title="Odhlásiť sa"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function UserLayout({ children }: UserLayoutProps) {
  const { user, isLoading } = useUserAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="mt-2 text-sm text-muted-foreground">Načítavam...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-muted">
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border p-4 flex items-center justify-between">
        <h1 className="text-lg font-heading font-bold">RealFoto</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[85vw] max-w-80">
            <Sidebar currentPath={location.pathname} userEmail={user.email} />
          </SheetContent>
        </Sheet>
      </header>

      <div className="flex">
        <aside className="hidden lg:block w-64 bg-card border-r border-border h-screen fixed top-0 left-0">
          <Sidebar currentPath={location.pathname} userEmail={user.email} />
        </aside>
        <main className="flex-1 p-4 lg:p-8 lg:ml-64 min-h-screen pt-20 lg:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
