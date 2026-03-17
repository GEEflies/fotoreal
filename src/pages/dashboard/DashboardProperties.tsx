import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { UserLayout } from '@/components/dashboard/UserLayout';
import { PropertyCard } from '@/components/dashboard/PropertyCard';
import { Button } from '@/components/ui/button';
import { Plus, Building2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Property {
  id: string;
  name: string;
  status: string;
  created_at: string;
  photo_count: number;
  thumbnail_url?: string;
}

export default function DashboardProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    const { data: props, error } = await supabase
      .from('properties')
      .select('id, name, status, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading properties:', error);
      setIsLoading(false);
      return;
    }

    const enriched: Property[] = [];
    for (const p of props || []) {
      const [{ data: photos }, { count }] = await Promise.all([
        supabase.from('property_photos').select('original_url').eq('property_id', p.id).limit(1),
        supabase.from('property_photos').select('id', { count: 'exact', head: true }).eq('property_id', p.id),
      ]);

      enriched.push({
        ...p,
        status: p.status as string,
        photo_count: count || 0,
        thumbnail_url: photos?.[0]?.original_url,
      });
    }

    setProperties(enriched);
    setIsLoading(false);
  };

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Credits banner - prominent */}
        {!creditsLoading && credits && (
          <CreditsBanner available={credits.available} />
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Nehnuteľnosti</h1>
            <p className="text-muted-foreground">Spravujte svoje nehnuteľnosti a fotky</p>
          </div>
          <Link to="/dashboard/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nová nehnuteľnosť
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16">
            <Building2 className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-foreground mb-2">Žiadne nehnuteľnosti</h2>
            <p className="text-muted-foreground mb-4">Pridajte svoju prvú nehnuteľnosť a nahrajte fotky</p>
            <Link to="/dashboard/new">
              <Button><Plus className="h-4 w-4 mr-2" /> Pridať nehnuteľnosť</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((p) => (
              <PropertyCard
                key={p.id}
                id={p.id}
                name={p.name}
                status={p.status}
                photoCount={p.photo_count}
                thumbnailUrl={p.thumbnail_url}
                createdAt={p.created_at}
              />
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
}
