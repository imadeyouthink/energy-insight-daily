# App icon update — Minimalist lightning bolt

## Goal
Replace the current white foreground shape on the Energy Coach app icon with a minimalist lightning bolt while keeping the existing pastel blue-purple-turquoise gradient background.

## Implementation steps

1. Generate a new iOS-style app icon asset
   - Rounded-square canvas with the same gradient background used in the existing app icon.
   - White, minimalist lightning bolt centered in the foreground.
   - Soft inner glow / subtle glass border to match the current icon style.
   - Save to `public/app-icon.png` at 1024×1024 px.

2. Derive the required icon variants from the generated source
   - Create `public/apple-touch-icon.png` (180×180).
   - Create `public/favicon.png` (64×64 or 32×32).

3. Verify the output
   - View the generated image to confirm it matches the selected direction.
   - Check that the favicon and Apple touch icon references remain intact in `src/routes/__root.tsx` and `public/manifest.json` (read-only; no changes expected unless a new format is introduced).

## Deliverables
- `public/app-icon.png`
- `public/apple-touch-icon.png`
- `public/favicon.png`
