-- Fix the UPDATE policy that has "(true OR ...)" - always evaluates to true
DROP POLICY IF EXISTS "Users can update own session or admins can update all" ON public.submissions;

-- Create proper policy: users can only update their own session submissions, admins can update all
CREATE POLICY "Users can update own session or admins can update all"
ON public.submissions
FOR UPDATE
USING (
  session_id = current_setting('app.session_id', true)::text
  OR has_role(auth.uid(), 'admin'::app_role)
);