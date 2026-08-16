# Energy Coach — 3-page app overview

Create a 3-page PDF document that explains how the Energy Coach app works, written and styled for an end-user or stakeholder audience. The PDF should match the app's warm minimal aesthetic (white background, soft aurora gradients, black/terracotta accents, generous rounded corners).

## Page 1 — What the app does

- Headline: "Energy Coach — your 15-second daily check-in"
- Subheadline: "Turn how you feel into a short, practical plan for the day."
- Core value proposition: no typing, no streaks, no guilt.
- The two-screen flow: (1) Morning check-in with five questions, (2) a personalized plan.
- Illustrated with short screenshots of the check-in and plan screens.

## Page 2 — From inputs to plan

- Input map: sleep quality, energy, stress, caffeine after 2pm, alcohol last night, cycle tracking, day intensity.
- How cycle tracking works: optional toggle, last period start, cycle length, period length; the app computes the current phase (Menstrual/Follicular/Ovulation/Luteal) and day number.
- AI generation: the server sends the facts to Lovable AI Gateway (Gemini 3.5-flash) and asks for a friendly, under-120-word plan.
- Output format: 1 headline, 1 recap sentence, 4 bullets (movement, food, caffeine, bedtime).
- Data persistence: each check-in is saved in the backend so the home, plan, and history screens stay in sync.

## Page 3 — Navigation and design

- Three tabs: Home (today-at-a-glance chips), Plan (today's recommendation), History (last 14 days / sparkline trends).
- Status-coded chips: color shows whether sleep, energy, stress, and intensity are calm, moderate, or high.
- Glass-morphism UI: translucent nav bar, pill buttons, aurora gradients, soft shadows.
- PWA: app icon, manifest, offline-ready install behavior.
- Guest mode: try the app without creating an account via anonymous sign-in.

## Deliverable

A 3-page PDF saved to `/mnt/documents/energy-coach-overview.pdf` plus a QA pass (converted to images and inspected for layout issues).
