import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Trash2, StickyNote, Image, Phone } from 'lucide-react';
import { format } from 'date-fns';
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

const STATUS_OPTIONS: { value: SubmissionStatus; label: string; color: string }[] = [
  { value: 'nove', label: 'Nové', color: 'bg-blue-500/10 text-blue-600' },
  { value: 'kontaktovane', label: 'Kontaktované', color: 'bg-orange-500/10 text-orange-600' },
  { value: 'ma_zaujem', label: 'Má záujem', color: 'bg-green-500/10 text-green-600' },
  { value: 'nema_zaujem', label: 'Nemá záujem', color: 'bg-red-500/10 text-red-600' },
  { value: 'zavolat_neskor', label: 'Zavolať neskôr', color: 'bg-purple-500/10 text-purple-600' },
  { value: 'uzavrete', label: 'Uzavreté', color: 'bg-muted text-muted-foreground' },
];

export default function AdminSubmissionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (id) fetchSubmission();
  }, [id]);

  const fetchSubmission = async () => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      setSubmission(data as Submission | null);
    } catch (error) {
      console.error('Error fetching submission:', error);
      toast({
        title: 'Chyba',
        description: 'Nepodarilo sa načítať lead.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: SubmissionStatus) => {
    if (!submission) return;
    try {
      const { error } = await supabase
        .from('submissions')
        .update({ status: newStatus })
        .eq('id', submission.id);

      if (error) throw error;
      setSubmission({ ...submission, status: newStatus });
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

  const handleDelete = async () => {
    if (!submission) return;
    try {
      const { error } = await supabase
        .from('submissions')
        .delete()
        .eq('id', submission.id);

      if (error) throw error;
      toast({ title: 'Lead zmazaný' });
      navigate('/admin/submissions');
    } catch (error) {
      console.error('Error deleting submission:', error);
      toast({
        title: 'Chyba',
        description: 'Nepodarilo sa zmazať lead.',
        variant: 'destructive',
      });
    }
  };

  const getStatusOption = (status: string) => {
    return STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];
  };

  const getPropertyLabel = (type: string | null) => {
    if (type === 'byt') return 'Byt';
    if (type === 'dom') return 'Dom';
    return 'Neurčené';
  };

  const getConditionLabel = (condition: string | null) => {
    const labels: Record<string, string> = {
      original: 'Pôvodný stav',
      renovated: 'Renovovaný',
      new: 'Novostavba',
    };
    return condition ? labels[condition] || condition : '-';
  };

  const getHeatingLabel = (heating: string | null) => {
    const labels: Record<string, string> = {
      central: 'Centrálne',
      gas: 'Plynové',
      electric: 'Elektrické',
      solid: 'Tuhé palivo',
      heat_pump: 'Tepelné čerpadlo',
      other: 'Iné',
    };
    return heating ? labels[heating] || heating : '-';
  };

  const formatAccessories = (formData: Record<string, unknown> | null) => {
    if (!formData) return '-';
    const parts: string[] = [];
    
    if (formData.hasBalcony) {
      parts.push(`Balkón${formData.balconySize ? ` (${formData.balconySize} m²)` : ''}`);
    }
    if (formData.hasTerrace) {
      parts.push(`Terasa${formData.terraceSize ? ` (${formData.terraceSize} m²)` : ''}`);
    }
    if (formData.hasCellar) {
      parts.push(`Pivnica${formData.cellarSize ? ` (${formData.cellarSize} m²)` : ''}`);
    }
    if (formData.parkingType && formData.parkingType !== 'none') {
      const parkingLabels: Record<string, string> = {
        outdoor: 'Vonkajšie státie',
        garage: 'Garáž',
        underground: 'Podzemné státie',
      };
      parts.push(`${parkingLabels[formData.parkingType as string] || formData.parkingType}${formData.parkingCount ? ` (${formData.parkingCount}x)` : ''}`);
    }
    
    return parts.length > 0 ? parts.join(', ') : 'Žiadne';
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!submission) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Lead nebol nájdený.</p>
          <Button asChild>
            <Link to="/admin/submissions">Späť na zoznam</Link>
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const formData = submission.form_data || {};
  const currentStatus = getStatusOption(submission.status);

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Header - Mobile optimized */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild className="h-9 w-9 shrink-0">
              <Link to="/admin/submissions">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg md:text-2xl font-heading font-bold text-foreground truncate">
                {submission.name || 'Bez mena'}
              </h1>
              <a 
                href={`tel:${submission.phone}`}
                className="flex items-center gap-1 text-sm text-primary"
              >
                <Phone className="h-3 w-3" />
                {submission.phone || 'Bez telefónu'}
              </a>
            </div>
          </div>
          
          {/* Actions row - full width on mobile */}
          <div className="flex gap-2">
            <Select value={submission.status} onValueChange={handleStatusChange}>
              <SelectTrigger className={`flex-1 h-10 ${currentStatus.color}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="destructive" size="icon" onClick={() => setShowDelete(true)} className="h-10 w-10 shrink-0">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Single Compact Table */}
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border">
                {/* Contact Section */}
                <tr className="bg-muted/50">
                  <td colSpan={2} className="px-3 py-2 font-semibold text-foreground text-xs uppercase tracking-wide">
                    Kontakt
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">Meno</td>
                  <td className="px-3 py-2 font-medium text-foreground">{submission.name || '-'}</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">Telefón</td>
                  <td className="px-3 py-2">
                    <a href={`tel:${submission.phone}`} className="font-medium text-primary">
                      {submission.phone || '-'}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">GDPR</td>
                  <td className={`px-3 py-2 font-medium ${submission.gdpr_consent ? 'text-success' : 'text-destructive'}`}>
                    {submission.gdpr_consent ? 'Áno' : 'Nie'}
                  </td>
                </tr>

                {/* Address Section */}
                <tr className="bg-muted/50">
                  <td colSpan={2} className="px-3 py-2 font-semibold text-foreground text-xs uppercase tracking-wide">
                    Adresa
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">Ulica</td>
                  <td className="px-3 py-2 font-medium text-foreground">{String(formData.street ?? '-')}</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">Mesto</td>
                  <td className="px-3 py-2 font-medium text-foreground">{String(formData.city ?? '-')}</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">PSČ</td>
                  <td className="px-3 py-2 font-medium text-foreground">{String(formData.zipCode ?? '-')}</td>
                </tr>

                {/* Property Section */}
                <tr className="bg-muted/50">
                  <td colSpan={2} className="px-3 py-2 font-semibold text-foreground text-xs uppercase tracking-wide">
                    Nehnuteľnosť
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">Typ</td>
                  <td className="px-3 py-2 font-medium text-foreground">{getPropertyLabel(submission.property_type)}</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">Plocha</td>
                  <td className="px-3 py-2 font-medium text-foreground">{formData.floorArea ? `${formData.floorArea} m²` : '-'}</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">Izby</td>
                  <td className="px-3 py-2 font-medium text-foreground">{String(formData.rooms ?? '-')}</td>
                </tr>
                {submission.property_type === 'byt' && (
                  <>
                    <tr>
                      <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">Poschodie</td>
                      <td className="px-3 py-2 font-medium text-foreground">{String(formData.floor ?? '-')}</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">Výťah</td>
                      <td className="px-3 py-2 font-medium text-foreground">{formData.hasElevator ? 'Áno' : 'Nie'}</td>
                    </tr>
                  </>
                )}
                <tr>
                  <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">Stav</td>
                  <td className="px-3 py-2 font-medium text-foreground">{getConditionLabel(formData.condition as string)}</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">Kúrenie</td>
                  <td className="px-3 py-2 font-medium text-foreground">{getHeatingLabel(formData.heatingType as string)}</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">Rok výstavby</td>
                  <td className="px-3 py-2 font-medium text-foreground">{String(formData.yearBuilt ?? '-')}</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">Rekonštrukcia</td>
                  <td className="px-3 py-2 font-medium text-foreground">{String(formData.yearRenovated ?? '-')}</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">Príslušenstvo</td>
                  <td className="px-3 py-2 font-medium text-foreground">{formatAccessories(formData)}</td>
                </tr>

                {/* Metadata Section */}
                <tr className="bg-muted/50">
                  <td colSpan={2} className="px-3 py-2 font-semibold text-foreground text-xs uppercase tracking-wide">
                    Metadata
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">Krok</td>
                  <td className="px-3 py-2 font-medium text-foreground">{submission.current_step}/11</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">Vytvorené</td>
                  <td className="px-3 py-2 font-medium text-foreground">{format(new Date(submission.created_at), 'd. MMM yyyy, HH:mm', { locale: sk })}</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">Aktualizované</td>
                  <td className="px-3 py-2 font-medium text-foreground">{format(new Date(submission.updated_at), 'd. MMM yyyy, HH:mm', { locale: sk })}</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">Notifikácie</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-2">
                      <span className="flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${submission.phone_sms_sent ? 'bg-success' : 'bg-muted-foreground'}`}></span>
                        <span className="text-xs text-muted-foreground">SMS</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${submission.email_sent ? 'bg-success' : 'bg-muted-foreground'}`}></span>
                        <span className="text-xs text-muted-foreground">Email</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${submission.webhook_sent ? 'bg-success' : 'bg-muted-foreground'}`}></span>
                        <span className="text-xs text-muted-foreground">Webhook</span>
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Notes - only if exists */}
        {formData.note && (
          <Card>
            <CardHeader className="pb-2 px-3 pt-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <StickyNote className="h-4 w-4" />
                Poznámka
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <p className="text-sm text-foreground whitespace-pre-wrap">{formData.note as string}</p>
            </CardContent>
          </Card>
        )}

        {/* Photos - only if exists */}
        {submission.photos && submission.photos.length > 0 && (
          <Card>
            <CardHeader className="pb-2 px-3 pt-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Image className="h-4 w-4" />
                Fotky ({submission.photos.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="grid grid-cols-3 gap-2">
                {submission.photos.map((photo, index) => (
                  <a
                    key={index}
                    href={photo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-square rounded-lg overflow-hidden bg-muted hover:opacity-80 transition-opacity"
                  >
                    <img
                      src={photo}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
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