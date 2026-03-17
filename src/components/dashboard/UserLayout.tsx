import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useUserAuth } from '@/hooks/use-user-auth';
import { Building2, Plus, LogOut, Home, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface UserLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: '/dashboard', label: 'Nehnuteľnosti', icon: Building2 },
  { href: '/dashboard/new', label: 'Nová nehnuteľnosť', icon: Plus },
];

function NavItem({ href, label, icon: Icon, isActive }: {
  href: string; label: string; icon: typeof Building2; isActive: boolean;
}) {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

function Sidebar({ currentPath }: { currentPath: string }) {
  const { signOut } = useUserAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h1 className="text-lg font-heading font-bold text-foreground">RealFoto</h1>
        <p className="text-xs text-muted-foreground">Spracovanie fotiek</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            isActive={currentPath === item.href}
          />
        ))}
      </nav>

      <div className="p-4 border-t border-border space-y-2">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Home className="h-4 w-4" />
          Späť na web
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          Odhlásiť sa
        </button>
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
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar currentPath={location.pathname} />
          </SheetContent>
        </Sheet>
      </header>

      <div className="flex">
        <aside className="hidden lg:block w-64 bg-card border-r border-border h-screen fixed top-0 left-0">
          <Sidebar currentPath={location.pathname} />
        </aside>
        <main className="flex-1 p-4 lg:p-8 lg:ml-64 min-h-screen pt-20 lg:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
