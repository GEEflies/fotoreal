import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Plus, Building2, CreditCard, Home } from 'lucide-react';
import { format } from 'date-fns';
import { sk } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface ClientInfo {
  user_id: string;
  email: string;
  user_created_at: string;
  company_name: string | null;
  ico: string | null;
  address: string | null;
  logo_url: string | null;
  free_credits: number;
  purchased_credits: number;
  total_used: number;
  properties_count: number;
}

interface Property {
  id: string;
  name: string;
  status: string;
  created_at: string;
  photo_count?: number;
}

export default function AdminClientDetail() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [client, setClient] = useState<ClientInfo | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addCreditsAmount, setAddCreditsAmount] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userId) loadData();
  }, [userId]);

  const loadData = async () => {
    // Load client info from the function
    const { data: allClients } = await supabase.rpc('get_admin_user_list');
    const found = (allClients as ClientInfo[] | null)?.find(c => c.user_id === userId);
    if (found) setClient(found);

    // Load properties
    const { data: props } = await supabase
      .from('properties')
      .select('id, name, status, created_at')
      .eq('user_id', userId!)
      .order('created_at', { ascending: false });

    if (props) {
      // Get photo counts
      const propsWithCounts: Property[] = [];
      for (const p of props) {
        const { count } = await supabase
          .from('property_photos')
          .select('*', { count: 'exact', head: true })
          .eq('property_id', p.id);
        propsWithCounts.push({ ...p, photo_count: count ?? 0 });
      }
      setProperties(propsWithCounts);
    }

    setIsLoading(false);
  };

  const handleAddCredits = async () => {
    const amount = parseInt(addCreditsAmount);
    if (!amount || amount <= 0 || !client) return;

    setIsSaving(true);
    
    // First check if user_credits row exists
    const { data: existing } = await supabase
      .from('user_credits')
      .select('id, purchased_credits')
      .eq('user_id', client.user_id)
      .maybeSingle();

    let error;
    if (existing) {
      // Update existing row
      ({ error } = await supabase
        .from('user_credits')
        .update({ purchased_credits: existing.purchased_credits + amount })
        .eq('user_id', client.user_id));
    } else {
      // Insert new row
      ({ error } = await supabase
        .from('user_credits')
        .insert({ user_id: client.user_id, purchased_credits: amount, free_credits: 5 }));
    }

    if (error) {
      toast({ title: 'Chyba', description: 'Nepodarilo sa pridať kredity.', variant: 'destructive' });
    } else {
      toast({ title: 'Hotovo', description: `Pridaných ${amount} kreditov.` });
      setClient(prev => prev ? { ...prev, purchased_credits: (existing?.purchased_credits ?? 0) + amount } : null);
      setAddCreditsAmount('');
    }
    setIsSaving(false);
  };

  const statusLabels: Record<string, string> = {
    uploading: 'Nahráva sa',
    processing: 'Spracováva sa',
    done: 'Hotové',
    error: 'Chyba',
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!client) {
    return (
      <AdminLayout>
        <div className="text-center py-20 text-muted-foreground">Klient nenájdený</div>
      </AdminLayout>
    );
  }

  const available = client.free_credits + client.purchased_credits - client.total_used;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/clients')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">{client.email}</h1>
            <p className="text-sm text-muted-foreground">
              Registrácia: {format(new Date(client.user_created_at), 'd. MMMM yyyy', { locale: sk })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Profil firmy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Názov firmy</span>
                <span className="font-medium">{client.company_name || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">IČO</span>
                <span className="font-medium">{client.ico || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Adresa</span>
                <span className="font-medium">{client.address || '—'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Credits */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Kredity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Bezplatné</p>
                  <p className="text-xl font-bold">{client.free_credits}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Zakúpené</p>
                  <p className="text-xl font-bold">{client.purchased_credits}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Použité</p>
                  <p className="text-xl font-bold">{client.total_used}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Dostupné</p>
                  <p className="text-xl font-bold text-primary">{available}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Input
                  type="number"
                  min="1"
                  placeholder="Počet kreditov"
                  value={addCreditsAmount}
                  onChange={e => setAddCreditsAmount(e.target.value)}
                  className="w-40"
                />
                <Button onClick={handleAddCredits} disabled={isSaving || !addCreditsAmount} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Pridať
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Properties */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Home className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Nehnuteľnosti ({properties.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Názov</TableHead>
                  <TableHead>Stav</TableHead>
                  <TableHead className="text-center">Fotky</TableHead>
                  <TableHead>Vytvorené</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      Žiadne nehnuteľnosti
                    </TableCell>
                  </TableRow>
                ) : (
                  properties.map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell>
                        <Badge variant={p.status === 'done' ? 'default' : 'secondary'}>
                          {statusLabels[p.status] || p.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{p.photo_count}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(p.created_at), 'd. MMM yyyy', { locale: sk })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
