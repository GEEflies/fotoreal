-- Add 'uploading' status to photo_ai_status enum for finer progress granularity.
ALTER TYPE public.photo_ai_status ADD VALUE IF NOT EXISTS 'uploading' AFTER 'enhancing';
