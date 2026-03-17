import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { UserLayout } from '@/components/dashboard/UserLayout';
import { CreditsBanner } from '@/components/dashboard/CreditsBanner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useCredits } from '@/hooks/use-credits';
import { Upload, X, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const MAX_FILES = 320;
const MAX_SIZE_MB = 100;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
// Accept all image types including RAW formats
const ACCEPT_STRING = 'image/*,.raw,.cr2,.cr3,.nef,.arw,.dng,.orf,.rw2,.pef,.raf,.srw,.tif,.tiff,.bmp,.psd,.pdf';

export default function DashboardNewProperty() {
  const [name, setName] = useState('');
  const [isNameManuallySet, setIsNameManuallySet] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [propertyNumber, setPropertyNumber] = useState(1);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { credits, isLoading: creditsLoading } = useCredits();

  // Load property count for auto-naming
  useEffect(() => {
    const loadCount = async () => {
      const { count } = await supabase
        .from('properties')
        .select('id', { count: 'exact', head: true });
      const num = (count || 0) + 1;
      setPropertyNumber(num);
      if (!isNameManuallySet) {
        setName(`Nehnuteľnosť #${num}`);
      }
    };
    loadCount();
  }, [isNameManuallySet]);

  const handleNameFocus = () => {
    // Auto-select all text on focus so user can immediately type to replace
    if (nameInputRef.current) {
      nameInputRef.current.select();
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setIsNameManuallySet(true);
  };

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;
    const remaining = MAX_FILES - photos.length;
    const newFiles = Array.from(files).slice(0, remaining);

    // Only validate size
    for (const file of newFiles) {
      if (file.size > MAX_SIZE_BYTES) {
        toast({ title: 'Príliš veľký súbor', description: `${file.name} je väčší ako ${MAX_SIZE_MB} MB.`, variant: 'destructive' });
        return;
      }
    }

    setPhotos(prev => [...prev, ...newFiles]);
    newFiles.forEach(f => {
      // For image types that browser can render, show preview
      if (f.type.startsWith('image/') && !f.type.includes('raw') && f.size < 20 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = (e) => setPreviews(prev => [...prev, e.target?.result as string]);
        reader.readAsDataURL(f);
      } else {
        // For RAW/large files show a placeholder
        setPreviews(prev => [...prev, '']);
      }
    });
  }, [photos.length, toast]);

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const availableCredits = credits?.available ?? 0;
  const photosOverLimit = photos.length > availableCredits;

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast({ title: 'Chyba', description: 'Zadajte názov nehnuteľnosti.', variant: 'destructive' });
      return;
    }
    if (photos.length === 0) {
      toast({ title: 'Chyba', description: 'Nahrajte aspoň jednu fotku.', variant: 'destructive' });
      return;
    }
    if (photosOverLimit) {
      toast({ title: 'Nedostatok kreditov', description: `Máte ${availableCredits} kreditov, ale nahrali ste ${photos.length} fotiek.`, variant: 'destructive' });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Credits are deducted per-photo in the edge function after successful processing
      // Create property
      const { data: property, error: propError } = await supabase
        .from('properties')
        .insert({ name: name.trim(), user_id: user.id, status: 'uploading' as const })
        .select('id')
        .single();

      if (propError) throw propError;

      // Upload photos
      for (let i = 0; i < photos.length; i++) {
        const file = photos[i];
        const filePath = `${user.id}/${property.id}/${Date.now()}-${file.name}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('property-photos')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('property-photos')
          .getPublicUrl(uploadData.path);

        await supabase.from('property_photos').insert({
          property_id: property.id,
          original_url: urlData.publicUrl,
        });

        setUploadProgress(Math.round(((i + 1) / photos.length) * 100));
      }

      await supabase.from('properties').update({ status: 'processing' as const }).eq('id', property.id);

      supabase.functions.invoke('process-photos', {
        body: { property_id: property.id },
      });

      toast({ title: 'Úspech!', description: 'Fotky sa spracovávajú AI-čkom.' });
      navigate(`/dashboard/properties/${property.id}`);
    } catch (error) {
      console.error('Error:', error);
      toast({ title: 'Chyba', description: 'Nepodarilo sa vytvoriť nehnuteľnosť.', variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <UserLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Nová nehnuteľnosť</h1>
          <p className="text-muted-foreground">Nahrajte fotky a AI ich automaticky spracuje</p>
        </div>

        {/* Credits banner */}
        {!creditsLoading && credits && (
          <CreditsBanner available={availableCredits} />
        )}

        <Card>
          <CardHeader>
            <CardTitle>Detaily</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Názov nehnuteľnosti</Label>
              <Input
                id="name"
                ref={nameInputRef}
                value={name}
                onChange={handleNameChange}
                onFocus={handleNameFocus}
                placeholder="napr. 3-izbový byt, Staré Mesto"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Fotografie</Label>
                <span className={cn("text-sm", photosOverLimit ? "text-destructive font-medium" : "text-muted-foreground")}>
                  {photos.length} {photosOverLimit && `/ ${availableCredits} kreditov`}
                </span>
              </div>

              {photosOverLimit && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>Nahrali ste viac fotiek ako máte kreditov. <a href="/dashboard/credits" className="underline font-medium">Dokúpiť kredity</a></span>
                </div>
              )}

              <label className={cn(
                "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                "border-border hover:border-primary/50 hover:bg-muted/50"
              )}>
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Kliknite alebo pretiahnite fotky</p>
                <p className="text-xs text-muted-foreground mt-1">Všetky formáty vrátane RAW (max {MAX_SIZE_MB} MB)</p>
                <input
                  type="file"
                  className="hidden"
                  accept={ACCEPT_STRING}
                  multiple
                  onChange={(e) => handleFileSelect(e.target.files)}
                  disabled={isUploading}
                />
              </label>

              {previews.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {previews.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden group bg-muted">
                      {url ? (
                        <img src={url} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                          <Upload className="h-5 w-5 mb-1" />
                          <span className="text-[10px] truncate px-1 max-w-full">{photos[index]?.name.split('.').pop()?.toUpperCase()}</span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Nahrávam fotky...</span>
                  <span className="font-medium">{uploadProgress}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={isUploading || !name.trim() || photos.length === 0 || photosOverLimit}
              size="lg"
              className="w-full"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              {isUploading ? 'Nahrávam...' : `Spracovať ${photos.length} ${photos.length === 1 ? 'fotku' : photos.length < 5 ? 'fotky' : 'fotiek'} s AI`}
            </Button>
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  );
}
