# Simplify auth to email + guest only (no social sign-in)

Publish the iOS app without needing Sign in with Apple by removing all third-party social login and keeping only email/password and guest mode.

## What changes

- Remove **Continue with Apple** from the sign-in screen and delete its handler.
- Ensure no **Continue with Google** button or code remains.
- Reorder the sign-in screen to lead with the email + password form, then a divider, then **Continue as guest**.
- Keep the name field in the sign-up form so the home greeting can still show a first name.
- Keep the post-login **NamePrompt** for users (e.g., guests or email-only sign-ups) whose profile has no `display_name`.
- Disable the Apple and Google providers in the backend auth configuration so no social provider is active.

## Technical notes

- `src/routes/auth.tsx`:
  - Delete `onApple()` and the Apple button.
  - Remove any remaining Google sign-in imports, handlers, or buttons.
  - Keep the name input in sign-up mode and pass it to `supabase.auth.signUp({ options: { data: { display_name } } })`.
  - Keep the `onGuest()` anonymous sign-in handler and the "Continue as guest" button.
- Backend auth configuration (`supabase--configure_social_auth` or equivalent): disable Apple and Google providers so no social sign-in is offered.
- `src/components/energy/NamePrompt.tsx` and `src/routes/index.tsx`: keep the existing flow that prompts users who lack a `display_name`.
- `profiles` table and `handle_new_user()` trigger: remain unchanged; they still create a profile and copy the name from auth metadata.

## Out of scope

- Password reset / forgot-password flow. Email sign-in works, but password reset requires a separate `/reset-password` page and a reset email flow — add that only if requested.
- Re-adding social sign-in later. If social login is ever added back, Sign in with Apple will become required again for iOS App Store compliance.
