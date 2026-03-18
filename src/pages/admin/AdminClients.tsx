import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, CreditCard, Building2, Search } from 'lucide-react';
import { format } from 'date-fns';
import { sk } from 'date-fns/locale';

interface ClientRow {
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

export default function AdminClients() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    const { data, error } = await supabase.rpc('get_admin_user_list');
    if (!error && data) {
      setClients(data as ClientRow[]);
    }
    setIsLoading(false);
  };

  const filtered = clients.filter(c =>
    (c.email?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (c.company_name?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const totalClients = clients.length;
  const totalPurchased = clients.reduce((s, c) => s + c.purchased_credits, 0);
  const withCompany = clients.filter(c => c.company_name).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-heading font-bold text-foreground">Klienti</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Celkom klientov</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClients}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Zakúpené kredity</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPurchased}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">S firmou</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{withCompany}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Hľadať podľa emailu alebo firmy..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Firma</TableHead>
                  <TableHead className="text-center">Kredity</TableHead>
                  <TableHead className="text-center">Nehnuteľnosti</TableHead>
                  <TableHead>Registrácia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Načítavam...
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Žiadni klienti
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map(c => {
                    const available = c.free_credits + c.purchased_credits - c.total_used;
                    return (
                      <TableRow
                        key={c.user_id}
                        className="cursor-pointer"
                        onClick={() => navigate(`/admin/clients/${c.user_id}`)}
                      >
                        <TableCell className="font-medium">{c.email}</TableCell>
                        <TableCell>{c.company_name || '—'}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={available > 0 ? 'default' : 'secondary'}>
                            {available} voľných
                          </Badge>
                          <span className="text-xs text-muted-foreground ml-2">
                            ({c.free_credits}F + {c.purchased_credits}K − {c.total_used}U)
                          </span>
                        </TableCell>
                        <TableCell className="text-center">{c.properties_count}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {format(new Date(c.user_created_at), 'd. MMM yyyy', { locale: sk })}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
