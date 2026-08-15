CREATE TABLE public.daily_entries (
  entry_date DATE NOT NULL PRIMARY KEY,
  sleep SMALLINT NOT NULL,
  energy SMALLINT NOT NULL,
  stress SMALLINT NOT NULL,
  day_intensity SMALLINT NOT NULL,
  caffeine BOOLEAN NOT NULL DEFAULT false,
  alcohol BOOLEAN NOT NULL DEFAULT false,
  cycle_phase TEXT,
  cycle_day SMALLINT,
  plan TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_entries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_entries TO authenticated;
GRANT ALL ON public.daily_entries TO service_role;
ALTER TABLE public.daily_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Prototype open access to daily entries" ON public.daily_entries FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.cycle_settings (
  id TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
  enabled BOOLEAN NOT NULL DEFAULT false,
  last_period_start DATE,
  cycle_length SMALLINT NOT NULL DEFAULT 28,
  period_length SMALLINT NOT NULL DEFAULT 5,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.cycle_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cycle_settings TO authenticated;
GRANT ALL ON public.cycle_settings TO service_role;
ALTER TABLE public.cycle_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Prototype open access to cycle settings" ON public.cycle_settings FOR ALL USING (true) WITH CHECK (true);