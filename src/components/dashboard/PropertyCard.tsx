import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Image as ImageIcon, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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
  onDeleted?: () => void;
}

export function PropertyCard({ id, name, status, photoCount, thumbnailUrl, createdAt, onDeleted }: PropertyCardProps) {
  const statusInfo = statusLabels[status] || statusLabels.uploading;
  const { toast } = useToast();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await supabase.from('property_photos').delete().eq('property_id', id);
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Vymazané', description: 'Nehnuteľnosť bola vymazaná.' });
      setDialogOpen(false);
      onDeleted?.();
    } catch (err) {
      console.error('Delete error:', err);
      toast({ title: 'Chyba', description: 'Nepodarilo sa vymazať nehnuteľnosť.', variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/dashboard/properties/${id}`);
  };

  return (
    <>
      <Card
        className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
        onClick={handleCardClick}
      >
        <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden relative">
          {thumbnailUrl ? (
            <img src={thumbnailUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <Building2 className="h-12 w-12 text-muted-foreground/40" />
          )}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                setDialogOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
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

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Vymazať nehnuteľnosť?</AlertDialogTitle>
            <AlertDialogDescription>
              Táto akcia vymaže nehnuteľnosť "{name}" a všetky jej fotky. Nedá sa vrátiť.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušiť</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Mažem...' : 'Vymazať'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
