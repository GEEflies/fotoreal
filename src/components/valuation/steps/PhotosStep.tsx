import { useState, useCallback } from "react";
import { WizardStep } from "../WizardStep";
import { ValuationFormData } from "@/types/valuation";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface PhotosStepProps {
  formData: ValuationFormData;
  onUpdate: (updates: Partial<ValuationFormData>) => void;
  sessionId: string;
}

const MAX_FILES = 20;
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

export function PhotosStep({ formData, onUpdate, sessionId }: PhotosStepProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { toast } = useToast();

  const handleFileUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = MAX_FILES - formData.photos.length;
    if (remainingSlots <= 0) {
      toast({
        title: "Limit dosiahnutý",
        description: `Môžete nahrať maximálne ${MAX_FILES} fotografií.`,
        variant: "destructive",
      });
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    
    // Validate files
    for (const file of filesToUpload) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast({
          title: "Neplatný formát",
          description: `Súbor ${file.name} nie je podporovaný. Použite JPG, PNG alebo WebP.`,
          variant: "destructive",
        });
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        toast({
          title: "Súbor je príliš veľký",
          description: `Súbor ${file.name} je väčší ako ${MAX_SIZE_MB} MB.`,
          variant: "destructive",
        });
        return;
      }
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    const uploadedUrls: string[] = [];
    
    try {
      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];
        const fileName = `${sessionId}/${Date.now()}-${file.name}`;
        
        const { data, error } = await supabase.storage
          .from('submission-photos')
          .upload(fileName, file);
        
        if (error) throw error;
        
        const { data: urlData } = supabase.storage
          .from('submission-photos')
          .getPublicUrl(data.path);
        
        uploadedUrls.push(urlData.publicUrl);
        setUploadProgress(Math.round(((i + 1) / filesToUpload.length) * 100));
      }
      
      onUpdate({ photos: [...formData.photos, ...uploadedUrls] });
      
      toast({
        title: "Fotky nahrané",
        description: `Úspešne nahraných ${uploadedUrls.length} fotografií.`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Chyba pri nahrávaní",
        description: "Nepodarilo sa nahrať fotky. Skúste to znova.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [formData.photos, onUpdate, sessionId, toast]);

  const removePhoto = (index: number) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index);
    onUpdate({ photos: newPhotos });
  };

  return (
    <WizardStep 
      title="Fotografie a poznámky" 
      description="Nahrajte fotky nehnuteľnosti a pridajte ďalšie informácie."
    >
      <div className="space-y-6">
        {/* Photo upload */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Fotografie (voliteľné)</Label>
            <span className="text-sm text-muted-foreground">
              {formData.photos.length} / {MAX_FILES}
            </span>
          </div>
          
          {formData.photos.length < MAX_FILES && (
            <label 
              className={cn(
                "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                isUploading 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              )}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {isUploading ? (
                  <>
                    <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Nahrávam... {uploadProgress}%
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Kliknite alebo pretiahnite fotky
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG, WebP (max {MAX_SIZE_MB} MB)
                    </p>
                  </>
                )}
              </div>
              <input
                type="file"
                className="hidden"
                accept={ALLOWED_TYPES.join(',')}
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
                disabled={isUploading}
              />
            </label>
          )}

          {/* Photo preview grid */}
          {formData.photos.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {formData.photos.map((url, index) => (
                <div 
                  key={index} 
                  className="relative aspect-square rounded-lg overflow-hidden group"
                >
                  <img
                    src={url}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
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

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="note">Poznámka (voliteľné)</Label>
          <Textarea
            id="note"
            placeholder="Doplňujúce informácie o nehnuteľnosti, jej výhodách, stave..."
            value={formData.note || ''}
            onChange={(e) => onUpdate({ note: e.target.value })}
            rows={4}
          />
        </div>
      </div>
    </WizardStep>
  );
}

export function validatePhotosStep(formData: ValuationFormData): boolean {
  // Always valid - photos and note are optional
  return true;
}
