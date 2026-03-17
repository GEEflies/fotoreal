import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Mail, MessageSquare, Webhook, MapPin, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Settings {
  google_places_api_key: string;
  notification_emails: string;
  notification_phone: string;
  webhook_url: string;
  redirect_url: string;
}

const defaultSettings: Settings = {
  google_places_api_key: '',
  notification_emails: '',
  notification_phone: '',
  webhook_url: '',
  redirect_url: '',
};

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('key, value');

      if (error) throw error;

      const settingsMap: Settings = { ...defaultSettings };
      data?.forEach(row => {
        if (row.key in settingsMap) {
          settingsMap[row.key as keyof Settings] = row.value || '';
        }
      });
      setSettings(settingsMap);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: 'Chyba',
        description: 'Nepodarilo sa načítať nastavenia.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update each setting
      const updates = Object.entries(settings).map(([key, value]) => 
        supabase
          .from('settings')
          .update({ value })
          .eq('key', key)
      );

      await Promise.all(updates);

      toast({
        title: 'Uložené',
        description: 'Nastavenia boli úspešne uložené.',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Chyba',
        description: 'Nepodarilo sa uložiť nastavenia.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (key: keyof Settings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-heading font-bold text-foreground">Nastavenia</h1>
            <p className="text-sm text-muted-foreground">Konfigurácia notifikácií</p>
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="h-10 shrink-0">
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            <span className="hidden sm:inline">Uložiť</span>
          </Button>
        </div>

        <div className="grid gap-3 md:gap-4">
          {/* Google Places */}
          <Card>
            <CardHeader className="pb-2 px-3 pt-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="truncate">Google Maps API</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Pre autocomplete adresy
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <Input
                type="password"
                placeholder="AIzaSy..."
                value={settings.google_places_api_key}
                onChange={(e) => handleChange('google_places_api_key', e.target.value)}
                className="h-10"
              />
            </CardContent>
          </Card>

          {/* Email notifications */}
          <Card>
            <CardHeader className="pb-2 px-3 pt-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 shrink-0" />
                E-maily pre notifikácie
              </CardTitle>
              <CardDescription className="text-xs">
                Oddeľte čiarkou
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <Input
                type="text"
                placeholder="email@firma.sk, email2@firma.sk"
                value={settings.notification_emails}
                onChange={(e) => handleChange('notification_emails', e.target.value)}
                className="h-10"
              />
            </CardContent>
          </Card>

          {/* SMS notifications */}
          <Card>
            <CardHeader className="pb-2 px-3 pt-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <MessageSquare className="h-4 w-4 shrink-0" />
                Telefón pre SMS
              </CardTitle>
              <CardDescription className="text-xs">
                SMS po dokončení formulára
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <Input
                type="tel"
                placeholder="+421911123456"
                value={settings.notification_phone}
                onChange={(e) => handleChange('notification_phone', e.target.value)}
                className="h-10"
              />
            </CardContent>
          </Card>

          {/* Webhook URL */}
          <Card>
            <CardHeader className="pb-2 px-3 pt-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Webhook className="h-4 w-4 shrink-0" />
                Webhook URL (n8n)
              </CardTitle>
              <CardDescription className="text-xs">
                Pre automatizácie
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <Input
                type="url"
                placeholder="https://..."
                value={settings.webhook_url}
                onChange={(e) => handleChange('webhook_url', e.target.value)}
                className="h-10"
              />
            </CardContent>
          </Card>

          {/* Redirect URL */}
          <Card>
            <CardHeader className="pb-2 px-3 pt-3">
              <CardTitle className="text-sm">
                URL po odoslaní
              </CardTitle>
              <CardDescription className="text-xs">
                Presmerovanie po formulári
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <Input
                type="url"
                placeholder="https://..."
                value={settings.redirect_url}
                onChange={(e) => handleChange('redirect_url', e.target.value)}
                className="h-10"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}