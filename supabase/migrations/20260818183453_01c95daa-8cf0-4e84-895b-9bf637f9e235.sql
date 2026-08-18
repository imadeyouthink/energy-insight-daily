ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS reminder_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS reminder_time time NOT NULL DEFAULT '08:00';