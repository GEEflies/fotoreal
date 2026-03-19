-- Enable realtime for user_credits so sidebar updates when credits change
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_credits;
