Add a minimal brand lockup to the sign-in/sign-up screens only.

Scope
- Only `src/routes/auth.tsx` and a new brand component are affected.
- No changes to Home, Plan, History, Check-in, or the TabBar.

What we'll build
1. Create a small `BrandLockup` component that combines the existing lightning bolt icon with a clean "Energy Coach" wordmark.
   - Use the same rounded/Inter Tight style used elsewhere.
   - Keep it compact so it sits above the glass auth card without stealing attention.
2. Place the lockup inside the auth screen's aurora gradient background, centered above the glass card.
3. Ensure it works for both sign-in and sign-up modes, since they share the same route.

Design choices
- Keep the Apple-like, glass-morphism aesthetic.
- The wordmark should be subtle (dark warm-gray text) so the auth card remains the focal point.
- Do not add a logo to any other screen for now, per your request.
