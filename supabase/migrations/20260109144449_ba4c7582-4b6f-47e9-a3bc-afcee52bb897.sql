-- Fix submissions RLS policy - the condition "(true OR ...)" always evaluates to true
-- Drop the problematic policy and create a proper one

DROP POLICY IF EXISTS "Users can read own session or admins can read all" ON public.submissions;

-- Create proper policy: users can only read their own session submissions, admins can read all
CREATE POLICY "Users can read own session or admins can read all"
ON public.submissions
FOR SELECT
USING (
  session_id = current_setting('app.session_id', true)::text
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Fix step_analytics - make it admin-only readable
DROP POLICY IF EXISTS "Anyone can read step analytics" ON public.step_analytics;

CREATE POLICY "Admins can read step analytics"
ON public.step_analytics
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));