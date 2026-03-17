
-- Enums
CREATE TYPE public.property_status AS ENUM ('uploading', 'processing', 'done', 'error');
CREATE TYPE public.photo_ai_status AS ENUM ('pending', 'enhancing', 'sky_replace', 'hdr', 'privacy_blur', 'done', 'error');

-- Properties table
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  status property_status NOT NULL DEFAULT 'uploading',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own properties" ON public.properties FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own properties" ON public.properties FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own properties" ON public.properties FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own properties" ON public.properties FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all properties" ON public.properties FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all properties" ON public.properties FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Property photos table
CREATE TABLE public.property_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  original_url TEXT NOT NULL,
  processed_url TEXT,
  ai_status photo_ai_status NOT NULL DEFAULT 'pending',
  ai_step_label TEXT DEFAULT 'Čakám na spracovanie',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.property_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own property photos" ON public.property_photos FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.properties WHERE id = property_photos.property_id AND user_id = auth.uid()));
CREATE POLICY "Users can insert own property photos" ON public.property_photos FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.properties WHERE id = property_photos.property_id AND user_id = auth.uid()));
CREATE POLICY "Users can update own property photos" ON public.property_photos FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.properties WHERE id = property_photos.property_id AND user_id = auth.uid()));
CREATE POLICY "Users can delete own property photos" ON public.property_photos FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.properties WHERE id = property_photos.property_id AND user_id = auth.uid()));
CREATE POLICY "Admins can view all property photos" ON public.property_photos FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all property photos" ON public.property_photos FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at on properties
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_submissions_updated_at();

-- Storage bucket for property photos
INSERT INTO storage.buckets (id, name, public) VALUES ('property-photos', 'property-photos', true);

CREATE POLICY "Authenticated users can upload property photos" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'property-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Anyone can view property photos" ON storage.objects FOR SELECT
  USING (bucket_id = 'property-photos');
CREATE POLICY "Users can delete own property photos" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'property-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Enable realtime for property_photos
ALTER PUBLICATION supabase_realtime ADD TABLE public.property_photos;
