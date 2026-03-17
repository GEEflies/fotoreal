import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Trash2, Search, ChevronLeft, ChevronRight, Users, CheckCircle, CalendarDays, Clock, Phone } from 'lucide-react';
import { format, startOfWeek, startOfDay } from 'date-fns';
import { sk } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Tables } from '@/integrations/supabase/types';

type SubmissionStatus = 'nove' | 'kontaktovane' | 'ma_zaujem' | 'nema_zaujem' | 'zavolat_neskor' | 'uzavrete';

type Submission = Tables<'submissions'> & {
  form_data: Record<string, unknown> | null;
};

interface Stats {
  total: number;
  complete: number;
  thisWeek: number;
  today: number;
}

const STATUS_OPTIONS: { value: SubmissionStatus; label: string; color: string }[] = [
  { value: 'nove', label: 'Nové', color: 'bg-blue-500/10 text-blue-600' },
  { value: 'kontaktovane', label: 'Kontaktované', color: 'bg-orange-500/10 text-orange-600' },
  { value: 'ma_zaujem', label: 'Má záujem', color: 'bg-green-500/10 text-green-600' },
  { value: 'nema_zaujem', label: 'Nemá záujem', color: 'bg-red-500/10 text-red-600' },
  { value: 'zavolat_neskor', label: 'Zavolať neskôr', color: 'bg-purple-500/10 text-purple-600' },
  { value: 'uzavrete', label: 'Uzavreté', color: 'bg-muted text-muted-foreground' },
];

const PAGE_SIZE = 20;

