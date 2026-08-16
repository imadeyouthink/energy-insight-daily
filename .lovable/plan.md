# Replace Google sign-in with Continue with Apple

iOS-only app, so Google goes away and Apple takes its place. Cleaner sign-in screen: Apple, email, guest.

## What changes

- Remove the **Continue with Google** button and its handler from the sign-in screen.
- Add **Continue with Apple** in the same position, styled as a black pill with the Apple mark, matching the existing glass button language.
- Final order: Continue with Apple, divider, email + password form (with name field on sign-up), Continue as guest.
- Apple often withholds the name on repeat sign-ins and can use a private relay email, so the profile display name falls back to the email prefix when Apple sends nothing — the home greeting never shows blank.

## Technical notes

- `src/routes/auth.tsx`: delete `onGoogle()` and its button; add `onApple()` calling `lovable.auth.signInWithOAuth("apple", { redirect_uri: window.location.origin })` with the same error/redirect handling.
- Enable the managed Apple provider in the backend auth config in the same change, otherwise the first tap errors with "provider not supported". No Apple Developer account needed for the managed setup.
- Update the `handle_new_user()` trigger so `display_name` falls back to the email prefix when auth metadata carries no name.

## Out of scope

Native iOS packaging (Capacitor wrapper, App Store submission) — this change only makes the auth surface Apple-appropriate. Say the word if you want the native wrapper planned next.
