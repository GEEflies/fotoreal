
-- Profiles table for billing info, logo, watermark settings
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  company_name text,
  ico text,
  dic text,
  ic_dph text,
  address text,
  logo_url text,
  watermark_position text DEFAULT 'bottom-right',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Logo storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true);

CREATE POLICY "Users can upload own logo" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'logos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can update own logo" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'logos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Anyone can view logos" ON storage.objects FOR SELECT TO public USING (bucket_id = 'logos');
CREATE POLICY "Users can delete own logo" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'logos' AND (storage.foldername(name))[1] = auth.uid()::text);
