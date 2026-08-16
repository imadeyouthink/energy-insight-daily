# 3-Pager: How Energy Coach Works

## Goal
Create a concise, polished 3-page document that explains how the Energy Coach app works for stakeholders, investors, or onboarding. The document should match the app's visual identity (white background, pastel aurora accents, black typography, glass-morphism cards, Inter Tight typography) and be delivered as a PDF in `/mnt/documents/exports/`.

## Format
- **Output:** PDF, A4/Letter-size, portrait, 3 pages exactly.
- **Visual style:** Clean, Apple/iOS-inspired, minimal, warm.
- **Brand elements:** Energy Coach app icon, wordmark, aurora gradient highlights, rounded cards, black CTA-style buttons.

## Content Structure

### Page 1 — App Overview & User Flow
- **Hero header:** App icon + "Energy Coach" wordmark over a soft aurora gradient banner.
- **Tagline:** "A 15-second daily check-in that turns how you feel into a plan."
- **Core value proposition:** Quick, judgment-free, personalized daily guidance based on sleep, energy, stress, load, and optional cycle tracking.
- **Three-tab structure:**
  - **Home** — greeting, date chip, "Today at a glance" chips, cycle phase education banner, CTA to plan.
  - **Plan** — AI-generated daily plan with headline, recap, 4 recommendations (movement, food, caffeine, bedtime).
  - **History** — last 14 days with color-coded daily metrics.
- **Two entry modes:** Sign up / sign in / Google / Guest mode for testing.
- **Key flow diagram:** empty state → check-in → plan generated → history updated.

### Page 2 — Data & Intelligence Architecture
- **Inputs collected:** Sleep (1-5), Energy (1-5), Stress (1-5), Day intensity (1-5), Caffeine late, Alcohol last night.
- **Cycle tracking:** Optional toggle; if enabled, calculates phase (Menstrual / Follicular / Ovulation / Luteal) and day from last period start, cycle length, period length.
- **Data storage:** Supabase backend, `daily_entries` and `cycle_settings` tables, row-level security tied to authenticated user, guest mode via anonymous Supabase auth.
- **AI plan generation:**
  - Server function via `createServerFn` calls Lovable AI Gateway (`google/gemini-3.5-flash`).
  - Prompt: friendly energy coach, headline + recap + 4 bullets, <120 words, no category labels.
  - Response parsed into headline, recap, and bullets.
- **History & trends:** 7-day static dot timeline colored by status, 14-day history list with color-coded metric badges.

### Page 3 — Design System & UX Principles
- **Aesthetic:** iOS-native feel, white background, pastel aurora gradient header, glass-morphism floating nav bar, black highlights.
- **Typography:** Inter Tight, 30px display headlines, 11px uppercase section labels, 13-15px body, 22px slider numbers.
- **Components:** Rounded pill buttons, glass cards, segmented scale buttons, sliders, toggles, black chip badges, turquoise cycle banner.
- **UX principles:**
  - No streaks, badges, or guilt.
  - One-screen check-in, no typing.
  - Status color coding (green/amber/red) for at-a-glance health signals.
  - Educational cycle phase banner to close the knowledge gap.
  - Clear CTAs: "Get today's plan", "See today's plan", "Edit today's check-in".
- **PWA qualities:** Web app manifest, apple-mobile-web-app meta tags, safe-area insets, app icon, touch-icon, home-screen installable.

## Technical Implementation
- Generate the PDF using a Python script (reportlab or python-pptx) that reads the app icon from `public/app-icon.png` and renders the 3 pages with the correct layout, fonts, and brand colors.
- QA by converting each page to an image and inspecting for alignment, overflow, and brand consistency.
- Deliver to `/mnt/documents/exports/energy-coach-how-it-works.pdf`.

## Deliverables
1. PDF file: `/mnt/documents/exports/energy-coach-how-it-works.pdf`
2. QA screenshots of each page (temporary, not saved to `/mnt/documents`).
3. `<presentation-artifact>` tag in the final response so the user can download the PDF.
