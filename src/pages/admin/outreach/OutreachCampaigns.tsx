import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Send, Pause, Play, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

interface Campaign {
  id: string;
  name: string;
  status: string;
  lead_count: number;
  created_at: string;
  updated_at: string;
}

const statusLabels: Record<string, string> = {
  draft: 'Koncept',
  generating: 'Generujem...',
  ready: 'Pripravená',
  sending: 'Odosiela sa',
  paused: 'Pozastavená',
  completed: 'Dokončená',
};

const statusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  draft: 'outline',
  generating: 'secondary',
  ready: 'default',
  sending: 'default',
  paused: 'secondary',
  completed: 'outline',
};

export default function OutreachCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('outreach_campaigns')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) toast.error('Chyba pri načítaní kampaní');
    else setCampaigns((data as Campaign[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchCampaigns(); }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold">Kampane</h1>
            <p className="text-sm text-muted-foreground">Cold email kampane s AI personalizáciou</p>
          </div>
          <Link to="/admin/outreach/campaigns/new">
            <Button><Plus className="h-4 w-4 mr-2" />Nová kampaň</Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Načítavam...</div>
        ) : campaigns.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Send className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>Žiadne kampane. Vytvorte prvú kampaň.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {campaigns.map(c => (
              <Card key={c.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{c.name}</span>
                        <Badge variant={statusVariants[c.status] || 'outline'}>
                          {statusLabels[c.status] || c.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {c.lead_count} leadov · Vytvorená {format(new Date(c.created_at), 'dd.MM.yyyy')}
                      </p>
                    </div>
                    <Link to={`/admin/outreach/campaigns/${c.id}`}>
                      <Button variant="outline" size="sm"><Eye className="h-4 w-4 mr-1" />Detail</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
