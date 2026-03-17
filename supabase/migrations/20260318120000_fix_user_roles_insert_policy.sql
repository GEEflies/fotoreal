-- Allow authenticated users to insert their own 'user' role
-- (needed for first login when the role doesn't exist yet)
CREATE POLICY "Users can insert own user role"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND role = 'user'
);
