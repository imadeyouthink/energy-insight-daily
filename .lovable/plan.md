# Ask for a name after Apple sign-in

## The gap

The sign-up form collects a name, but Continue with Apple has no form. Apple returns a name only on a user's very first authorization, and with Hide My Email the address is a random relay string — so the email-prefix fallback can produce a name like "a1b2c3d4". Guest sign-in has the same gap: no name at all.

## What changes

- After sign-in, if the profile has no usable name, Home shows a one-time inline prompt instead of a bare "Good afternoon":
  - Heading: "What should we call you?"
  - Single glass text input plus a Save pill, styled like the existing check-in controls.
  - On save, the name is written to the profile and the greeting immediately becomes "Good afternoon, Diri".
- Dismissible with a small "Skip" link; skipping just leaves the plain greeting, and the prompt does not nag again in that session.
- Applies to Apple and guest users alike; email sign-ups already have a name and never see it.
- A name is "usable" when it is a real name from Apple or the sign-up form. Names auto-derived from a relay email are treated as missing, so Apple users are asked rather than greeted with a random string.
- The name stays editable later from the same place if it was skipped.

## Technical notes

- Migration: stop falling back to the email prefix in `handle_new_user()`; leave `display_name` null when auth metadata has no real name, and keep reading Apple's `full_name` / `name` metadata when present. Null is the signal that drives the prompt.
- New `src/components/energy/NamePrompt.tsx`: controlled input, writes `display_name` via the browser Supabase client to `profiles`, then invalidates the `["profile", userId]` query so the greeting updates instantly.
- `src/routes/index.tsx`: render the prompt in place of the greeting line when `useProfile()` returns no display name and the user hasn't skipped (skip flag in `sessionStorage`).
- No change to `src/routes/auth.tsx` — the Apple button stays as is.
