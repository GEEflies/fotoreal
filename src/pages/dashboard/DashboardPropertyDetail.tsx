import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AIProgressLoader } from '@/components/dashboard/AIProgressLoader';
import { PhotoCompareModal } from '@/components/dashboard/PhotoCompareModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Download, DownloadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Photo {
  id: string;
  original_url: string;
  processed_url: string | null;
  ai_status: string;
  ai_step_label: string;
}

interface Property {
  id: string;
  name: string;
  status: string;
  created_at: string;
}

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  uploading: { label: 'Nahrávanie', variant: 'secondary' },
  processing: { label: 'Spracováva sa', variant: 'default' },
  done: { label: 'Hotovo', variant: 'outline' },
  error: { label: 'Chyba', variant: 'destructive' },
};

async function downloadAllPhotos(photos: Photo[], propertyName: string) {
  const processedPhotos = photos.filter(p => p.ai_status === 'done' && p.processed_url);
  if (processedPhotos.length === 0) return;

  for (let i = 0; i < processedPhotos.length; i++) {
    const photo = processedPhotos[i];
    try {
      const resp = await fetch(photo.processed_url!);
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const ext = photo.processed_url!.includes('.png') ? 'png' : 'jpg';
      a.download = `${propertyName}-${i + 1}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      // Small delay between downloads to avoid browser blocking
      if (i < processedPhotos.length - 1) {
        await new Promise(r => setTimeout(r, 300));
      }
    } catch (e) {
      console.error('Download error:', e);
    }
  }
}

export default function DashboardPropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [compareIndex, setCompareIndex] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!id) return;
    loadData();
    
    const channel = supabase
      .channel(`property-photos-${id}`)
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'property_photos',
        filter: `property_id=eq.${id}`,
      }, (payload) => {
        setPhotos(prev => prev.map(p =>
          p.id === payload.new.id ? { ...p, ...payload.new as Photo } : p
        ));
        if (payload.new.status === 'done') {
          window.dispatchEvent(new Event('credits-changed'));
        }
      })
      .subscribe();

    const propChannel = supabase
      .channel(`property-${id}`)
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'properties',
        filter: `id=eq.${id}`,
      }, (payload) => {
        setProperty(prev => prev ? { ...prev, ...payload.new as Property } : null);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(propChannel);
    };
  }, [id]);

  // Fallback polling every 5s while processing — bulletproof even if Realtime drops.
  // Also detects stalled processing (chain breakage) and re-triggers the edge function.
  useEffect(() => {
    if (!id || property?.status !== 'processing') return;

    const poll = async () => {
      const [{ data: prop }, { data: photoData }] = await Promise.all([
        supabase.from('properties').select('*').eq('id', id).single(),
        supabase.from('property_photos').select('*').eq('property_id', id).order('created_at'),
      ]);
      if (prop) setProperty(prev => prev ? { ...prev, ...prop as unknown as Property } : null);
      if (photoData) setPhotos(photoData as unknown as Photo[]);

      // Re-trigger if processing stalled (pending photos but none actively processing)
      if (photoData) {
        const hasPending = photoData.some((p: { ai_status: string }) => p.ai_status === 'pending');
        const hasActive = photoData.some((p: { ai_status: string }) =>
          p.ai_status === 'analyzing' || p.ai_status === 'enhancing' || p.ai_status === 'uploading'
        );
        if (hasPending && !hasActive) {
          supabase.functions.invoke('process-photos', { body: { property_id: id } })
            .then(({ error }) => { if (error) console.error('Re-trigger error:', error); });
        }
      }
    };

    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, [id, property?.status]);

  const loadData = async () => {
    if (!id) return;
    const [{ data: prop }, { data: photoData }] = await Promise.all([
      supabase.from('properties').select('*').eq('id', id).single(),
      supabase.from('property_photos').select('*').eq('property_id', id).order('created_at'),
    ]);
    if (prop) setProperty(prop as unknown as Property);
    if (photoData) setPhotos(photoData as unknown as Photo[]);
    setIsLoading(false);
  };

  const handleDownloadAll = async () => {
    if (!property) return;
    setIsDownloading(true);
    toast({ title: 'Sťahujem...', description: `Sťahujem ${donePhotos.length} fotiek.` });
    await downloadAllPhotos(photos, property.name);
    setIsDownloading(false);
  };

  const donePhotos = photos.filter(p => p.ai_status === 'done' && p.processed_url);
  const doneCount = donePhotos.length;
  const totalCount = photos.length;

  // Phase anchors (percentage) and expected durations (ms) for smooth interpolation
  const PHASE_CONFIG: Record<string, { anchor: number; next: number; durationMs: number }> = {
    pending:   { anchor: 0,   next: 15,  durationMs: 2000 },
    analyzing: { anchor: 15,  next: 30,  durationMs: 15000 },
    enhancing: { anchor: 30,  next: 85,  durationMs: 70000 },
    uploading: { anchor: 85,  next: 100, durationMs: 5000 },
    done:      { anchor: 100, next: 100, durationMs: 0 },
    error:     { anchor: 100, next: 100, durationMs: 0 },
  };

  // Track when each photo entered its current status
  const phaseTimestamps = useRef<Map<string, { status: string; enteredAt: number }>>(new Map());

  // Update timestamps when photo statuses change
  useEffect(() => {
    for (const photo of photos) {
      const entry = phaseTimestamps.current.get(photo.id);
      if (!entry || entry.status !== photo.ai_status) {
        phaseTimestamps.current.set(photo.id, { status: photo.ai_status, enteredAt: Date.now() });
      }
    }
  }, [photos]);

  // Tick every 200ms while processing for smooth progress animation
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (property?.status !== 'processing') return;
    const timer = setInterval(() => setTick(t => t + 1), 200);
    return () => clearInterval(timer);
  }, [property?.status]);

  // Calculate interpolated progress per photo
  const getInterpolatedProgress = (photo: Photo): number => {
    const config = PHASE_CONFIG[photo.ai_status] || PHASE_CONFIG.pending;
    if (config.durationMs === 0) return config.anchor;

    const entry = phaseTimestamps.current.get(photo.id);
    const elapsed = entry ? Date.now() - entry.enteredAt : 0;
    const fraction = Math.min(elapsed / config.durationMs, 0.95); // cap at 95% to never overshoot
    return config.anchor + fraction * (config.next - config.anchor);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _tick = tick; // referenced to trigger recalculation
  const progressPercent = totalCount > 0
    ? Math.round(photos.reduce((sum, p) => sum + getInterpolatedProgress(p), 0) / totalCount)
    : 0;

  if (isLoading) {
    return (
      <>
        <div className="space-y-6">
          <div>
            <Link to="/dashboard" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2">
              <ArrowLeft className="h-4 w-4" /> Späť na nehnuteľnosti
            </Link>
            <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="aspect-square rounded-lg bg-card border border-border animate-pulse" />)}
          </div>
        </div>
      </>
    );
  }

  if (!property) {
    return (
      <>
        <div className="text-center py-16">
          <p className="text-muted-foreground">Nehnuteľnosť sa nenašla.</p>
          <Link to="/dashboard"><Button variant="outline" className="mt-4">Späť</Button></Link>
        </div>
      </>
    );
  }

  const statusInfo = statusLabels[property.status] || statusLabels.uploading;

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <Link to="/dashboard" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2">
              <ArrowLeft className="h-4 w-4" /> Späť na nehnuteľnosti
            </Link>
            <h1 className="text-2xl font-heading font-bold text-foreground">{property.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
              <span className="text-sm text-muted-foreground">
                {doneCount} / {totalCount} spracovaných
              </span>
            </div>
          </div>

          {donePhotos.length > 0 && (
            <Button
              onClick={handleDownloadAll}
              disabled={isDownloading}
              className="gap-2"
            >
              <DownloadCloud className="h-4 w-4" />
              {isDownloading ? 'Sťahujem...' : `Stiahnuť všetky (${donePhotos.length})`}
            </Button>
          )}
        </div>

        {/* Overall progress */}
        {property.status === 'processing' && (
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-foreground">Celkový priebeh</span>
                <span className="text-muted-foreground">{progressPercent}%</span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Photo grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <Card
              key={photo.id}
              className="overflow-hidden group cursor-pointer transition-shadow hover:shadow-lg"
              onClick={() => setCompareIndex(index)}
            >
              <div className="aspect-video relative overflow-hidden bg-muted">
                <img
                  src={photo.processed_url || photo.original_url}
                  alt="Foto"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                {photo.ai_status !== 'done' && photo.ai_status !== 'error' && (
                  <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                    <AIProgressLoader status={photo.ai_status} label={photo.ai_step_label || ''} />
                  </div>
                )}
                {photo.ai_status === 'done' && photo.processed_url && (
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center">
                    <span className="text-sm font-medium text-background opacity-0 group-hover:opacity-100 transition-opacity bg-foreground/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      Porovnať
                    </span>
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <AIProgressLoader
                    status={photo.ai_status}
                    label={photo.ai_status === 'done' ? 'Hotovo' : (photo.ai_step_label || '')}
                  />
                  {photo.ai_status === 'done' && photo.processed_url && (
                    <a
                      href={photo.processed_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Compare modal */}
      <PhotoCompareModal
        photos={photos}
        initialIndex={compareIndex ?? 0}
        open={compareIndex !== null}
        onOpenChange={(open) => { if (!open) setCompareIndex(null); }}
      />
    </>
  );
}
