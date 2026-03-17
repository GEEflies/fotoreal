import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { UserLayout } from '@/components/dashboard/UserLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const MAX_FILES = 50;
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function DashboardNewProperty() {
  const [name, setName] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;
    const remaining = MAX_FILES - photos.length;
    const newFiles = Array.from(files).slice(0, remaining);

    for (const file of newFiles) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast({ title: 'Neplatný formát', description: `${file.name} nie je podporovaný.`, variant: 'destructive' });
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        toast({ title: 'Príliš veľký súbor', description: `${file.name} je väčší ako ${MAX_SIZE_MB} MB.`, variant: 'destructive' });
        return;
      }
    }

    setPhotos(prev => [...prev, ...newFiles]);
    newFiles.forEach(f => {
      const reader = new FileReader();
      reader.onload = (e) => setPreviews(prev => [...prev, e.target?.result as string]);
      reader.readAsDataURL(f);
    });
  }, [photos.length, toast]);

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast({ title: 'Chyba', description: 'Zadajte názov nehnuteľnosti.', variant: 'destructive' });
      return;
    }
    if (photos.length === 0) {
      toast({ title: 'Chyba', description: 'Nahrajte aspoň jednu fotku.', variant: 'destructive' });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create property
      const { data: property, error: propError } = await supabase
        .from('properties')
        .insert({ name: name.trim(), user_id: user.id, status: 'uploading' as const })
        .select('id')
        .single();

      if (propError) throw propError;

      // Upload photos and create records
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

      // Update property status and trigger processing
      await supabase.from('properties').update({ status: 'processing' as const }).eq('id', property.id);

      // Trigger AI processing (fire and forget)
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

        <Card>
          <CardHeader>
            <CardTitle>Detaily</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Názov nehnuteľnosti</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="napr. 3-izbový byt, Staré Mesto"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Fotografie</Label>
                <span className="text-sm text-muted-foreground">{photos.length} / {MAX_FILES}</span>
              </div>

              {photos.length < MAX_FILES && (
                <label className={cn(
                  "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                  "border-border hover:border-primary/50 hover:bg-muted/50"
                )}>
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Kliknite alebo pretiahnite fotky</p>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP (max {MAX_SIZE_MB} MB)</p>
                  <input
                    type="file"
                    className="hidden"
                    accept={ALLOWED_TYPES.join(',')}
                    multiple
                    onChange={(e) => handleFileSelect(e.target.files)}
                    disabled={isUploading}
                  />
                </label>
              )}

              {previews.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {previews.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                      <img src={url} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
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
              disabled={isUploading || !name.trim() || photos.length === 0}
              size="lg"
              className="w-full"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              {isUploading ? 'Nahrávam...' : 'Spracovať fotky s AI'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  );
}
