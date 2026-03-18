import { Loader2, Sparkles, Search, Check, AlertCircle, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusConfig: Record<string, { icon: typeof Loader2; color: string; animate?: boolean }> = {
  pending: { icon: Loader2, color: 'text-muted-foreground', animate: true },
  analyzing: { icon: Search, color: 'text-primary', animate: true },
  enhancing: { icon: Sparkles, color: 'text-primary', animate: true },
  uploading: { icon: Upload, color: 'text-primary', animate: true },
  done: { icon: Check, color: 'text-success' },
  error: { icon: AlertCircle, color: 'text-destructive' },
};

interface AIProgressLoaderProps {
  status: string;
  label: string;
  className?: string;
}

export function AIProgressLoader({ status, label, className }: AIProgressLoaderProps) {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      <Icon className={cn("h-4 w-4", config.color, config.animate && "animate-spin")} />
      <span className={cn("font-medium", config.color)}>{label}</span>
    </div>
  );
}
