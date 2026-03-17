-- Drop old enum and create new one with correct values
ALTER TABLE public.submissions ALTER COLUMN status DROP DEFAULT;
ALTER TABLE public.submissions ALTER COLUMN status TYPE text;

DROP TYPE IF EXISTS submission_status;

CREATE TYPE submission_status AS ENUM ('nove', 'kontaktovane', 'ma_zaujem', 'nema_zaujem', 'zavolat_neskor', 'uzavrete');

-- Map old values to new ones
UPDATE public.submissions SET status = 'nove' WHERE status IN ('draft', 'phone_captured');
UPDATE public.submissions SET status = 'uzavrete' WHERE status = 'complete';

-- Convert back to enum
ALTER TABLE public.submissions ALTER COLUMN status TYPE submission_status USING status::submission_status;
ALTER TABLE public.submissions ALTER COLUMN status SET DEFAULT 'nove'::submission_status;