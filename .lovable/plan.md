# Add Continue with Apple

## Why

Apple's App Store rules require Sign in with Apple in any app that offers another third-party sign-in (Google). So if Dunami ships as an iOS app, Apple isn't optional — and on iOS it's usually the fastest, highest-trust option.

Recommendation: don't remove Google. Add Apple as the primary button, keep Google below it, keep email and guest as they are. That covers App Store review and web users on Android/desktop.

## What changes

- Sign-in screen gets a **Continue with Apple** pill button, styled to match the existing glass buttons, placed above Continue with Google.
- Order becomes: Apple, Google, email form, Continue as guest.
- Apple sign-in uses the same OAuth flow already used for Google, returning to the app and landing on Home like the other methods.
- Apple often returns no name on later sign-ins, so the profile display name falls back to the email prefix when Apple gives nothing — the home greeting never shows a blank name.

## Technical notes

- `src/routes/auth.tsx`: add `onApple()` calling `lovable.auth.signInWithOAuth("apple", { redirect_uri: window.location.origin })`, mirroring `onGoogle()` error/redirect handling, plus the button markup.
- Enable the managed Apple provider in the backend auth config in the same change, otherwise the first tap errors with "provider not supported". No Apple Developer account needed for the managed setup.
- The existing `handle_new_user()` trigger already copies `display_name` from auth metadata; add an email-prefix fallback so Apple's private-relay signups still get a name.

## Out of scope

Actual iOS packaging (Capacitor/native wrapper, App Store submission) — this change only makes the auth surface App Store compliant. Say the word if you want the native wrapper planned too.
