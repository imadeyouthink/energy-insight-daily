# Screenshot set for the two user journeys

Capture every screen that exists today, plus the state variations needed to tell two journey stories. No new screens, no design changes.

## What blocks us right now

The preview is currently signed out, so only the auth screens can be captured. Sign in through the preview once, then send a message — the session becomes available and the rest can be captured immediately.

## Journey 1 — New user, no account

1. Sign up screen (brand lockup + glass card)
2. Sign in screen (mode toggle variation)
3. Home, empty state — "Start today's check-in" CTA, no chips, no trends
4. Plan, empty state — CTA back to the check-in
5. History, empty state — "No check-ins yet."
6. Check-in form, top (sleep / energy / stress)
7. Check-in form, cycle section with "Track my cycle" toggle off
8. Check-in form, cycle setup expanded and filled, Save enabled
9. Check-in form, bottom — "How packed is today?" + submit
10. Plan, filled — headline, recap, 4 tagged recommendations
11. Home, after check-in — chips, cycle banner, "See today's plan"
12. History with a single record (today)

## Journey 2 — Returning user, cycle already set up

1. Home with existing history — chips, cycle banner, 7-day dot trends populated
2. Check-in with the cycle phase already saved (collapsed tag state, no form)
3. Plan for the day, filled
4. History with 7–14 days of records

## How the states are produced

Journey 1 is captured against a freshly created throwaway account so the empty states are genuine. Journey 2 uses the signed-in account that already has entries; if it has fewer than a week of records, a few back-dated demo rows are added to the same account so the trends and history look real. Both journeys are driven through the actual UI in a headless browser at mobile viewport (390x844), matching how the app is used.

## Deliverable

PNG files written to the project's files area under `screenshots/journey-1/` and `screenshots/journey-2/`, numbered in journey order with descriptive names (e.g. `03-home-empty.png`), plus a short index listing each shot. Each image is reviewed before delivery for clipped text, missing gradients, or half-loaded states.

## Technical notes

- Capture runs via Playwright against `localhost:8080`, with the injected preview session restored for the returning-user pass.
- No source files change; only screenshot artifacts are produced.
- Back-dated rows, if needed, go into `daily_entries` for the signed-in user only.
