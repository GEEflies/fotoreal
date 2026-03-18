import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Mail, Inbox, Star } from 'lucide-react';

interface InboxRow {
  id: string;
  email: string;
  display_name: string | null;
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_password: string;
  imap_host: string | null;
  imap_port: number | null;
  daily_limit: number;
  sent_today: number;
  is_active: boolean;
  is_reply_to: boolean;
  created_at: string;
}

const emptyForm = {
  email: '', display_name: '', smtp_host: '', smtp_port: 465,
  smtp_user: '', smtp_password: '', imap_host: '', imap_port: 993,
  daily_limit: 50, is_active: true, is_reply_to: false,
};

export default function OutreachInboxes() {
  const [inboxes, setInboxes] = useState<InboxRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchInboxes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('outreach_inboxes')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) toast.error('Chyba pri načítaní schránok');
    else setInboxes((data as InboxRow[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchInboxes(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (inbox: InboxRow) => {
    setEditing(inbox.id);
    setForm({
      email: inbox.email,
      display_name: inbox.display_name || '',
      smtp_host: inbox.smtp_host,
      smtp_port: inbox.smtp_port,
      smtp_user: inbox.smtp_user,
      smtp_password: inbox.smtp_password,
      imap_host: inbox.imap_host || '',
      imap_port: inbox.imap_port || 993,
      daily_limit: inbox.daily_limit,
      is_active: inbox.is_active,
      is_reply_to: inbox.is_reply_to,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.email || !form.smtp_host || !form.smtp_user || !form.smtp_password) {
      toast.error('Vyplňte všetky povinné polia');
      return;
    }

    const payload = {
      email: form.email,
      display_name: form.display_name || null,
      smtp_host: form.smtp_host,
      smtp_port: form.smtp_port,
      smtp_user: form.smtp_user,
      smtp_password: form.smtp_password,
      imap_host: form.imap_host || null,
      imap_port: form.imap_port || null,
      daily_limit: form.daily_limit,
      is_active: form.is_active,
      is_reply_to: form.is_reply_to,
    };

    // If setting as reply-to, unset others first
    if (form.is_reply_to) {
      await supabase.from('outreach_inboxes').update({ is_reply_to: false } as any).eq('is_reply_to', true);
    }

    if (editing) {
      const { error } = await supabase.from('outreach_inboxes').update(payload as any).eq('id', editing);
      if (error) { toast.error('Chyba pri ukladaní'); return; }
      toast.success('Schránka aktualizovaná');
    } else {
      const { error } = await supabase.from('outreach_inboxes').insert(payload as any);
      if (error) { toast.error('Chyba pri pridávaní'); return; }
      toast.success('Schránka pridaná');
    }

    setDialogOpen(false);
    fetchInboxes();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Naozaj chcete zmazať túto schránku?')) return;
    const { error } = await supabase.from('outreach_inboxes').delete().eq('id', id);
    if (error) toast.error('Chyba pri mazaní');
    else { toast.success('Schránka zmazaná'); fetchInboxes(); }
  };

  const handleToggleActive = async (inbox: InboxRow) => {
    await supabase.from('outreach_inboxes').update({ is_active: !inbox.is_active } as any).eq('id', inbox.id);
    fetchInboxes();
  };

  const setField = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold">Schránky</h1>
            <p className="text-sm text-muted-foreground">SMTP účty pre odosielanie outreach emailov</p>
          </div>
          <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Pridať schránku</Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Načítavam...</div>
        ) : inboxes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Inbox className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>Žiadne schránky. Pridajte SMTP účet na odosielanie.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {inboxes.map(inbox => (
              <Card key={inbox.id} className={!inbox.is_active ? 'opacity-60' : ''}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Mail className="h-5 w-5 text-primary shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{inbox.email}</span>
                          {inbox.is_reply_to && (
                            <Badge variant="default" className="text-xs"><Star className="h-3 w-3 mr-1" />Reply-To</Badge>
                          )}
                          {!inbox.is_active && <Badge variant="secondary" className="text-xs">Neaktívna</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {inbox.display_name && `${inbox.display_name} · `}
                          {inbox.smtp_host}:{inbox.smtp_port} · 
                          Odoslané dnes: {inbox.sent_today}/{inbox.daily_limit}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Switch checked={inbox.is_active} onCheckedChange={() => handleToggleActive(inbox)} />
                      <Button variant="ghost" size="icon" onClick={() => openEdit(inbox)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(inbox.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Upraviť schránku' : 'Nová schránka'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Email *</Label>
                <Input value={form.email} onChange={e => setField('email', e.target.value)} placeholder="outreach@firma.sk" />
              </div>
              <div>
                <Label>Zobrazované meno</Label>
                <Input value={form.display_name} onChange={e => setField('display_name', e.target.value)} placeholder="Ján Novák" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>SMTP Host *</Label>
                <Input value={form.smtp_host} onChange={e => setField('smtp_host', e.target.value)} placeholder="smtp.gmail.com" />
              </div>
              <div>
                <Label>SMTP Port</Label>
                <Input type="number" value={form.smtp_port} onChange={e => setField('smtp_port', parseInt(e.target.value))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>SMTP User *</Label>
                <Input value={form.smtp_user} onChange={e => setField('smtp_user', e.target.value)} />
              </div>
              <div>
                <Label>SMTP Heslo *</Label>
                <Input type="password" value={form.smtp_password} onChange={e => setField('smtp_password', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>IMAP Host</Label>
                <Input value={form.imap_host} onChange={e => setField('imap_host', e.target.value)} placeholder="imap.gmail.com" />
              </div>
              <div>
                <Label>IMAP Port</Label>
                <Input type="number" value={form.imap_port} onChange={e => setField('imap_port', parseInt(e.target.value))} />
              </div>
            </div>
            <div>
              <Label>Denný limit</Label>
              <Input type="number" value={form.daily_limit} onChange={e => setField('daily_limit', parseInt(e.target.value))} />
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={form.is_active} onCheckedChange={v => setField('is_active', v)} />
                <Label>Aktívna</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_reply_to} onCheckedChange={v => setField('is_reply_to', v)} />
                <Label>Reply-To schránka</Label>
              </div>
            </div>
            <Button onClick={handleSave} className="w-full">
              {editing ? 'Uložiť zmeny' : 'Pridať schránku'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
