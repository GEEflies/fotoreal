-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user roles (prevents recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS policies for user_roles table
-- Only admins can view all roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Only admins can insert roles
CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete roles
CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update submissions RLS policies for admin access
-- Drop existing policies first
DROP POLICY IF EXISTS "Anyone can read their session submission" ON public.submissions;
DROP POLICY IF EXISTS "Anyone can update their session submission" ON public.submissions;

-- Recreate with admin access
CREATE POLICY "Users can read own session or admins can read all"
ON public.submissions
FOR SELECT
USING (
  true OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Users can update own session or admins can update all"
ON public.submissions
FOR UPDATE
USING (
  true OR public.has_role(auth.uid(), 'admin')
);

-- Admins can delete submissions
CREATE POLICY "Admins can delete submissions"
ON public.submissions
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to read all step_analytics
DROP POLICY IF EXISTS "Anyone can read step analytics" ON public.step_analytics;

CREATE POLICY "Anyone can read step analytics"
ON public.step_analytics
FOR SELECT
USING (true);

-- Admins can delete step_analytics (for reset)
CREATE POLICY "Admins can delete step analytics"
ON public.step_analytics
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));