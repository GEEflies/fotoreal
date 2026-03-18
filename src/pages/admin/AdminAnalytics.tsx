import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Image, TrendingUp, DollarSign, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { sk } from 'date-fns/locale';

// Stripe package pricing
const CREDIT_PACKAGES = [
  { credits: 20, price: 14 },
  { credits: 40, price: 26 },
  { credits: 80, price: 48 },
  { credits: 160, price: 87 },
  { credits: 320, price: 165 },
];

// Average cost per photo for AI processing (estimate)
const COST_PER_PHOTO_EUR = 0.03;

interface ClientRow {
  user_id: string;
  email: string;
  user_created_at: string;
  company_name: string | null;
  free_credits: number;
  purchased_credits: number;
  total_used: number;
  properties_count: number;
}

export default function AdminAnalytics() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [totalPhotos, setTotalPhotos] = useState(0);
  const [processedPhotos, setProcessedPhotos] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);

    // Load clients
    const { data: clientData } = await supabase.rpc('get_admin_user_list');
    if (clientData) setClients(clientData as ClientRow[]);

    // Load photo stats
    const { count: total } = await supabase
      .from('property_photos')
      .select('*', { count: 'exact', head: true });

    const { count: processed } = await supabase
      .from('property_photos')
      .select('*', { count: 'exact', head: true })
      .eq('ai_status', 'done');

    setTotalPhotos(total ?? 0);
    setProcessedPhotos(processed ?? 0);
    setIsLoading(false);
  };

  // Calculate revenue estimate from purchased credits
  const totalPurchasedCredits = clients.reduce((s, c) => s + c.purchased_credits, 0);
  const totalUsedCredits = clients.reduce((s, c) => s + c.total_used, 0);
  const totalFreeCredits = clients.reduce((s, c) => s + c.free_credits, 0);

  // Estimate revenue: use weighted average price per credit from packages
  const avgPricePerCredit = CREDIT_PACKAGES.reduce((s, p) => s + p.price / p.credits, 0) / CREDIT_PACKAGES.length;
  const estimatedRevenue = Math.round(totalPurchasedCredits * avgPricePerCredit * 100) / 100;

  // Costs
  const totalCosts = Math.round(processedPhotos * COST_PER_PHOTO_EUR * 100) / 100;
  const estimatedProfit = Math.round((estimatedRevenue - totalCosts) * 100) / 100;

  // Top clients by usage
  const topClients = [...clients]
    .filter(c => c.total_used > 0)
    .sort((a, b) => b.total_used - a.total_used)
    .slice(0, 10);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-heading font-bold text-foreground">Analytika</h1>
          <Button variant="outline" size="icon" onClick={loadData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Klienti</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clients.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {clients.filter(c => c.purchased_credits > 0).length} platiacich
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Fotky</CardTitle>
              <Image className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{processedPhotos}</div>
              <p className="text-xs text-muted-foreground mt-1">
                z {totalPhotos} nahratých
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Náklady</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCosts} €</div>
              <p className="text-xs text-muted-foreground mt-1">
                ~{COST_PER_PHOTO_EUR} € / fotka
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estimatedRevenue} €</div>
              <p className="text-xs text-muted-foreground mt-1">
                Profit: <span className={estimatedProfit >= 0 ? 'text-green-600' : 'text-destructive'}>{estimatedProfit} €</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Credit overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Bezplatné kredity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFreeCredits}</div>
              <p className="text-xs text-muted-foreground">rozdané celkovo</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Zakúpené kredity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPurchasedCredits}</div>
              <p className="text-xs text-muted-foreground">celkovo</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Použité kredity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsedCredits}</div>
              <p className="text-xs text-muted-foreground">celkovo</p>
            </CardContent>
          </Card>
        </div>

        {/* Top clients */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top klienti podľa použitia</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Firma</TableHead>
                  <TableHead className="text-center">Použité</TableHead>
                  <TableHead className="text-center">Zakúpené</TableHead>
                  <TableHead className="text-center">Nehnuteľnosti</TableHead>
                  <TableHead>Registrácia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Žiadni aktívni klienti
                    </TableCell>
                  </TableRow>
                ) : (
                  topClients.map(c => (
                    <TableRow key={c.user_id}>
                      <TableCell className="font-medium">{c.email}</TableCell>
                      <TableCell>{c.company_name || '—'}</TableCell>
                      <TableCell className="text-center font-medium">{c.total_used}</TableCell>
                      <TableCell className="text-center">{c.purchased_credits}</TableCell>
                      <TableCell className="text-center">{c.properties_count}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(c.user_created_at), 'd. MMM yyyy', { locale: sk })}
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
