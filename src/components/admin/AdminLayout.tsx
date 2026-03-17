import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { 
  Users,
  UserCheck,
  BarChart3,
  LogOut,
  Home,
  Menu,
  Megaphone,
  Mail,
  Inbox,
  Send,
  ChartLine,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: '/admin/submissions', label: 'Leady', icon: Users },
  { href: '/admin/clients', label: 'Klienti', icon: UserCheck },
  { href: '/admin/analytics', label: 'Analytika', icon: BarChart3 },
];

const outreachItems = [
  { href: '/admin/outreach/leads', label: 'Leady', icon: Users },
  { href: '/admin/outreach/inboxes', label: 'Schránky', icon: Mail },
  { href: '/admin/outreach/campaigns', label: 'Kampane', icon: Send },
  { href: '/admin/outreach/replies', label: 'Odpovede', icon: Inbox },
  { href: '/admin/outreach/stats', label: 'Štatistiky', icon: ChartLine },
];

function NavLink({ href, label, icon: Icon, isActive }: { 
  href: string; 
  label: string; 
  icon: typeof Users; 
  isActive: boolean;
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
  const [outreachOpen, setOutreachOpen] = useState(true);
  const { signOut } = useAdminAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h1 className="text-lg font-heading font-bold text-foreground">
          Admin Panel
        </h1>
        <p className="text-xs text-muted-foreground">Ocenenie nehnuteľností</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
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

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isAdmin, isLoading } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate('/admin/login');
      } else if (!isAdmin) {
        navigate('/admin/login?error=not_admin');
      }
    }
  }, [user, isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Načítavam...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted">
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border p-4 flex items-center justify-between">
        <h1 className="text-lg font-heading font-bold">Admin Panel</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar currentPath={location.pathname} />
          </SheetContent>
        </Sheet>
      </header>

      <div className="flex">
        {/* Desktop sidebar - Fixed */}
        <aside className="hidden lg:block w-64 bg-card border-r border-border h-screen fixed top-0 left-0">
          <Sidebar currentPath={location.pathname} />
        </aside>

        {/* Main content - Scrollable */}
        <main className="flex-1 p-4 lg:p-8 lg:ml-64 min-h-screen pt-20 lg:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}