
-- Enums for outreach system
CREATE TYPE public.outreach_campaign_status AS ENUM ('draft', 'generating', 'ready', 'sending', 'paused', 'completed');
CREATE TYPE public.outreach_email_status AS ENUM ('draft', 'queued', 'sending', 'sent', 'failed');

-- 1. Outreach Leads
CREATE TABLE public.outreach_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text,
  name text,
  phone text,
  company_name text,
  city text,
  specialization text,
  website text,
  source text NOT NULL DEFAULT 'csv_import',
  tags text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.outreach_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can select outreach_leads" ON public.outreach_leads FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert outreach_leads" ON public.outreach_leads FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update outreach_leads" ON public.outreach_leads FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete outreach_leads" ON public.outreach_leads FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 2. Outreach Inboxes
CREATE TABLE public.outreach_inboxes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  display_name text,
  smtp_host text NOT NULL,
  smtp_port integer NOT NULL DEFAULT 465,
  smtp_user text NOT NULL,
  smtp_password text NOT NULL,
  imap_host text,
  imap_port integer DEFAULT 993,
  daily_limit integer NOT NULL DEFAULT 50,
  sent_today integer NOT NULL DEFAULT 0,
  sent_today_reset_at timestamptz NOT NULL DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true,
  is_reply_to boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.outreach_inboxes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can select outreach_inboxes" ON public.outreach_inboxes FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert outreach_inboxes" ON public.outreach_inboxes FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update outreach_inboxes" ON public.outreach_inboxes FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete outreach_inboxes" ON public.outreach_inboxes FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 3. Outreach Campaigns
CREATE TABLE public.outreach_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  status public.outreach_campaign_status NOT NULL DEFAULT 'draft',
  template_subject text,
  template_blocks jsonb DEFAULT '[]'::jsonb,
  lead_filter jsonb DEFAULT '{}'::jsonb,
  lead_count integer DEFAULT 0,
  inbox_ids uuid[] DEFAULT '{}',
  reply_to_inbox_id uuid REFERENCES public.outreach_inboxes(id) ON DELETE SET NULL,
  delay_min_seconds integer NOT NULL DEFAULT 60,
  delay_max_seconds integer NOT NULL DEFAULT 300,
  supplier_profile jsonb DEFAULT '{}'::jsonb,
  scheduled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.outreach_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can select outreach_campaigns" ON public.outreach_campaigns FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert outreach_campaigns" ON public.outreach_campaigns FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update outreach_campaigns" ON public.outreach_campaigns FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete outreach_campaigns" ON public.outreach_campaigns FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 4. Outreach Emails
CREATE TABLE public.outreach_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public.outreach_campaigns(id) ON DELETE CASCADE,
  lead_id uuid NOT NULL REFERENCES public.outreach_leads(id) ON DELETE CASCADE,
  inbox_id uuid REFERENCES public.outreach_inboxes(id) ON DELETE SET NULL,
  subject text,
  body_html text,
  status public.outreach_email_status NOT NULL DEFAULT 'draft',
  error_message text,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.outreach_emails ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can select outreach_emails" ON public.outreach_emails FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert outreach_emails" ON public.outreach_emails FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update outreach_emails" ON public.outreach_emails FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete outreach_emails" ON public.outreach_emails FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 5. Outreach Replies
CREATE TABLE public.outreach_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inbox_id uuid REFERENCES public.outreach_inboxes(id) ON DELETE SET NULL,
  from_email text NOT NULL,
  subject text,
  body_text text,
  body_html text,
  received_at timestamptz NOT NULL DEFAULT now(),
  is_read boolean NOT NULL DEFAULT false,
  lead_id uuid REFERENCES public.outreach_leads(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.outreach_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can select outreach_replies" ON public.outreach_replies FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert outreach_replies" ON public.outreach_replies FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update outreach_replies" ON public.outreach_replies FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete outreach_replies" ON public.outreach_replies FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
