import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BeforeAfterSlider } from '@/components/ui/BeforeAfterSlider';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhotoItem {
  id: string;
  original_url: string;
  processed_url: string | null;
  ai_status: string;
}

interface PhotoCompareModalProps {
  photos: PhotoItem[];
  initialIndex: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PhotoCompareModal({ photos, initialIndex, open, onOpenChange }: PhotoCompareModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Reset index when modal opens with new initialIndex
  const photo = photos[currentIndex];
  if (!photo) return null;

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;
  const hasProcessed = photo.ai_status === 'done' && !!photo.processed_url;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] p-0 gap-0 bg-background/95 backdrop-blur-xl border-border overflow-hidden [&>button]:hidden">
        <DialogTitle className="sr-only">Porovnanie fotiek</DialogTitle>
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-sm font-medium text-muted-foreground">
            Fotka {currentIndex + 1} / {photos.length}
          </span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Slider area */}
        <div className="relative flex items-center justify-center p-4 min-h-[60vh]">
          {/* Nav arrows */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute left-2 z-30 h-10 w-10 rounded-full bg-background/80 shadow-lg backdrop-blur-sm",
              !hasPrev && "opacity-0 pointer-events-none"
            )}
            onClick={() => setCurrentIndex(i => i - 1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="w-full max-w-4xl mx-auto">
            {hasProcessed ? (
              <BeforeAfterSlider
                beforeSrc={photo.original_url}
                afterSrc={photo.processed_url!}
                beforeLabel="Originál"
                afterLabel="Upravená"
                className="w-full aspect-video rounded-xl"
              />
            ) : (
              <div className="w-full aspect-video rounded-xl overflow-hidden bg-muted">
                <img
                  src={photo.original_url}
                  alt="Originál"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute right-2 z-30 h-10 w-10 rounded-full bg-background/80 shadow-lg backdrop-blur-sm",
              !hasNext && "opacity-0 pointer-events-none"
            )}
            onClick={() => setCurrentIndex(i => i + 1)}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Thumbnail strip */}
        {photos.length > 1 && (
          <div className="flex gap-2 px-4 pb-4 overflow-x-auto justify-center">
            {photos.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setCurrentIndex(i)}
                className={cn(
                  "w-16 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0",
                  i === currentIndex
                    ? "border-primary ring-1 ring-primary/30"
                    : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <img
                  src={p.processed_url || p.original_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
