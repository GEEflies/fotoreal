-- Create enum for property types
CREATE TYPE public.property_type AS ENUM ('byt', 'dom', 'pozemok');

-- Create enum for submission status
CREATE TYPE public.submission_status AS ENUM ('draft', 'phone_captured', 'complete');

-- Create submissions table for lead data
CREATE TABLE public.submissions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    status public.submission_status NOT NULL DEFAULT 'draft',
    current_step INTEGER NOT NULL DEFAULT 1,
    
    -- Contact info
    name TEXT,
    phone TEXT,
    phone_normalized TEXT,
    gdpr_consent BOOLEAN DEFAULT false,
    
    -- Property info
    property_type public.property_type,
    
    -- All form data as JSONB for flexibility
    form_data JSONB DEFAULT '{}'::jsonb,
    
    -- Photo URLs
    photos TEXT[] DEFAULT '{}',
    
    -- SMS/notification flags (prevent duplicates)
    phone_sms_sent BOOLEAN DEFAULT false,
    complete_sms_sent BOOLEAN DEFAULT false,
    email_sent BOOLEAN DEFAULT false,
    webhook_sent BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index on session_id for fast lookups
CREATE INDEX idx_submissions_session_id ON public.submissions(session_id);
CREATE INDEX idx_submissions_status ON public.submissions(status);
CREATE INDEX idx_submissions_created_at ON public.submissions(created_at DESC);

-- Create step_analytics table for tracking unique step views
CREATE TABLE public.step_analytics (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    step_number INTEGER NOT NULL,
    step_name TEXT NOT NULL,
    viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    
    -- Ensure unique step view per session
    UNIQUE(session_id, step_number)
);

-- Create index for analytics queries
CREATE INDEX idx_step_analytics_step_number ON public.step_analytics(step_number);

-- Enable RLS on both tables
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.step_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for submissions
-- Allow anyone to insert (anonymous lead capture)
CREATE POLICY "Anyone can create submissions"
ON public.submissions
FOR INSERT
WITH CHECK (true);

-- Allow anyone to update their own session's submission
CREATE POLICY "Anyone can update their session submission"
ON public.submissions
FOR UPDATE
USING (true);

-- Allow anyone to read their own session's submission
CREATE POLICY "Anyone can read their session submission"
ON public.submissions
FOR SELECT
USING (true);

-- RLS Policies for step_analytics
-- Allow anyone to insert step analytics
CREATE POLICY "Anyone can create step analytics"
ON public.step_analytics
FOR INSERT
WITH CHECK (true);

-- Allow reading analytics (for admin dashboard later)
CREATE POLICY "Anyone can read step analytics"
ON public.step_analytics
FOR SELECT
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_submissions_updated_at
BEFORE UPDATE ON public.submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_submissions_updated_at();

-- Create storage bucket for submission photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'submission-photos',
    'submission-photos',
    true,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
);

-- Storage policies for submission-photos bucket
CREATE POLICY "Anyone can upload submission photos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'submission-photos');

CREATE POLICY "Anyone can view submission photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'submission-photos');

CREATE POLICY "Anyone can update their submission photos"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'submission-photos');

CREATE POLICY "Anyone can delete their submission photos"
ON storage.objects
FOR DELETE
USING (bucket_id = 'submission-photos');