export default function AdminSubmissions() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, complete: 0, thisWeek: 0, today: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubmissions();
  }, [statusFilter, typeFilter, page]);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      // Fetch stats
      const { data: allData } = await supabase
        .from('submissions')
        .select('created_at, status');

      if (allData) {
        const now = new Date();
        const weekStart = startOfWeek(now, { weekStartsOn: 1 });
        const dayStart = startOfDay(now);

        setStats({
          total: allData.length,
          complete: allData.filter(s => s.status === 'uzavrete').length,
          thisWeek: allData.filter(s => new Date(s.created_at) >= weekStart).length,
          today: allData.filter(s => new Date(s.created_at) >= dayStart).length,
        });
      }

      // Fetch paginated submissions
      let query = supabase
        .from('submissions')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter as SubmissionStatus);
      }
      if (typeFilter !== 'all') {
        query = query.eq('property_type', typeFilter as 'byt' | 'dom' | 'pozemok');
      }

      const { data, count, error } = await query
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (error) throw error;

      setSubmissions((data as Submission[]) || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: 'Chyba',
        description: 'Nepodarilo sa načítať leady.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('submissions')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      toast({
        title: 'Lead zmazaný',
        description: 'Lead bol úspešne odstránený.',
      });
      fetchSubmissions();
    } catch (error) {
      console.error('Error deleting submission:', error);
      toast({
        title: 'Chyba',
        description: 'Nepodarilo sa zmazať lead.',
        variant: 'destructive',
      });
    } finally {
      setDeleteId(null);
    }
  };

  const handleStatusChange = async (e: React.MouseEvent, id: string, newStatus: SubmissionStatus) => {
    e.stopPropagation();
    try {
      const { error } = await supabase
        .from('submissions')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setSubmissions(submissions.map(s => 
        s.id === id ? { ...s, status: newStatus } : s
      ));
      toast({ title: 'Status aktualizovaný' });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Chyba',
        description: 'Nepodarilo sa aktualizovať status.',
        variant: 'destructive',
      });
    }
  };

  const getStatusOption = (status: string) => {
    return STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];
  };

  const getPropertyIcon = (type: string | null) => {
    if (type === 'byt') return '🏢';
    if (type === 'dom') return '🏠';
    return '🏘️';
  };

  const filteredSubmissions = submissions.filter(s => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      s.name?.toLowerCase().includes(searchLower) ||
      s.phone?.includes(search) ||
      (s.form_data as Record<string, unknown>)?.city?.toString().toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <AdminLayout>
      <div className="space-y-4 md:space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-heading font-bold text-foreground">Leady</h1>
          <p className="text-sm text-muted-foreground">Správa všetkých leadov</p>
        </div>

        {/* Stats Cards - Compact on mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-primary/10 rounded-lg">
                  <Users className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-bold">{stats.total}</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">Celkom</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-success/10 rounded-lg">
                  <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-success" />
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-bold">{stats.complete}</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">Uzavretých</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-warning/10 rounded-lg">
                  <CalendarDays className="h-4 w-4 md:h-5 md:w-5 text-warning" />
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-bold">{stats.thisWeek}</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">Tento týždeň</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-accent/10 rounded-lg">
                  <Clock className="h-4 w-4 md:h-5 md:w-5 text-accent" />
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-bold">{stats.today}</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">Dnes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters - Stack on mobile */}
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex flex-col gap-2 md:gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Hľadať..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }}>
                  <SelectTrigger className="flex-1 md:w-36 h-10">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Všetky</SelectItem>
                    {STATUS_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(0); }}>
                  <SelectTrigger className="flex-1 md:w-32 h-10">
                    <SelectValue placeholder="Typ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Všetky</SelectItem>
                    <SelectItem value="byt">Byt</SelectItem>
                    <SelectItem value="dom">Dom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leads */}
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-base">
              {totalCount} {totalCount === 1 ? 'lead' : totalCount < 5 ? 'leady' : 'leadov'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 md:p-4 md:pt-0">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Načítavam...</div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Žiadne leady
              </div>
            ) : (
              <>
                {/* Mobile: Stacked Cards */}
                <div className="md:hidden divide-y divide-border">
                  {filteredSubmissions.map((submission) => {
                    const statusOption = getStatusOption(submission.status);
                    return (
                      <div 
                        key={submission.id} 
                        className="p-4 active:bg-muted/50"
                        onClick={() => navigate(`/admin/submissions/${submission.id}`)}
                      >
                        {/* Header: Name + Property */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">
                              {submission.name || 'Bez mena'}
                            </p>
                            <a 
                              href={`tel:${submission.phone}`}
                              className="flex items-center gap-1 text-sm text-primary"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Phone className="h-3 w-3" />
                              {submission.phone || '-'}
                            </a>
                          </div>
                          <span className="text-2xl" title={submission.property_type || 'Neurčené'}>
                            {getPropertyIcon(submission.property_type)}
                          </span>
                        </div>

                        {/* Status + Step */}
                        <div className="flex items-center gap-2 mb-3" onClick={(e) => e.stopPropagation()}>
                          <Select 
                            value={submission.status} 
                            onValueChange={(v) => handleStatusChange({ stopPropagation: () => {} } as React.MouseEvent, submission.id, v as SubmissionStatus)}
                          >
                            <SelectTrigger className={`flex-1 h-9 text-xs ${statusOption.color}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUS_OPTIONS.map(option => (
                                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            Krok {submission.current_step}/11
                          </span>
                        </div>

                        {/* Footer: Date + Delete */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(submission.created_at), 'd. MMM yyyy, HH:mm', { locale: sk })}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={(e) => { e.stopPropagation(); setDeleteId(submission.id); }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop: Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Meno</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Telefón</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Typ</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Krok</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Vytvorené</th>
                        <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Akcie</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubmissions.map((submission) => {
                        const statusOption = getStatusOption(submission.status);
                        return (
                          <tr 
                            key={submission.id} 
                            className="border-b border-border hover:bg-muted/50 cursor-pointer"
                            onClick={() => navigate(`/admin/submissions/${submission.id}`)}
                          >
                            <td className="py-3 px-2">
                              <span className="font-medium text-foreground">
                                {submission.name || 'Bez mena'}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-muted-foreground">
                              {submission.phone || '-'}
                            </td>
                            <td className="py-3 px-2" onClick={(e) => e.stopPropagation()}>
                              <Select 
                                value={submission.status} 
                                onValueChange={(v) => handleStatusChange({ stopPropagation: () => {} } as React.MouseEvent, submission.id, v as SubmissionStatus)}
                              >
                                <SelectTrigger className={`w-36 h-7 text-xs ${statusOption.color}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {STATUS_OPTIONS.map(option => (
                                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="py-3 px-2">
                              <span className="text-lg" title={submission.property_type || 'Neurčené'}>
                                {getPropertyIcon(submission.property_type)}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-muted-foreground">
                              {submission.current_step}/11
                            </td>
                            <td className="py-3 px-2 text-sm text-muted-foreground">
                              {format(new Date(submission.created_at), 'd. MMM yyyy, HH:mm', { locale: sk })}
                            </td>
                            <td className="py-3 px-2" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  onClick={() => setDeleteId(submission.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between p-4 pt-4 border-t border-border">
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {page + 1} / {totalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={page === 0}
                        className="h-9 px-3"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="hidden sm:inline ml-1">Predošlá</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                        disabled={page === totalPages - 1}
                        className="h-9 px-3"
                      >
                        <span className="hidden sm:inline mr-1">Ďalšia</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Zmazať lead?</AlertDialogTitle>
            <AlertDialogDescription>
              Táto akcia je nevratná.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-10">Zrušiť</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="h-10 bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Zmazať
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}