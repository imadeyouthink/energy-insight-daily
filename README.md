# Your Daily Energy

Build a mobile-first web app called "Energy Coach" — a 15-second daily check-in that turns how someone feels into a personalized daily plan. Light mode only, warm minimal aesthetic (soft cream background, warm terracotta/orange accent, dark warm-gray text, generous rounded corners, no clutter).

CORE FLOW — two screens only:

SCREEN 1: Morning check-in

- "How did you sleep?" — 5 tap buttons in a row, values 1-5 labeled Terrible / Poor / Okay / Good / Great. No default selected; require a selection before submit.

- "Energy" — a draggable slider, 1 (empty) to 5 (great), default 3, with the live number shown next to it.

- "Stress" — same slider style, 1 (calm) to 5 (overwhelmed), default 3.

- "Menstrual cycle phase" — NOT asked daily. Instead, a small settings row shows the auto-calculated phase (Menstrual / Follicular / Ovulation / Luteal) plus which day of the cycle it is. First time, it shows "Not set up" with a "Set up" link that reveals: an enable toggle, a date picker for "first day of last period," and number inputs for average cycle length (default 28) and average period length (default 5). Save these once; from then on the phase is computed automatically each day from today's date vs. that stored data — zero daily input required. Show an "Edit" link to revisit settings.

- "How packed is today?" — 5 tap buttons, values 1-5 labeled Light / Easy / Normal / Busy / Packed (this replaces asking the user to describe their calendar — same signal, one tap).

- "Caffeine after 2pm yesterday?" — Yes/No toggle pair, defaults to No.

- "Alcohol last night?" — Yes/No toggle pair, defaults to No.

- One button: "Get today's plan."

SCREEN 2: The plan

On submit, send all the check-in values to an AI call (use a Supabase edge function calling an LLM) with this instruction: "You are a warm, practical daily energy coach. Write a short personalized plan: line 1 is a punchy headline on whether today is a day to push hard or take it easy (e.g. 'Today is not a day for HIIT.'), line 2 is a one-sentence recap of the key facts behind that call (sleep, cycle phase if set, how packed today is), then exactly 4 short bullet recommendations covering movement, food, caffeine, and bedtime — specific to these inputs, not generic. Under 80 words total, no preamble." Render the response as: a bold headline, a muted one-line recap underneath, then the 4 recommendations as a clean bulleted list. Include an "Edit today's check-in" button to go back to Screen 1.

DATA:

- Persist each day's check-in + generated plan (keyed by date) so reopening the app the same day shows the already-generated plan instead of a blank form.

- Store the cycle settings (enable flag, start date, cycle length, period length) separately and persistently.

- Show a simple "History" list below/after the main flow: last ~14 days, one compact row each, showing date, sleep/energy/stress/day-intensity scores and cycle phase if tracked. Tag today's row.

- Use Supabase for persistence (simple tables: daily_entries, cycle_settings) rather than only browser storage, so data survives across devices/sessions.

DESIGN PRINCIPLES (important, follow strictly):

- Nothing on the check-in screen should take more than one tap or one drag — no free-text fields.

- No streaks, no badges, no guilt messaging for a missed day.

- Every field has a sensible default except sleep, which requires a conscious tap.

- Keep the whole check-in screen to a single scroll, no multi-step wizard.

This is a personal-use prototype, not a multi-user product — no login/auth needed for v1.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://energy-insight-daily.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8e5461af-40cd-47b0-b4d9-01c945774c88).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
