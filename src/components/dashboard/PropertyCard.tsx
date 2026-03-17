import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  uploading: { label: 'Nahrávanie', variant: 'secondary' },
  processing: { label: 'Spracováva sa', variant: 'default' },
  done: { label: 'Hotovo', variant: 'outline' },
  error: { label: 'Chyba', variant: 'destructive' },
};

interface PropertyCardProps {
  id: string;
  name: string;
  status: string;
  photoCount: number;
  thumbnailUrl?: string;
  createdAt: string;
}

export function PropertyCard({ id, name, status, photoCount, thumbnailUrl, createdAt }: PropertyCardProps) {
  const statusInfo = statusLabels[status] || statusLabels.uploading;

  return (
    <Link to={`/dashboard/properties/${id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
        <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
          {thumbnailUrl ? (
            <img src={thumbnailUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <Building2 className="h-12 w-12 text-muted-foreground/40" />
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-foreground truncate">{name}</h3>
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <ImageIcon className="h-3.5 w-3.5" />
              {photoCount} fotiek
            </span>
            <span>{new Date(createdAt).toLocaleDateString('sk-SK')}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
