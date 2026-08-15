-- daily_entries: scope to owner
DELETE FROM public.daily_entries;
ALTER TABLE public.daily_entries
  ADD COLUMN user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();

DO $$
DECLARE c text;
BEGIN
  SELECT conname INTO c FROM pg_constraint
   WHERE conrelid = 'public.daily_entries'::regclass AND contype = 'p';
  IF c IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.daily_entries DROP CONSTRAINT %I', c);
  END IF;
END $$;

ALTER TABLE public.daily_entries ADD PRIMARY KEY (user_id, entry_date);

DROP POLICY IF EXISTS "Prototype open access to daily entries" ON public.daily_entries;

REVOKE ALL ON public.daily_entries FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_entries TO authenticated;
GRANT ALL ON public.daily_entries TO service_role;

CREATE POLICY "Users manage their own daily entries"
  ON public.daily_entries FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- cycle_settings: one row per owner
DELETE FROM public.cycle_settings;
ALTER TABLE public.cycle_settings
  ADD COLUMN user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid();

DO $$
DECLARE c text;
BEGIN
  SELECT conname INTO c FROM pg_constraint
   WHERE conrelid = 'public.cycle_settings'::regclass AND contype = 'p';
  IF c IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.cycle_settings DROP CONSTRAINT %I', c);
  END IF;
END $$;

ALTER TABLE public.cycle_settings DROP COLUMN IF EXISTS id;
ALTER TABLE public.cycle_settings ADD PRIMARY KEY (user_id);

DROP POLICY IF EXISTS "Prototype open access to cycle settings" ON public.cycle_settings;

REVOKE ALL ON public.cycle_settings FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cycle_settings TO authenticated;
GRANT ALL ON public.cycle_settings TO service_role;

CREATE POLICY "Users manage their own cycle settings"
  ON public.cycle_settings FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());