import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { UserLayout } from '@/components/dashboard/UserLayout';
import { AIProgressLoader } from '@/components/dashboard/AIProgressLoader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Download, ExternalLink } from 'lucide-react';

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

export default function DashboardPropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    loadData();
    
    // Subscribe to realtime updates on property_photos
    const channel = supabase
      .channel(`property-photos-${id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'property_photos',
          filter: `property_id=eq.${id}`,
        },
        (payload) => {
          setPhotos(prev => prev.map(p => 
            p.id === payload.new.id 
              ? { ...p, ...payload.new as Photo }
              : p
          ));
        }
      )
      .subscribe();

    // Also subscribe to property status changes
    const propChannel = supabase
      .channel(`property-${id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'properties',
          filter: `id=eq.${id}`,
        },
        (payload) => {
          setProperty(prev => prev ? { ...prev, ...payload.new as Property } : null);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(propChannel);
    };
  }, [id]);

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

  const doneCount = photos.filter(p => p.ai_status === 'done').length;
  const totalCount = photos.length;
  const progressPercent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  if (isLoading) {
    return (
      <UserLayout>
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="aspect-square rounded-lg" />)}
          </div>
        </div>
      </UserLayout>
    );
  }

  if (!property) {
    return (
      <UserLayout>
        <div className="text-center py-16">
          <p className="text-muted-foreground">Nehnuteľnosť sa nenašla.</p>
          <Link to="/dashboard"><Button variant="outline" className="mt-4">Späť</Button></Link>
        </div>
      </UserLayout>
    );
  }

  const statusInfo = statusLabels[property.status] || statusLabels.uploading;

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
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
          {photos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden">
              <div className="aspect-video relative overflow-hidden bg-muted">
                <img
                  src={photo.processed_url || photo.original_url}
                  alt="Foto"
                  className="w-full h-full object-cover"
                />
                {photo.ai_status !== 'done' && photo.ai_status !== 'error' && (
                  <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                    <AIProgressLoader status={photo.ai_status} label={photo.ai_step_label || ''} />
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
    </UserLayout>
  );
}
