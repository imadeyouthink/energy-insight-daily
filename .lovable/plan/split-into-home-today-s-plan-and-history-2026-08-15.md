# Split into Home, Today's plan, and History

Yes — separating the check-in from the plan is the right move. Right now one screen swaps between two very different states, which makes the tab bar lie about where you are. Three tabs make each screen have a single job.

## Navigation

Tab bar: **Home · Plan · History**

The check-in form becomes its own screen (`/check-in`) reached from a CTA, not a tab. It's a task, not a destination — you open it, finish it, and get returned to the plan.

## Screens and states

**Home (`/`)**
- Not checked in yet today: gradient header with date + greeting, then a prominent "Start today's check-in · 15 seconds" card as the first thing on the page.
- Checked in: header shows the plan headline, a "Today at a glance" row of chips (sleep, energy, stress, day intensity, cycle phase if tracked), a compact preview of the plan with a "See full plan" link, and a small last-7-days energy strip.
- Always: a light "Edit today's check-in" link once an entry exists.

**Plan (`/plan`)**
- Entry exists: current PlanView (headline, recap, 4 tagged bullets, Edit button).
- No entry today: empty state — soft gradient header, one line ("No plan yet today"), and a "Do the check-in" button linking to `/check-in`.

**History (`/history`)**
- Unchanged, last 14 days. Today's row appears only after check-in — this already works because rows come from saved entries.

**Check-in (`/check-in`)**
- The existing CheckIn form, full screen, no tab bar highlight.
- On submit: generate plan, save entry, navigate to `/plan`.
- Opened with an existing entry (edit mode): fields prefilled, submit re-generates and returns to `/plan`.

## What Home should show

For a daily wellbeing app, Home is the "where am I today" screen, not a second plan page:
1. Date + greeting in the gradient header (existing style).
2. Primary action or today's status — check-in CTA, or the at-a-glance chips.
3. One-line plan teaser linking to the Plan tab.
4. A quiet 7-day energy trend strip (no scores, no streaks, no judgement).
5. Cycle phase tag when tracking is on.

Nothing gamified — consistent with the no-streaks, no-badges rule.

## Technical notes

- New routes: `src/routes/plan.tsx`, `src/routes/check-in.tsx`; `src/routes/index.tsx` rewritten as Home.
- Shared today-state logic (fetch entries, today's entry, cycle settings, plan mutation) moves into a `src/hooks/useToday.ts` hook so all three routes read the same TanStack Query cache; no data-layer or schema changes.
- `TabBar.tsx` gains a third tab and keeps `activeOptions.exact`; `/check-in` renders without the bar so the submit button is unobstructed.
- Each route gets its own `head()` metadata (title, description, og:title, og:description).
- Existing components (`CheckIn`, `PlanView`, `History`, `CycleSetup`) are reused as-is; only layout wrappers change.
