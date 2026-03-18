import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { UserLayout } from '@/components/dashboard/UserLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type WatermarkPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center-center';

interface Profile {
  id: string;
  user_id: string;
  company_name: string | null;
  ico: string | null;
  dic: string | null;
  ic_dph: string | null;
  address: string | null;
  logo_url: string | null;
  watermark_position: string | null;
}

const POSITIONS: { value: WatermarkPosition; label: string; warn?: boolean }[] = [
  { value: 'top-left', label: 'Vľavo hore' },
  { value: 'top-right', label: 'Vpravo hore' },
  { value: 'bottom-left', label: 'Vľavo dole' },
  { value: 'bottom-right', label: 'Vpravo dole' },
  { value: 'center-center', label: 'Stred', warn: true },
];

function WatermarkPreview({ position, logoUrl }: { position: WatermarkPosition; logoUrl: string | null }) {
  const positionStyles: Record<WatermarkPosition, string> = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2',
    'center-center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  };

  return (
    <div className="relative w-full aspect-video rounded-lg border border-border overflow-hidden">
      {/* Real property photo as background */}
      <img
        src="https://raw.githubusercontent.com/SlohGPT/realfoto-adames/main/public/landing/hdr%20merging/hdr-after.jpeg"
        alt="Ukážka fotky"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Watermark */}
      <div className={cn("absolute w-12 h-12 flex items-center justify-center", positionStyles[position])}>
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className="max-w-full max-h-full object-contain opacity-70" />
        ) : (
          <div className="w-10 h-10 rounded bg-destructive/80 border border-destructive flex items-center justify-center shadow-sm">
            <span className="text-[8px] text-white font-bold tracking-wider">LOGO</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const initialLoadDone = useRef(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Form fields
  const [companyName, setCompanyName] = useState('');
  const [ico, setIco] = useState('');
  const [dic, setDic] = useState('');
  const [icDph, setIcDph] = useState('');
  const [address, setAddress] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [watermarkPosition, setWatermarkPosition] = useState<WatermarkPosition>('bottom-right');

  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      const p = data as unknown as Profile;
      setProfile(p);
      setCompanyName(p.company_name || '');
      setIco(p.ico || '');
      setDic(p.dic || '');
      setIcDph(p.ic_dph || '');
      setAddress(p.address || '');
      setLogoUrl(p.logo_url);
      setWatermarkPosition((p.watermark_position as WatermarkPosition) || 'bottom-right');
    }
    setIsLoading(false);
  };

  // Auto-save with debounce
  useEffect(() => {
    if (!initialLoadDone.current) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      handleSave();
    }, 800);
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [companyName, ico, dic, icDph, address, watermarkPosition, logoUrl]);

  // Mark initial load done after profile loads
  useEffect(() => {
    if (!isLoading) {
      // Small delay to avoid triggering save on initial state hydration
      setTimeout(() => { initialLoadDone.current = true; }, 100);
    }
  }, [isLoading]);

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const profileData = {
        user_id: user.id,
        company_name: companyName || null,
        ico: ico || null,
        dic: dic || null,
        ic_dph: icDph || null,
        address: address || null,
        logo_url: logoUrl,
        watermark_position: watermarkPosition,
        updated_at: new Date().toISOString(),
      };

      if (profile) {
        const { error } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', profile.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('profiles')
          .insert(profileData)
          .select()
          .single();
        if (error) throw error;
        if (data) setProfile(data as unknown as Profile);
      }

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Save error:', error);
      setSaveStatus('idle');
      toast({ title: 'Chyba', description: 'Nepodarilo sa uložiť profil.', variant: 'destructive' });
    }
  };

  const handleLogoUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Chyba', description: 'Nahrajte obrázok (PNG, JPG, SVG).', variant: 'destructive' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Chyba', description: 'Logo musí byť menšie ako 5 MB.', variant: 'destructive' });
      return;
    }

    setIsUploadingLogo(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const ext = file.name.split('.').pop() || 'png';
      const filePath = `${user.id}/logo.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('logos').getPublicUrl(filePath);
      setLogoUrl(`${urlData.publicUrl}?t=${Date.now()}`);
      toast({ title: 'Logo nahrané', description: 'Logo bolo úspešne nahrané.' });
    } catch (error) {
      console.error('Logo upload error:', error);
      toast({ title: 'Chyba', description: 'Nepodarilo sa nahrať logo.', variant: 'destructive' });
    } finally {
      setIsUploadingLogo(false);
    }
  }, [toast]);

  const handleRemoveLogo = () => {
    setLogoUrl(null);
  };

  if (isLoading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Profil</h1>
          <p className="text-muted-foreground">Fakturačné údaje a nastavenie vodoznaku</p>
        </div>

        {/* Billing Info */}
        <Card>
          <CardHeader>
            <CardTitle>Fakturačné údaje</CardTitle>
            <CardDescription>Tieto údaje sa použijú na faktúrach</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company">Názov firmy</Label>
              <Input id="company" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="napr. RealFoto s.r.o." />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ico">IČO</Label>
                <Input id="ico" value={ico} onChange={(e) => setIco(e.target.value)} placeholder="12345678" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dic">DIČ</Label>
                <Input id="dic" value={dic} onChange={(e) => setDic(e.target.value)} placeholder="2012345678" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icdph">IČ DPH</Label>
                <Input id="icdph" value={icDph} onChange={(e) => setIcDph(e.target.value)} placeholder="SK2012345678" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Adresa</Label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Hlavná 1, 811 01 Bratislava" />
            </div>
          </CardContent>
        </Card>

        {/* Logo & Watermark */}
        <Card>
          <CardHeader>
            <CardTitle>Logo & vodoznak</CardTitle>
            <CardDescription>
              Vaše logo sa pridá ako vodoznak na spracované fotky
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo upload */}
            <div className="space-y-3">
              <Label>Logo</Label>
              {logoUrl ? (
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-lg border border-border bg-muted flex items-center justify-center overflow-hidden">
                    <img src={logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="space-y-2">
                    <label className="cursor-pointer">
                      <Button variant="outline" size="sm" asChild>
                        <span>
                          <Upload className="h-3.5 w-3.5 mr-1.5" />
                          Zmeniť
                        </span>
                      </Button>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
                        disabled={isUploadingLogo}
                      />
                    </label>
                    <Button variant="ghost" size="sm" onClick={handleRemoveLogo} className="text-destructive">
                      <X className="h-3.5 w-3.5 mr-1.5" />
                      Odstrániť
                    </Button>
                  </div>
                </div>
              ) : (
                <label className={cn(
                  "flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                  "border-border hover:border-primary/50 hover:bg-muted/50",
                  isUploadingLogo && "opacity-50 pointer-events-none"
                )}>
                  {isUploadingLogo ? (
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  ) : (
                    <>
                      <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Nahrať logo</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG, SVG (max 5 MB)</p>
                    </>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
                    disabled={isUploadingLogo}
                  />
                </label>
              )}
            </div>

            {/* Watermark position selector */}
            <div className="space-y-3">
              <Label>Pozícia vodoznaku</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {POSITIONS.map((pos) => (
                  <button
                    key={pos.value}
                    onClick={() => setWatermarkPosition(pos.value)}
                    className={cn(
                      "relative flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all",
                      watermarkPosition === pos.value
                        ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/30"
                        : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {watermarkPosition === pos.value && (
                      <Check className="h-3.5 w-3.5 shrink-0" />
                    )}
                    <span>{pos.label}</span>
                    {pos.warn && (
                      <span className="text-[10px] text-warning font-normal ml-auto">⚠️</span>
                    )}
                  </button>
                ))}
              </div>
              <p className={cn("text-xs flex items-center gap-1.5 min-h-[1.25rem]", watermarkPosition === 'center-center' ? "text-destructive" : "text-transparent pointer-events-none")}>
                ⚠️ Stredový vodoznak neodporúčame — nepôsobí profesionálne na realitných fotkách.
              </p>
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <Label>Náhľad</Label>
              <WatermarkPreview position={watermarkPosition} logoUrl={logoUrl} />
            </div>
          </CardContent>
        </Card>

        {/* Auto-save indicator */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground h-10">
          {saveStatus === 'saving' && (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Ukladám...</span>
            </>
          )}
          {saveStatus === 'saved' && (
            <>
              <Check className="h-3.5 w-3.5 text-success" />
              <span className="text-success">Uložené</span>
            </>
          )}
        </div>
      </div>
    </UserLayout>
  );
}
