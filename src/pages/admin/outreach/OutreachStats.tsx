import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Send, CheckCircle, XCircle, Mail, Users } from 'lucide-react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

export default function OutreachStats() {
  const [stats, setStats] = useState({
    totalEmails: 0, sent: 0, failed: 0, queued: 0, totalLeads: 0, totalCampaigns: 0,
  });
  const [inboxStats, setInboxStats] = useState<{ email: string; sent_today: number; daily_limit: number }[]>([]);
  const [failedEmails, setFailedEmails] = useState<{ id: string; subject: string | null; error_message: string | null; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);

      const [emailsRes, leadsRes, campaignsRes, inboxesRes, failedRes] = await Promise.all([
        supabase.from('outreach_emails').select('status'),
        supabase.from('outreach_leads').select('id', { count: 'exact', head: true }),
        supabase.from('outreach_campaigns').select('id', { count: 'exact', head: true }),
        supabase.from('outreach_inboxes').select('email, sent_today, daily_limit'),
        supabase.from('outreach_emails').select('id, subject, error_message, created_at').eq('status', 'failed').order('created_at', { ascending: false }).limit(20),
      ]);

      const emails = (emailsRes.data as any[]) || [];
      setStats({
        totalEmails: emails.length,
        sent: emails.filter(e => e.status === 'sent').length,
        failed: emails.filter(e => e.status === 'failed').length,
        queued: emails.filter(e => e.status === 'queued').length,
        totalLeads: leadsRes.count || 0,
        totalCampaigns: campaignsRes.count || 0,
      });
      setInboxStats((inboxesRes.data as any[]) || []);
      setFailedEmails((failedRes.data as any[]) || []);
      setLoading(false);
    };
    fetchStats();
  }, []);

  const successRate = stats.totalEmails > 0
    ? Math.round((stats.sent / stats.totalEmails) * 100)
    : 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Outreach štatistiky</h1>
          <p className="text-sm text-muted-foreground">Prehľad výkonnosti outreach kampaní</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Načítavam...</div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Send className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{stats.sent}</p>
                    <p className="text-xs text-muted-foreground">Odoslaných</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{successRate}%</p>
                    <p className="text-xs text-muted-foreground">Úspešnosť</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <XCircle className="h-5 w-5 text-destructive" />
                  <div>
                    <p className="text-2xl font-bold">{stats.failed}</p>
                    <p className="text-xs text-muted-foreground">Zlyhané</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalLeads}</p>
                    <p className="text-xs text-muted-foreground">Leady</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Per-inbox stats */}
            <Card>
              <CardHeader><CardTitle className="text-lg">Odoslané podľa schránok</CardTitle></CardHeader>
              <CardContent>
                {inboxStats.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Žiadne schránky</p>
                ) : (
                  <div className="space-y-2">
                    {inboxStats.map((inbox, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm">{inbox.email}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${Math.min((inbox.sent_today / inbox.daily_limit) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-16 text-right">
                            {inbox.sent_today}/{inbox.daily_limit}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Failed emails */}
            {failedEmails.length > 0 && (
              <Card>
                <CardHeader><CardTitle className="text-lg">Posledné zlyhané emaily</CardTitle></CardHeader>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Predmet</TableHead>
                      <TableHead>Chyba</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {failedEmails.map(e => (
                      <TableRow key={e.id}>
                        <TableCell className="text-sm">{e.subject || '—'}</TableCell>
                        <TableCell className="text-sm text-destructive">{e.error_message || '—'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
