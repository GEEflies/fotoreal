import { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Upload, Search, Trash2, Tag, Users, Mail, Plus, X } from 'lucide-react';
import Papa from 'papaparse';

interface Lead {
  id: string;
  email: string | null;
  name: string | null;
  phone: string | null;
  company_name: string | null;
  city: string | null;
  specialization: string | null;
  website: string | null;
  source: string;
  tags: string[];
  created_at: string;
}

interface ColumnMapping {
  [csvColumn: string]: string;
}

const LEAD_FIELDS = [
  { value: '', label: '— Preskočiť —' },
  { value: 'email', label: 'Email' },
  { value: 'name', label: 'Meno' },
  { value: 'phone', label: 'Telefón' },
  { value: 'company_name', label: 'Firma' },
  { value: 'city', label: 'Mesto' },
  { value: 'specialization', label: 'Špecializácia' },
  { value: 'website', label: 'Web' },
];

export default function OutreachLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // CSV import state
  const [csvDialogOpen, setCsvDialogOpen] = useState(false);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({});
  const [importing, setImporting] = useState(false);

  // Tag dialog
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [newTag, setNewTag] = useState('');

  // Add lead dialog
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newLead, setNewLead] = useState({ email: '', name: '', phone: '', company_name: '', city: '', specialization: '', website: '' });

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('outreach_leads').select('*').order('created_at', { ascending: false });
    if (search) {
      query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%,company_name.ilike.%${search}%,city.ilike.%${search}%`);
    }
    const { data, error } = await query.limit(500);
    if (error) {
      toast.error('Chyba pri načítaní leadov');
    } else {
      setLeads((data as Lead[]) || []);
    }
    setLoading(false);
  }, [search]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      complete: (results) => {
        const rows = results.data as string[][];
        if (rows.length < 2) {
          toast.error('CSV súbor je prázdny');
          return;
        }
        setCsvHeaders(rows[0]);
        setCsvData(rows.slice(1).filter(r => r.some(c => c?.trim())));
        // Auto-map columns
        const mapping: ColumnMapping = {};
        rows[0].forEach(header => {
          const h = header.toLowerCase().trim();
          if (h.includes('email') || h.includes('e-mail')) mapping[header] = 'email';
          else if (h.includes('men') || h.includes('name')) mapping[header] = 'name';
          else if (h.includes('tel') || h.includes('phone')) mapping[header] = 'phone';
          else if (h.includes('firm') || h.includes('company')) mapping[header] = 'company_name';
          else if (h.includes('mest') || h.includes('city')) mapping[header] = 'city';
          else if (h.includes('spec')) mapping[header] = 'specialization';
          else if (h.includes('web')) mapping[header] = 'website';
        });
        setColumnMapping(mapping);
        setCsvDialogOpen(true);
      },
      error: () => toast.error('Chyba pri čítaní CSV'),
    });
    e.target.value = '';
  };

  const handleImport = async () => {
    setImporting(true);
    const rows = csvData.map(row => {
      const lead: Record<string, string> = {};
      csvHeaders.forEach((header, i) => {
        const field = columnMapping[header];
        if (field && row[i]?.trim()) {
          lead[field] = row[i].trim();
        }
      });
      lead.source = 'csv_import';
      return lead;
    }).filter(r => r.email || r.name || r.phone);

    if (rows.length === 0) {
      toast.error('Žiadne platné záznamy na import');
      setImporting(false);
      return;
    }

    // Batch insert (50 at a time)
    let imported = 0;
    for (let i = 0; i < rows.length; i += 50) {
      const batch = rows.slice(i, i + 50);
      const { error } = await supabase.from('outreach_leads').insert(batch as any);
      if (error) {
        toast.error(`Chyba pri importe: ${error.message}`);
        break;
      }
      imported += batch.length;
    }

    toast.success(`Importovaných ${imported} leadov`);
    setCsvDialogOpen(false);
    setCsvData([]);
    setCsvHeaders([]);
    setColumnMapping({});
    setImporting(false);
    fetchLeads();
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    const { error } = await supabase.from('outreach_leads').delete().in('id', Array.from(selectedIds));
    if (error) {
      toast.error('Chyba pri mazaní');
    } else {
      toast.success(`Zmazaných ${selectedIds.size} leadov`);
      setSelectedIds(new Set());
      fetchLeads();
    }
  };

  const handleTagSelected = async () => {
    if (!newTag.trim() || selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    // Fetch current tags, then append
    const { data: current } = await supabase.from('outreach_leads').select('id, tags').in('id', ids);
    if (current) {
      for (const lead of current) {
        const tags = [...(lead.tags || [])];
        if (!tags.includes(newTag.trim())) {
          tags.push(newTag.trim());
          await supabase.from('outreach_leads').update({ tags } as any).eq('id', lead.id);
        }
      }
    }
    toast.success(`Tag "${newTag}" pridaný k ${ids.length} leadom`);
    setNewTag('');
    setTagDialogOpen(false);
    setSelectedIds(new Set());
    fetchLeads();
  };

  const handleAddLead = async () => {
    if (!newLead.email && !newLead.name) {
      toast.error('Zadajte aspoň email alebo meno');
      return;
    }
    const { error } = await supabase.from('outreach_leads').insert({
      ...newLead,
      source: 'manual',
    } as any);
    if (error) {
      toast.error('Chyba pri pridávaní');
    } else {
      toast.success('Lead pridaný');
      setAddDialogOpen(false);
      setNewLead({ email: '', name: '', phone: '', company_name: '', city: '', specialization: '', website: '' });
      fetchLeads();
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === leads.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(leads.map(l => l.id)));
    }
  };

  const totalLeads = leads.length;
  const withEmail = leads.filter(l => l.email).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold">Leady</h1>
            <p className="text-sm text-muted-foreground">Spravujte kontakty pre outreach kampane</p>
          </div>
          <div className="flex gap-2">
            <label>
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
              <Button variant="outline" asChild>
                <span><Upload className="h-4 w-4 mr-2" />Import CSV</span>
              </Button>
            </label>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />Pridať lead</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Nový lead</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  {Object.entries({ email: 'Email', name: 'Meno', phone: 'Telefón', company_name: 'Firma', city: 'Mesto', specialization: 'Špecializácia', website: 'Web' }).map(([key, label]) => (
                    <div key={key}>
                      <Label>{label}</Label>
                      <Input
                        value={newLead[key as keyof typeof newLead]}
                        onChange={e => setNewLead(prev => ({ ...prev, [key]: e.target.value }))}
                      />
                    </div>
                  ))}
                  <Button onClick={handleAddLead} className="w-full">Pridať</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{totalLeads}</p>
                <p className="text-xs text-muted-foreground">Celkom leadov</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{withEmail}</p>
                <p className="text-xs text-muted-foreground">S emailom</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Upload className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{leads.filter(l => l.source === 'csv_import').length}</p>
                <p className="text-xs text-muted-foreground">Z CSV importu</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search + Bulk actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Hľadať podľa mena, emailu, firmy, mesta..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          {selectedIds.size > 0 && (
            <div className="flex gap-2">
              <Dialog open={tagDialogOpen} onOpenChange={setTagDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm"><Tag className="h-4 w-4 mr-1" />Tag ({selectedIds.size})</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Pridať tag</DialogTitle></DialogHeader>
                  <div className="flex gap-2">
                    <Input value={newTag} onChange={e => setNewTag(e.target.value)} placeholder="Názov tagu" />
                    <Button onClick={handleTagSelected}>Pridať</Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="destructive" size="sm" onClick={handleDeleteSelected}>
                <Trash2 className="h-4 w-4 mr-1" />Zmazať ({selectedIds.size})
              </Button>
            </div>
          )}
        </div>

        {/* Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={leads.length > 0 && selectedIds.size === leads.length}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Meno</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">Firma</TableHead>
                <TableHead className="hidden md:table-cell">Mesto</TableHead>
                <TableHead className="hidden lg:table-cell">Špec.</TableHead>
                <TableHead className="hidden lg:table-cell">Tagy</TableHead>
                <TableHead className="hidden lg:table-cell">Zdroj</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Načítavam...
                  </TableCell>
                </TableRow>
              ) : leads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Žiadne leady. Importujte CSV alebo pridajte manuálne.
                  </TableCell>
                </TableRow>
              ) : (
                leads.map(lead => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(lead.id)}
                        onCheckedChange={() => toggleSelect(lead.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{lead.name || '—'}</TableCell>
                    <TableCell>{lead.email || '—'}</TableCell>
                    <TableCell className="hidden md:table-cell">{lead.company_name || '—'}</TableCell>
                    <TableCell className="hidden md:table-cell">{lead.city || '—'}</TableCell>
                    <TableCell className="hidden lg:table-cell">{lead.specialization || '—'}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex gap-1 flex-wrap">
                        {(lead.tags || []).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge variant="outline" className="text-xs">{lead.source}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* CSV Column Mapping Dialog */}
      <Dialog open={csvDialogOpen} onOpenChange={setCsvDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Mapovanie stĺpcov CSV ({csvData.length} riadkov)</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Priraďte stĺpce z CSV k poliam leadu:
            </p>
            <div className="space-y-3">
              {csvHeaders.map(header => (
                <div key={header} className="flex items-center gap-3">
                  <span className="w-40 text-sm font-medium truncate">{header}</span>
                  <span className="text-muted-foreground">→</span>
                  <select
                    value={columnMapping[header] || ''}
                    onChange={e => setColumnMapping(prev => ({ ...prev, [header]: e.target.value }))}
                    className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {LEAD_FIELDS.map(f => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            {/* Preview */}
            {csvData.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Ukážka (prvé 3 riadky):</p>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full border">
                    <thead>
                      <tr>
                        {csvHeaders.map(h => (
                          <th key={h} className="border px-2 py-1 text-left bg-muted">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {csvData.slice(0, 3).map((row, i) => (
                        <tr key={i}>
                          {row.map((cell, j) => (
                            <td key={j} className="border px-2 py-1">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <Button onClick={handleImport} disabled={importing} className="w-full">
              {importing ? 'Importujem...' : `Importovať ${csvData.length} leadov`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
