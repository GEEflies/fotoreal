import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { RefreshCw, Mail, MailOpen, Inbox } from 'lucide-react';
import { format } from 'date-fns';

interface Reply {
  id: string;
  from_email: string;
  subject: string | null;
  body_text: string | null;
  received_at: string;
  is_read: boolean;
  lead_id: string | null;
}

export default function OutreachReplies() {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReply, setSelectedReply] = useState<Reply | null>(null);

  const fetchReplies = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('outreach_replies')
      .select('*')
      .order('received_at', { ascending: false })
      .limit(200);
    if (error) toast.error('Chyba pri načítaní odpovedí');
    else setReplies((data as Reply[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchReplies(); }, []);

  const markAsRead = async (reply: Reply) => {
    if (!reply.is_read) {
      await supabase.from('outreach_replies').update({ is_read: true } as any).eq('id', reply.id);
    }
    setSelectedReply(reply);
    setReplies(prev => prev.map(r => r.id === reply.id ? { ...r, is_read: true } : r));
  };

  const fetchNewReplies = async () => {
    toast.info('Načítavanie nových odpovedí... (vyžaduje IMAP edge function)');
    // Will call outreach-fetch-replies edge function in Phase 4
    try {
      await supabase.functions.invoke('outreach-fetch-replies');
      fetchReplies();
      toast.success('Odpovede aktualizované');
    } catch {
      toast.error('Chyba pri načítaní odpovedí');
    }
  };

  const unreadCount = replies.filter(r => !r.is_read).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold">Odpovede</h1>
            <p className="text-sm text-muted-foreground">
              Centralizovaná schránka · {unreadCount} neprečítaných
            </p>
          </div>
          <Button variant="outline" onClick={fetchNewReplies}>
            <RefreshCw className="h-4 w-4 mr-2" />Načítať nové
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Reply list */}
          <div className="space-y-2">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Načítavam...</div>
            ) : replies.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Inbox className="h-10 w-10 mx-auto mb-3 opacity-50" />
                  <p>Žiadne odpovede.</p>
                </CardContent>
              </Card>
            ) : (
              replies.map(reply => (
                <Card
                  key={reply.id}
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedReply?.id === reply.id ? 'ring-2 ring-primary' : ''
                  } ${!reply.is_read ? 'border-primary/30 bg-primary/5' : ''}`}
                  onClick={() => markAsRead(reply)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-2">
                      {reply.is_read ? (
                        <MailOpen className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      ) : (
                        <Mail className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm truncate ${!reply.is_read ? 'font-semibold' : ''}`}>
                            {reply.from_email}
                          </span>
                          <span className="text-xs text-muted-foreground shrink-0 ml-2">
                            {format(new Date(reply.received_at), 'dd.MM HH:mm')}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {reply.subject || '(bez predmetu)'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Reply detail */}
          <Card className="sticky top-20">
            <CardContent className="p-4">
              {selectedReply ? (
                <div>
                  <div className="mb-4 pb-4 border-b border-border">
                    <p className="font-medium">{selectedReply.from_email}</p>
                    <p className="text-sm text-muted-foreground">{selectedReply.subject || '(bez predmetu)'}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(selectedReply.received_at), 'dd.MM.yyyy HH:mm')}
                    </p>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm font-sans">
                      {selectedReply.body_text || '(prázdna správa)'}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Vyberte odpoveď na zobrazenie</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
